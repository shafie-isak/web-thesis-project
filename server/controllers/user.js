import User from "../models/users.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/sendEmail.js';
import XPLog from "../models/xp_log.js";
import mongoose from 'mongoose';




export const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users })
  } catch (error) {
    console.log("error getting users ", error.message);
    res.status(500).json({ message: "Servre error" })
  }
}


// CREATE USER with profile picture
export const createUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const profilePicture = req.file?.filename || "";

  try {
    // Check duplicates
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already exists" });
    if (await User.findOne({ phone })) return res.status(410).json({ message: "Phone number already exists" });

    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "Fill all the fields" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      profilePicture
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error("User creation failed:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE USER by admin with profile picture
export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;
    const profilePicture = req.file?.filename;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check duplicates
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) return res.status(409).json({ message: "Email already exists" });

    const phoneExists = await User.findOne({ phone, _id: { $ne: id } });
    if (phoneExists) return res.status(410).json({ message: "Phone number already exists" });

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (status) user.status = status;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json({ success: true, message: "User updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








export const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "banned" },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User banned", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to ban user" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    // Prevent user from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(403).json({ message: "You cannot delete yourself." });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};


export const getTopUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ coins: -1 }) // or 'xp' if preferred
      .limit(5)
      .select("name email profilePicture coins xp level"); // customize fields

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top users." });
  }
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found or incorrect credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
        xp: user.xp,
      },
    });

  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetToken -resetTokenExpires');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      coins: user.coins,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfilePicture = async (req, res) => {
  const { email } = req.body;

  if (!req.file || !email) {
    return res.status(400).json({ message: "Email and image file required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { profilePicture: req.file.filename },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile picture updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// POST /api/users/update-xp
export const updateXP = async (req, res) => {
  const { coinsEarned, xpGained } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Add values to existing fields
    user.coins = (user.coins || 0) + coinsEarned;
    user.xp = (user.xp || 0) + xpGained;

    // ✅ Update level based on XP
    if (user.xp >= 1000) {
      user.level = "Advanced";
    } else if (user.xp >= 500) {
      user.level = "Intermediate";
    } else {
      user.level = "Beginner";
    }

    if (user.xp >= 100 && !user.badges.includes('xp_100')) {
      user.badges.push('xp_100');
    }
    if (user.xp >= 1000 && !user.badges.includes('xp_1000')) {
      user.badges.push('xp_1000');
    }


    await XPLog.create({
      userId: req.user.id,
      source: req.body.source || 'quiz',
      xp: req.body.xpGained,
    });

    await user.save();
    res.status(200).json({ message: "XP and coins updated", user });
  } catch (err) {
    console.error("XP update failed:", err);
    res.status(500).json({ message: err.message });
  }
};

export const unlockBadge = async (req, res) => {
  const { badgeId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      await user.save();
    }

    res.status(200).json({ message: "Badge unlocked", badges: user.badges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};









export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
  await user.save();

  const resetLink = `http://localhost:5000/api/users/reset-password/${token}`;

  // Send the email here:
  try {
    await sendResetEmail(email, resetLink);
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();
  res.status(200).json({ message: "Password reset successfully" });
};


export const getWeeklyXPSummary = async (req, res) => {
  const userId = req.user.id;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(startOfToday);
  weekAgo.setDate(weekAgo.getDate() - 6);



  try {
    const summary = await XPLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: weekAgo },
          xp: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          totalXP: { $sum: "$xp" }
        }
      }
    ]);

    const xpByDay = Array(7).fill(0); // Mon–Sun

    summary.forEach(item => {
      const dayIndex = (item._id + 5) % 7;
      xpByDay[dayIndex] = item.totalXP;
    });

    res.json({ weeklyXP: xpByDay });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weekly XP summary", error });
  }
};

