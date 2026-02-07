import {
  postVisits,
  fetchVisits,
  checkEditPermissionForMonth,
  deleteVisits,
  fetchVisitsByIsa,
  fetchVisitsByLocation,
  fetchISAs,
  submitVisits,
} from '../models/visitModel.js';

// Post multiple visits
export const postMultipleVisits = async (req, res) => {
  try {
    const visitsArray = req.body;
    if (!Array.isArray(visitsArray) || visitsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Visits array is required and cannot be empty',
      });
    }

    const result = await postVisits(visitsArray);
    res.json({
      success: true,
      message: 'Visits added successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error in postMultipleVisits:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error while posting visits' });
  }
};

// Delete a visit
export const deleteVisit = async (req, res) => {
  try {
    const { visit_date, month, isa_id } = req.body;
    if (!visit_date || !month || !isa_id) {
      return res.status(400).json({
        success: false,
        message: 'visit_date, month, and isa_id are required',
      });
    }

    const result = await deleteVisits(visit_date, month, isa_id);
    res.json({
      success: true,
      message: 'Visit deleted successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error in deleteVisit:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error while deleting visit' });
  }
};

// Fetch all visits
export const fetchAllVisits = async (req, res) => {
  try {
    const { month, isa_id } = req.params;
    if (!month || !isa_id) {
      return res.status(400).json({
        success: false,
        message: 'Month and ISA ID are required',
      });
    }

    const visits = await fetchVisits(month, isa_id);
    res.json({ success: true, data: visits });
  } catch (err) {
    console.error('Error in fetchAllVisits:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error while fetching visits' });
  }
};

// Submit monthly visits
export const submitMonthlyVisits = async (req, res) => {
  try {
    const { month, isa_id } = req.body;
    if (!month || !isa_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Month and ISA ID are required' });
    }

    const result = await submitVisits(month, isa_id);
    res.json({ success: true, message: result });
  } catch (err) {
    console.error('Error in submitMonthlyVisits:', err);
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error while submitting visits',
      });
  }
};

// Check monthly edit permission
export const checkMonthlyEditPermission = async (req, res) => {
  try {
    const { month, isa_id } = req.params;
    if (!month || !isa_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Month and ISA ID are required' });
    }

    const canEdit = await checkEditPermissionForMonth(month, isa_id);

    res.json({
      success: true,
      canEdit,
      reason: canEdit
        ? null
        : 'Schedule is locked after approval by higher authority',
    });
  } catch (err) {
    console.error('Error in checkMonthlyEditPermission:', err);
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error while checking edit permission',
      });
  }
};

// Get all ISAs
export const getISAs = async (req, res) => {
  try {
    const isas = await fetchISAs();
    res.json({ success: true, data: isas });
  } catch (err) {
    console.error('Error in getISAs:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error while fetching ISAs' });
  }
};

// Get visits by ISA
export const getVisitsByIsa = async (req, res) => {
  try {
    const { isa_id, date, month, week } = req.query;
    if (!isa_id) {
      return res
        .status(400)
        .json({ success: false, message: 'isa_id is required' });
    }

    const visits = await fetchVisitsByIsa(
      Number(isa_id),
      date && date !== 'null' ? date : null,
      month && month !== 'null' ? month : '',
      week && week !== 'null' ? week : null
    );

    res.json({ success: true, data: visits });
  } catch (err) {
    console.error('Error in getVisitsByIsa:', err);
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error while fetching visits by ISA',
      });
  }
};

// Get visits by location
export const getVisitsByLocation = async (req, res) => {
  try {
    const { location_id, date, month, week } = req.query;
    if (!location_id) {
      return res
        .status(400)
        .json({ success: false, message: 'location_id is required' });
    }

    const visits = await fetchVisitsByLocation(
      Number(location_id),
      date && date !== 'null' ? date : null,
      month && month !== 'null' ? month : null,
      week && week !== 'null' ? week : null
    );

    res.json({ success: true, data: visits });
  } catch (err) {
    console.error('Error in getVisitsByLocation:', err);
    res
      .status(500)
      .json({
        success: false,
        message: 'Server error while fetching visits by location',
      });
  }
};
