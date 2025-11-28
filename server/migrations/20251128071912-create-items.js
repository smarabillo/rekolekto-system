"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("items", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    barcode: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    product_name: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    material_type: {
      type: Sequelize.ENUM("PET", "CAN"),
      allowNull: false,
    },
    size: {
      type: Sequelize.ENUM("SMALL", "LARGE"),
      allowNull: true,
    },
    points: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("items");
}
