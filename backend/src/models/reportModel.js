import db from '../config/db.js';

/**
 * Update visit report text and status
 */
/**
 * Update visit report, status, and actual location (if changed)
 */
export const submitVisitReport = async ({
  visit_id,
  report_text,
  status,
  actual_location_id = null,
  location_change_reason = null,
  actual_duty = null,
}) => {
  if (isNaN(actual_location_id)) {
    console.log(actual_location_id);
    const [rows] = await db.query(`SELECT id from locations where name = ?`, [
      actual_location_id,
    ]);
    actual_location_id = rows[0].id;
  }

  if (!actual_duty) {
    console.log('hadhi');
  }

  console.log('Hehe hooo', actual_location_id);
  // Get planned location
  const [rows] = await db.query(
    `SELECT location_id, duty FROM visits WHERE id = ?`,
    [visit_id]
  );

  const visit = rows[0]; // the first row
  console.log(visit.location_id, visit.duty);

  // Decide whether location really changed
  const isLocationChanged =
    actual_location_id && Number(actual_location_id) !== visit.location_id;
  console.log(actual_duty);
  await db.query(
    `
    UPDATE visits
    SET
      report_text = ?,
      status = ?,
      actual_location_id = ?,
      location_change_reason = ?,
      actual_duty = ?
    WHERE id = ?
    `,
    [
      report_text,
      status,
      isLocationChanged ? actual_location_id : visit.location_id,
      isLocationChanged ? location_change_reason : null,
      isLocationChanged ? actual_duty : visit.duty,
      visit_id,
    ]
  );
};

/**
 * Save uploaded evidence file
 */
export const addVisitEvidence = async ({ visit_id, file_url, file_type }) => {
  await db.query(
    `
    INSERT INTO visit_evidence
      (visit_id, file_url, file_type)
    VALUES (?, ?, ?)
    `,
    [visit_id, file_url, file_type]
  );
};

/**
 * Get visit report with evidence
 */
export const getVisitReportById = async (visitId) => {
  const [[visit]] = await db.query(`SELECT * FROM visits WHERE id = ?`, [
    visitId,
  ]);

  const [files] = await db.query(
    `SELECT * FROM visit_evidence WHERE visit_id = ?`,
    [visitId]
  );

  return { ...visit, evidence: files };
};
