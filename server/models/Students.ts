import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Students = sequelize.define(
  "Students",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.ENUM("7, 8, 9, 10, 11, 12"),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

export default Students;
