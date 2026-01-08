// Language Translation System for Admin - Using the System Page
const translations = {
    th: {
        // Page Title and Navigation
        'admin-title': 'แอดมิน',
        'user-list': 'รายชื่อผู้ใช้',
        'system-usage': 'การใช้งานระบบ',
        'activity-log': 'การตั้งค่าทั่วไป',
        'logout': 'ออกจากระบบ',
        
        // Page Content
        'check-historical-edits': 'ตรวจสอบการแก้ไขย้อนหลัง',
        'username': 'ชื่อผู้ใช้งาน',
        'role': 'บทบาท',
        'level': 'ระดับ',
        'action': 'การกระทำ',
        'date': 'วันที่',
        'to': 'ถึง',
        
        // Loading and Error States
        'loading-logs': 'กำลังโหลดข้อมูลการใช้งาน...',
        'error-loading-logs': 'ไม่สามารถโหลดข้อมูลการใช้งานได้',
        'try-again': 'ลองใหม่',
        'no-logs-found': 'No Log Found',
        'no-logs-description': 'ยังไม่มีการบันทึกกิจกรรมการใช้งานในระบบ',
        'no-results-found': 'ไม่พบข้อมูลตามเงื่อนไขที่ระบุ',
        'try-different-criteria': 'ลองเปลี่ยนเงื่อนไขการค้นหา',
        'clear-filters': 'ล้างตัวกรอง',
        
        // Alert Messages
        'data-loaded-success': 'โหลดข้อมูลการใช้งานสำเร็จ',
        'filters-cleared': 'ล้างตัวกรองสำเร็จ',
        'connection-error': 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
        'logout-confirm': 'คุณต้องการออกจากระบบหรือไม่?',
        
        // Table Headers
        'date-header': 'วันที่',
        'time-header': 'เวลา',
        'user-name-header': 'ชื่อผู้ใช้',
        'position-header': 'ตำแหน่ง',
        'access-level-header': 'ระดับการเข้าถึง',
        'action-header': 'การกระทำ',
        'target-header': 'ที่กระทำ',
        'notes-header': 'หมายเหตุ',
        
        // Dropdown Options
        'all': 'ทั้งหมด',
        'doctor': 'แพทย์',
        'admin': 'ผู้ดูแลระบบ',
        'pharmacist': 'เภสัชกร',
        'lab-manager': 'ผู้จัดการแลป',
        'lab-assistant': 'ผู้ช่วยแลป',
        'bioinformatician': 'นักชีวสารสนเทศ',
        'user': 'ผู้ใช้'
    },
    en: {
        // Page Title and Navigation
        'admin-title': 'Admin',
        'user-list': 'User List',
        'system-usage': 'System Usage',
        'activity-log': 'General Settings',
        'logout': 'Logout',
        
        // Page Content
        'check-historical-edits': 'Check Historical Edits',
        'username': 'Username',
        'role': 'Role',
        'level': 'Level',
        'action': 'Action',
        'date': 'Date',
        'to': 'To',
        
        // Loading and Error States
        'loading-logs': 'Loading system usage data...',
        'error-loading-logs': 'Unable to load system usage data',
        'try-again': 'Try Again',
        'no-logs-found': 'No Log Found',
        'no-logs-description': 'No activity logs have been recorded in the system yet',
        'no-results-found': 'No Data Found Matching Criteria',
        'try-different-criteria': 'Try changing your search criteria',
        'clear-filters': 'Clear Filters',
        
        // Alert Messages
        'data-loaded-success': 'System usage data loaded successfully',
        'filters-cleared': 'Filters cleared successfully',
        'connection-error': 'Error connecting to database',
        'logout-confirm': 'Are you sure you want to logout?',
        
        // Table Headers
        'date-header': 'Date',
        'time-header': 'Time',
        'user-name-header': 'User Name',
        'position-header': 'Position',
        'access-level-header': 'Access Level',
        'action-header': 'Action',
        'target-header': 'Target',
        'notes-header': 'Notes',
        
        // Dropdown Options
        'all': 'All',
        'doctor': 'Doctor',
        'admin': 'Administrator',
        'pharmacist': 'Pharmacist',
        'lab-manager': 'Lab Manager',
        'lab-assistant': 'Lab Assistant',
        'bioinformatician': 'Bioinformatician',
        'user': 'User'
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

// Logout functionality
function logout() {
    try {
        sessionStorage.clear();
        localStorage.removeItem('user');
        console.log('Admin logged out successfully');
        window.location.href = './login.html';
    } catch (error) {
        console.error('Error during logout:', error);
        window.location.href = './login.html';
    }
}

// Initialize logout button
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showConfirmAlert(
                'logout-confirm',
                () => logout(),
                () => {} // Do nothing on cancel
            );
        });
    }
}

// Custom confirmation alert
function showConfirmAlert(messageKey, onConfirm, onCancel) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const translatedMessage = translate(messageKey);
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="modal-button cancel-button" id="cancelBtn">
                    ${currentLanguage === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button class="modal-button confirm-button error" id="confirmBtn" autofocus>
                    ${currentLanguage === 'th' ? 'ตกลง' : 'OK'}
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
    
    // Initialize modal styles
    if (auditLogManager) {
        auditLogManager.initializeModalStyles();
    }
}

// Audit Log Management Class
class AuditLogManager {
    constructor() {
        this.apiUrl = this.getApiUrl();
        this.allLogs = [];
        this.init();
    }

    getApiUrl() {
        return window.location.protocol === 'file:' 
            ? 'http://localhost:3000/api' 
            : '/api';
    }

    async init() {
        this.setupFilterEventListeners();
        await this.loadAuditLogs();
    }

    setupFilterEventListeners() {
        // Username filter
        const usernameFilter = document.querySelector('.f-name input');
        if (usernameFilter) {
            usernameFilter.addEventListener('input', () => this.applyFilters());
        }

        // Role filter
        const roleFilter = document.querySelector('.f-role select');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.applyFilters());
        }

        // Level filter
        const levelFilter = document.querySelector('.f-level select');
        if (levelFilter) {
            levelFilter.addEventListener('change', () => this.applyFilters());
        }

        // Action filter
        const actionFilter = document.querySelector('.f-action select');
        if (actionFilter) {
            actionFilter.addEventListener('change', () => this.applyFilters());
        }

        // Date filters
        const dateFromFilter = document.querySelector('.f-date input');
        const dateToFilter = document.querySelector('.f-date-to input');
        if (dateFromFilter) {
            dateFromFilter.addEventListener('change', () => this.applyFilters());
        }
        if (dateToFilter) {
            dateToFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    async loadAuditLogs() {
        try {
            this.showLoadingState();

            const response = await fetch(`${this.apiUrl}/audit-logs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📊 Loaded audit logs from database:', result);
            
            // Check if response indicates no logs found
            if (result.message === 'no log found' || result.count === 0) {
                console.log('📋 No audit logs found');
                this.allLogs = [];
                this.showEmptyState();
                return;
            }
            
            // Handle both array response and object response with logs array
            const logs = Array.isArray(result) ? result : (result.logs || []);
            
            this.allLogs = logs;
            this.displayLogs(logs);
            
            // Show success alert if data was loaded
            if (logs && logs.length > 0) {
                this.showAlert('data-loaded-success', 'success');
            }
            
        } catch (error) {
            console.error('❌ Error loading audit logs:', error);
            this.showErrorState(error.message);
            this.showAlert('connection-error', 'error');
        }
    }

    showLoadingState() {
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="loadingRow">
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="loading-spinner">
                            <div class="spinner-icon">⏳</div>
                            <div class="loading-text">${translate('loading-logs') || 'กำลังโหลดข้อมูลการใช้งาน...'}</div>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showErrorState(errorMessage) {
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="errorRow">
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="error-state">
                            <div class="error-icon">❌</div>
                            <div class="error-message">${translate('error-loading-logs') || 'ไม่สามารถโหลดข้อมูลการใช้งานได้'}</div>
                            <div class="error-details">${errorMessage}</div>
                            <button class="btn-retry" onclick="auditLogManager.loadAuditLogs()" style="margin-top: 15px; padding: 8px 16px; background: #4f7fdc; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                ${translate('try-again') || 'ลองใหม่'}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showEmptyState() {
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="emptyRow">
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-icon" style="font-size: 48px; margin-bottom: 15px;">📋</div>
                            <div class="empty-message" style="font-size: 18px; color: #666; margin-bottom: 10px;">
                                ${translate('no-logs-found') || 'No Log Found'}
                            </div>
                            <div class="empty-description" style="font-size: 14px; color: #888;">
                                ${translate('no-logs-description') || 'ยังไม่มีการบันทึกกิจกรรมการใช้งานในระบบ'}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showNoResultsState() {
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="noResultsRow">
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div class="no-results-state">
                            <div class="no-results-icon" style="font-size: 48px; margin-bottom: 15px;">🔍</div>
                            <div class="no-results-message" style="font-size: 18px; color: #666; margin-bottom: 10px;">
                                ${translate('no-results-found') || 'ไม่พบข้อมูลตามเงื่อนไขที่ระบุ'}
                            </div>
                            <div class="no-results-suggestion" style="font-size: 14px; color: #888; margin-bottom: 15px;">
                                ${translate('try-different-criteria') || 'ลองเปลี่ยนเงื่อนไขการค้นหา'}
                            </div>
                            <button class="btn-clear-filters" onclick="auditLogManager.clearFilters()" 
                                style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                ${translate('clear-filters') || 'ล้างตัวกรอง'}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    displayLogs(logs) {
        const tbody = document.querySelector('.table tbody');
        if (!tbody) return;

        if (!logs || logs.length === 0) {
            this.showEmptyState();
            return;
        }

        tbody.innerHTML = logs.map(log => `
            <tr>
                <td class="center">${this.formatDate(log.Timestamp)}</td>
                <td class="center">${this.formatTime(log.Timestamp)}</td>
                <td>${this.escapeHtml(log.user_fullname || log.EmployeeID || 'ไม่ทราบชื่อ')}</td>
                <td>${this.escapeHtml(log.user_role || 'ไม่ระบุ')}</td>
                <td>${this.escapeHtml(log.user_access || 'ไม่ระบุ')}</td>
                <td>${this.escapeHtml(log.Action || 'ไม่ระบุ')}</td>
                <td>${this.escapeHtml(log.Place || 'ไม่ระบุ')}</td>
                <td>${this.escapeHtml(log.Description || '')}</td>
            </tr>
        `).join('');

        console.log(`✅ Displayed ${logs.length} audit logs in table`);
    }

    applyFilters() {
        if (!this.allLogs || this.allLogs.length === 0) {
            return;
        }

        const usernameFilter = document.querySelector('.f-name input');
        const roleFilter = document.querySelector('.f-role select');
        const levelFilter = document.querySelector('.f-level select');
        const actionFilter = document.querySelector('.f-action select');
        const dateFromFilter = document.querySelector('.f-date input');
        const dateToFilter = document.querySelector('.f-date-to input');

        const usernameValue = usernameFilter ? usernameFilter.value.toLowerCase().trim() : '';
        const roleValue = roleFilter ? roleFilter.value : '';
        const levelValue = levelFilter ? levelFilter.value : '';
        const actionValue = actionFilter ? actionFilter.value : '';
        const dateFromValue = dateFromFilter ? dateFromFilter.value : '';
        const dateToValue = dateToFilter ? dateToFilter.value : '';

        let filteredLogs = this.allLogs;

        // Apply username filter
        if (usernameValue) {
            filteredLogs = filteredLogs.filter(log => {
                const fullName = (log.user_fullname || log.EmployeeID || '').toLowerCase();
                return fullName.includes(usernameValue);
            });
        }

        // Apply role filter
        if (roleValue && roleValue !== 'ทั้งหมด' && roleValue !== 'All') {
            filteredLogs = filteredLogs.filter(log => log.user_role === roleValue);
        }

        // Apply level filter
        if (levelValue && levelValue !== 'ทั้งหมด' && levelValue !== 'All') {
            filteredLogs = filteredLogs.filter(log => log.user_access === levelValue);
        }

        // Apply action filter
        if (actionValue && actionValue !== 'ทั้งหมด' && actionValue !== 'All') {
            filteredLogs = filteredLogs.filter(log => log.Action === actionValue);
        }

        // Apply date filters
        if (dateFromValue) {
            const fromDate = new Date(dateFromValue);
            filteredLogs = filteredLogs.filter(log => {
                const logDate = new Date(log.Timestamp);
                return logDate >= fromDate;
            });
        }

        if (dateToValue) {
            const toDate = new Date(dateToValue + 'T23:59:59');
            filteredLogs = filteredLogs.filter(log => {
                const logDate = new Date(log.Timestamp);
                return logDate <= toDate;
            });
        }

        // Display filtered results
        if (filteredLogs.length === 0) {
            this.showNoResultsState();
        } else {
            this.displayLogs(filteredLogs);
        }
    }

    clearFilters() {
        // Clear all filter inputs
        const usernameFilter = document.querySelector('.f-name input');
        const roleFilter = document.querySelector('.f-role select');
        const levelFilter = document.querySelector('.f-level select');
        const actionFilter = document.querySelector('.f-action select');
        const dateFromFilter = document.querySelector('.f-date input');
        const dateToFilter = document.querySelector('.f-date-to input');

        if (usernameFilter) usernameFilter.value = '';
        if (roleFilter) roleFilter.value = '';
        if (levelFilter) levelFilter.value = '';
        if (actionFilter) actionFilter.value = '';
        if (dateFromFilter) dateFromFilter.value = '';
        if (dateToFilter) dateToFilter.value = '';

        // Show all logs
        this.displayLogs(this.allLogs);
        this.showAlert('filters-cleared', 'success');
    }

    showAlert(message, type = 'info', callback = null) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Translate the message if needed
        const translatedMessage = this.translateMessage(message);
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        // Determine if it's an error type
        const isError = (type === 'error');
        
        modal.innerHTML = `
            <div class="modal-content">
                <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
                <button class="modal-button ${isError ? 'error' : ''}" autofocus>
                    ${currentLanguage === 'th' ? 'ตกลง' : 'OK'}
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
        
        // Focus the button
        setTimeout(() => {
            button.focus();
        }, 100);
        
        // Initialize modal styles if not present
        this.initializeModalStyles();
    }

    translateMessage(message) {
        // Use the translations object instead of hardcoded messages
        return translate(message) || message;
    }

    initializeModalStyles() {
        if (!document.getElementById('adminUsageModalStyles')) {
            const style = document.createElement('style');
            style.id = 'adminUsageModalStyles';
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
                }
                
                .modal-content {
                    background: white;
                    padding: 20px 30px;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 450px;
                    min-width: 300px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .modal-button {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 15px;
                    font-size: 14px;
                    min-width: 80px;
                }
                
                .modal-button:hover {
                    background: #45a049;
                }
                
                .modal-button.error {
                    background: #f44336;
                }
                
                .modal-button.error:hover {
                    background: #da190b;
                }
                
                .modal-button.cancel-button {
                    background: #6c757d;
                }
                
                .modal-button.cancel-button:hover {
                    background: #5a6268;
                }
                
                .modal-button.confirm-button {
                    background: #4CAF50;
                }
                
                .modal-button.confirm-button:hover {
                    background: #45a049;
                }
                
                .modal-button.confirm-button.error {
                    background: #f44336;
                }
                
                .modal-button.confirm-button.error:hover {
                    background: #da190b;
                }
            `;
            document.head.appendChild(style);
        }
    }

    formatDate(timestamp) {
        if (!timestamp) return 'ไม่ระบุ';
        
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return 'ไม่ระบุ';
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = (date.getFullYear() + 543).toString().slice(-2); // Buddhist year
            
            return `${day}/${month}/${year}`;
        } catch {
            return 'ไม่ระบุ';
        }
    }

    formatTime(timestamp) {
        if (!timestamp) return 'ไม่ระบุ';
        
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return 'ไม่ระบุ';
            
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${hours}:${minutes}`;
        } catch {
            return 'ไม่ระบุ';
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize audit log manager
let auditLogManager;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageToggle();
    initializeLogout();
    
    // Initialize audit log functionality
    auditLogManager = new AuditLogManager();
    
    console.log('Admin Using the System page initialized');
});