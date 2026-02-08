import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  createUser,
  getUserByEmail,
  getAllUsersModel,
  editUserModel,
  changePasswordModel,
} from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Register user
export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    // Check required fields
    if (!full_name || !email || !password || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const result = await createUser(full_name, email, password, phone, role);

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    //////console.log(user);

    ////console.log(user.role);
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password' });

    //const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, name: user.full_name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId, name, email, phone, role } = req.body;
    ////console.log('Name ', name);
    const result = await editUserModel(userId, name, email, phone, role);

    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    ////console.log(req.body);
    const { id, currentPassword, newPassword } = req.body;
    ////console.log('Paasss', currentPassword);
    const result = await changePasswordModel(id, currentPassword, newPassword);
    ////console.log('result', result);

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
