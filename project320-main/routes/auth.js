const express = require("express");
const bcrypt = require("bcryptjs");
const supabaseService = require("../services/supabaseService");

const router = express.Router();

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔍 Login attempt - Email:', email);
  console.log('🔍 Login attempt - Password:', password);

  if(email === "Admin@gmail.com") {
    const admin_password = "$2b$10$TS/DdTSB0xGlsZ/fRhojkel2qmiBBTUSn7kENoBObYLpmWF9tjHgO"; // Hash for "Admin001"
    
    const isAdmin = await bcrypt.compare(password, admin_password);
    if (!isAdmin) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // If admin login is successful, you can return the admin user object here or continue
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: 0,
        firstname: "Admin",
        lastname: "",
        email: "Admin",
        role: "Admin",
        access: "all",
      },
    });
  }

  try {
    console.log('🔍 Calling supabaseService.authenticateUser...');
    const user = await supabaseService.authenticateUser(email, password);
    console.log('✅ Authentication successful in route');

    // Success — send full info needed for homepage
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        access: user.access,
      },
    });
  } catch (error) {
    console.error("❌ Login error in route:", error.message);
    
    if (error.message.includes('User not found')) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (error.message.includes('Invalid password')) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
