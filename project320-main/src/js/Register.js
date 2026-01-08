// Register Page Specific Translations
const REGISTER_TRANSLATIONS = {
    th: {
        // Registration Form
        'register-title': 'กรอกข้อมูลคนไข้รายใหม่',
        'firstname-label': 'ชื่อ',
        'lastname-label': 'นามสกุล',
        'age-label': 'อายุ',
        'gender-label': 'เพศ',
        'id-card-label': 'เลขบัตรประชาชน',
        'hospital-label': 'หน่วยงานที่ส่งตรวจ',
        'ethnicity-label': 'เชื้อชาติ',
        'patient-phone-label': 'เบอร์ติดต่อผู้ป่วย',
        'birthdate-label': 'วันเกิด',
        'weight-label': 'น้ำหนัก (กก.)',
        'height-label': 'ส่วนสูง (ซม.)',
        'physician-label': 'แพทย์',
        'physician-phone-label': 'เบอร์ติดต่อแพทย์',
        'specimen-label': 'สิ่งส่งตรวจ',
        'note-label': 'หมายเหตุเพิ่มเติม',
        
        // Placeholders
        'firstname-placeholder': 'ชื่อ',
        'lastname-placeholder': 'นามสกุล',
        'age-placeholder': 'อายุ',
        'gender-select-placeholder': 'เลือกเพศ',
        'id-card-placeholder': 'เลข 13 หลัก',
        'hospital-placeholder': 'ชื่อโรงพยาบาล/หน่วยงาน',
        'ethnicity-placeholder': 'เช่น ไทย, จีน, มอญ',
        'phone-placeholder': '0XXXXXXXXX',
        'weight-placeholder': 'เช่น 65.5',
        'height-placeholder': 'เช่น 170.5',
        'physician-placeholder': 'ชื่อ-สกุลแพทย์ผู้ส่งตรวจ',
        'specimen-select-placeholder': 'เลือกชนิดสิ่งส่งตรวจ',
        'note-placeholder': 'ระบุข้อมูลเพิ่มเติม เช่น ประวัติการใช้ยา ประวัติการแพ้ ข้อมูลอื่น ๆ ที่จำเป็นของผู้ป่วย',
        
        // Options
        'gender-male': 'ชาย',
        'gender-female': 'หญิง',
        'gender-other': 'อื่น ๆ',
        'specimen-other': 'อื่น ๆ',
        
        // Buttons
        'save-print-btn': 'บันทึกและพิมพ์ใบสั่งตรวจ (PDF)',
        
        // Patient Check Messages
        'checking-patient': 'กำลังตรวจสอบข้อมูล...',
        'existing-patient-found': 'พบข้อมูลผู้ป่วยเดิม: {name} - ข้อมูลถูกกรอกอัตโนมัติ',
        'new-patient': 'ผู้ป่วยรายใหม่ - กรุณากรอกข้อมูลให้ครบถ้วน',
        'patient-check-error': 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่อีกครั้ง',
        'invalid-id-card': 'รูปแบบเลขบัตรประชาชนไม่ถูกต้อง (ต้องเป็นตัวเลข 13 หลัก)',
        'saving-data': 'กำลังบันทึกข้อมูล...',
        'data-saved-success': 'บันทึกข้อมูลสำเร็จ!'
    },
    en: {
        // Registration Form
        'register-title': 'New Patient Registration',
        'firstname-label': 'First Name',
        'lastname-label': 'Last Name',
        'age-label': 'Age',
        'gender-label': 'Gender',
        'id-card-label': 'ID Card Number',
        'hospital-label': 'Referring Unit',
        'ethnicity-label': 'Ethnicity',
        'patient-phone-label': 'Patient Phone',
        'birthdate-label': 'Date of Birth',
        'weight-label': 'Weight (kg)',
        'height-label': 'Height (cm)',
        'physician-label': 'Physician',
        'physician-phone-label': 'Physician Phone',
        'specimen-label': 'Specimen Type',
        'note-label': 'Additional Notes',
        
        // Placeholders
        'firstname-placeholder': 'First Name',
        'lastname-placeholder': 'Last Name',
        'age-placeholder': 'Age',
        'gender-select-placeholder': 'Select Gender',
        'id-card-placeholder': '13-digit number',
        'hospital-placeholder': 'Hospital/Institution Name',
        'ethnicity-placeholder': 'e.g. Thai, Chinese, Mon',
        'phone-placeholder': '0XXXXXXXXX',
        'weight-placeholder': 'e.g. 65.5',
        'height-placeholder': 'e.g. 170.5',
        'physician-placeholder': 'Physician Name',
        'specimen-select-placeholder': 'Select Specimen Type',
        'note-placeholder': 'Specify additional information such as medication history, allergies, or other relevant patient data',
        
        // Options
        'gender-male': 'Male',
        'gender-female': 'Female',
        'gender-other': 'Other',
        'specimen-other': 'Other',
        
        // Buttons
        'save-print-btn': 'Save and Print Test Order (PDF)',
        
        // Patient Check Messages
        'checking-patient': 'Checking patient data...',
        'existing-patient-found': 'Existing patient found: {name} - Data auto-filled',
        'new-patient': 'New patient - Please fill in all required information',
        'patient-check-error': 'Error checking patient data. Please try again.',
        'invalid-id-card': 'Invalid ID card format (must be 13 digits)',
        'saving-data': 'Saving data...',
        'data-saved-success': 'Data saved successfully!'
    }
};

// Initialize Language Manager with register-specific translations
let languageManager;

// User Management Functions
function loadUserInfo() {
    const userInfo = sessionStorage.getItem('user');
    const userNameElement = document.getElementById('userName');
    
    if (userInfo) {
        try {
            const user = JSON.parse(userInfo);
            const displayName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
            userNameElement.textContent = displayName || user.email || translate('user-fallback');
        } catch (error) {
            console.error('Error parsing user info:', error);
            userNameElement.textContent = translate('user-fallback');
        }
    } else {
        console.log('No user session found, using fallback');
        userNameElement.textContent = translate('user-fallback');
    }
}

// Custom confirm modal function
function showConfirmModal(message, onConfirm = null, onCancel = null) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const translatedMessage = languageManager.translate(message) || message;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
            <div class="modal-buttons">
                <button class="modal-button cancel-button" id="cancelBtn">
                    ${languageManager.translate('cancel-button') || 'ยกเลิก'}
                </button>
                <button class="modal-button confirm-button" id="confirmBtn" autofocus>
                    ${languageManager.translate('confirm-button') || 'ตกลง'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const confirmBtn = modal.querySelector('#confirmBtn');
    const cancelBtn = modal.querySelector('#cancelBtn');
    
    confirmBtn.addEventListener('click', function() {
        modal.remove();
        if (onConfirm) {
            onConfirm();
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.remove();
        if (onCancel) {
            onCancel();
        }
    });
    
    // Focus the confirm button
    setTimeout(() => {
        confirmBtn.focus();
    }, 100);
}

// Logout functionality
function logout() {
    // Show custom confirmation modal
    showConfirmModal('logout-confirm', 
        // On confirm
        function() {
            try {
                sessionStorage.clear();
                localStorage.removeItem('user');
                console.log('User logged out successfully');
                window.location.href = './login.html';
            } catch (error) {
                console.error('Error during logout:', error);
                window.location.href = './login.html';
            }
        },
        // On cancel - do nothing
        null
    );
}

// Initialize logout button
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Patient Registration Functions
class PatientRegistration {
    constructor() {
        this.debounceTimer = null;
        this.isExistingPatient = false;
        this.currentPatientId = null;
        this.initializeForm();
    }

    initializeForm() {
        const cidInput = document.getElementById('cid');
        const form = document.querySelector('.form');
        const saveButton = document.querySelector('.btn-primary');
        
        if (cidInput) {
            // Add event listener for ID card input
            cidInput.addEventListener('input', this.handleCidInput.bind(this));
        }
        
        if (saveButton) {
            saveButton.addEventListener('click', this.handleSaveClick.bind(this));
        }
    }

    handleCidInput(event) {
        const cidValue = event.target.value.trim();
        
        // Clear previous timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        // Clear previous results
        this.clearCheckResult();
        
        // If empty or less than 13 digits, don't check
        if (!cidValue || cidValue.length < 13) {
            return;
        }
        
        // Validate ID card format (13 digits)
        if (!/^\d{13}$/.test(cidValue)) {
            this.showCheckResult(languageManager.translate('invalid-id-card'), 'error');
            return;
        }
        
        // Debounce API call
        this.debounceTimer = setTimeout(() => {
            this.checkExistingPatient(cidValue);
        }, 500);
    }

    async checkExistingPatient(cidNumber) {
        try {
            this.showCheckResult(languageManager.translate('checking-patient'), 'loading');
            
            // Mock data for testing - replace with actual API call when server is ready
            const mockPatients = {
                '1159900011199': {
                    Patient_ID: 'HN20251001',
                    Firstname: 'นายสมชาย',
                    Lastname: 'ใจดี',
                    Age: '42',
                    Gender: 'ชาย',
                    PhoneNumber: '0816665455',
                    Ethnicity: 'ไทย',
                    Weight: '60',
                    Height: '175',
                    DateOfBirth: '1994-06-23'
                }
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            try {
                // Try to connect to actual server first
                const response = await fetch(`http://localhost:3000/api/patients/check/${cidNumber}`, {
                    timeout: 2000 // 2 second timeout
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.exists && result.patient) {
                        this.isExistingPatient = true;
                        this.currentPatientId = result.patient.Patient_ID;
                        this.showCheckResult(
                            `พบข้อมูลผู้ป่วยเดิม: ${result.patient.Firstname} ${result.patient.Lastname} - ข้อมูลถูกกรอกอัตโนมัติ`, 
                            'existing'
                        );
                        this.fillExistingPatientData(result.patient);
                        return;
                    }
                }
            } catch (serverError) {
                console.log('Server not available, using mock data');
            }
            
            // Use mock data if server is not available
            if (mockPatients[cidNumber]) {
                this.isExistingPatient = true;
                this.currentPatientId = mockPatients[cidNumber].Patient_ID;
                const patientName = `${mockPatients[cidNumber].Firstname} ${mockPatients[cidNumber].Lastname}`;
                this.showCheckResult(
                    languageManager.translate('existing-patient-found').replace('{name}', patientName), 
                    'existing'
                );
                this.fillExistingPatientData(mockPatients[cidNumber]);
            } else {
                this.isExistingPatient = false;
                this.currentPatientId = null;
                this.showCheckResult(languageManager.translate('new-patient'), 'new');
                this.clearForm();
            }
            
        } catch (error) {
            console.error('Error checking patient:', error);
            this.showCheckResult(languageManager.translate('patient-check-error'), 'error');
        }
    }

    fillExistingPatientData(patient) {
        // Fill form fields with existing patient data
        const fields = {
            'first_name': patient.Firstname || '',
            'last_name': patient.Lastname || '',
            'age': patient.Age || '',
            'gender': patient.Gender || '',
            'patient_phone': patient.PhoneNumber || '',
            'ethnicity': patient.Ethnicity || '',
            'weight': patient.Weight || '',
            'height': patient.Height || '',
            'date_of_birth': patient.DateOfBirth ? patient.DateOfBirth.split('T')[0] : ''
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
                // Add visual feedback that field was auto-filled
                element.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    element.style.backgroundColor = '';
                }, 2000);
            }
        });
    }

    clearForm() {
        const fieldsToKeep = ['cid', 'hospital', 'physician', 'physician_phone', 'specimen', 'note'];
        const allInputs = document.querySelectorAll('input, select, textarea');
        
        allInputs.forEach(input => {
            if (!fieldsToKeep.includes(input.id)) {
                input.value = '';
                input.style.backgroundColor = '';
            }
        });
    }

    showCheckResult(message, type) {
        const resultDiv = document.getElementById('cidCheckResult');
        if (resultDiv) {
            resultDiv.textContent = message;
            resultDiv.className = `cid-check-result show ${type}`;
        }
    }

    clearCheckResult() {
        const resultDiv = document.getElementById('cidCheckResult');
        if (resultDiv) {
            resultDiv.className = 'cid-check-result';
        }
    }

    async handleSaveClick(event) {
        event.preventDefault();
        
        try {
            // Validate form
            const formData = this.collectFormData();
            if (!this.validateForm(formData)) {
                return;
            }

            // Show loading state
            const saveButton = event.target;
            const originalText = saveButton.textContent;
            saveButton.disabled = true;
            saveButton.textContent = languageManager.translate('saving-data');

            let result;
            if (this.isExistingPatient && this.currentPatientId) {
                // Update existing patient and create new specimen
                result = await this.updateExistingPatient(formData);
            } else {
                // Create new patient and specimen
                result = await this.createNewPatient(formData);
            }

            if (result.success) {
                this.showSuccessMessage(languageManager.translate('data-saved-success'));
                setTimeout(() => {
                    this.resetForm();
                }, 2000);
            }

        } catch (error) {
            console.error('Error saving patient:', error);
            this.showErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            const saveButton = event.target;
            saveButton.disabled = false;
            saveButton.textContent = languageManager.translate('save-btn');
        }
    }

    collectFormData() {
        return {
            first_name: document.getElementById('first_name')?.value || '',
            last_name: document.getElementById('last_name')?.value || '',
            age: document.getElementById('age')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            cid: document.getElementById('cid')?.value || '',
            hospital: document.getElementById('hospital')?.value || '',
            ethnicity: document.getElementById('ethnicity')?.value || '',
            patient_phone: document.getElementById('patient_phone')?.value || '',
            physician: document.getElementById('physician')?.value || '',
            physician_phone: document.getElementById('physician_phone')?.value || '',
            specimen: document.getElementById('specimen')?.value || '',
            note: document.getElementById('note')?.value || '',
            weight: document.getElementById('weight')?.value || '',
            height: document.getElementById('height')?.value || '',
            date_of_birth: document.getElementById('date_of_birth')?.value || ''
        };
    }

    validateForm(formData) {
        const errors = [];

        if (!formData.first_name.trim()) {
            errors.push(`${languageManager.translate('firstname-label')}: ${languageManager.translate('required-field')}`);
        }
        
        if (!formData.last_name.trim()) {
            errors.push(`${languageManager.translate('lastname-label')}: ${languageManager.translate('required-field')}`);
        }
        
        if (!formData.cid.trim() || !/^\d{13}$/.test(formData.cid)) {
            errors.push(languageManager.translate('invalid-id-card'));
        }

        if (errors.length > 0) {
            this.showErrorMessage(errors.join('\n'));
            return false;
        }

        return true;
    }

    async createNewPatient(formData) {
        const response = await fetch('http://localhost:3000/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to create patient');
        }

        return await response.json();
    }

    async updateExistingPatient(formData) {
        // Update patient data
        const updateResponse = await fetch(`http://localhost:3000/api/patients/${this.currentPatientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update patient');
        }

        // Create new specimen for existing patient
        const specimenData = {
            ...formData,
            patient_id: this.currentPatientId
        };

        const specimenResponse = await fetch('http://localhost:3000/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(specimenData)
        });

        if (!specimenResponse.ok) {
            throw new Error('Failed to create specimen');
        }

        return { success: true };
    }

    showSuccessMessage(message) {
        // You can implement a toast notification or modal here
        alert(message);
    }

    showErrorMessage(message) {
        alert(message);
    }

    resetForm() {
        document.querySelector('.form').reset();
        this.clearCheckResult();
        this.isExistingPatient = false;
        this.currentPatientId = null;
    }
}

// Add modal styles
function addModalStyles() {
    if (!document.getElementById('modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            .custom-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal-content {
                background: white;
                padding: 25px 30px;
                border-radius: 12px;
                text-align: center;
                max-width: 400px;
                min-width: 280px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-30px) scale(0.9);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .modal-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }
            
            .modal-button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                min-width: 80px;
            }
            
            .modal-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .cancel-button {
                background: #6c757d !important;
            }
            
            .cancel-button:hover {
                background: #5a6268 !important;
            }
            
            .confirm-button {
                background: #f44336 !important;
            }
            
            .confirm-button:hover {
                background: #da190b !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add modal styles
    addModalStyles();
    
    // Initialize language system with register-specific translations
    languageManager = new LanguageManager(REGISTER_TRANSLATIONS);
    
    loadUserInfo();
    initializeLogout();
    
    // Initialize patient registration functionality
    new PatientRegistration();
});