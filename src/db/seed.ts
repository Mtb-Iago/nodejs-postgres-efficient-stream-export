import { sql } from "./client.ts";
import { fakerPT_BR as faker } from '@faker-js/faker'

const TOTAL_PRODUCTS = 10_000;
const MAX_PRODUCTS_CREATED = 100;

console.log("Seeding database...");


await sql`
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_in_cents INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`;
console.log("Table products created!");

await sql`TRUNCATE products`;

// Loop to insert 100k products
for (const _i of Array.from({ length: MAX_PRODUCTS_CREATED })) {
    const productsToInsert = Array.from({ length: TOTAL_PRODUCTS }).map(() => {
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price_in_cents: faker.number.int({ min: 1000, max: 10_000 }),
        };
    });

    await sql`INSERT INTO products ${sql(productsToInsert)}`;
    console.log(`Inserted ${TOTAL_PRODUCTS} products`);
}

await sql.end();
console.log("Database seeded with products!");