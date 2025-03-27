import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

export class File extends Model {
  public name!: string;
  public extension!: string;
  public mime_type!: string;
  public size!: number;
  public upload_date!: Date;
}

File.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    extension: { type: DataTypes.STRING, allowNull: false },
    mime_type: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    upload_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "files", timestamps: false }
);

export default File;
