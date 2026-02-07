import {
  getSubmittedVisitsSummaryService,
  getVisitDetailService,
  adeApproveScheduleService,
  adeRejectScheduleService,
  ddeApproveScheduleService,
  getLatestRejectionForISAService,
  ddeRejectScheduleService,
} from '../models/approvalModel.js';

// Fetch submitted visits summary
export const fetchSubmittedVisits = async (req, res) => {
  try {
    const month = req.query.month; // optional

    const visits = await getSubmittedVisitsSummaryService(month);

    const result = visits.map((v) => ({
      isa_id: v.isa_id,
      isa_name: v.isa_name,
      status: v.overall_status,
      scheduleSubmitted: v.schedule_submitted === 1,
    }));

    res.json({ success: true, visits: result });
  } catch (err) {
    console.error('Error in fetchSubmittedVisits:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch visit detail for a specific ISA
export const fetchVisitDetail = async (req, res) => {
  try {
    const isa_id = req.params.isa_id;
    if (!isa_id) {
      return res
        .status(400)
        .json({ success: false, message: 'isa_id is required' });
    }

    const detail = await getVisitDetailService(isa_id);
    res.json({ success: true, detail });
  } catch (err) {
    console.error('Error in fetchVisitDetail:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DDE approve schedule
export const ddeApproveSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const { approved_by } = req.body;

    if (!isa_id || !approved_by) {
      return res.status(400).json({
        success: false,
        message: 'isa_id and approved_by are required',
      });
    }

    const result = await ddeApproveScheduleService(isa_id, approved_by);

    res.json({
      success: true,
      message: 'Schedule approved and copied to visit_plan.',
      data: result,
    });
  } catch (err) {
    console.error('Error in ddeApproveSchedule:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DDE reject schedule
export const ddeRejectSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const { approved_by, comment = '' } = req.body;

    if (!isa_id || !approved_by) {
      return res.status(400).json({
        success: false,
        message: 'isa_id and approved_by are required',
      });
    }

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
    console.error('Error in ddeRejectSchedule:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADE approve schedule
export const adeApproveSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const { approved_by } = req.body;

    if (!isa_id || !approved_by) {
      return res.status(400).json({
        success: false,
        message: 'isa_id and approved_by are required',
      });
    }

    const result = await adeApproveScheduleService(isa_id, approved_by);

    res.json({
      success: true,
      message: 'Schedule approved by DDE',
      data: result,
    });
  } catch (err) {
    console.error('Error in adeApproveSchedule:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADE reject schedule
export const adeRejectSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const { approved_by, comment = '' } = req.body;

    if (!isa_id || !approved_by) {
      return res.status(400).json({
        success: false,
        message: 'isa_id and approved_by are required',
      });
    }

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
    console.error('Error in adeRejectSchedule:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get latest rejection info for ISA
export const getLatestRejectionForISA = async (req, res) => {
  try {
    const { isa_id } = req.params;
    if (!isa_id) {
      return res
        .status(400)
        .json({ success: false, message: 'isa_id is required' });
    }

    const rejection = await getLatestRejectionForISAService(isa_id);
    res.json({ success: true, rejection });
  } catch (err) {
    console.error('Error in getLatestRejectionForISA:', err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch rejection info' });
  }
};
