const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/dbconfig.js");

const router = express.Router();

// POST /verifyotp - Verify OTP for password reset
router.post("/verifyotp", async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: "Please enter the OTP" });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Check if OTP exists and is valid
    const [otpRows] = await db.execute(`
      SELECT rp.UserID, rp.OTP, rp.OTP_Expire, u.Firstname, u.Lastname, u.Email 
      FROM restorepassword rp
      JOIN user u ON rp.UserID = u.UserID
      WHERE rp.Email = ? AND rp.OTP = ?
    `, [email.trim(), otp]);

    if (otpRows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const otpRecord = otpRows[0];
    const { UserID, OTP, OTP_Expire, Firstname, Lastname, Email } = otpRecord;

    // Check if OTP has expired
    const currentTime = new Date();
    const expiryTime = new Date(OTP_Expire);

    if (currentTime > expiryTime) {
      return res.status(400).json({ 
        message: "OTP expired" 
      });
    }

    // OTP is valid - mark as verified (optional: you can add a verified flag)
    await db.execute(`
      UPDATE restorepassword 
      SET VerifyOTP = 1, 
          CreatedAt = NOW() 
      WHERE UserID = ? AND Email = ?
    `, [UserID, email.trim()]);

    console.log(`✅ OTP verified for user: ${Email} (${Firstname} ${Lastname})`);

    // Return user info for session storage
    res.status(200).json({
      message: "Verification successful",
      user: {
        id: UserID,
        firstname: Firstname,
        lastname: Lastname,
        email: Email,
        verified: true
      }
    });

  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;