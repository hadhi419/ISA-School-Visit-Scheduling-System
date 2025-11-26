import db from "../config/db.js";

// Get all locations with full details
export const getAllLocations = async () => {
  const [rows] = await db.query(`
    SELECT id, name, category, address, parent_id 
    FROM locations
  `);
  return rows;
};
