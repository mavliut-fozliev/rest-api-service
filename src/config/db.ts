import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const uri = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(uri, {
  logging: false,
});

export default sequelize;
