const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const db = require("../config/dbconfig.js");

const router = express.Router();

// Configure nodemailer transporter (equivalent to SwiftMailer)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'NonthawatForStudy@gmail.com',
    pass: 'ifre wgkn uknu ecox' // App password
  }
});

// POST /requestotp - Send OTP for password reset
router.post("/requestotp", async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email || email.trim() === '') {
    return res.status(400).json({ message: "Please enter your email." });
  }

  try {
    // Check if email exists in user table
    const [userRows] = await db.execute(
      "SELECT UserID, Firstname FROM user WHERE Email = ?",
      [email.trim()]
    );

    if (userRows.length === 0) {
      // Return generic message for security (don't reveal if email exists)
      return res.status(200).json({ 
        message: "If this email exists in our system, you'll receive a password reset link shortly." 
      });
    }

    const user = userRows[0];
    const { UserID, Firstname } = user;

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Set expiry to 10 minutes from now (using local timezone)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
    
    // Format as MySQL datetime in local timezone (not UTC)
    const expiry = expiryTime.getFullYear() + '-' +
        String(expiryTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(expiryTime.getDate()).padStart(2, '0') + ' ' +
        String(expiryTime.getHours()).padStart(2, '0') + ':' +
        String(expiryTime.getMinutes()).padStart(2, '0') + ':' +
        String(expiryTime.getSeconds()).padStart(2, '0');

    // Store/Update OTP in restorepassword table
    await db.execute(`
      INSERT INTO restorepassword (UserID, Email, OTP, OTP_Expire, CreatedAt) 
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
      OTP = VALUES(OTP), 
      OTP_Expire = VALUES(OTP_Expire), 
      CreatedAt = NOW()
    `, [UserID, email.trim(), otp, expiry]);

    // Email content (converted from PHP)
    const subject = "Password Reset OTP";
    const htmlBody = `
      <html>
      <body style='font-family: Arial, sans-serif;'>
          <h2>Password Reset Request</h2>
          <p>Hi <strong>${Firstname}</strong>,</p>
          <p>Your OTP for password reset is:</p>
          <h3 style='color:#4CAF50;'>${otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
      </body>
      </html>
    `;

    // Send email using nodemailer
    const mailOptions = {
      from: {
        name: 'PGx System',
        address: 'NonthawatForStudy@gmail.com'
      },
      to: {
        name: Firstname,
        address: email.trim()
      },
      subject: subject,
      html: htmlBody
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}: ${otp} (expires: ${expiry})`);

    // Return success response
    res.status(200).json({
      message: "OTP has been sent to your email address.",
      email: email.trim() // Send back for OTP verification step
    });

  } catch (err) {
    console.error("❌ Request OTP error:", err);
    res.status(500).json({ message: "Server error occurred while sending OTP." });
  }
});

module.exports = router;