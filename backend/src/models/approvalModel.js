import db from "../config/db.js";

export const getSubmittedVisitsSummaryService = async (month) => {
  try {
    const selectedMonth = month || new Date().toLocaleString('default', { month: 'long' });

    const [rows] = await db.query(
      `
      SELECT 
        u.id AS isa_id,
        u.full_name AS isa_name,

        -- Overall status based on priority: REJECTED > any APPROVED > PENDING > IN_PROCESS
        MAX(
          CASE
            WHEN v.status LIKE '%REJECTED%' THEN v.status
            WHEN v.status LIKE '%APPROVED%' THEN v.status
            WHEN v.status = 'PENDING' THEN 'PENDING'
            ELSE 'IN_PROCESS'
          END
        ) AS overall_status,

        -- Schedule submitted? 1 if at least one visit exists beyond IN_PROCESS
       CASE 
        WHEN COUNT(v.id) = 0 THEN 0
        WHEN SUM(CASE WHEN v.status <> 'IN_PROCESS' THEN 1 ELSE 0 END) > 0 THEN 1
        ELSE 0
      END AS schedule_submitted


      FROM users u
      LEFT JOIN visits v ON v.isa_id = u.id AND v.month = "February"
      WHERE u.role = 'ISA'
      GROUP BY u.id, u.full_name
      ORDER BY u.full_name ASC
      `,
      [selectedMonth]
    );

    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};


export const getVisitDetailService = async (isa_id) => {
  try {
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
      ORDER BY CAST(v.visit_date AS UNSIGNED) ASC
    `,
      [isa_id]
    );

    const [userRows] = await db.query(
      `SELECT full_name AS isa_name FROM users WHERE id = ?`,
      [isa_id]
    );

    return {
      isa_id: Number(isa_id),
      isa_name: userRows[0]?.isa_name || "Unknown",
      schedule: rows.map((r) => ({
        visit_id: r.visit_id,          // added
        date: r.visit_date,
        duty: r.duty,
        location: r.location || "Unknown",
      })),
    };
  } catch (err) {
    console.error(err);
    return { isa_id, isa_name: "Unknown", schedule: [] };
  }
};



export const zdeApproveScheduleService = async (isa_id, approved_by) => {
        try {
          // 1. Update visits table: mark as ZDE_APPROVED
          await db.query(
            `UPDATE visits
            SET status = 'ZDE_APPROVED'
            WHERE isa_id = ? AND status = 'DDE_APPROVED'`,
            [isa_id]
          );

          // 2. Insert each visit into visit_plan
          const [visits] = await db.query(
            `SELECT isa_id, location_id, visit_date AS planned_date, month
            FROM visits
            WHERE isa_id = ? AND status = 'ZDE_APPROVED'`,
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
            SELECT id, ?, 'ZDE', 'APPROVED' FROM visits WHERE isa_id = ? AND status = 'ZDE_APPROVED'`,
            [approved_by, isa_id]
          );

          console.log(result)

          return { message: "ZDE approved and visits copied to visit_plan" };
        } catch (err) {
          console.error(err);
          throw err;
        }
      };


      
export const zdeRejectScheduleService = async (isa_id, approved_by, comment = '') => {
  const [updateResult] = await db.query(
    `
    UPDATE visits
    SET status = 'ZDE_REJECTED'
    WHERE isa_id = ? AND status IN ('PENDING','ADE_APPROVED','DDE_APPROVED')
    `,
    [isa_id]
  );

  // Log rejection for each visit
  const [rejectedVisits] = await db.query(
    `SELECT id AS visit_id FROM visits WHERE isa_id = ? AND status = 'ZDE_REJECTED'`,
    [isa_id]
  );

  for (const visit of rejectedVisits) {
    await db.query(
      `INSERT INTO approval_logs (visit_id, approved_by, role, status, comment, approved_at)
       VALUES (?, ?, 'ZDE', 'REJECTED', ?, NOW())`,
      [visit.visit_id, approved_by, comment]
    );
  }

  return updateResult.affectedRows;
};



export const ddeRejectScheduleService = async (isa_id, approved_by, comment = '') => {
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




export const ddeApproveScheduleService = async (isa_id, approved_by) => {
        try {
          // 1. Update visits table: mark as ZDE_APPROVED
          await db.query(
            `UPDATE visits
            SET status = 'DDE_APPROVED'
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
            SELECT id, ?, 'DDE', 'APPROVED' FROM visits WHERE isa_id = ? AND status = 'DDE_APPROVED'`,
            [approved_by, isa_id]
          );

          console.log(result)

          return { message: "DDE approved" };
        } catch (err) {
          console.error(err);
          throw err;
        }
      };

