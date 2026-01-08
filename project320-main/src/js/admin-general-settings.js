// Admin General Settings Page Language Support
class AdminGeneralSettings {
    constructor() {
        this.languageManager = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('AdminGeneralSettings setup called');
        console.log('Document ready state:', document.readyState);
        
        // Initialize language manager with page-specific translations
        this.initializeLanguageSystem();
        this.setupEventListeners();
        this.setupLanguageToggle();
        
        console.log('Setup completed');
    }

    initializeLanguageSystem() {
        // Page-specific translations that extend the shared ones
        const pageTranslations = {
            th: {
                // Logo settings
                'logo-settings': 'การตั้งค่าโลโก้',
                'current-logo': 'รูปภาพโลโก้ปัจจุบัน',
                'logo-size-hint': 'รูปภาพที่ใช้ควรมีขนาด XPixel × XPixel',
                'upload': 'อัปโหลด',

                // Certification
                'certification-standards': 'การรับรองมาตรฐาน',
                'view-details': 'ดูข้อมูล',

                // General
                'general-settings': 'การตั้งค่าทั่วไป'
            },
            en: {
                // Logo settings
                'logo-settings': 'Logo Settings',
                'current-logo': 'Current Logo Image',
                'logo-size-hint': 'Image should be XPixel × XPixel',
                'upload': 'Upload',

                // Certification
                'certification-standards': 'Certification Standards',
                'view-details': 'View Details',

                // General
                'general-settings': 'General Settings'
            }
        };

        // Initialize language manager
        if (typeof LanguageManager !== 'undefined') {
            this.languageManager = new LanguageManager(pageTranslations);
        } else {
            console.warn('LanguageManager not found. Language switching disabled.');
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        console.log('Logout button found:', logoutBtn);
        
        if (logoutBtn) {
            console.log('Adding click listener to logout button');
            logoutBtn.addEventListener('click', (e) => {
                console.log('Logout button clicked!');
                e.preventDefault();
                this.handleLogout();
            });
        } else {
            console.error('Logout button not found!');
        }

        // Upload button functionality
        const uploadBtn = document.querySelector('.btn-gray[data-translate="upload"]');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.handleLogoUpload();
            });
        }
    }

    setupLanguageToggle() {
        if (!this.languageManager) return;

        const languageSwitch = document.getElementById('languageSwitch');
        if (!languageSwitch) return;

        const leftOption = languageSwitch.querySelector('.lang-option.left');
        const rightOption = languageSwitch.querySelector('.lang-option.right');
        const slider = languageSwitch.querySelector('.switch-slider');

        // Set initial state
        const currentLang = this.languageManager.getCurrentLanguage();
        
        // Set initial class on the switch
        languageSwitch.className = `lang-switch ${currentLang}`;
        
        this.updateLanguageToggle(currentLang, leftOption, rightOption, slider);

        // Add click handlers
        leftOption.addEventListener('click', () => {
            this.languageManager.setLanguage('en');
            this.updateLanguageToggle('en', leftOption, rightOption, slider);
        });

        rightOption.addEventListener('click', () => {
            this.languageManager.setLanguage('th');
            this.updateLanguageToggle('th', leftOption, rightOption, slider);
        });
    }

    updateLanguageToggle(lang, leftOption, rightOption, slider) {
        // Update active states for lang options
        if (lang === 'en') {
            leftOption.classList.add('active');
            rightOption.classList.remove('active');
        } else {
            leftOption.classList.remove('active');
            rightOption.classList.add('active');
        }
        
        // Update slider position by changing the switch class
        const languageSwitch = document.getElementById('languageSwitch');
        if (languageSwitch) {
            languageSwitch.className = `lang-switch ${lang}`;
        }
    }

    handleLogout() {
        console.log('handleLogout called');
        
        // Use custom confirmation dialog
        this.showConfirmAlert(
            'confirm-logout',
            () => {
                console.log('User confirmed logout');
                // Clear session data and redirect to login page
                try {
                    sessionStorage.clear();
                    localStorage.removeItem('user');
                    console.log('Admin logged out successfully from General Settings');
                    window.location.href = 'login.html';
                } catch (error) {
                    console.error('Error during logout:', error);
                    window.location.href = 'login.html';
                }
            },
            () => {
                console.log('Logout cancelled');
            }
        );
    }

    // Custom confirmation alert matching other admin pages
    showConfirmAlert(messageKey, onConfirm, onCancel) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const translatedMessage = this.languageManager ? 
            this.languageManager.getTranslation(messageKey) : 
            'คุณต้องการออกจากระบบหรือไม่?';
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        const currentLang = this.languageManager ? 
            this.languageManager.getCurrentLanguage() : 'th';
        
        modal.innerHTML = `
            <div class="modal-content">
                <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="modal-button cancel-button" id="cancelBtn">
                        ${currentLang === 'th' ? 'ยกเลิก' : 'Cancel'}
                    </button>
                    <button class="modal-button confirm-button error" id="confirmBtn" autofocus>
                        ${currentLang === 'th' ? 'ตกลง' : 'OK'}
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
        this.initializeModalStyles();
    }

    // Custom alert system
    showAlert(message, type = 'info', callback = null) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Translate the message if needed
        const translatedMessage = this.languageManager ? 
            this.languageManager.getTranslation(message) || message : message;
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        // Determine if it's an error type
        const isError = (type === 'error');
        const currentLang = this.languageManager ? 
            this.languageManager.getCurrentLanguage() : 'th';
        
        modal.innerHTML = `
            <div class="modal-content">
                <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
                <button class="modal-button ${isError ? 'error' : ''}" autofocus>
                    ${currentLang === 'th' ? 'ตกลง' : 'OK'}
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

    initializeModalStyles() {
        if (!document.getElementById('adminGeneralModalStyles')) {
            const style = document.createElement('style');
            style.id = 'adminGeneralModalStyles';
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

    handleLogoUpload() {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Here you would typically upload the file to your server
                console.log('Logo file selected:', file.name);
                
                // Show success message
                const message = this.languageManager ? 
                    this.languageManager.getTranslation('logo-uploaded') || 'Logo uploaded successfully' :
                    'โลโก้ถูกอัปโหลดเรียบร้อยแล้ว';
                
                alert(message);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }
}

// Initialize when DOM is ready
new AdminGeneralSettings();

// Fallback direct event listener for logout button
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (logoutBtn && !logoutBtn.hasAttribute('data-listener-added')) {
            logoutBtn.setAttribute('data-listener-added', 'true');
            
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Use custom confirmation dialog
                const currentLang = localStorage.getItem('preferredLanguage') || 'th';
                const confirmMessage = currentLang === 'th' ? 
                    'คุณต้องการออกจากระบบหรือไม่?' : 
                    'Are you sure you want to logout?';
                
                showCustomConfirm(
                    confirmMessage,
                    function() {
                        try {
                            sessionStorage.clear();
                            localStorage.removeItem('user');
                            window.location.href = 'login.html';
                        } catch (error) {
                            console.error('Logout error:', error);
                            window.location.href = 'login.html';
                        }
                    },
                    function() {
                        // Logout cancelled - do nothing
                    }
                );
            });
        }
    }, 100);
});

// Custom confirmation dialog function
function showCustomConfirm(message, onConfirm, onCancel) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Get current language from localStorage or default to Thai
    const currentLang = localStorage.getItem('preferredLanguage') || 'th';
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <p style="margin: 0 0px 15px 0; font-size: 16px;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="modal-button cancel-button" id="cancelBtn">
                    ${currentLang === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button class="modal-button confirm-button error" id="confirmBtn" autofocus>
                    ${currentLang === 'th' ? 'ตกลง' : 'OK'}
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
    initializeCustomModalStyles();
}

// Initialize modal styles
function initializeCustomModalStyles() {
    if (!document.getElementById('customModalStyles')) {
        const style = document.createElement('style');
        style.id = 'customModalStyles';
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