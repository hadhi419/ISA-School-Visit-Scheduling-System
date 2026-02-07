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

    if (!full_name || !email || !password || !phone || !role) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }

    const result = await createUser(full_name, email, password, phone, role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId: result.insertId },
    });
  } catch (err) {
    console.error('Error in registerUser:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.full_name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ success: true, message: 'Login successful', data: { token } });
  } catch (err) {
    console.error('Error in loginUser:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.json({ success: true, data: { users } });
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Edit user
export const editUser = async (req, res) => {
  try {
    const { userId, name, email, phone, role } = req.body;
    if (!userId || !name || !email || !phone || !role) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const result = await editUserModel(userId, name, email, phone, role);

    res.json({ success: true, message: result });
  } catch (err) {
    console.error('Error in editUser:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    if (!id || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const result = await changePasswordModel(id, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error in changePassword:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
