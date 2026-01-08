const express = require("express");
const supabaseService = require("../services/supabaseService");

const router = express.Router();

// POST /verifyotp - Verify OTP (Supabase version)
router.post("/verifyotp", async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: "Please enter both email and OTP." });
  }

  if (otp.length !== 6 || isNaN(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit number." });
  }

  try {
    // Verify OTP using Supabase service
    const result = await supabaseService.verifyOTP(email.trim(), otp);

    if (result.success) {
      console.log(`✅ OTP verified successfully for ${email}`);
      
      res.status(200).json({
        message: "OTP verified successfully. You can now reset your password.",
        email: email.trim(),
        verified: true
      });
    }

  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    
    if (err.message.includes('OTP not found')) {
      return res.status(404).json({ message: "No OTP found for this email. Please request a new OTP." });
    }
    
    if (err.message.includes('Invalid OTP')) {
      return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
    }
    
    if (err.message.includes('OTP expired')) {
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }
    
    res.status(500).json({ message: "Server error occurred while verifying OTP." });
  }
});

module.exports = router;