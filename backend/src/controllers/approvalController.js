import { getSubmittedVisitsSummaryService, getVisitDetailService, zdeApproveScheduleService, zdeRejectScheduleService,ddeApproveScheduleService, ddeRejectScheduleService } from "../models/approvalModel.js";

export const fetchSubmittedVisits = async (req, res) => {
  try {
    // Optional: you can pass month via query param, else default to current month
    const month = req.query.month || new Date().toLocaleString('default', { month: 'long' });
    const visits = await getSubmittedVisitsSummaryService(month);

    // Convert schedule_submitted from 0/1 to boolean
    const result = visits.map(v => ({
      isa_id: v.isa_id,
      isa_name: v.isa_name,
      status: v.overall_status,
      scheduleSubmitted: v.schedule_submitted === 1,
    }));

    res.json({ visits: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const fetchVisitDetail = async (req, res) => {
  try {
    const isa_id = req.params.isa_id;

    if (!isa_id) {
      return res.status(400).json({ error: "isa_id is required" });
    }

    const detail = await getVisitDetailService(isa_id);
    res.json(detail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const zdeApproveSchedule = async (req, res) => {

  console.log("Debugging");
 
  
  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by; // ZDE user id

    const result = await zdeApproveScheduleService(isa_id, approved_by);

     console.log(result);

    res.json({
      success: true,
      message: "Schedule approved and copied to visit_plan.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const zdeRejectSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by; 
    const comment = req.body.comment || '';

    const updated = await zdeRejectScheduleService(isa_id, approved_by, comment);

    res.json({
      success: true,
      message: "Revision requested successfully.",
      updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const ddeApproveSchedule = async (req, res) => {

  console.log("Debugging");
 
  
  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by; // ZDE user id

    const result = await ddeApproveScheduleService(isa_id, approved_by);

     console.log(result);

    res.json({
      success: true,
      message: "Schedule approved by DDE",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const ddeRejectSchedule = async (req, res) => {
  try {
    const { isa_id } = req.params;
    const approved_by = req.body.approved_by; 
    const comment = req.body.comment || '';

    const updated = await ddeRejectScheduleService(isa_id, approved_by, comment);

    res.json({
      success: true,
      message: "Revision requested successfully.",
      updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};