import db from "../config/db.js";

// Post a visit

// Post multiple visits at once
export const postVisits = async (visitsArray) => {
  try {
    if (!Array.isArray(visitsArray) || visitsArray.length === 0) {
      return { error: "Visits array is required" };
    }

    // Validate and prepare values for bulk insert
    const allowedDuties = ['HNST','EXAM','DEV','EVAL','HOLI'];
    const values = [];

    for (const visit of visitsArray) {
      const { visit_date, month, isa_id, location_id, duty, report_text = null } = visit;

      if (!visit_date || !month || !isa_id || !location_id || !duty) {
        return { error: "All fields are required for each visit" };
      }

      if (!allowedDuties.includes(duty)) {
        return { error: `Invalid duty value: ${duty}` };
      }

      values.push([visit_date, month, isa_id, location_id, duty, report_text, "PENDING"]);
    }

    // Bulk insert using ? placeholder for multiple rows
    const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
    const flatValues = values.flat();

   const [result] = await db.query(
        `INSERT IGNORE INTO visits 
        (visit_date, month, isa_id, location_id, duty, report_text, status) 
        VALUES ${placeholders}`,
        flatValues
        );

        return {
        message: `${result.affectedRows} visit(s) saved successfully`,
        duplicates: values.length - result.affectedRows
        };

  } catch (err) {
    console.error(err);
    return { error: "Server error" };
  }
};




// Post a visit
export const fetchVisits = async (month, isa_id) => {
   try {

    if (!month || !isa_id) return res.status(400).json({ error: "Month and ISA ID are required" });

  
    
      const [rows] = await db.query("select * from visits");

    return rows;
  } catch (err) {
    console.error(err);
    return ({ error: "Server error" });
  }
};
