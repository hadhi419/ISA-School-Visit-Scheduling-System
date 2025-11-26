import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const createUser = async (full_name, email, password, phone, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
    [full_name, email, hashedPassword, phone, role]
  );

  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0];
};
