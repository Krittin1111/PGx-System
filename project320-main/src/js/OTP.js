// Translation system
const translations = {
    th: {
        // Form elements
        'verify-otp-title': 'ยืนยันรหัส OTP',
        'otp-label': 'รหัส OTP',
        'verify-button': 'ยืนยัน',
        
        // Modal button
        'ok-button': 'ตกลง',
        
        // Messages
        'otp-sent-to': 'รหัส OTP ถูกส่งไปที่:',
        'session-expired': 'เซสชันหมดอายุ กรุณาเริ่มใหม่จากหน้าลืมรหัสผ่าน',
        'please-enter-otp': 'กรุณากรอกรหัส OTP',
        'verifying': 'กำลังตรวจสอบ...',
        'verification-success': 'ตรวจสอบสำเร็จ!',
        'verification-failed': 'การตรวจสอบ OTP ล้มเหลว',
        'server-error': 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง',
        
        // Server message translations
        'Invalid OTP': 'รหัส OTP ไม่ถูกต้อง',
        'OTP expired': 'รหัส OTP หมดอายุ',
        'OTP not found': 'ไม่พบรหัส OTP',
        'Server error': 'เซิร์ฟเวอร์ขัดข้อง'
    },
    en: {
        // Form elements
        'verify-otp-title': 'Verify OTP',
        'otp-label': 'OTP Code',
        'verify-button': 'Verify',
        
        // Modal button
        'ok-button': 'OK',
        
        // Messages
        'otp-sent-to': 'OTP sent to:',
        'session-expired': 'Session expired. Please start over from forgot password page.',
        'please-enter-otp': 'Please enter the OTP.',
        'verifying': 'Verifying...',
        'verification-success': 'Verification successful!',
        'verification-failed': 'OTP verification failed.',
        'server-error': 'Server error. Please try again later.',
        
        // Server message translations
        'Invalid OTP': 'Invalid OTP',
        'OTP expired': 'OTP expired',
        'OTP not found': 'OTP not found',
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
    
    // Update email display if it exists
    const emailDisplay = document.querySelector('.email-display');
    if (emailDisplay) {
        const email = sessionStorage.getItem("email");
        if (email) {
            emailDisplay.innerHTML = `${translations[currentLanguage]['otp-sent-to']} <strong>${email}</strong>`;
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

// Add modal styles
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

// Display email info when page loads
document.addEventListener("DOMContentLoaded", function() {
    // Initialize translations first
    initializeTranslations();
    setupLanguageToggle();
    
    const email = sessionStorage.getItem("email");
    if (email) {
        // Create and add email display element
        const emailDisplay = document.createElement("p");
        emailDisplay.className = "email-display";
        emailDisplay.style.cssText = "text-align: center; color: #666; margin: 10px 0; font-size: 14px;";
        emailDisplay.innerHTML = `${translations[currentLanguage]['otp-sent-to']} <strong>${email}</strong>`;
        
        // Insert after the h2 title
        const title = document.querySelector("h2.main");
        title.parentNode.insertBefore(emailDisplay, title.nextSibling);
    } else {
        // No email in session, redirect back
        showModal(translations[currentLanguage]['session-expired'], true, function() {
            window.location.href = "./Forgotpassword.html";
        });
    }
});

document.getElementById("OTPForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get email from sessionStorage (stored from forgot password page)
    const email = sessionStorage.getItem("email");
    const OTP = document.getElementById("OTP").value.trim();

    if (!email) {
        showModal(translations[currentLanguage]['session-expired'], true, function() {
            window.location.href = "./Forgotpassword.html";
        });
        return;
    }

    if (!OTP) {
        showModal(translations[currentLanguage]['please-enter-otp'], true);
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
            ${translations[currentLanguage]['verifying']}
        </span>
    `;

    // Add CSS animation if not already present
    if (!document.getElementById('loadingStyles')) {
        const style = document.createElement('style');
        style.id = 'loadingStyles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    try {
        const response = await fetch(getApiUrl("/verifyotp"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp: OTP }),
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center;">
                    <span style="color: #4CAF50; margin-right: 8px;">✓</span>
                    ${translations[currentLanguage]['verification-success']}
                </span>
            `;

            // Store user info with verification status and OTP for password reset
            const userData = {
                ...data.user,
                verified: true,
                email: email.trim(),
                otp: OTP,
                timestamp: Date.now() // For security, we can check if this is recent
            };
            sessionStorage.setItem("user", JSON.stringify(userData));
            
            // Clean up email from sessionStorage since OTP is verified
            sessionStorage.removeItem("email");

            // Optional: debug
            console.log("OTP verified for user:", data.user);

            // Redirect to change password page after brief delay
            setTimeout(() => {
                window.location.href = "./Changepassword.html";
            }, 1000);
        } else {
            // Verification failed - restore button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            showModal(data.message || translations[currentLanguage]['verification-failed'], true);
        }
    } catch (err) {
        console.error("Error:", err);
        
        // Restore button on error
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showModal(translations[currentLanguage]['server-error'], true);
    }
});
