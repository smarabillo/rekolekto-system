import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

function getOptionalEnv(name: string): string | undefined {
  return process.env[name];
}

const sequelize = new Sequelize(
  getRequiredEnv("DATABASE_NAME"),
  getRequiredEnv("DATABASE_USER"),
  getRequiredEnv("DATABASE_PASSWORD"),
  {
    host: getRequiredEnv("DATABASE_HOST"),
    dialect: "postgres",
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    logging: false,
  }
);

export default sequelize;
