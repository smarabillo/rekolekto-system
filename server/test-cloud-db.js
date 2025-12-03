import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to Cloud DB successfully."))
  .catch((err) => console.error("Connection failed:", err));
