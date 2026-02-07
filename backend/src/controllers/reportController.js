import {
  submitVisitReport,
  addVisitEvidence,
  getVisitReportById,
} from '../models/reportModel.js';

/**
 * Submit visit report with files
 */
export const submitMonitoringReport = async (req, res) => {
  try {
    const {
      visit_id,
      report_text,
      status,
      actual_location_id,
      location_change_reason,
      actual_duty,
    } = req.body;

    // Validate required fields
    if (!visit_id || !report_text || !status) {
      return res.status(400).json({
        success: false,
        message: 'visit_id, report_text, and status are required',
      });
    }

    // 1️⃣ Update visit report text and status
    await submitVisitReport({
      visit_id,
      report_text,
      status,
      actual_location_id,
      location_change_reason,
      actual_duty,
    });

    // 2️⃣ Handle uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    for (const file of req.files) {
      const fileType = file.mimetype.startsWith('image/') ? 'IMG' : 'DOC';
      await addVisitEvidence({
        visit_id,
        file_url: file.path.replace(/\\/g, '/'),
        file_type: fileType,
      });
    }

    // 3️⃣ Fetch updated report with evidence
    const report = await getVisitReportById(visit_id);

    return res.status(201).json({
      success: true,
      message: 'Monitoring report submitted successfully',
      data: report,
    });
  } catch (err) {
    console.error('Error in submitMonitoringReport:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting monitoring report',
    });
  }
};
