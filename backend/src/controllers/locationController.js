import {
  getAllLocations,
  addLocationModel,
  editLocationModel,
} from '../models/locationModel.js';

// Fetch all locations
export const fetchLocations = async (req, res) => {
  try {
    const locations = await getAllLocations();
    res.json({ success: true, data: { locations } });
  } catch (err) {
    console.error('Error in fetchLocations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a new location
export const addLocation = async (req, res) => {
  try {
    const { locationName, category, address } = req.body;

    if (!locationName || !category || !address) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const response = await addLocationModel(locationName, category, address);
    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: response,
    });
  } catch (err) {
    console.error('Error in addLocation:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Edit an existing location
export const editLocation = async (req, res) => {
  try {
    const { editLocation, name, category, address } = req.body;

    if (!editLocation || !name || !category || !address) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const response = await editLocationModel(
      editLocation,
      name,
      category,
      address
    );
    res.json({
      success: true,
      message: 'Location edited successfully',
      data: response,
    });
  } catch (err) {
    console.error('Error in editLocation:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
