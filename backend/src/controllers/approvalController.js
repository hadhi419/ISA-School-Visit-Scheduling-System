import {
  getSubmittedVisitsSummaryService,
  getVisitDetailService,
  adeApproveScheduleService,
  adeRejectScheduleService,
  ddeApproveScheduleService,
  getLatestRejectionForISAService,
  ddeRejectScheduleService,
} from '../models/approvalModel.js';

export const fetchSubmittedVisits = async (req, res) => {
  try {
    // Optional: you can pass month via query param, else default to current month
    const month = req.query.month;
    const visits = await getSubmittedVisitsSummaryService(month);

    // Convert schedule_submitted from 0/1 to boolean
    const result = visits.map((v) => ({
      isa_id: v.isa_id,
      isa_name: v.isa_name,
      status: v.overall_status,
      scheduleSubmitted: v.schedule_submitted === 1,
    }));

    res.json({ visits: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const fetchVisitDetail = async (req, res) => {
  try {
    const isa_id = req.params.isa_id;

    if (!isa_id) {
      return res.status(400).json({ error: 'isa_id is required' });
    }

    const detail = await getVisitDetailService(isa_id);
    res.json(detail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const ddeApproveSchedule = async (req, res) => {
  console.log('Debugging');

  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by; // DDE user id

    const result = await ddeApproveScheduleService(isa_id, approved_by);

    console.log(result);

    res.json({
      success: true,
      message: 'Schedule approved and copied to visit_plan.',
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const ddeRejectSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by;
    const comment = req.body.comment || '';

    const updated = await ddeRejectScheduleService(
      isa_id,
      approved_by,
      comment
    );

    res.json({
      success: true,
      message: 'Revision requested successfully.',
      updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adeApproveSchedule = async (req, res) => {
  console.log('Debugging');
  console.log(req.body);

  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by; // DDE user id

    const result = await adeApproveScheduleService(isa_id, approved_by);

    console.log(result);

    res.json({
      success: true,
      message: 'Schedule approved by DDE',
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adeRejectSchedule = async (req, res) => {
  try {
    //console.log('Debugging adeRejectSchedule');
    // console.log(req.body);
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by;
    const comment = req.body.comment || '';
    //console.log(comment);
    //console.log(approved_by);

    const updated = await adeRejectScheduleService(
      isa_id,
      approved_by,
      comment
    );

    res.json({
      success: true,
      message: 'Revision requested successfully.',
      updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getLatestRejectionForISA = async (req, res) => {
  const { isa_id } = req.params;

  try {
    const rejection = await getLatestRejectionForISAService(isa_id);
    res.json({ rejection });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rejection info' });
  }
};
