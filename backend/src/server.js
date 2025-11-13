import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js"; 

import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import visitsRoutes from "./routes/visits.js";



const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/visits", visitsRoutes);


import bcrypt from "bcryptjs";

async function hashed()
{
  const password = "123456";
  const hashed = await bcrypt.hash(password, 10);
  console.log(hashed);

}


app.get("/", async (req, res) => {
  try {
    hashed();
    const [rows] = await db.query("SELECT NOW() AS now");
    res.json({ message: "EduCal backend is running...", time: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
