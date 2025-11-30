import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new user (Student or Admin)
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2️⃣ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Create user - always create as 'student' from public signup
    const userRole = 'student';
    const user = await User.create({ name, email, password, role: userRole });

    // 4️⃣ Return response with token
    if (user) {
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Respond with token
    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get current user data
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
