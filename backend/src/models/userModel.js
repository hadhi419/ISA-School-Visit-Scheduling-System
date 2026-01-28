import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createUser = async (full_name, email, password, phone, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
    [full_name, email, hashedPassword, phone, role]
  );

  return result;
};

export const editUserModel = async (id, full_name, email, phone, role) => {
  // const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    'update users set full_name=?, email=?, phone=?, role=? WHERE id = ?',
    [full_name, email, phone, role, id]
  );

  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [
    email,
  ]);

  return rows[0];
};

export const getUserByID = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [
    id,
  ]);

  return rows[0];
};

export const getAllUsersModel = async () => {
  const [rows] = await db.query('SELECT * FROM users');

  return rows;
};

export const changePasswordModel = async (id, currentPass, newPass) => {
  try {
    const user = await getUserByID(id);

    const isMatch = await bcrypt.compare(currentPass, user.password);

    if (!isMatch) {
      return 'Your current password is wrong';
    }
    const hashedPassword = await bcrypt.hash(newPass, 10);
    console.log(hashedPassword);
    const query = 'update users set password=? where id=?';

    const [result] = await db.query(query, [hashedPassword, id]);

    return 'Password has been changed successfully';
  } catch (e) {
    return e;
  }
};
