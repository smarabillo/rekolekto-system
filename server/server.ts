import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  sequelize from "./config/db";

dotenv.config();

const app = express();

//--------------- middleware
app.use(cors());
app.use(express.json());

//--------------- root routeç
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//--------------- routes
// app.use("/api", routes);

//--------------- health route with DB check
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send("✅ Database is connected!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Health check failed:", error.message);
      res.status(500).send("❌ Database connection failed!");
    } else {
      console.error("❌ Health check failed:", error);
      res.status(500).send("❌ Database connection failed!");
    }
  }
});

//--------------- start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running at port ${PORT}`);
});
