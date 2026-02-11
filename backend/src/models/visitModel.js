import db from '../config/db.js';
export const postVisits = async (visitsArray) => {
  try {
    //////console.log(visitsArray);
    if (!Array.isArray(visitsArray) || visitsArray.length === 0) {
      return { error: 'Visits array is required' };
    }

    const allowedDuties = [
      'HNST',
      'ADVO',
      'ExEv',
      'Office',
      'HOLI',
      'PL',
      'Parti',
      'Faci',
      'Other',
    ];

    const values = [];

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthYear = nextMonth.getFullYear(); // year for the "date" field

    for (const visit of visitsArray) {
      const {
        visit_date,
        month,
        isa_id,
        location_id,
        duty,
        report_text = null,
      } = visit;

      if (
        visit_date == null ||
        month == null ||
        isa_id == null ||
        duty == null
      ) {
        continue;
      }

      if (!allowedDuties.includes(duty)) {
        continue;
      }

      // Construct a proper date for the new "date" field
      let parsedDate = null;
      try {
        // Assuming visit_date is day number only: '15' => YYYY-MM-DD
        const day = parseInt(visit_date.toString(), 10); // day of the month

        // Convert month from POST body to 0-indexed month number
        // If month is string like "February", this converts it to 1 → 0-indexed for JS Date
        const monthNumber =
          typeof month === 'string'
            ? new Date(`${month} 1`).getMonth()
            : month - 1;

        parsedDate = new Date(new Date().getFullYear(), monthNumber, day);

        // Format as YYYY-MM-DD for MySQL date field
        const formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;

        values.push([
          visit_date,
          month,
          isa_id,
          location_id,
          duty,
          report_text,
          'IN_PROCESS',
          formattedDate, // now uses the correct month from POST
        ]);
      } catch (err) {
        ////console.warn('Invalid visit_date, skipping', visit_date);
        continue;
      }
    }

    if (values.length === 0) {
      return { error: 'No valid visits to save' };
    }

    const placeholders = values
      .map(() => '(?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ');
    const flatValues = values.flat();

    const [result] = await db.query(
      `
      INSERT INTO visits 
        (visit_date, month, isa_id, location_id, duty, report_text, status, date)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        location_id = VALUES(location_id),
        duty = VALUES(duty),
        report_text = VALUES(report_text),
        status = VALUES(status),
        date = VALUES(date),
        updated_at = CURRENT_TIMESTAMP
    `,
      flatValues
    );

    //////console.log(result);

    return {
      message: `${result.affectedRows} visit(s) saved successfully`,
      duplicates: values.length - result.affectedRows,
    };
  } catch (err) {
    ////console.error(err);
    return { error: 'Server error' };
  }
};

export const fetchVisits = async (month, isa_id) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        v.*,
        l.name AS location_name
      FROM visits v
      LEFT JOIN locations l ON v.location_id = l.id
      WHERE v.month = ? AND v.isa_id = ?
      ORDER BY CAST(v.visit_date AS UNSIGNED)
      `,
      [month, isa_id]
    );

    return rows;
  } catch (err) {
    ////console.error(err);
    return { error: 'Server error' };
  }
};

export const submitVisits = async (month, isa_id) => {
  try {
    const [result] = await db.query(
      `UPDATE visits 
       SET status = 'PENDING'
       WHERE month = ? AND isa_id = ?`,
      [month, isa_id]
    );
    ////console.log(result);
    return `${result.affectedRows} visit(s) submitted successfully`;
  } catch (err) {
    ////console.error(err);
    return 'Failed to submit visits';
  }
};

export const deleteVisits = async (date, month, isa_id) => {
  try {
    ////console.log(date, month, isa_id);
    const [result] = await db.query(
      `delete from visits 
       WHERE visit_date = ? AND month = ? AND isa_id = ?`,
      [date, month, isa_id]
    );
    ////console.log(result.warningStatus);
    return `${result.affectedRows} visit(s) deleted successfully`;
  } catch (err) {
    ////console.error('erroooorrr', err);
    return err;
  }
};

export const checkEditPermissionForMonth = async (month, isa_id) => {
  try {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) AS lockedCount
      FROM visits
      WHERE month = ?
        AND isa_id = ?
        AND status NOT IN ('IN_PROCESS','ADE_REJECTED','DDE_REJECTED')
      `,
      [month, isa_id]
    );
    console.log(rows[0]);

    // If any row is locked → cannot edit
    return rows[0].lockedCount === 0;
  } catch (err) {
    ////console.error(err);
    throw err;
  }
};

export const fetchVisitsByIsa = async (
  isa_id = null,
  date = null,
  month = null,
  week = null
) => {
  ////console.log(isa_id);
  ////console.log(date);
  ////console.log(month);
  ////console.log(week);

  try {
    const query = `
      SELECT 
        v.id,
        v.visit_date,
        v.month,
        l.name AS location,
        v.duty,
        v.status,
        u.full_name,
        u.role
      FROM visits v
      LEFT JOIN locations l ON v.location_id = l.id
      LEFT JOIN users u ON v.isa_id = u.id
      WHERE
        (? IS NULL OR v.isa_id = ?) AND
        (? IS NULL OR v.date = ?) AND
        (? IS NULL OR v.month = ?) AND
        (? IS NULL OR CEIL(DAY(v.date)/7) = ?)
        AND v.status IN ('VISITED','DDE_APPROVED', 'ZDE_APPROVED')
        AND (v.duty <> 'HOLI' OR v.duty <> 'PL')
      ORDER BY v.date ASC
    `;

    //////console.log(query, [isa_id, isa_id, date, date, month, month, week, week]);

    const [rows] = await db.execute(query, [
      isa_id || null,
      isa_id || null,
      date || null,
      date || null,
      month || null,
      month || null,
      week || null,
      week || null,
    ]);

    //////console.log(rows);

    return rows;
  } catch (err) {
    ////console.error('Error fetching visits by ISA:', err);
    throw err;
  }
};

// Fetch visits filtered by Location
export const fetchVisitsByLocation = async (location_id, date, month, week) => {
  try {
    ////console.log('l', location_id);
    ////console.log('d', date);
    ////console.log('m', month);
    ////console.log('w', week);

    const query = `
      SELECT v.id, v.visit_date AS date, v.month,
             u.full_name AS isa_name, v.duty, v.status, u.role
      FROM visits v
      LEFT JOIN users u ON v.isa_id = u.id AND u.role = 'ISA'
      WHERE (? IS NULL OR v.location_id = ?)
        AND (? IS NULL OR V.date = ?)
        AND (? IS NULL OR v.month = ?)
        AND (? IS NULL OR CEIL(DAY(v.date)/7) = ?)
        AND status IN ('VISITED','DDE_APPROVED', 'ZDE_APPROVED')
        AND v.duty NOT IN ('HOLI', 'PL')
      ORDER BY v.visit_date ASC
    `;
    const [rows] = await db.execute(query, [
      location_id || null,
      location_id || null,
      date || null,
      date || null,
      month || null,
      month || null,
      week || null,
      week || null,
    ]);

    ////console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchISAs = async () => {
  try {
    const query = `SELECT id, full_name, role FROM users WHERE  role IN ('ISA','ADE', 'DDE')`;
    const [rows] = await db.execute(query);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
};
