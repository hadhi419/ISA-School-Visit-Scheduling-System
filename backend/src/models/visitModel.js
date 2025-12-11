import db from "../config/db.js";

export const postVisits = async (visitsArray) => {
  try {

    console.log(visitsArray);
    if (!Array.isArray(visitsArray) || visitsArray.length === 0) {
      return { error: "Visits array is required" };
    }

    const allowedDuties = ['HNST','EXAM','DEV','EVAL','HOLI'];
    const values = [];

   for (const visit of visitsArray) {
        const { visit_date, month, isa_id, location_id, duty, report_text = null } = visit;

        // Only skip if truly missing
        if (visit_date == null || month == null || isa_id == null || duty == null) {
          continue;
        }

        if (!allowedDuties.includes(duty)) {
          continue;
        }

        values.push([visit_date, month, isa_id, location_id, duty, report_text, "IN_PROCESS"]);
      }


    if (values.length === 0) {
      return { error: "No valid visits to save" };
    }

    const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
    const flatValues = values.flat();

    const [result] = await db.query(
      `INSERT IGNORE INTO visits 
      (visit_date, month, isa_id, location_id, duty, report_text, status) 
      VALUES ${placeholders}`,
      flatValues
    );

        console.log(result);
        
    return {
      message: `${result.affectedRows} visit(s) saved successfully`,
      duplicates: values.length - result.affectedRows
    };



  } catch (err) {
    console.error(err);
    return { error: "Server error" };
  }
};

export const fetchVisits = async (month, isa_id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM visits WHERE month = ? AND isa_id = ?",
      [month, isa_id]
    );
    return rows;
  } catch (err) {
    console.error(err);
    return { error: "Server error" };
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
    console.log(result)
    return `${result.affectedRows} visit(s) submitted successfully`;
  } catch (err) {
    console.error(err);
    return "Failed to submit visits";
  }
};

