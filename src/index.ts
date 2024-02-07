import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import mealTypeRoutes from "./routes/mealTypes";
import menuTypeRoutes from "./routes/menuTypes";
import jointTypeRoutes from "./routes/jointTypes";

const { PORT, DB_URI } = process.env;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/meal-types", mealTypeRoutes);
app.use("/api/menu-types", menuTypeRoutes);
app.use("/api/joint-types", jointTypeRoutes);

mongoose.connect(DB_URI);
mongoose.connection.on("open", () =>
  console.log("Connected to database successfully")
);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
