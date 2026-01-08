const express = require('express');
const supabaseService = require('../services/supabaseService');
const router = express.Router();

/**
 * GET /api/specimens/:specimenId
 * Retrieve specimen data by Specimen_ID or Barcode_Internal
 */
router.get('/:specimenId', async (req, res) => {
    try {
        const { specimenId } = req.params;
        console.log(`🔍 Looking up specimen: ${specimenId}`);

        const specimen = await supabaseService.getSpecimenByCode(specimenId);
        
        if (!specimen) {
            console.log('❌ Specimen not found');
            return res.json({
                success: false,
                message: 'ไม่พบใบสั่งตรวจ หรือมีอะไรผิดพลาดลองแสกนใหม่หรือกรอกเลข barcode',
                specimen: null
            });
        }

        console.log(`✅ Successfully found specimen: ${specimen.Specimen_ID}`);
        res.json({
            success: true,
            message: 'พบข้อมูลใบสั่งตรวจแล้ว',
            specimen: specimen
        });

    } catch (error) {
        console.error('❌ Error looking up specimen:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง',
            error: error.message
        });
    }
});

/**
 * GET /api/specimens
 * Get all specimens (with optional filters)
 */
router.get('/', async (req, res) => {
    try {
        const { status, patientId, limit = 50 } = req.query;
        console.log('📋 Loading specimens list...');

        const specimens = await supabaseService.getAllSpecimens({ status, patientId, limit });

        console.log(`✅ Successfully loaded ${specimens.length} specimens`);
        res.json({
            success: true,
            specimens: specimens,
            count: specimens.length
        });

    } catch (error) {
        console.error('❌ Error loading specimens:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load specimens',
            error: error.message
        });
    }
});

module.exports = router;