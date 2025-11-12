import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /api/visits
// POST /api/visits
router.post("/", async (req, res) => {
  try {
    const { visit_date, month, isa_id, location_id, duty } = req.body;

    if (!visit_date || !month || !isa_id || !location_id || !duty) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const allowedDuties = ['HNST', 'EXAM', 'DEV', 'EVAL', 'HOLI'];
    if (!allowedDuties.includes(duty)) {
      return res.status(400).json({ error: "Invalid duty value" });
    }

    const [result] = await db.query(
      `INSERT INTO visits (visit_date, month, isa_id, location_id, duty)
       VALUES (?, ?, ?, ?, ?)`,
      [visit_date, month, isa_id, location_id, duty]
    );

    res.status(201).json({
      message: "Visit created successfully",
      visitId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/visits/month/:month
router.get("/month/:month", async (req, res) => {
  try {
    const { month } = req.params;
    if (!month) return res.status(400).json({ error: "Month is required" });

   const monthParam = month.trim(); // remove extra spaces from URL
   const [rows] = await db.query(
        `SELECT v.id, v.visit_date, v.month, v.duty,
                i.user_id AS isa_user_id, u.name AS isa_name,
                l.name AS location_name
        FROM visits v
        JOIN isa_details i ON v.isa_id = i.id
        JOIN users u ON i.user_id = u.id
        JOIN locations l ON v.location_id = l.id
        WHERE v.month LIKE ?`,
        [`${monthParam}%`] // uses LIKE instead of =, avoids LOWER/TRIM issues
        );



    console.log(month.toLowerCase());
    console.log(rows);

    res.json({ visits: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
