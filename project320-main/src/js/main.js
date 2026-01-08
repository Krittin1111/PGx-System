// Language Translation System - Working version from login page
const translations = {
    th: {
        // Dashboard
        'dashboard-title': 'PGX Dashboard',
        'loading-user': 'กำลังโหลด...',
        'user-fallback': 'ผู้ใช้งาน',
        'logout-confirm': 'คุณต้องการออกจากระบบหรือไม่?',
        'ok-button': 'ตกลง',
        'cancel-button': 'ยกเลิก',
        'confirm-button': 'ตกลง',
        'logout-success': 'ออกจากระบบสำเร็จ',
        
        // Navigation
        'nav-home': 'หน้าหลัก',
        'nav-register': 'ลงทะเบียนผู้ป่วย',
        'nav-send-test': 'ส่งตรวจ',
        'nav-record-results': 'บันทึกผลการทดสอบ',
        'nav-report': 'รายงานผล',
        'nav-quality': 'ควบคุมคุณภาพ',
        'nav-statistics': 'รายงานสถิติ',
        'nav-logout': 'ออกจากระบบ',
        
        // Quick Access Section
        'quick-access-title': 'การเข้าถึงด่วน',
        'search-patient': 'ค้นหาผู้ป่วย',
        'patient-search-placeholder': 'ระบุ ชื่อ หรือ HN ของผู้ป่วย',
        'search-btn': 'ค้นหา',
        'report-btn': 'รายงานผล',
        
        // Status Section
        'status-title': 'สถานะรายงานผล',
        'status-approved': 'อนุมัติแล้ว',
        'status-pending': 'รออนุมัติ',
        'status-returned': 'ส่งกลับแก้ไข',
        'status-testing': 'ตรวจค้างอยู่',
        
        // Table Headers
        'table-date': 'วันที่ส่งตรวจ',
        'table-code': 'รหัสตรวจสอบ',
        'table-patient': 'คนไข้',
        'table-tests': 'รายการตรวจ',
        'table-status': 'สถานะผล',
        
        // Pills/Tabs
        'pill-all': 'ทั้งหมด',
        'pill-latest': 'ตรวจล่าสุด',
        'pill-important': 'สำคัญ',
        
        // Alerts
        'alert-title': 'แจ้งเตือนล่าสุด',
        'alert-message': 'รหัสทดสอบที่ต้องแก้ไข : ชนิดการทดสอบ',
        
        // Knowledge Base
        'knowledge-title': 'คลังความรู้',
        
        // Footer
        'certification-title': 'การรับรองมาตรฐาน',
        'certification-desc': 'ห้องปฏิบัติการนี้ผ่านการรับรองตามมาตรฐานดังต่อไปนี้',
        'contact-info': 'สำหรับข้อร้องเรียนหรือข้อเสนอแนะ กรุณาติดต่อผู้จัดการฝ่ายประกันคุณภาพ โทร 0-2345-6789 ต่อ 1234'
    },
    en: {
        // Dashboard
        'dashboard-title': 'PGX Dashboard',
        'loading-user': 'Loading...',
        'user-fallback': 'User',
        'logout-confirm': 'Do you want to logout?',
        'ok-button': 'OK',
        'cancel-button': 'Cancel',
        'confirm-button': 'Confirm',
        'logout-success': 'Logged out successfully',
        
        // Navigation
        'nav-home': 'Home',
        'nav-register': 'Patient Registration',
        'nav-send-test': 'Send Test',
        'nav-record-results': 'Record Test Results',
        'nav-report': 'Reports',
        'nav-quality': 'Quality Control',
        'nav-statistics': 'Statistics Report',
        'nav-logout': 'Logout',
        
        // Quick Access Section
        'quick-access-title': 'Quick Access',
        'search-patient': 'Search Patient',
        'patient-search-placeholder': 'Enter patient name or HN',
        'search-btn': 'Search',
        'report-btn': 'Report',
        
        // Status Section
        'status-title': 'Report Status',
        'status-approved': 'Approved',
        'status-pending': 'Pending Approval',
        'status-returned': 'Returned for Revision',
        'status-testing': 'Test Pending',
        
        // Table Headers
        'table-date': 'Test Date',
        'table-code': 'Test Code',
        'table-patient': 'Patient',
        'table-tests': 'Test List',
        'table-status': 'Result Status',
        
        // Pills/Tabs
        'pill-all': 'All',
        'pill-latest': 'Latest Tests',
        'pill-important': 'Important',
        
        // Alerts
        'alert-title': 'Latest Alerts',
        'alert-message': 'Test Code to Fix : Test Type',
        
        // Knowledge Base
        'knowledge-title': 'Knowledge Base',
        
        // Footer
        'certification-title': 'Standard Certification',
        'certification-desc': 'This laboratory is certified according to the following standards',
        'contact-info': 'For complaints or suggestions, please contact Quality Assurance Manager at 0-2345-6789 ext. 1234'
    }
};

let currentLanguage = localStorage.getItem('preferredLanguage') || 'th';

// Language switching functionality
function initializeLanguageToggle() {
    const languageSwitch = document.getElementById('languageSwitch');
    const langOptions = document.querySelectorAll('.lang-option');

    // Set initial language state
    updateLanguage(currentLanguage);
    updateSwitchPosition(currentLanguage);

    // Handle switch click
    languageSwitch.addEventListener('click', (e) => {
        // Toggle between languages
        const newLanguage = currentLanguage === 'th' ? 'en' : 'th';
        
        currentLanguage = newLanguage;
        localStorage.setItem('preferredLanguage', newLanguage);
        updateLanguage(newLanguage);
        updateSwitchPosition(newLanguage);
    });

    // Handle individual option clicks
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = option.getAttribute('data-lang');
            
            if (selectedLang !== currentLanguage) {
                currentLanguage = selectedLang;
                localStorage.setItem('preferredLanguage', selectedLang);
                updateLanguage(selectedLang);
                updateSwitchPosition(selectedLang);
            }
        });
    });
}

function updateSwitchPosition(lang) {
    const languageSwitch = document.getElementById('languageSwitch');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Update switch class for slider position
    languageSwitch.className = `lang-switch ${lang}`;
    
    // Update active states
    langOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}

function updateLanguage(lang) {
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Update user display if needed
    updateUserDisplay();

    updateActiveLanguageOption();
}

function updateActiveLanguageOption() {
    updateSwitchPosition(currentLanguage);
}

function translate(key) {
    return translations[currentLanguage][key] || key;
}

// Custom modal function to replace alert() - Same as login page
function showModal(message, isError = false, callback = null) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Translate the message if needed
    const translatedMessage = translate(message) || message;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
            <button class="modal-button ${isError ? 'error' : ''}" autofocus>
                ${translate('ok-button') || 'ตกลง'}
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click event listener to the button
    const button = modal.querySelector('.modal-button');
    button.addEventListener('click', function() {
        modal.remove();
        if (callback) {
            callback();
        }
    });
    
    // Focus the button to ensure cursor works after
    setTimeout(() => {
        button.focus();
    }, 100);
}

// Custom confirm modal function
function showConfirmModal(message, onConfirm = null, onCancel = null) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const translatedMessage = translate(message) || message;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
            <div class="modal-buttons">
                <button class="modal-button cancel-button" id="cancelBtn">
                    ${translate('cancel-button') || 'ยกเลิก'}
                </button>
                <button class="modal-button confirm-button" id="confirmBtn" autofocus>
                    ${translate('confirm-button') || 'ตกลง'}
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

// User Management Functions
function loadUserInfo() {
    // Get user info from sessionStorage (set during login)
    const userInfo = sessionStorage.getItem('user');
    const userNameElement = document.getElementById('userName');
    
    if (userInfo) {
        try {
            const user = JSON.parse(userInfo);
            // Display first name and last name
            const displayName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
            userNameElement.textContent = displayName || user.email || translate('user-fallback');
            
            console.log('Loaded user info:', user);
        } catch (error) {
            console.error('Error parsing user info:', error);
            userNameElement.textContent = translate('user-fallback');
        }
    } else {
        // No user info found, redirect to login
        console.log('No user session found, redirecting to login');
        window.location.href = './login.html';
    }
}

// Update user display when language changes
function updateUserDisplay() {
    const userInfo = sessionStorage.getItem('user');
    const userNameElement = document.getElementById('userName');
    
    if (userInfo && userNameElement.textContent === 'Loading...') {
        loadUserInfo();
    } else if (!userInfo) {
        userNameElement.textContent = translate('loading-user');
    }
}

// Logout functionality
function logout() {
    // Show custom confirmation modal
    showConfirmModal('logout-confirm', 
        // On confirm
        function() {
            try {
                // Clear all session data
                sessionStorage.clear();
                localStorage.removeItem('user');
                
                // Optional: Call logout API if needed
                // fetch('/api/logout', { method: 'POST' });
                
                console.log('User logged out successfully');
                
                // Show success message then redirect
                showModal('logout-success', false, function() {
                    window.location.href = './login.html';
                });
                
            } catch (error) {
                console.error('Error during logout:', error);
                // Still redirect even if there's an error
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

// Add modal styles - Same as login page
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
                background: #45a049;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .modal-button.error {
                background: #f44336;
            }
            
            .modal-button.error:hover {
                background: #da190b;
            }
            
            .cancel-button {
                background: #757575 !important;
            }
            
            .cancel-button:hover {
                background: #616161 !important;
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

// ===== BARCODE SCANNER FUNCTIONALITY =====

class BarcodeScanner {
    constructor() {
        this.isScanning = false;
        this.modal = document.getElementById('barcodeScannerModal');
        this.closeBtn = document.getElementById('closeBarcodeModal');
        this.scanArea = document.getElementById('scanArea');
        this.stopBtn = document.getElementById('stopScanner');
        this.manualInput = document.getElementById('manualBarcodeInput');
        this.searchBtn = document.getElementById('searchManualBarcode');
        
        this.initializeScanner();
    }
    
    initializeScanner() {
        // Scan button in quick access
        const scanBtn = document.getElementById('scanBarcodeBtn');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => this.openModal());
        }
        
        // Modal controls
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Make scan area clickable
        if (this.scanArea) {
            this.scanArea.addEventListener('click', () => this.startScanning());
        }
        
        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', () => this.stopScanning());
        }
        
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.searchBarcode());
        }
        
        // Manual input enter key
        if (this.manualInput) {
            this.manualInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchBarcode();
                }
            });
        }
        
        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    openModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.resetDisplay();
            
            // Focus on manual input
            if (this.manualInput) {
                setTimeout(() => this.manualInput.focus(), 300);
            }
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.stopScanning();
            this.modal.style.display = 'none';
        }
    }
    
    resetDisplay() {
        // Hide all result sections
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('viewReportBtn').style.display = 'none';
        
        // Hide barcode section and show placeholder
        document.getElementById('barcodeSection').style.display = 'none';
        document.getElementById('scanPlaceholder').style.display = 'flex';
        
        // Reset input
        if (this.manualInput) {
            this.manualInput.value = '';
        }
    }
    
    async startScanning() {
        if (this.isScanning || !window.Quagga) return;
        
        // Disable scan area during initialization
        if (this.scanArea) {
            this.scanArea.style.pointerEvents = 'none';
            this.scanArea.style.opacity = '0.7';
        }
        
        try {
            // Hide placeholder and show camera preview
            document.getElementById('scanPlaceholder').style.display = 'none';
            const cameraPreview = document.getElementById('camera-preview');
            cameraPreview.style.display = 'flex';
            cameraPreview.innerHTML = '';
            
            const config = {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: cameraPreview,
                    constraints: {
                        width: { min: 320, ideal: 640, max: 800 },
                        height: { min: 240, ideal: 480, max: 600 },
                        facingMode: "environment"
                    }
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true
                },
                numOfWorkers: 2,
                frequency: 10,
                decoder: {
                    readers: [
                        "code_128_reader",
                        "ean_reader",
                        "ean_8_reader",
                        "code_39_reader",
                        "codabar_reader",
                        "upc_reader",
                        "i2of5_reader"
                    ]
                },
                locate: true
            };
            
            await new Promise((resolve, reject) => {
                Quagga.init(config, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            
            Quagga.start();
            this.isScanning = true;
            
            // Add scanning visual state
            if (this.scanArea) {
                this.scanArea.classList.add('scanning');
            }
            
            // Update UI
            this.stopBtn.style.display = 'inline-block';
            this.stopBtn.disabled = false;
            
            // Listen for scans
            Quagga.onDetected((result) => {
                const code = result.codeResult.code;
                console.log('Barcode detected:', code);
                this.handleBarcodeDetected(code);
                
                // Auto-stop after successful scan
                this.stopScanning();
            });
            
        } catch (error) {
            console.error('Scanner initialization error:', error);
            this.showError('ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบการอนุญาตใช้กล้อง');
            this.resetScannerButtons();
        }
    }
    
    stopScanning() {
        if (!this.isScanning) return;
        
        if (window.Quagga) {
            Quagga.stop();
        }
        
        this.isScanning = false;
        
        // Hide camera and show placeholder
        const cameraPreview = document.getElementById('camera-preview');
        cameraPreview.style.display = 'none';
        cameraPreview.innerHTML = '';
        document.getElementById('scanPlaceholder').style.display = 'flex';
        
        // Remove scanning visual state
        if (this.scanArea) {
            this.scanArea.classList.remove('scanning');
        }
        
        this.resetScannerButtons();
    }
    
    resetScannerButtons() {
        // Re-enable scan area and remove scanning state
        if (this.scanArea) {
            this.scanArea.style.pointerEvents = 'auto';
            this.scanArea.style.opacity = '1';
            this.scanArea.classList.remove('scanning');
        }
        this.stopBtn.disabled = true;
        this.stopBtn.style.display = 'none';
    }
    
    async searchBarcode() {
        const barcode = this.manualInput.value.trim();
        if (!barcode) {
            this.showError('กรุณาใส่รหัส Barcode');
            return;
        }
        
        this.handleBarcodeDetected(barcode);
    }
    
    async handleBarcodeDetected(barcode) {
        console.log('Processing barcode:', barcode);
        
        // Show barcode in display
        this.showBarcodeResult(barcode);
        
        // Show loading
        this.showLoading();
        
        try {
            // Call API to search for specimen
            const response = await fetch(`/api/specimens/${barcode}`);
            const result = await response.json();
            
            if (result.success && result.specimen) {
                this.showSpecimenInfo(result.specimen);
            } else {
                this.showError(result.message || 'ไม่พบใบสั่งตรวจ หรือมีอะไรผิดพลาดลองแสกนใหม่หรือกรอกเลข barcode');
            }
            
        } catch (error) {
            console.error('Error searching specimen:', error);
            this.showError('เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง');
        }
    }
    
    showBarcodeResult(barcode) {
        // Show barcode section and update display
        document.getElementById('barcodeSection').style.display = 'block';
        document.getElementById('barcodeResultDisplay').textContent = barcode;
        
        // Update manual input
        if (this.manualInput) {
            this.manualInput.value = barcode;
        }
    }
    

    
    showLoading() {
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('loadingMessage').style.display = 'block';
        document.getElementById('viewReportBtn').style.display = 'none';
    }
    
    showSpecimenInfo(specimen) {
        // Hide loading and error
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        
        // Show patient info
        const patientInfo = document.getElementById('patientInfo');
        patientInfo.style.display = 'block';
        
        // Populate data
        document.getElementById('labCode').textContent = specimen.Specimen_ID || 'N/A';
        
        // Patient info from joined data
        const patientHN = specimen.Patient?.HN || 'N/A';
        document.getElementById('patientNumber').textContent = patientHN;
        document.getElementById('patientNumber').href = `#patient=${patientHN}`;
        
        document.getElementById('specimenType').textContent = specimen.Specimen_Type || 'N/A';
        
        // For drug name, you might need additional data from Test_Heredity table
        document.getElementById('drugName').textContent = specimen.Container || 'N/A';
        
        // Show report button
        document.getElementById('viewReportBtn').style.display = 'block';
        
        // Store specimen data for report viewing
        this.currentSpecimen = specimen;
        
        console.log('Specimen info displayed:', specimen);
    }
    
    showError(message) {
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('viewReportBtn').style.display = 'none';
        
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.style.display = 'block';
        
        const errorText = document.querySelector('.error-text');
        if (errorText) {
            errorText.textContent = message;
        }
    }
}

// Add translations for barcode scanner
const barcodeTranslations = {
    th: {
        'scan-btn': 'สแกน',
        'barcode-scanner-title': 'หน้าแสกนใบสั่งตรวจ',
        'scan-area-title': 'พื้นที่แสกน Barcode',
        'scan-instruction': 'แสดง Barcode ภายในกรอบที่กำหนด',
        'found-barcode-title': 'Barcode ที่พบ',
        'lab-order-number': 'หมายเลขใบสั่งตรวจ',
        'patient-number': 'หมายเลขผู้ป่วย',
        'patient-found': 'ค้นพบข้อมูลผู้ป่วยในระบบ',
        'find-patient': 'ค้นหาผู้ป่วย',
        'specimen-type': 'สิ่งส่งตรวจ',
        'related-drug': 'ยาที่เกี่ยวข้อง',
        'barcode-error': 'ไม่พบใบสั่งตรวจ หรือมีอะไรผิดพลาดลองแสกนใหม่หรือกรอกเลข barcode',
        'searching': 'กำลังค้นหา...',
        'stop-scanner': 'หยุดแสกน',
        'manual-input-title': 'กรอกรหัส Barcode ด้วยตนเอง',
        'manual-barcode-placeholder': 'กรอกรหัส Barcode',
        'search': 'ค้นหา',
        'view-report': 'รายงานผล'
    },
    en: {
        'scan-btn': 'Scan',
        'barcode-scanner-title': 'Barcode Scanner',
        'barcode-placeholder': 'Show Barcode',
        'barcode-frame-text': 'within frame',
        'barcode-number': 'Found Barcode',
        'result-label': 'Results',
        'lab-code': 'Lab Order Number',
        'patient-number': 'Patient Number',
        'patient-system-note': 'Search patient in system',
        'find-patient': 'Find Patient',
        'specimen-type': 'Specimen Type',
        'drug-name': 'Drug to Analyze',
        'barcode-error': 'Order not found or error occurred. Please scan again or enter barcode manually',
        'searching': 'Searching...',
        'stop-scanner': 'Stop Scanner',
        'manual-input-title': 'Enter Barcode Manually',
        'manual-barcode-placeholder': 'Enter Barcode',
        'search': 'Search',
        'view-report': 'View Report'
    }
};

// Merge barcode translations
Object.keys(barcodeTranslations).forEach(lang => {
    if (translations[lang]) {
        Object.assign(translations[lang], barcodeTranslations[lang]);
    }
});

// Initialize barcode scanner when page loads
let barcodeScanner;

// Initialize language toggle when page loads
document.addEventListener('DOMContentLoaded', function() {
    addModalStyles();
    initializeLanguageToggle();
    loadUserInfo();
    initializeLogout();
    
    // Initialize barcode scanner
    barcodeScanner = new BarcodeScanner();
    
    console.log('Main page initialized with barcode scanner');
});