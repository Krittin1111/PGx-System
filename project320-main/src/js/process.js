// Language Translation System
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
        'nav-logout': 'ออกจากระบบ'
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
        'nav-logout': 'Logout'
    }
};

let currentLanguage = localStorage.getItem('preferredLanguage') || 'th';

// Language switching functionality
function initializeLanguageToggle() {
    console.log('Initializing language toggle...');
    const languageSwitch = document.getElementById('languageSwitch');
    const langOptions = document.querySelectorAll('.lang-option');

    if (!languageSwitch) {
        console.error('Language switch element not found!');
        return;
    }

    // Set initial language state
    updateLanguage(currentLanguage);
    updateSwitchPosition(currentLanguage);

    // Handle switch click
    languageSwitch.addEventListener('click', (e) => {
        console.log('Language switch clicked!');
        const newLanguage = currentLanguage === 'th' ? 'en' : 'th';
        
        currentLanguage = newLanguage;
        localStorage.setItem('preferredLanguage', newLanguage);
        updateLanguage(newLanguage);
        updateSwitchPosition(newLanguage);
    });

    // Handle individual option clicks
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            console.log('Individual language option clicked:', option.getAttribute('data-lang'));
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

    updateActiveLanguageOption();
}

function updateActiveLanguageOption() {
    updateSwitchPosition(currentLanguage);
}

function translate(key) {
    return translations[currentLanguage][key] || key;
}

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
        console.log('No user session found, redirecting to login');
        window.location.href = './login.html';
    }
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

// ===== ดึง element ทั้งหมด =====
const statusText = document.getElementById("status-text");
const confirmBtn = document.getElementById("approve-btn");
const reviseBtn = document.getElementById("reject-btn");
const pdfBtn = document.getElementById("pdf-btn");
const backBtn = document.getElementById("back-btn");

const modal = document.getElementById("revise-modal");
const cancelModal = document.getElementById("cancel-modal");
const confirmRevise = document.getElementById("confirm-revise");
const reviseMessage = document.getElementById("revise-message");

let status = "";
// ✅ ดึงรหัสการทดสอบจาก URL เช่น ?testCode=400001
const urlParams = new URLSearchParams(window.location.search);
const testCode = urlParams.get("testCode");

// ✅ ปุ่มยืนยันผล (ผ่าน)
confirmBtn.addEventListener("click", () => {
  status = "approved";
  // ✅ บันทึกสถานะไว้ใน localStorage
  if (testCode) localStorage.setItem(testCode, status);
  updateStatus();
});

// 🟥 ปุ่มส่งกลับให้แก้ไข
reviseBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// 🔹 ปิด Modal
cancelModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  reviseMessage.value = "";
  confirmRevise.disabled = true;
});

// 🔹 พิมพ์ข้อความใน Modal
reviseMessage.addEventListener("input", () => {
  confirmRevise.disabled = reviseMessage.value.trim() === "";
});

// 🔹 ยืนยันส่งกลับให้แก้ไข
confirmRevise.addEventListener("click", () => {
  status = "rejected"; // ✅ ต้องใช้ค่าเดียวกับฝั่ง report
  if (testCode) localStorage.setItem(testCode, status);
  modal.classList.add("hidden");
  reviseMessage.value = "";
  confirmRevise.disabled = true;
  updateStatus();

  // ✅ กลับหน้า report
  setTimeout(() => {
    window.location.href = "report.html";
  }, 500);
});


// 🔹 ปุ่มย้อนกลับ
backBtn.addEventListener("click", () => {
  window.location.href = "report.html";
});

// ✅ ฟังก์ชันอัปเดตสถานะ
function updateStatus() {
  if (status === "approved") {
    statusText.innerHTML = "<strong>สถานะ:</strong> ผ่าน";
    confirmBtn.disabled = true;
    reviseBtn.disabled = true;
    pdfBtn.classList.remove("hidden");
  } else if (status === "rejected") {
    statusText.innerHTML = "<strong>สถานะ:</strong> รอแก้ไข";
    confirmBtn.disabled = true;
    reviseBtn.disabled = true;
    pdfBtn.classList.add("hidden");
  } else {
    statusText.innerHTML = "";
    confirmBtn.disabled = false;
    reviseBtn.disabled = false;
    pdfBtn.classList.add("hidden");
  }
}

// Initialize everything when page loads
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

document.addEventListener('DOMContentLoaded', function() {
    addModalStyles();
    initializeLanguageToggle();
    loadUserInfo();
    initializeLogout();
    updateStatus();
});

updateStatus();
