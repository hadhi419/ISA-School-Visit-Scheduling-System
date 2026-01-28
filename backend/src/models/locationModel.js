import db from '../config/db.js';

// Get all locations with full details
export const getAllLocations = async () => {
  const [rows] = await db.query(`
    SELECT id, name, category, address 
    FROM locations
  `);
  return rows;
};

export const addLocationModel = async (locationName, category, address) => {
  const [rows] = await db.query(
    `
    insert into locations (name, category, address) VALUES(?,?,?)
  `,
    [locationName, category, address]
  );
  return rows;
};

export const editLocationModel = async (
  editLocation,
  name,
  category,
  address
) => {
  const [rows] = await db.query(
    `
    update locations
    set name=?, category=?, address=?
    WHERE id=?
  `,
    [name, category, address, editLocation]
  );
  return rows;
};
