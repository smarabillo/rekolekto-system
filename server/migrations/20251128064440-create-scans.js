'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('scans', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    barcode: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    material_detected: {
      type: Sequelize.ENUM('CAN', 'PET'),
      allowNull: false
    },
    size: {
      type: Sequelize.ENUM('SMALL', 'LARGE', 'N/A'),
      allowNull: false
    },
    points_earned: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    image_path: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    response_time_ms: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()')
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('scans');
}