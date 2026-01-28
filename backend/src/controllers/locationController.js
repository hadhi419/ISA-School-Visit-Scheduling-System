import {
  getAllLocations,
  addLocationModel,
  editLocationModel,
} from '../models/locationModel.js';

export const fetchLocations = async (req, res) => {
  try {
    const locations = await getAllLocations();
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addLocation = async (req, res) => {
  try {
    const { locationName, category, address } = req.body;

    console.log(address);

    const response = await addLocationModel(locationName, category, address);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editLocation = async (req, res) => {
  try {
    const { editLocation, name, category, address } = req.body;

    console.log(address);

    const response = await editLocationModel(
      editLocation,
      name,
      category,
      address
    );
    res.json('Edit done successfully', response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
