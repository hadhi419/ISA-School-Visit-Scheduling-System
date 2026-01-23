import {
  postVisits,
  fetchVisits,
  checkEditPermissionForMonth,
  deleteVisits,
  fetchVisitsByIsa,
  fetchVisitsByLocation,
  fetchISAs,
} from '../models/visitModel.js';

export const postMultipleVisits = async (req, res) => {
  try {
    const visitsArray = req.body;
    const message = await postVisits(visitsArray);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteVisit = async (req, res) => {
  try {
    console.log(req.body);
    const { visit_date, month, isa_id } = req.body;
    //console.log(visit_date, month, isa_id);
    const message = await deleteVisits(visit_date, month, isa_id);
    console.log('Routerrr', message);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchAllVisits = async (req, res) => {
  try {
    const { month, isa_id } = req.params;
    const visits = await fetchVisits(month, isa_id);
    res.json({ visits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import { submitVisits } from '../models/visitModel.js';

export const submitMonthlyVisits = async (req, res) => {
  try {
    const { month, isa_id } = req.body;

    if (!month || !isa_id) {
      return res.status(400).json({ error: 'Month and ISA ID are required' });
    }

    const result = await submitVisits(month, isa_id);
    res.json({ message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkMonthlyEditPermission = async (req, res) => {
  try {
    const { month, isa_id } = req.params;

    if (!month || !isa_id) {
      return res.status(400).json({ error: 'Month and ISA ID are required' });
    }

    const canEdit = await checkEditPermissionForMonth(month, isa_id);

    res.json({
      canEdit,
      reason: canEdit
        ? null
        : 'Schedule is locked after approval by higher authority',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getISAs = async (req, res) => {
  try {
    const isas = await fetchISAs();
    res.json(isas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller for ISA Monitoring
export const getVisitsByIsa = async (req, res) => {
  try {
    const { isa_id, date } = req.query;
    console.log(date);

    const visits = await fetchVisitsByIsa(
      isa_id ? Number(isa_id) : null,
      date && date !== 'null' ? date : null
    );

    res.json({ success: true, data: visits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller for Location Monitoring
export const getVisitsByLocation = async (req, res) => {
  try {
    console.log(req.query);
    const { location_id, date } = req.query;
    const visits = await fetchVisitsByLocation(
      location_id ? Number(location_id) : null,

      date && date !== 'null' ? date : null
    );
    res.json({ success: true, data: visits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
