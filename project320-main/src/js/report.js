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
        'nav-logout': 'ออกจากระบบ',
        
        // Report specific
        'search-results': 'ค้นหาผลตรวจ',
        'analysis-table': 'ตารางวิเคราะห์ผลตรวจ',
        'search-placeholder': 'ค้นหา...'
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
        
        // Report specific
        'search-results': 'Search Results',
        'analysis-table': 'Analysis Table',
        'search-placeholder': 'Search...'
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

    console.log('Language switch element found:', languageSwitch);
    console.log('Lang options found:', langOptions.length);

    // Set initial language state
    updateLanguage(currentLanguage);
    updateSwitchPosition(currentLanguage);

    // Handle switch click
    languageSwitch.addEventListener('click', (e) => {
        console.log('Language switch clicked!');
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
                // Clear all session data
                sessionStorage.clear();
                localStorage.removeItem('user');
                
                console.log('User logged out successfully');
                window.location.href = './login.html';
                
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

// === ตัวอย่างข้อมูลผู้ป่วย ===
const mockData = [
  { date: "7/10/2568", testCode: "400001", patientName: "ศุรศัก ประตูบ้านทอง", testType: "BloodEDTA", status: "pending" },
  { date: "8/10/2568", testCode: "400002", patientName: "อารีย์ สุขใจ", testType: "BloodEDTA", status: "pending" },
  { date: "9/10/2568", testCode: "400003", patientName: "สมศรี ศรีสม", testType: "BloodEDTA", status: "pending" }
];

// === โหลดข้อมูล ===
function loadResults() {
  const table = document.getElementById('result-table');
  table.innerHTML = '';

  mockData.forEach((item, index) => {
    // ✅ ดึงสถานะล่าสุดจาก localStorage
    const savedStatus = localStorage.getItem(item.testCode);
    if (savedStatus) {
      item.status = savedStatus;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.testCode}</td>
      <td>${item.patientName}</td>
      <td>${item.testType}</td>
      <td><span class="status ${item.status}" id="status-${index}">${getStatusText(item.status)}</span></td>
      <td><button class="action-btn ${getActionClass(item.status)}" id="btn-${index}">${getActionText(item.status)}</button></td>
    `;
    table.appendChild(row);
  });

  // ✅ ผูก event ให้ปุ่มในแต่ละแถว
  mockData.forEach((item, index) => {
    document.getElementById(`btn-${index}`).addEventListener('click', () => handleActionClick(index));
  });
}

// === เมื่อกดปุ่มดำเนินการ ===
function handleActionClick(index) {
  const item = mockData[index];
  if (item.status === 'pending') {
    window.location.href = `process.html?testCode=${item.testCode}`;
  }
  else if (item.status === 'rejected') {
    window.location.href = `edit.html?testCode=${item.testCode}`;
  }
}

// === ตัวช่วยแสดงข้อความและคลาส ===
function getStatusText(status) {
  switch(status) {
    case 'pending': return 'รอดำเนินการ';
    case 'approved': return 'ผ่าน';
    case 'rejected': return 'รอแก้ไข';
    default: return '-';
  }
}

function getActionText(status) {
  switch(status) {
    case 'pending': return 'ดำเนินการ';
    case 'approved': return 'อ่านผลแล้ว';
    case 'rejected': return 'แก้ไขผลตรวจ';
    default: return '';
  }
}

function getActionClass(status) {
  switch(status) {
    case 'pending': return 'processing';
    case 'approved': return 'done';
    case 'rejected': return 'failed';
    default: return '';
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

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    addModalStyles();
    initializeLanguageToggle();
    loadUserInfo();
    initializeLogout();
    loadResults();
});
