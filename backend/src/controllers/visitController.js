import {
  postVisits,
  fetchVisits,
  checkEditPermissionForMonth,
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
