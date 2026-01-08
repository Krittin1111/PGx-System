const express = require("express");
const bcrypt = require("bcryptjs");
const supabaseService = require("../services/supabaseService");

const router = express.Router();

// GET /users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await supabaseService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /users - Create new user
router.post("/", async (req, res) => {
  const { firstname, lastname, email, password, role, access } = req.body;

  // Validation
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
  }

  try {
    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await supabaseService.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || 'User',
      dept: access || 'Lab Assistant',
      isPasswordHashed: true // Indicate that password is already hashed
    });

    res.status(201).json({
      message: "สร้างผู้ใช้ใหม่สำเร็จ",
      user: newUser
    });

  } catch (error) {
    console.error("❌ Error creating user:", error);
    
    if (error.message.includes('อีเมลนี้ถูกใช้งานแล้ว') || error.message.includes('already exists')) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }
    
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้" });
  }
});

// PUT /users/:id - Update user
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email, role, access, password } = req.body;

  try {
    const updateData = {
      firstname,
      lastname,
      email,
      role,
      access
    };

    // Add password if provided and hash it
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await supabaseService.updateUser(userId, updateData);

    console.log(`✅ Updated user: ${firstname} ${lastname} (${userId})`);
    res.status(200).json({ message: "อัปเดตข้อมูลผู้ใช้สำเร็จ" });

  } catch (error) {
    console.error("❌ Error updating user:", error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
    
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้" });
  }
});

// DELETE /users/:id - Delete user
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await supabaseService.deleteUser(userId);

    console.log(`✅ Deleted user: ${userId}`);
    res.status(200).json({ message: "ลบผู้ใช้สำเร็จ" });

  } catch (error) {
    console.error("❌ Error deleting user:", error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
    
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
  }
});

// POST /users/:id/reset-password - Reset user password
router.post("/:id/reset-password", async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
  }

  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Pass the already hashed password directly to resetPassword
    await supabaseService.resetPassword(userId, hashedPassword);

    res.status(200).json({ message: "รีเซ็ตรหัสผ่านสำเร็จ" });

  } catch (error) {
    console.error("❌ Error resetting password:", error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
    
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน" });
  }
});

module.exports = router;