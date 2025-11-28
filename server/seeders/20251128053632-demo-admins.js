import bcrypt from "bcrypt";

/** @type {import('sequelize-cli').Seeder} */
export default {
  async up(queryInterface) {
    // Password hashing
    const hashedPassword = await bcrypt.hash("password123", 10);

    return queryInterface.bulkInsert("admins", [
      {
        userName: "Admin1",
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("admins", null, {});
  },
};
