import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class RefreshToken extends Model {
  public userId!: string;
  public refreshToken!: string;
}

RefreshToken.init(
  {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "refresh_tokens", modelName: "RefreshToken" }
);

export default RefreshToken;
