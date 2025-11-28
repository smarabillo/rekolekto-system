import bcrypt from "bcrypt";

/** @type {import('sequelize-cli').Seeder} */
export default {
  async up(queryInterface) {
    // Password hashing
    const hashedPassword = await bcrypt.hash("password123", 10);

    return queryInterface.bulkInsert("students", [
      {
        studentId: "2120364",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        grade: "10",
        section: "A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("students", null, {});
  },
};
