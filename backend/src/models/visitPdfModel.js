import db from '../config/db.js';

export const fetchVisitsForPdf = async ({
  isa_id,
  month,
  year,
  date,
  location_id,
}) => {
  //console.log('Monthhhhh ', month);
  const query = `
    SELECT 
      v.visit_date,
      v.month,
      DATE_FORMAT(v.date, '%Y-%m-%d') AS full_date,
      l.name AS location_name,
      A.name as actual_location_name,
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

  const [rows] = await db.execute(query, params);
  console.log(rows);
  return rows;
};
