# 📦 Exportação de Registros com Streaming e Cursor SQL

Este projeto realiza a **exportação eficiente para grande quantidade de registros** do PostgreSQL para um arquivo `.csv` usando:
- [SQL Cursor](https://medium.com/@ietienam/efficient-pagination-with-postgresql-using-cursors-83e827148118) para evitar carregamento total em memória
- Streaming com pipeline do Node.js
- Escrita incremental com `csv-stringify`

---

## 📋 Pré-requisitos

- [Node.js 23](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/) ou `npm/yarn`

---

## 🚀 Subindo o ambiente com PostgreSQL

O projeto vem com um `docker-compose.yml` para facilitar o setup local do banco de dados.

```bash
docker-compose up -d
```

A conexão padrão será:
```DATABASE_URL=postgres://postgres:postgres@localhost:5432/export```

✅ Certifique-se de que a variável de ambiente DATABASE_URL está configurada corretamente (via .env.local ou diretamente no terminal

---

## 🌱 Populando o Banco com Dados de Teste
Execute o script de seed para gerar *1 000 000* de registros com nomes e preços aleatórios:

```bash
npm run db:seed
```

_caso precise, é possível alterar a quantidade de itens gerados basta alterar o valor das variávies:_

```
const TOTAL_PRODUCTS = 10_000;
const MAX_PRODUCTS_CREATED = 100;
```

---

📤 Exportando os registros para CSV

```bash
npm run export
```

--- 

🧪 Rodando os Testes
```bash
npm run test
```

--- 

## 📁 Estrutura do Projeto
```bash
src/
├── db/
│   └── client.ts        # Conexão com PostgreSQL
│   └── seed.ts          # População do banco
├── export.ts            # Exportação com streams e csv-stringify
├── __tests__/
│   └── export.test.ts   # Testes unitários de streaming e CSV
```

---


## 🚀 Tecnologias Utilizadas
- [Node.js](https://nodejs.org/docs/latest/api/synopsis.html) + [TypeScript](https://nodejs.org/en/learn/typescript/introduction)

- [PostgreSQL](https://www.postgresql.org/)

- [Docker](https://docs.docker.com/get-started/)

- [csv-stringify](https://www.npmjs.com/package/csv-stringify)

- [Jest](https://jestjs.io/docs/getting-started)

- [Streams (Readable, Transform, Writable)](https://nodejs.org/api/stream.html)

- [SQL Cursor com postgres.js](https://medium.com/@ietienam/efficient-pagination-with-postgresql-using-cursors-83e827148118)

---

## 📈 Benefícios da Arquitetura
✅ Exportação eficiente com streaming

✅ Baixo uso de memória

✅ Performance escalável com cursor SQL

✅ Código testável e modular

--- 

## 📌 Observações
- O projeto está configurado com "type": "module" (ESM)

- O tsconfig.json está preparado para es2024 + NodeNext

- O uso de pipeline garante controle de erros e backpressure

---

📝 Licença

###### _Este projeto é um refactor com melhorias e adaptações de um projeto open source desenvolvido por Diego da Rocketseat. O código original pode ser encontrado em [vídeo youtube](https://www.youtube.com/watch?v=TaYcpJQHJQE)._

MIT © 2025 — Iago Oliveira