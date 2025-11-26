import { postVisits, fetchVisits } from "../models/visitModel.js";

export const postSingleVisit = async (req, res) => {
  try {
    const array = req.body;
    const message = await postVisits(array);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const fetchAllVisits = async (req, res) => {
  try {
    const { month,isa_id } = req.params;
    const visits = await fetchVisits(month,isa_id);
    res.json({ visits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};