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

    if (!visit_id || !report_text || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    console.log('Uploaded files:', req.files);

    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    } else {
      console.log('Uploaded files:', req.files);
    }

    if (req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // 2️⃣ Save uploaded files to visit_evidence
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith('image/') ? 'IMG' : 'DOC'; // map other files to DOC, could add PDF detection

        await addVisitEvidence({
          visit_id,
          file_url: file.path.replace(/\\/g, '/'), // normalize Windows paths
          file_type: fileType,
        });
      }
    }

    // 3️⃣ Fetch the updated visit report with evidence to return
    const report = await getVisitReportById(visit_id);

    return res.status(201).json({
      message: 'Monitoring report submitted successfully',
      report,
    });
  } catch (err) {
    console.error('submitMonitoringReport error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
