'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Items.init({
    barcode: DataTypes.STRING,
    product_name: DataTypes.STRING,
    material_type: DataTypes.ENUM,
    size: DataTypes.ENUM,
    points: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Items',
  });
  return Items;
};