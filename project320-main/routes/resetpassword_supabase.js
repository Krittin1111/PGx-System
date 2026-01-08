const express = require("express");
const supabaseService = require("../services/supabaseService");

const router = express.Router();

// POST /resetpassword - Reset password after OTP verification (Supabase version)
router.post("/resetpassword", async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  if (otp.length !== 6 || isNaN(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit number." });
  }

  try {
    // First verify the OTP is still valid
    const otpResult = await supabaseService.verifyOTP(email.trim(), otp);

    if (!otpResult.success) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Reset password using Supabase service
    await supabaseService.resetPasswordWithOTP(email.trim(), newPassword);

    console.log(`✅ Password reset completed for ${email}`);

    res.status(200).json({
      message: "Password has been reset successfully. You can now log in with your new password.",
      success: true
    });

  } catch (err) {
    console.error("❌ Reset password error:", err);
    
    if (err.message.includes('OTP not found')) {
      return res.status(404).json({ message: "No OTP found for this email. Please request a new OTP." });
    }
    
    if (err.message.includes('Invalid OTP')) {
      return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
    }
    
    if (err.message.includes('OTP expired')) {
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }
    
    if (err.message.includes('User not found')) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(500).json({ message: "Server error occurred while resetting password." });
  }
});

module.exports = router;