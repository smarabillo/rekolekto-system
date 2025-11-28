import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//--------------- middleware
app.use(cors());
app.use(express.json());

//--------------- root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//--------------- routes
// import routes from './routes/index.js'; // Uncomment if you have routes
// app.use("/api", routes);

//--------------- health route with DB check
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send("✅ Database is connected!");
  } catch (error) {
    console.error("❌ Health check failed:", error.message || error);
    res.status(500).send("❌ Database connection failed!");
  }
});

//--------------- start server
app.listen(PORT, () => {
  console.log(`✅ Server running at port ${PORT}`);
});
