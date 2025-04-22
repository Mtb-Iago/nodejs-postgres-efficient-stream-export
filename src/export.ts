import { sql } from "./db/client.ts";
import { Transform } from "node:stream";
import type { TransformOptions } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { stringify, Stringifier } from "csv-stringify";
import { Readable, Writable } from "node:stream";

// Define a estrutura dos dados que serão retornados do banco
interface Product {
    id: number;
    name: string;
}

// Constantes de configuração
const MIN_PRICE_CENTS = 1000;
const CURSOR_BATCH_SIZE = 500;
const OUTPUT_FILE = "products.csv";

/**
 * Cria a query SQL que irá buscar os produtos com preço maior ou igual a 1000 centavos.
 */
function createProductQuery() {
    return sql<Product[]>`
        SELECT id, name 
        FROM products 
        WHERE price_in_cents >= ${MIN_PRICE_CENTS}
    `;
}

/**
 * Cria uma Transform stream que recebe arrays de produtos e envia os itens individualmente.
 */
export function createTransformStream(counter: { count: number }): Transform {
    const options: TransformOptions = { objectMode: true };

    return new Transform({
        ...options,
        transform(chunk: Product[], _encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
            for (const product of chunk) {
                this.push(product); // envia cada produto individualmente para o próximo passo do pipeline
            }
            counter.count += chunk.length; // atualiza o contador de produtos processados
            console.log(`Processados ${counter.count} produtos`);
            callback();
        },
    });
}

/**
 * Cria um stringifier para converter os dados dos produtos em formato CSV com cabeçalhos.
 */
export function createCsvStringifier(): Stringifier {
    return stringify({
        delimiter: ",",
        header: true,
        columns: [
            { key: "id", header: "ID" },
            { key: "name", header: "NAME" },
        ],
    });
}

/**
 * Função principal que exporta os produtos para um arquivo CSV.
 * Utiliza pipeline para processar os dados de forma eficiente em stream.
 */
export async function exportProductsToCSV(): Promise<void> {
    try {
        const startTime = Date.now(); // marca o tempo inicial
        const counter = { count: 0 }; // contador de registros processados
        console.log("Iniciando exportação de produtos...");

        const query = createProductQuery();
        const cursor: Readable = Readable.from(query.cursor(CURSOR_BATCH_SIZE)); // converte AsyncIterable para Readable stream
        const csvOutput: Writable = createWriteStream(OUTPUT_FILE, 'utf-8');

        await pipeline(
            cursor,
            createTransformStream(counter),
            createCsvStringifier(),
            csvOutput
        );

        const durationInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`✅ Exportação concluída com sucesso: ${OUTPUT_FILE}`);
        console.log(`📦 Total de produtos exportados: ${counter.count}`);
        console.log(`⏱️ Tempo total de execução: ${durationInSeconds} segundos`);
    } catch (error) {
        console.error("Erro ao exportar produtos:", error);
    } finally {
        // Encerra conexão com o banco mesmo em caso de erro
        await sql.end();
        console.log("Conexão com o banco finalizada.");
    }
}


async function main() {
    await exportProductsToCSV();
}


// Executa o processo de exportação
main();
