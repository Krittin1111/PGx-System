// Admin Certificate Settings Page Language Support
class AdminCertSettings {
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
        // Initialize language manager with page-specific translations
        this.initializeLanguageSystem();
        this.setupEventListeners();
        this.setupLanguageToggle();
    }

    initializeLanguageSystem() {
        // Page-specific translations that extend the shared ones
        const pageTranslations = {
            th: {
                // Certificate Management
                'certificate-settings': 'การตั้งค่าใบรับรอง',
                'certificate-standard': 'มาตรฐานใบรับรอง',
                'add-new-certificate': 'เพิ่มใบรับรองใหม่',
                'edit-certificate': 'แก้ไขใบรับรอง',
                
                // Table Headers
                'certificate': 'ใบรับรอง',
                'certificate-number': 'เลขที่ใบรับรอง',
                'certification-authority': 'หน่วยงานรับรอง',
                'issue-date': 'วันที่ออก',
                'expiry-date': 'วันหมดอายุ',
                'status': 'สถานะ',
                'actions': 'จัดการ',
                
                // Form Fields
                'standard': 'มาตรฐาน (Standard)',
                'upload-authority-logo': 'อัปโหลดโลโก้หน่วยงาน',
                
                // Status
                'status-normal': 'ปกติ',
                'status-expired': 'หมดอายุ',
                'status-expiring-soon': 'ใกล้หมดอายุ',
                
                // Placeholders
                'search-placeholder': 'ค้นหา...',
                'enter-standard': 'ระบุมาตรฐาน',
                'enter-certificate-number': 'พิมพ์เลขที่ใบรับรอง',
                'enter-authority': 'ระบุหน่วยงานที่รับรอง',
                
                // Messages
                'certificate-saved': 'บันทึกใบรับรองสำเร็จ',
                'certificate-deleted': 'ลบใบรับรองสำเร็จ',
                'confirm-delete-certificate': 'คุณต้องการลบใบรับรองนี้หรือไม่?',
                
                // Navigation
                'back-button': 'ย้อนกลับ',
                'back-to-general-settings': 'กลับไปที่การตั้งค่าทั่วไป'
            },
            en: {
                // Certificate Management
                'certificate-settings': 'Certificate Settings',
                'certificate-standard': 'Certificate Standard',
                'add-new-certificate': 'Add New Certificate',
                'edit-certificate': 'Edit Certificate',
                
                // Table Headers
                'certificate': 'Certificate',
                'certificate-number': 'Certificate Number',
                'certification-authority': 'Certification Authority',
                'issue-date': 'Issue Date',
                'expiry-date': 'Expiry Date',
                'status': 'Status',
                'actions': 'Actions',
                
                // Form Fields
                'standard': 'Standard',
                'upload-authority-logo': 'Upload Authority Logo',
                
                // Status
                'status-normal': 'Normal',
                'status-expired': 'Expired',
                'status-expiring-soon': 'Expiring Soon',
                
                // Placeholders
                'search-placeholder': 'Search...',
                'enter-standard': 'Enter standard',
                'enter-certificate-number': 'Enter certificate number',
                'enter-authority': 'Enter certification authority',
                
                // Messages
                'certificate-saved': 'Certificate saved successfully',
                'certificate-deleted': 'Certificate deleted successfully',
                'confirm-delete-certificate': 'Are you sure you want to delete this certificate?',
                
                // Navigation
                'back-button': 'Back',
                'back-to-general-settings': 'Back to General Settings'
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
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Certificate modal events (preserve existing functionality)
        this.setupCertificateModal();
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

        // Update modal title based on current context
        this.updateModalTitle();
    }

    updateModalTitle() {
        const dialogTitle = document.getElementById('certDialogTitle');
        if (dialogTitle && this.languageManager) {
            const isEditing = dialogTitle.textContent.includes('แก้ไข') || dialogTitle.textContent.includes('Edit');
            const key = isEditing ? 'edit-certificate' : 'add-new-certificate';
            dialogTitle.textContent = this.languageManager.getTranslation(key);
        }
    }

    setupCertificateModal() {
        // Preserve existing modal functionality but add language support
        const openBtn = document.getElementById('openCreate');
        const dialogTitle = document.getElementById('certDialogTitle');

        if (openBtn) {
            const originalClick = openBtn.onclick || (() => {});
            openBtn.addEventListener('click', () => {
                if (this.languageManager) {
                    dialogTitle.textContent = this.languageManager.getTranslation('add-new-certificate');
                }
                // Call original functionality if it exists
                if (typeof originalClick === 'function') {
                    originalClick();
                }
            });
        }

        // Update edit buttons to support translation
        document.querySelectorAll('.btnEditCert').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.languageManager) {
                    dialogTitle.textContent = this.languageManager.getTranslation('edit-certificate');
                }
            });
        });
    }

    handleLogout() {
        if (confirm(this.languageManager ? 
            this.languageManager.getTranslation('confirm-logout') : 
            'คุณต้องการออกจากระบบหรือไม่?')) {
            // Redirect to login page
            window.location.href = 'login.html';
        }
    }
}

// Initialize when DOM is ready
new AdminCertSettings();