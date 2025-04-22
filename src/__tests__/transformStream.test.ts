import { stringify } from "csv-stringify";
import { createTransformStream } from "../export.ts";
import { Readable, Writable } from "stream";

// Mocka o cliente postgres e a função cursor, além de mockar o método 'end'
jest.mock("postgres", () => {
    return jest.fn().mockImplementation(() => ({
        cursor: jest.fn().mockImplementation((batchSize: number) => {
            let data = [
                { id: 1, name: "Produto 1" },
                { id: 2, name: "Produto 2" },
                { id: 3, name: "Produto 3" },
            ];

            return {
                next: jest.fn().mockImplementation(() => {
                    if (data.length > 0) {
                        const batch = data.splice(0, batchSize);
                        return { value: batch, done: false };
                    } else {
                        return { done: true };
                    }
                }),
            };
        }),
        // Mockando o método 'end', que não existe no objeto real
        end: jest.fn().mockResolvedValue(undefined), // Retorna uma Promise resolvida
    }));
});
describe("createTransformStream e CSV Stringify", () => {
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        // Restaura o comportamento original de console após os testes
        jest.restoreAllMocks();
    });

    it("deve transformar dados de produtos em produtos individuais e gerar CSV com cabeçalhos", (done) => {
        // Dados de entrada
        const input = [
            { id: 1, name: "Produto 1" },
            { id: 2, name: "Produto 2" },
        ];

        // Criando o fluxo de leitura
        const readable = Readable.from([input]);

        const counter = { count: 0 };
        const transform = createTransformStream(counter);

        const output: string[] = [];

        // Criando o fluxo de escrita
        const writable = new Writable({
            objectMode: false, // Como estamos escrevendo strings, não usamos objectMode
            write(chunk: Buffer, _encoding: string, callback: () => void): void {
                output.push(chunk.toString()); // Converte Buffer para string e armazena no array
                callback();
            }
        });

        // Criando o 'stringify' para converter para CSV
        const csvStringifier = stringify({
            delimiter: ",",
            header: true,
            columns: [
                { key: "id", header: "ID" },
                { key: "name", header: "NAME" },
            ],
        });

        // Criando o fluxo de transformação e CSV
        readable.pipe(transform).pipe(csvStringifier).pipe(writable).on("finish", () => {
            // Verificar se o CSV foi gerado corretamente
            const expectedCsvOutput = [
                "ID,NAME\n", // Cabeçalho esperado
                "1,Produto 1\n", // Dados esperados
                "2,Produto 2\n", // Mais dados
            ];

            expect(output).toEqual(expectedCsvOutput); // Verificar a saída CSV
            expect(counter.count).toBe(2); // Verificar se o contador foi atualizado corretamente
            done(); // Finaliza o teste
        });
    });
});
