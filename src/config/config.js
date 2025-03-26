import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

export default {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "mysql",
  },
};
