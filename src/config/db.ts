import { Sequelize } from "sequelize";
import config from "./config";

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment as keyof typeof config];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,
});

export default sequelize;
