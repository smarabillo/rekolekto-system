'use strict';

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    'scans',
    [
      {
        user_id: 1,
        barcode: 'ABC123456',
        material_detected: 'CAN',
        size: 'SMALL',
        points_earned: 3,
        image_path: '/images/scan1.jpg',
        response_time_ms: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {}
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('scans', null, {});
}
