const express = require("express");
const supabase = require("../config/supabaseclient");
const router = express.Router();

// Check if patient exists by ID card number
router.get("/check/:idCardNumber", async (req, res) => {
  try {
    const { idCardNumber } = req.params;

    if (!idCardNumber) {
      return res.status(400).json({ error: "ID card number is required" });
    }

    const { data, error } = await supabase
      .from("Patient")
      .select("*")
      .eq("IDCardNumber", idCardNumber)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking patient:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (data) {
      res.json({ exists: true, patient: data });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new patient
router.post("/", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      age,
      gender,
      cid,
      hospital,
      ethnicity,
      patient_phone,
      physician,
      physician_phone,
      specimen,
      note,
      weight,
      height,
      date_of_birth
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !cid) {
      return res.status(400).json({ 
        error: "First name, last name, and ID card number are required" 
      });
    }

    // Generate Patient_ID (format: HN + YYYYMMDD + sequence)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the last patient ID for today to generate sequence
    const { data: lastPatient } = await supabase
      .from("Patient")
      .select("Patient_ID")
      .like("Patient_ID", `HN${dateStr}%`)
      .order("Patient_ID", { ascending: false })
      .limit(1);

    let sequence = "001";
    if (lastPatient && lastPatient.length > 0) {
      const lastSequence = parseInt(lastPatient[0].Patient_ID.slice(-3));
      sequence = String(lastSequence + 1).padStart(3, "0");
    }

    const patientId = `HN${dateStr}${sequence}`;

    // Insert patient data
    const { data: patientData, error: patientError } = await supabase
      .from("Patient")
      .insert({
        Patient_ID: patientId,
        IDCardNumber: cid,
        Firstname: first_name,
        Lastname: last_name,
        Age: age ? parseInt(age) : null,
        DateOfBirth: date_of_birth || null,
        Gender: gender || null,
        PhoneNumber: patient_phone || null,
        Ethnicity: ethnicity || null,
        Weight: weight ? parseFloat(weight) : null,
        Height: height ? parseFloat(height) : null,
        Created_At: new Date().toISOString(),
        Updated_At: new Date().toISOString()
      })
      .select()
      .single();

    if (patientError) {
      console.error("Error creating patient:", patientError);
      return res.status(500).json({ error: "Failed to create patient" });
    }

    // Generate Specimen_ID
    const specimenId = `SP${dateStr}${sequence}`;

    // Insert specimen data
    const { data: specimenData, error: specimenError } = await supabase
      .from("Specimen")
      .insert({
        Specimen_ID: specimenId,
        Patient_ID: patientId,
        Specimen_Type: specimen || null,
        Submit_Date: new Date().toISOString(),
        Submitted_By_Unit: hospital || null,
        Doctor_Name: physician || null,
        Status: "Pending",
        Chain_Of_Custody: note || null,
        Created_At: new Date().toISOString(),
        Updated_At: new Date().toISOString()
      })
      .select()
      .single();

    if (specimenError) {
      console.error("Error creating specimen:", specimenError);
      // If specimen creation fails, we might want to rollback patient creation
      // For now, we'll just log the error and return success for patient
      return res.status(500).json({ error: "Patient created but failed to create specimen" });
    }

    res.status(201).json({
      success: true,
      message: "Patient and specimen created successfully",
      patient: patientData,
      specimen: specimenData
    });

  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update existing patient
router.put("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const {
      first_name,
      last_name,
      age,
      gender,
      patient_phone,
      ethnicity,
      weight,
      height,
      date_of_birth
    } = req.body;

    const { data, error } = await supabase
      .from("Patient")
      .update({
        Firstname: first_name,
        Lastname: last_name,
        Age: age ? parseInt(age) : null,
        DateOfBirth: date_of_birth || null,
        Gender: gender || null,
        PhoneNumber: patient_phone || null,
        Ethnicity: ethnicity || null,
        Weight: weight ? parseFloat(weight) : null,
        Height: height ? parseFloat(height) : null,
        Updated_At: new Date().toISOString()
      })
      .eq("Patient_ID", patientId)
      .select()
      .single();

    if (error) {
      console.error("Error updating patient:", error);
      return res.status(500).json({ error: "Failed to update patient" });
    }

    res.json({
      success: true,
      message: "Patient updated successfully",
      patient: data
    });

  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;