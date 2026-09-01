import { Pool } from "pg";

// CONEXÃO COM A BASE DE DADOS
export const db = new Pool({
    user: process.env.BD_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'vivapet',
    password: process.env.DB_PASSWORD || 'BemVindo!',
    port: parseInt(process.env.DB_PORT || '5432'),
});