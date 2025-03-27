import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Token extends Model {
  public userId!: string;
  public accessToken!: string;
  public refreshToken!: string;
  public deviceId!: string;
}

Token.init(
  {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    accessToken: { type: DataTypes.STRING, allowNull: false },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
    deviceId: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "tokens", modelName: "Token" }
);

export default Token;
