"use strict";

import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Scans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Scans.belongsTo(models.Students, {
        foreignKey: "user_id",
      });
    }
  }
  Scans.init(
    {
      user_id: DataTypes.INTEGER,
      barcode: DataTypes.STRING,
      material_detected: DataTypes.ENUM,
      size: DataTypes.ENUM,
      points_earned: DataTypes.INTEGER,
      image_path: DataTypes.TEXT,
      response_time_ms: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Scans",
    }
  );
  return Scans;
};
