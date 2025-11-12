import { getAllLocations } from "../models/locationModel.js";

export const fetchLocations = async (req, res) => {
  try {
    const locations = await getAllLocations();
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
