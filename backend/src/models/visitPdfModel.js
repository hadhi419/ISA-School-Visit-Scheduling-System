import db from '../config/db.js';

export const fetchVisitsForPdf = async ({
  isa_id,
  month,
  year,
  date,
  location_id,
}) => {
  // 1️⃣ Fetch the visit data
  const visitsQuery = `
    SELECT 
      v.visit_date,
      v.month,
      DATE_FORMAT(v.date, '%Y-%m-%d') AS full_date,
      l.name AS location_name,
      A.name AS actual_location_name,
      v.duty,
      v.actual_duty,
      v.location_change_reason,
      v.status,
      u.full_name AS isa_name
    FROM visits v
    LEFT JOIN locations l ON v.location_id = l.id
    LEFT JOIN locations A ON v.actual_location_id = A.id
    LEFT JOIN users u ON v.isa_id = u.id
    WHERE v.isa_id = ?
      AND v.month = ?
      AND YEAR(v.date) = ?
      AND (? IS NULL OR v.date = ?)
      AND (? IS NULL OR v.location_id = ?)
    ORDER BY v.date ASC
  `;

  const params = [
    isa_id,
    month,
    year,
    date || null,
    date || null,
    location_id || null,
    location_id || null,
  ];

  const [visits] = await db.execute(visitsQuery, params);

  // 2️⃣ Fetch counts by actual_duty
  const countsQuery = `
    SELECT 
      v.actual_duty,
      COUNT(*) AS duty_count
    FROM visits v
    WHERE v.isa_id = ?
      AND v.month = ?
      AND YEAR(v.date) = ?
      AND (? IS NULL OR v.date = ?)
      AND (? IS NULL OR v.location_id = ?)
    GROUP BY v.actual_duty
  `;

  const [counts] = await db.execute(countsQuery, params);

  // 3️⃣ Return both together
  return { visits, counts };
};
