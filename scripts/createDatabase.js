import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

async function createDatabase() {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      port: DB_PORT || 3306,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database '${DB_NAME}' created successfully!`);
    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  }
}

createDatabase();
