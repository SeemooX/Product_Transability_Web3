const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { Pool } = require('pg');
require('dotenv').config();

const sql = neon(process.env.NEON_DATABASE_URL);
const db = drizzle({ client: sql });


const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
});

module.exports = { db, pool };
