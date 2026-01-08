const express = require('express');
const supabaseService = require('../services/supabaseService');
const router = express.Router();

/**
 * GET /api/audit-logs
 * Retrieve all audit logs with user information
 */
router.get('/', async (req, res) => {
    try {
        console.log('📊 Loading audit logs from database...');
        
        const result = await supabaseService.getAllAuditLogs();
        
        console.log(`✅ Successfully loaded audit logs`);
        res.json(result);

    } catch (error) {
        console.error('❌ Error loading audit logs:', error);
        res.status(500).json({
            error: 'Failed to load audit logs',
            message: error.message
        });
    }
});

/**
 * GET /api/audit-logs/employee/:employeeId
 * Retrieve audit logs for a specific employee
 */
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        console.log(`📊 Loading audit logs for employee: ${employeeId}`);

        const logs = await supabaseService.getAuditLogsByEmployee(employeeId);

        console.log(`✅ Successfully loaded ${logs.length} audit logs for employee ${employeeId}`);
        res.json(logs);

    } catch (error) {
        console.error('❌ Error loading employee audit logs:', error);
        res.status(500).json({
            error: 'Failed to load employee audit logs',
            message: error.message
        });
    }
});

/**
 * POST /api/audit-logs
 * Create a new audit log entry
 */
router.post('/', async (req, res) => {
    try {
        const { employeeId, action, description, place } = req.body;
        
        if (!employeeId || !action) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'EmployeeID and Action are required'
            });
        }

        const newLog = await supabaseService.createAuditLog(employeeId, action, description, place);

        console.log(`✅ Successfully created audit log`);
        res.status(201).json({
            success: true,
            message: 'Audit log created successfully',
            log: newLog
        });

    } catch (error) {
        console.error('❌ Error creating audit log:', error);
        res.status(500).json({
            error: 'Failed to create audit log',
            message: error.message
        });
    }
});

/**
 * GET /api/audit-logs/actions
 * Get all unique actions for filter dropdown
 */
router.get('/actions', async (req, res) => {
    try {
        console.log('📊 Loading unique actions for filter...');

        const uniqueActions = await supabaseService.getUniqueActions();

        console.log(`✅ Successfully loaded ${uniqueActions.length} unique actions`);
        res.json(uniqueActions);

    } catch (error) {
        console.error('❌ Error loading actions:', error);
        res.status(500).json({
            error: 'Failed to load actions',
            message: error.message
        });
    }
});

module.exports = router;