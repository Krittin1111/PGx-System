const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.js");
// New Supabase-compatible OTP routes
const requestOtpRoutes = require("./routes/requestotp_supabase.js");
const verifyOtpRoutes = require("./routes/verifyotp_supabase.js");
const resetPasswordRoutes = require("./routes/resetpassword_supabase.js");
const usersRoutes = require("./routes/users.js");
const auditLogsRoutes = require("./routes/auditlogs.js");
const specimensRoutes = require("./routes/specimens.js");
const patientsRoutes = require("./routes/patients.js");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'PGX System API is running!', timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", authRoutes);
// Supabase-compatible OTP routes
app.use("/api", requestOtpRoutes);
app.use("/api", verifyOtpRoutes);
app.use("/api", resetPasswordRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/specimens", specimensRoutes);
app.use("/api/patients", patientsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
