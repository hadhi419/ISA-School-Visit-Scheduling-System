  import express from "express";
  import db from "../config/db.js";
  import { postSingleVisit, fetchAllVisits } from "../controllers/visitController.js";


  const router = express.Router();

  // POST /api/visits
  router.post("/", postSingleVisit);

  // GET /api/visits/month/
  router.get("/month/:month/:isa_id",fetchAllVisits);


  // GET /api/visits/month/
  router.get("/approved/month/:month", async (req, res) => {
    try {
      const { month } = req.params;
      if (!month) return res.status(400).json({ error: "Month is required" });

      const monthParam = month.trim();
      const [rows] = await db.query(
        `SELECT v.id, v.visit_date, v.month, v.duty,
                i.user_id AS isa_user_id, u.name AS isa_name,
                l.name AS location_name
        FROM visits v
        JOIN isa_details i ON v.isa_id = i.id
        JOIN users u ON i.user_id = u.id
        JOIN locations l ON v.location_id = l.id
        WHERE v.month LIKE ? AND v.approved = 1`,
        [`${monthParam}%`]
      );

      res.json({ visits: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });



  export default router;
