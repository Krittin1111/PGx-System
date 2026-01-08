const express = require("express");
const nodemailer = require("nodemailer");
const supabaseService = require("../services/supabaseService");

const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'NonthawatForStudy@gmail.com',
    pass: 'ifre wgkn uknu ecox' // App password
  }
});

// POST /requestotp - Send OTP for password reset (Supabase version)
router.post("/requestotp", async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email || email.trim() === '') {
    return res.status(400).json({ message: "Please enter your email." });
  }

  try {
    // Check if email exists in Supabase Employee table
    const user = await supabaseService.getUserForOTP(email.trim());

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Set expiry to 10 minutes from now (using local timezone like original)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    console.log(`🔍 OTP Timing - Current Local: ${new Date().toString()}, Expiry Local: ${expiryTime.toString()}`);
    console.log(`🔍 OTP Timing - Current ISO: ${new Date().toISOString()}, Expiry ISO: ${expiryTime.toISOString()}`);

    // Store OTP in Supabase
    await supabaseService.storeOTP(user.UserID, email.trim(), otp, expiryTime);

    // Email content
    const subject = "Password Reset OTP";
    const htmlBody = `
      <html>
      <body style='font-family: Arial, sans-serif;'>
          <h2>Password Reset Request</h2>
          <p>Hi <strong>${user.Firstname}</strong>,</p>
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
        name: user.Firstname,
        address: email.trim()
      },
      subject: subject,
      html: htmlBody
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}: ${otp} (expires: ${expiryTime.toISOString()})`);

    // Return success response
    res.status(200).json({
      message: "OTP has been sent to your email address.",
      email: email.trim()
    });

  } catch (err) {
    console.error("❌ Request OTP error:", err);
    
    if (err.message.includes('User not found')) {
      // Return generic message for security
      return res.status(200).json({ 
        message: "If this email exists in our system, you'll receive a password reset link shortly." 
      });
    }
    
    res.status(500).json({ message: "Server error occurred while sending OTP." });
  }
});

module.exports = router;