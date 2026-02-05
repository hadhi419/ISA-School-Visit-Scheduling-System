import db from '../config/db.js';

export const getSubmittedVisitsSummaryService = async (month) => {
  try {
    const selectedMonth =
      month || new Date().toLocaleString('default', { month: 'long' });

    ////console.log(selectedMonth);
    ////console.log('2', month);

    const [rows] = await db.query(
      `
      SELECT 
        u.id AS isa_id,
        u.full_name AS isa_name,
        v.status,

      
        MAX(
          CASE
            WHEN v.status LIKE '%REJECTED%' THEN v.status
            WHEN v.status LIKE '%APPROVED%' THEN v.status
            WHEN v.status = 'PENDING' THEN 'PENDING'
            ELSE 'IN_PROCESS'
          END
        ) AS overall_status,

       
       CASE 
        WHEN COUNT(v.id) = 0 THEN 0
        WHEN SUM(CASE WHEN v.status <> 'IN_PROCESS' THEN 1 ELSE 0 END) > 0 THEN 1
        ELSE 0
      END AS schedule_submitted


      FROM users u
      LEFT JOIN visits v ON v.isa_id = u.id AND v.month = ?
      WHERE u.role = 'ISA'
      GROUP BY u.id, u.full_name
      ORDER BY u.full_name ASC
      `,
      [selectedMonth]
    );

    ////console.log(rows);

    return rows;
  } catch (err) {
    ////console.error(err);
    return [];
  }
};

export const getVisitDetailService = async (isa_id) => {
  try {
    ////console.log('ISAAAA', isa_id);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const month = nextMonth.toLocaleString('default', { month: 'long' });
    const [rows] = await db.query(
      `
      SELECT 
        v.id AS visit_id,
        v.visit_date, 
        v.duty, 
        l.name AS location
      FROM visits v
      LEFT JOIN locations l ON v.location_id = l.id
      WHERE v.isa_id = ?
      AND v.month = ?
      ORDER BY CAST(v.visit_date AS UNSIGNED) ASC
    `,
      [isa_id, month]
    );

    const [userRows] = await db.query(
      `SELECT full_name AS isa_name FROM users WHERE id = ?`,
      [isa_id]
    );

    return {
      isa_id: Number(isa_id),
      isa_name: userRows[0]?.isa_name || 'Unknown',
      schedule: rows.map((r) => ({
        visit_id: r.visit_id, // added
        date: r.visit_date,
        duty: r.duty,
        location: r.location || 'Unknown',
      })),
    };
  } catch (err) {
    ////console.error(err);
    return { isa_id, isa_name: 'Unknown', schedule: [] };
  }
};

export const ddeApproveScheduleService = async (isa_id, approved_by) => {
  try {
    // 1. Update visits table: mark as ADE_APPROVED
    await db.query(
      `UPDATE visits
            SET status = 'DDE_APPROVED'
            WHERE isa_id = ? AND status = 'ADE_APPROVED'`,
      [isa_id]
    );

    // 2. Insert each visit into visit_plan
    const [visits] = await db.query(
      `SELECT isa_id, location_id, visit_date AS planned_date, month
            FROM visits
            WHERE isa_id = ? AND status = 'DDE_APPROVED'`,
      [isa_id]
    );

    for (const v of visits) {
      // Avoid duplicate entries: check if it already exists
      const [existing] = await db.query(
        `SELECT id FROM visit_plan WHERE isa_id = ? AND month = ? AND location_id = ? AND planned_date = ?`,
        [v.isa_id, v.month, v.location_id, v.planned_date]
      );
      if (existing.length === 0) {
        await db.query(
          `INSERT INTO visit_plan (isa_id, month, location_id, planned_date)
                VALUES (?, ?, ?, ?)`,
          [v.isa_id, v.month, v.location_id, v.planned_date]
        );
      }
    }

    // 3. Log approval
    const result = await db.query(
      `INSERT INTO approval_logs (visit_id, approved_by, role, status)
            SELECT id, ?, 'DDE', 'APPROVED' FROM visits WHERE isa_id = ? AND status = 'DDE_APPROVED'`,
      [approved_by, isa_id]
    );

    ////console.log(result);

    return { message: 'DDE approved and visits copied to visit_plan' };
  } catch (err) {
    ////console.error(err);
    throw err;
  }
};

export const ddeRejectScheduleService = async (
  isa_id,
  approved_by,
  comment = ''
) => {
  const [updateResult] = await db.query(
    `
    UPDATE visits
    SET status = 'DDE_REJECTED'
    WHERE isa_id = ? AND status IN ('PENDING','ADE_APPROVED')
    `,
    [isa_id]
  );

  // Log rejection for each visit
  const [rejectedVisits] = await db.query(
    `SELECT id AS visit_id FROM visits WHERE isa_id = ? AND status = 'DDE_REJECTED'`,
    [isa_id]
  );

  for (const visit of rejectedVisits) {
    await db.query(
      `INSERT INTO approval_logs (visit_id, approved_by, role, status, comment, approved_at)
       VALUES (?, ?, 'DDE', 'REJECTED', ?, NOW())`,
      [visit.visit_id, approved_by, comment]
    );
  }

  return updateResult.affectedRows;
};

export const adeRejectScheduleService = async (
  isa_id,
  approved_by = 9,
  comment = ''
) => {
  ////console.log(comment);
  ////console.log(isa_id);
  ////console.log(approved_by);

  const [updateResult] = await db.query(
    `
    UPDATE visits
    SET status = 'ADE_REJECTED'
    WHERE isa_id = ? AND status IN ('PENDING')
    `,
    [isa_id]
  );

  // Log rejection for each visit
  const [rejectedVisits] = await db.query(
    `SELECT id AS visit_id FROM visits WHERE isa_id = ? AND status = 'ADE_REJECTED'`,
    [isa_id]
  );

  //onsole.log(rejectedVisits);

  for (const visit of rejectedVisits) {
    const [row] = await db.query(
      `INSERT INTO approval_logs (visit_id, approved_by, role, status, comment, approved_at)
       VALUES (?, ?, 'ADE', 'REJECTED', ?, NOW())`,
      [visit.visit_id, approved_by, comment]
    );
    //////console.log(row);
  }

  return updateResult.affectedRows;
};

export const adeApproveScheduleService = async (isa_id, approved_by) => {
  try {
    ////console.log(approved_by);
    // 1. Update visits table: mark as ADE_APPROVED
    await db.query(
      `UPDATE visits
            SET status = 'ADE_APPROVED'
            WHERE isa_id = ? AND status = 'PENDING'`,
      [isa_id]
    );

    // // 2. Insert each visit into visit_plan
    // const [visits] = await db.query(
    //   `SELECT isa_id, location_id, visit_date AS planned_date, month
    //   FROM visits
    //   WHERE isa_id = ? AND status = 'DDE_APPROVED'`,
    //   [isa_id]
    // );

    // for (const v of visits) {
    //   // Avoid duplicate entries: check if it already exists
    //   const [existing] = await db.query(
    //     `SELECT id FROM visit_plan WHERE isa_id = ? AND month = ? AND location_id = ? AND planned_date = ?`,
    //     [v.isa_id, v.month, v.location_id, v.planned_date]
    //   );
    //   if (existing.length === 0) {
    //     await db.query(
    //       `INSERT INTO visit_plan (isa_id, month, location_id, planned_date)
    //       VALUES (?, ?, ?, ?)`,
    //       [v.isa_id, v.month, v.location_id, v.planned_date]
    //     );
    //   }
    // }

    // 3. Log approval
    const result = await db.query(
      `INSERT INTO approval_logs (visit_id, approved_by, role, status)
            SELECT id, ?, 'ADE', 'APPROVED' FROM visits WHERE isa_id = ? AND status = 'ADE_APPROVED'`,
      [approved_by, isa_id]
    );

    ////console.log(result);

    return { message: 'ADE approved' };
  } catch (err) {
    ////console.error(err);
    throw err;
  }
};

export const getLatestRejectionForISAService = async (isa_id) => {
  const [rows] = await db.query(
    `
    SELECT 
      al.comment,
      al.role,
      al.approved_at
    FROM approval_logs al
    JOIN visits v ON v.id = al.visit_id
    WHERE v.isa_id = ?
      AND al.status = 'REJECTED'
    ORDER BY al.approved_at DESC
    LIMIT 1
    `,
    [isa_id]
  );

  return rows[0] || null;
};
