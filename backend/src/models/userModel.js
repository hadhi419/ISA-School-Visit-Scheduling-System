import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );
  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
