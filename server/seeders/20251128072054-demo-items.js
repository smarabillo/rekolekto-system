"use strict";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    "items",
    [
      {
        barcode: "8996001600597",
        product_name:
          "Kopiko Lucky Day - Strong And Creamy Coffee (Ready-to-Drink COFFEE)",
        material_type: "PET",
        size: "SMALL",
        points: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("items", null, {});
}
