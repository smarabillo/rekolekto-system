import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
