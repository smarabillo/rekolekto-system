"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Students.hasMany(models.Scans, {
        foreignKey: "user_id",
      });
    }
  }
  Students.init(
    {
      studentId: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      grade: DataTypes.ENUM,
      section: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};
