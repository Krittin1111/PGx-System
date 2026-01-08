// Supabase Service - Replaces MySQL database operations
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const e = require('express');

const supabaseUrl = 'https://mjcwnwjolutphevfgncm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qY3dud2pvbHV0cGhldmZnbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTkzMTIsImV4cCI6MjA3NzczNTMxMn0.8R3Oa8uMC011Y-fUU7jcqg7baY6s1I98eRB3DON7on4';

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
    constructor() {
        this.supabase = supabase;
    }

    // Get all users (replaces MySQL query)
    async getAllUsers() {
        try {
            const { data, error } = await this.supabase
                .from('Employee')
                .select(`
                    EmployeeID,
                    Firstname,
                    Lastname,
                    Email,
                    Role,
                    Dept,
                    Dateregister,
                    Lastlogin
                `)
                .order('Dateregister', { ascending: false });

            if (error) throw error;

            console.log(`✅ Fetched ${data.length} users from Supabase`);
            
            // Map to match your existing API structure
            return data.map(employee => ({
                id: employee.EmployeeID,
                firstname: employee.Firstname,
                lastname: employee.Lastname,
                email: employee.Email,
                role: employee.Role,
                access: employee.Dept,
                created_at: employee.Dateregister,
                last_login: employee.Lastlogin
            }));

        } catch (error) {
            console.error('❌ Error fetching users:', error);
            throw error;
        }
    }

    // Create new user (replaces MySQL insert with transaction)
    async createUser(userData) {
        const { firstname, lastname, email, password, role = 'User', dept = 'Lab Assistant', isPasswordHashed = false } = userData;

        try {
            console.log('🔍 Creating user:', { firstname, lastname, email, role, dept, isPasswordHashed });

            // Check if email already exists
            const { data: existingEmployee } = await this.supabase
                .from('Employee')
                .select('EmployeeID')
                .eq('Email', email)
                .single();

            if (existingEmployee) {
                throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
            }

            // Generate unique EmployeeID
            const employeeId = 'EMP' + Date.now();
            const currentDate = new Date().toISOString().split('T')[0];

            // Hash the password if it's not already hashed
            const finalPassword = isPasswordHashed ? password : await bcrypt.hash(password, 10);

            // Start transaction-like operations
            // Step 1: Insert into Restoredpassword table first (for foreign key)
            const { error: rpError } = await this.supabase
                .from('Restoredpassword')
                .insert([{
                    Email: email,
                    CreatedAt: new Date().toISOString(),
                    VerifyOTP: null,
                    ExpiresAt: null,
                    OTP: null,
                    OTP_Expire: null
                }]);

            if (rpError) {
                console.log('⚠️ Restoredpassword insert warning:', rpError.message);
            }

            // Step 2: Insert into Employee table
            const { data: employeeData, error: dbError } = await this.supabase
                .from('Employee')
                .insert([{
                    EmployeeID: employeeId,
                    Firstname: firstname,
                    Lastname: lastname,
                    Email: email,
                    Password: finalPassword, // Store properly hashed password
                    Role: role,
                    Dept: dept,
                    Dateregister: currentDate
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            console.log(`✅ Created user in Supabase: ${employeeData.EmployeeID}`);
            
            return {
                id: employeeData.EmployeeID,
                firstname: employeeData.Firstname,
                lastname: employeeData.Lastname,
                email: employeeData.Email,
                role: employeeData.Role,
                access: employeeData.Dept
            };

        } catch (error) {
            console.error('❌ Error creating user:', error);
            throw error;
        }
    }

    // Update user (replaces MySQL update with transaction)
    async updateUser(userId, updates) {
        try {
            const { password, ...employeeUpdates } = updates;

            // Map field names to Employee table structure
            const mappedUpdates = {};
            if (employeeUpdates.firstname) mappedUpdates.Firstname = employeeUpdates.firstname;
            if (employeeUpdates.lastname) mappedUpdates.Lastname = employeeUpdates.lastname;
            if (employeeUpdates.email) mappedUpdates.Email = employeeUpdates.email;
            if (employeeUpdates.role) mappedUpdates.Role = employeeUpdates.role;
            if (employeeUpdates.access) mappedUpdates.Dept = employeeUpdates.access;
            if (password) {
                // Check if password is already hashed (starts with $2b$)
                const isAlreadyHashed = password.startsWith('$2b$');
                mappedUpdates.Password = isAlreadyHashed ? password : await bcrypt.hash(password, 10);
            }

            // Update Employee table
            const { data, error } = await this.supabase
                .from('Employee')
                .update(mappedUpdates)
                .eq('EmployeeID', userId)
                .select()
                .single();

            if (error) throw error;

            // If email changed, update Restoredpassword table too
            if (employeeUpdates.email) {
                await this.supabase
                    .from('Restoredpassword')
                    .update({ Email: employeeUpdates.email })
                    .eq('Email', data.Email); // Match old email
            }

            console.log(`✅ Updated user: ${userId}`);
            return {
                id: data.EmployeeID,
                firstname: data.Firstname,
                lastname: data.Lastname,
                email: data.Email,
                role: data.Role,
                access: data.Dept
            };

        } catch (error) {
            console.error('❌ Error updating user:', error);
            throw error;
        }
    }

    // Delete user (replaces MySQL delete with transaction)
    async deleteUser(userId) {
        try {
            // Get user email first for Restoredpassword deletion
            const { data: employee } = await this.supabase
                .from('Employee')
                .select('Email')
                .eq('EmployeeID', userId)
                .single();

            if (!employee) {
                throw new Error('User not found');
            }

            // Delete from Restoredpassword table first (foreign key)
            await this.supabase
                .from('Restoredpassword')
                .delete()
                .eq('Email', employee.Email);

            // Delete from Employee table
            const { error } = await this.supabase
                .from('Employee')
                .delete()
                .eq('EmployeeID', userId);

            if (error) throw error;

            console.log(`✅ Deleted user: ${userId}`);
            return { success: true };

        } catch (error) {
            console.error('❌ Error deleting user:', error);
            throw error;
        }
    }

    // Authenticate user (replaces MySQL login query)
    async authenticateUser(email, password) {
        try {
            console.log('🔍 Authenticating user:', email);
            console.log('🔑 Input password:', password);
            
            // Get user by email
            const { data: employee, error } = await this.supabase
                .from('Employee')
                .select('*')
                .eq('Email', email)
                .single();

            if (error || !employee) {
                console.log('❌ User not found:', error?.message);
                throw new Error('User not found');
            }

            console.log('🔐 Stored password hash:', employee.Password);
            console.log('🔐 Hash length:', employee.Password.length);
            
            // Compare hashed passwords
            const isMatch = await bcrypt.compare(password, employee.Password);
            console.log('🔍 Password match result:', isMatch);
            
            if (!isMatch) {
                console.log('❌ Password mismatch for:', email);
                throw new Error('Invalid password');
            }

            // Update last login
            await this.supabase
                .from('Employee')
                .update({ Lastlogin: new Date().toISOString() })
                .eq('EmployeeID', employee.EmployeeID);

            console.log(`✅ User authenticated: ${email} at ${new Date().toISOString()}`);
            
            return {
                id: employee.EmployeeID,
                firstname: employee.Firstname,
                lastname: employee.Lastname,
                email: employee.Email,
                role: employee.Role,
                access: employee.Dept
            };

        } catch (error) {
            console.error('❌ Authentication error:', error.message);
            throw error;
        }
    }

    // Reset password (replaces MySQL password reset)
    async resetPassword(userId, newPassword) {
        try {
            // Check if password is already hashed (from API routes)
            const isAlreadyHashed = newPassword.startsWith('$2b$');
            const finalPassword = isAlreadyHashed ? newPassword : await bcrypt.hash(newPassword, 10);
            
            const { error } = await this.supabase
                .from('Employee')
                .update({ Password: finalPassword })
                .eq('EmployeeID', userId);

            if (error) throw error;

            console.log(`✅ Password reset for user: ${userId}`);
            return { success: true };

        } catch (error) {
            console.error('❌ Error resetting password:', error);
            throw error;
        }
    }

    // OTP-related methods for password reset functionality

    // Check if user exists and get user info for OTP
    async getUserForOTP(email) {
        try {
            const { data: employee, error } = await this.supabase
                .from('Employee')
                .select('EmployeeID, Firstname, Email')
                .eq('Email', email.trim())
                .single();

            if (error || !employee) {
                throw new Error('User not found');
            }

            return {
                UserID: employee.EmployeeID,
                Firstname: employee.Firstname,
                Email: employee.Email
            };

        } catch (error) {
            console.error('❌ Error getting user for OTP:', error);
            throw error;
        }
    }

    // Store OTP in Restoredpassword table
    async storeOTP(userId, email, otp, expiryTime) {
        try {
            // Format expiry time like the original MySQL version (local timezone)
            const expiry = expiryTime.getFullYear() + '-' +
                String(expiryTime.getMonth() + 1).padStart(2, '0') + '-' +
                String(expiryTime.getDate()).padStart(2, '0') + 'T' +
                String(expiryTime.getHours()).padStart(2, '0') + ':' +
                String(expiryTime.getMinutes()).padStart(2, '0') + ':' +
                String(expiryTime.getSeconds()).padStart(2, '0') + '.000Z';

            console.log(`🔍 Storing OTP - Current: ${new Date().toISOString()}, Expiry formatted: ${expiry}`);

            const { error } = await this.supabase
                .from('Restoredpassword')
                .upsert({
                    Email: email.trim(),
                    OTP: otp.toString(), // Ensure OTP is stored as string for consistency
                    OTP_Expire: expiry,
                    CreatedAt: new Date().toISOString()
                }, { 
                    onConflict: 'Email',
                    ignoreDuplicates: false 
                });

            if (error) throw error;

            console.log(`✅ OTP stored for ${email}: ${otp} (expires: ${expiry})`);
            return { success: true };

        } catch (error) {
            console.error('❌ Error storing OTP:', error);
            throw error;
        }
    }

    // Verify OTP for password reset
    async verifyOTP(email, otp) {
        try {
            console.log(`🔍 Verifying OTP for email: ${email}, OTP: ${otp}`);
            
            const { data: otpRecord, error } = await this.supabase
                .from('Restoredpassword')
                .select('*')
                .eq('Email', email.trim())
                .single();

            console.log('🔍 OTP Record from DB:', otpRecord);
            console.log('🔍 DB Error:', error);

            if (error || !otpRecord) {
                console.log('❌ No OTP record found');
                throw new Error('OTP not found');
            }

            // Check if OTP matches (compare as strings for consistency)
            const dbOTP = otpRecord.OTP.toString();
            const inputOTP = otp.toString();
            
            console.log(`🔍 Comparing - DB OTP: "${dbOTP}" (type: ${typeof dbOTP}), Input OTP: "${inputOTP}" (type: ${typeof inputOTP})`);

            if (dbOTP !== inputOTP) {
                console.log('❌ OTP mismatch');
                throw new Error('Invalid OTP');
            }

            // Check if OTP is expired (use UTC for both times)
            const expiryTime = new Date(otpRecord.OTP_Expire);
            const currentTime = new Date();

            console.log(`🔍 Expiry check - Current: ${currentTime.toISOString()}, Expiry: ${expiryTime.toISOString()}`);
            console.log(`🔍 Time comparison - Current ms: ${currentTime.getTime()}, Expiry ms: ${expiryTime.getTime()}`);

            if (currentTime.getTime() > expiryTime.getTime()) {
                console.log('❌ OTP expired');
                throw new Error('OTP expired');
            }

            console.log(`✅ OTP verified for ${email}`);
            return { 
                success: true,
                userId: otpRecord.EmployeeID || null
            };

        } catch (error) {
            console.error('❌ Error verifying OTP:', error);
            throw error;
        }
    }

    // Reset password with OTP verification
    async resetPasswordWithOTP(email, newPassword) {
        try {
            // Get user first
            const user = await this.getUserForOTP(email);
            
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Update password in Employee table
            const { error } = await this.supabase
                .from('Employee')
                .update({ Password: hashedPassword })
                .eq('Email', email.trim());

            if (error) throw error;

            // Clear OTP after successful password reset
            await this.supabase
                .from('Restoredpassword')
                .update({ 
                    OTP: null, 
                    OTP_Expire: null,
                    VerifyOTP: true
                })
                .eq('Email', email.trim());

            console.log(`✅ Password reset completed for ${email}`);
            return { success: true };

        } catch (error) {
            console.error('❌ Error resetting password with OTP:', error);
            throw error;
        }
    }

    // Audit Log methods

    // Get all audit logs with user information
    async getAllAuditLogs() {
        try {
            console.log('📊 Fetching all audit logs from Supabase...');

            // Get all audit logs
            const { data: auditLogs, error: auditError } = await this.supabase
                .from('AuditLog')
                .select('*')
                .order('Timestamp', { ascending: false }); // Most recent first

            if (auditError) {
                console.error('❌ Error fetching audit logs:', auditError);
                throw auditError;
            }

            // Check if no logs found
            if (!auditLogs || auditLogs.length === 0) {
                console.log('📋 No audit logs found in database');
                return {
                    message: 'no log found',
                    logs: [],
                    count: 0
                };
            }

            // Get user information for each log
            const logsWithUserInfo = [];
            
            for (const log of auditLogs) {
                let userInfo = {
                    user_fullname: null,
                    user_role: null,
                    user_access: null
                };
                
                if (log.EmployeeID) {
                    try {
                        const { data: employee } = await this.supabase
                            .from('Employee')
                            .select('Firstname, Lastname, Role, Dept')
                            .eq('EmployeeID', log.EmployeeID)
                            .single();
                        
                        if (employee) {
                            userInfo = {
                                user_fullname: `${employee.Firstname} ${employee.Lastname}`,
                                user_role: employee.Role,
                                user_access: employee.Dept
                            };
                        }
                    } catch (employeeError) {
                        console.warn(`⚠️ Could not find employee data for ID: ${log.EmployeeID}`);
                    }
                }
                
                logsWithUserInfo.push({
                    ...log,
                    ...userInfo
                });
            }

            console.log(`✅ Successfully fetched ${logsWithUserInfo.length} audit logs`);
            return logsWithUserInfo;

        } catch (error) {
            console.error('❌ Error fetching audit logs:', error);
            throw error;
        }
    }

    // Get audit logs for a specific employee
    async getAuditLogsByEmployee(employeeId) {
        try {
            console.log(`📊 Fetching audit logs for employee: ${employeeId}`);

            const { data: auditLogs, error } = await this.supabase
                .from('AuditLog')
                .select('*')
                .eq('EmployeeID', employeeId)
                .order('Timestamp', { ascending: false });

            if (error) {
                console.error('❌ Error fetching employee audit logs:', error);
                throw error;
            }

            // Add user information
            const logsWithUserInfo = [];
            
            for (const log of auditLogs) {
                let userInfo = {
                    user_fullname: null,
                    user_role: null,
                    user_access: null
                };
                
                if (log.EmployeeID) {
                    try {
                        const { data: employee } = await this.supabase
                            .from('Employee')
                            .select('Firstname, Lastname, Role, Dept')
                            .eq('EmployeeID', log.EmployeeID)
                            .single();
                        
                        if (employee) {
                            userInfo = {
                                user_fullname: `${employee.Firstname} ${employee.Lastname}`,
                                user_role: employee.Role,
                                user_access: employee.Dept
                            };
                        }
                    } catch (employeeError) {
                        console.warn(`⚠️ Could not find employee data for ID: ${log.EmployeeID}`);
                    }
                }
                
                logsWithUserInfo.push({
                    ...log,
                    ...userInfo
                });
            }

            console.log(`✅ Successfully fetched ${logsWithUserInfo.length} audit logs for employee ${employeeId}`);
            return logsWithUserInfo;

        } catch (error) {
            console.error('❌ Error fetching employee audit logs:', error);
            throw error;
        }
    }

    // Create a new audit log entry
    async createAuditLog(logData) {
        try {
            const { employeeId, action, description, place } = logData;
            
            if (!employeeId || !action) {
                throw new Error('EmployeeID and Action are required');
            }

            // Generate unique Log_ID
            const logId = `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const { data: newLog, error } = await this.supabase
                .from('AuditLog')
                .insert({
                    Log_ID: logId,
                    EmployeeID: employeeId,
                    Action: action,
                    Description: description || null,
                    Timestamp: new Date().toISOString(),
                    Place: place || null
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating audit log:', error);
                throw error;
            }

            console.log(`✅ Successfully created audit log: ${logId}`);
            return newLog;

        } catch (error) {
            console.error('❌ Error creating audit log:', error);
            throw error;
        }
    }

    // Get all unique actions for filter dropdown
    async getUniqueActions() {
        try {
            console.log('📊 Fetching unique actions for filter...');

            const { data: logs, error } = await this.supabase
                .from('AuditLog')
                .select('Action')
                .not('Action', 'is', null);

            if (error) {
                console.error('❌ Error fetching actions:', error);
                throw error;
            }

            // Get unique actions
            const uniqueActions = [...new Set(logs.map(log => log.Action))].sort();

            console.log(`✅ Successfully fetched ${uniqueActions.length} unique actions`);
            return uniqueActions;

        } catch (error) {
            console.error('❌ Error fetching actions:', error);
            throw error;
        }
    }

    // ===== SPECIMEN MANAGEMENT =====

    // Get specimen by Specimen_ID or Barcode_Internal
    async getSpecimenByCode(code) {
        try {
            console.log(`🔍 Searching for specimen with code: ${code}`);

            // First try to match by Specimen_ID
            let { data: specimen, error } = await this.supabase
                .from('Specimen')
                .select(`
                    *,
                    Patient:Patient_ID (
                        Patient_ID,
                        FirstName,
                        LastName,
                        HN,
                        Phone,
                        Email
                    )
                `)
                .eq('Specimen_ID', code)
                .single();

            // If not found by Specimen_ID, try Barcode_Internal
            if (error && error.code === 'PGRST116') { // No rows found
                console.log(`🔍 Not found by Specimen_ID, trying Barcode_Internal...`);
                
                const result = await this.supabase
                    .from('Specimen')
                    .select(`
                        *,
                        Patient:Patient_ID (
                            Patient_ID,
                            FirstName,
                            LastName,
                            HN,
                            Phone,
                            Email
                        )
                    `)
                    .eq('Barcode_Internal', code)
                    .single();
                
                specimen = result.data;
                error = result.error;
            }

            if (error && error.code === 'PGRST116') {
                console.log('❌ Specimen not found with either ID or barcode');
                return null;
            }

            if (error) {
                console.error('❌ Error searching specimen:', error);
                throw error;
            }

            console.log(`✅ Found specimen: ${specimen.Specimen_ID}`);
            return specimen;

        } catch (error) {
            console.error('❌ Error in getSpecimenByCode:', error);
            throw error;
        }
    }

    // Get all specimens with optional filters
    async getAllSpecimens(filters = {}) {
        try {
            const { status, patientId, limit = 50 } = filters;
            console.log('📋 Fetching specimens with filters:', filters);

            let query = this.supabase
                .from('Specimen')
                .select(`
                    *,
                    Patient:Patient_ID (
                        Patient_ID,
                        FirstName,
                        LastName,
                        HN,
                        Phone,
                        Email
                    )
                `)
                .order('Submit_Date', { ascending: false })
                .limit(limit);

            // Apply filters
            if (status) {
                query = query.eq('Status', status);
            }

            if (patientId) {
                query = query.eq('Patient_ID', patientId);
            }

            const { data: specimens, error } = await query;

            if (error) {
                console.error('❌ Error fetching specimens:', error);
                throw error;
            }

            console.log(`✅ Successfully fetched ${specimens.length} specimens`);
            return specimens || [];

        } catch (error) {
            console.error('❌ Error in getAllSpecimens:', error);
            throw error;
        }
    }
}

module.exports = new SupabaseService();