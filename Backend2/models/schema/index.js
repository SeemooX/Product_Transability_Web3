const { drizzle } = require("drizzle-orm/neon-http");
const db = drizzle(process.env.NEON_DATABASE_URL);