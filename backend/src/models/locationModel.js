import db from "../config/db.js";

// Get all locations
export const getAllLocations = async () => {
  const [rows] = await db.query("SELECT id, name FROM locations");
  return rows;
};
