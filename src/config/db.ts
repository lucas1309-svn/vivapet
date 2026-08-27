import { Pool } from "pg";

export const db = new Pool({
    user: process.env.BD_USER || 'postgrees',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'vivapet',
    password: process.env.DB_PASSWORD || 'BemVindo!',
    port: parseInt(process.env.DB_PORT || '5432'),
})