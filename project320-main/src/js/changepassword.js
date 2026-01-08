// Translation system
const translations = {
    th: {
        // Form elements
        'change-password-title': 'เปลี่ยนรหัสผ่าน',
        'new-password-label': 'รหัสผ่านใหม่',
        'confirm-password-label': 'ยืนยันรหัสผ่าน',
        'change-password-button': 'เปลี่ยนรหัสผ่าน',
        
        // Modal button
        'ok-button': 'ตกลง',
        
        // Messages
        'change-password-for': 'เปลี่ยนรหัสผ่านสำหรับ:',
        'email': 'อีเมล:',
        'unauthorized-access': 'การเข้าถึงที่ไม่ได้รับอนุญาต กรุณาเริ่มใหม่จากหน้าลืมรหัสผ่าน',
        'please-fill-all-fields': 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        'password-min-length': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        'passwords-not-match': 'รหัสผ่านไม่ตรงกัน',
        'changing': 'กำลังเปลี่ยน...',
        'change-success': 'เปลี่ยนสำเร็จ!',
        'change-failed': 'การเปลี่ยนรหัสผ่านล้มเหลว',
        'password-changed-success': 'รหัสผ่านเปลี่ยนสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่',
        'server-error': 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง',
        
        // Server message translations
        'User not found': 'ไม่พบผู้ใช้งาน',
        'Password update failed': 'การอัปเดตรหัสผ่านล้มเหลว',
        'Server error': 'เซิร์ฟเวอร์ขัดข้อง'
    },
    en: {
        // Form elements
        'change-password-title': 'Change Password',
        'new-password-label': 'New Password',
        'confirm-password-label': 'Confirm Password',
        'change-password-button': 'Change Password',
        
        // Modal button
        'ok-button': 'OK',
        
        // Messages
        'change-password-for': 'Change password for:',
        'email': 'Email:',
        'unauthorized-access': 'Unauthorized access. Please start over from forgot password page.',
        'please-fill-all-fields': 'Please fill in all fields.',
        'password-min-length': 'Password must be at least 6 characters long.',
        'passwords-not-match': 'Passwords do not match.',
        'changing': 'Changing...',
        'change-success': 'Changed successfully!',
        'change-failed': 'Password change failed.',
        'password-changed-success': 'Password changed successfully! Please login with your new password.',
        'server-error': 'Server error. Please try again later.',
        
        // Server message translations
        'User not found': 'User not found',
        'Password update failed': 'Password update failed',
        'Server error': 'Server error'
    }
};

let currentLanguage = localStorage.getItem('preferredLanguage') || 'th';

// Initialize translation system
function initializeTranslations() {
    // Set initial toggle state
    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
        langSwitch.classList.remove('en', 'th');
        langSwitch.classList.add(currentLanguage);
        
        // Update active states
        const options = langSwitch.querySelectorAll('.lang-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === currentLanguage) {
                option.classList.add('active');
            }
        });
    }
    
    // Apply translations
    updateTexts();
}

// Update all translatable text
function updateTexts() {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[currentLanguage][key];
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
    
    // Update user display if it exists
    const userDisplay = document.querySelector('.user-display');
    if (userDisplay) {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user.firstname && user.lastname && user.email) {
            userDisplay.innerHTML = `${translations[currentLanguage]['change-password-for']} <strong>${user.firstname} ${user.lastname}</strong><br>
                                   ${translations[currentLanguage]['email']} <strong>${user.email}</strong>`;
        }
    }
}

// Language toggle functionality
function setupLanguageToggle() {
    const langOptions = document.querySelectorAll('.lang-option');
    
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            if (newLang !== currentLanguage) {
                currentLanguage = newLang;
                localStorage.setItem('preferredLanguage', currentLanguage);
                
                // Update toggle appearance
                const langSwitch = document.querySelector('.lang-switch');
                langSwitch.classList.remove('en', 'th');
                langSwitch.classList.add(currentLanguage);
                
                // Update active states
                langOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Update all text
                updateTexts();
            }
        });
    });
}

// Translate server messages to current language
function translateServerMessage(serverMessage) {
    // Check if we have a direct translation for this server message
    if (translations[currentLanguage][serverMessage]) {
        return translations[currentLanguage][serverMessage];
    }
    
    // If no direct translation found, return the original message
    return serverMessage;
}

// Custom modal function to replace alert()
function showModal(message, isError = false, callback = null) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Translate the message if it's a server message
    const translatedMessage = translateServerMessage(message);
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p style="margin: 0 0 15px 0; font-size: 16px;">${translatedMessage}</p>
            <button class="modal-button ${isError ? 'error' : ''}" autofocus>
                ${translations[currentLanguage]['ok-button']}
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

// Display user info when page loads
document.addEventListener("DOMContentLoaded", function() {
    // Initialize translations first
    initializeTranslations();
    setupLanguageToggle();
    
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    
    if (!user.verified || !user.email || !user.otp) {
        showModal(translations[currentLanguage]['unauthorized-access'], true, function() {
            window.location.href = "./Forgotpassword.html";
        });
        return;
    }

    // Create and add user display element
    const userDisplay = document.createElement("p");
    userDisplay.className = "user-display";
    userDisplay.style.cssText = "text-align: center; color: #666; margin: 10px 0; font-size: 14px;";
    userDisplay.innerHTML = `${translations[currentLanguage]['change-password-for']} <strong>${user.firstname} ${user.lastname}</strong><br>
                           ${translations[currentLanguage]['email']} <strong>${user.email}</strong>`;
    
    // Insert after the h2 title
    const title = document.querySelector("h2.main");
    title.parentNode.insertBefore(userDisplay, title.nextSibling);
});

document.getElementById("ChangePasswordForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get user from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const newPassword = document.getElementById("newpassword").value.trim();
    const confirmPassword = document.getElementById("confirmpassword").value.trim();

    // Validation
    if (!user.verified || !user.email || !user.otp) {
        showModal(translations[currentLanguage]['unauthorized-access'], true, function() {
            window.location.href = "./Forgotpassword.html";
        });
        return;
    }

    // Check if session is not too old (15 minutes max)
    const sessionAge = Date.now() - (user.timestamp || 0);
    if (sessionAge > 15 * 60 * 1000) { // 15 minutes
        showModal(translations[currentLanguage]['unauthorized-access'], true, function() {
            window.location.href = "./Forgotpassword.html";
        });
        return;
    }

    if (!newPassword || !confirmPassword) {
        showModal(translations[currentLanguage]['please-fill-all-fields'], true);
        return;
    }

    if (newPassword.length < 6) {
        showModal(translations[currentLanguage]['password-min-length'], true);
        return;
    }

    if (newPassword !== confirmPassword) {
        showModal(translations[currentLanguage]['passwords-not-match'], true);
        return;
    }

    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span style="display: inline-flex; align-items: center;">
            <span style="
                width: 16px; 
                height: 16px; 
                border: 2px solid #ffffff; 
                border-top: 2px solid transparent; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
                margin-right: 8px;
            "></span>
            ${translations[currentLanguage]['changing']}
        </span>
    `;

    // Add CSS animation and modal styles if not already present
    if (!document.getElementById('loadingStyles')) {
        const style = document.createElement('style');
        style.id = 'loadingStyles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
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
                max-width: 400px;
                min-width: 250px;
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
        `;
        document.head.appendChild(style);
    }

    try {
        const response = await fetch(getApiUrl("/resetpassword"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                email: user.email,
                otp: user.otp, // Use stored OTP from verification
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center;">
                    <span style="color: #4CAF50; margin-right: 8px;">✓</span>
                    ${translations[currentLanguage]['change-success']}
                </span>
            `;

            // Clean up session storage
            sessionStorage.removeItem("user");

            // Show success modal
            showModal(translations[currentLanguage]['password-changed-success'], false, function() {
                window.location.href = "./login.html";
            });
        } else {
            // Password change failed - restore button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            showModal(data.message || translations[currentLanguage]['change-failed'], true);
        }
    } catch (err) {
        console.error("Error:", err);
        
        // Restore button on error
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showModal(translations[currentLanguage]['server-error'], true);
    }
});
