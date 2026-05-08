import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "[db] DATABASE_URL is not set - falling back to in-memory storage."
  );
}

const pool = new pg.Pool(
  databaseUrl
    ? { connectionString: databaseUrl, connectionTimeoutMillis: 3000 }
    : {
        host: "127.0.0.1",
        port: 1,
        user: "noop",
        database: "noop",
        connectionTimeoutMillis: 1000,
      }
);

pool.on("error", (err) => {
  console.warn("[db] pg pool error:", err.message);
});

export const db = drizzle(pool);
