const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/dbconfig.js");

const router = express.Router();

// POST /resetpassword - Reset password after OTP verification
router.post("/resetpassword", async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    // Check if user has verified OTP
    const [otpRows] = await db.execute(`
      SELECT rp.UserID, rp.VerifyOTP, u.Email, u.Firstname, u.Lastname
      FROM restorepassword rp
      JOIN user u ON rp.UserID = u.UserID
      WHERE rp.Email = ? AND rp.VerifyOTP = 1
    `, [email.trim()]);

    if (otpRows.length === 0) {
      return res.status(400).json({ 
        message: "Unauthorized. Please verify OTP first." 
      });
    }

    const user = otpRows[0];
    const { UserID, Firstname, Lastname } = user;

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in user table
    await db.execute(`
      UPDATE user 
      SET Password = ? 
      WHERE UserID = ? AND Email = ?
    `, [hashedPassword, UserID, email.trim()]);

    // Clean up - remove OTP record (optional, or you could mark as used)
    await db.execute(`
      DELETE FROM restorepassword 
      WHERE UserID = ? AND Email = ?
    `, [UserID, email.trim()]);

    console.log(`✅ Password reset successfully for: ${email} (${Firstname} ${Lastname})`);

    // Return success response
    res.status(200).json({
      message: "Password has been reset successfully. You can now login with your new password.",
      user: {
        email: email.trim(),
        firstname: Firstname,
        lastname: Lastname
      }
    });

  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: "Server error occurred during password reset." });
  }
});

module.exports = router;
