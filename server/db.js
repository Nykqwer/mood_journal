// server/db.js
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // ensure number
});

pool.on("connect", () => {
  console.log("✅ Connected to the database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(1);
});

export default pool;
