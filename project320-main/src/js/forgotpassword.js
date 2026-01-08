// Translation system
const translations = {
    th: {
        // Form elements
        'forgot-password-title': 'ลืมรหัสผ่าน',
        'email-label': 'อีเมล',
        'send-otp-button': 'ส่งรหัส OTP',
        
        // Modal button
        'ok-button': 'ตกลง',
        
        // Messages
        'please-enter-email': 'กรุณากรอกอีเมล',
        'sending': 'กำลังส่ง...',
        'sent-success': 'ส่งสำเร็จ!',
        'request-failed': 'การร้องขอล้มเหลว',
        'server-error': 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง',
        
        // Server message translations
        'User not found': 'ไม่พบผู้ใช้งาน',
        'Invalid email': 'อีเมลไม่ถูกต้อง',
        'Server error': 'เซิร์ฟเวอร์ขัดข้อง'
    },
    en: {
        // Form elements
        'forgot-password-title': 'Forgot Password',
        'email-label': 'Email',
        'send-otp-button': 'Send OTP',
        
        // Modal button
        'ok-button': 'OK',
        
        // Messages
        'please-enter-email': 'Please enter your email.',
        'sending': 'Sending...',
        'sent-success': 'Sent successfully!',
        'request-failed': 'Request failed.',
        'server-error': 'Server error. Please try again later.',
        
        // Server message translations
        'User not found': 'User not found',
        'Invalid email': 'Invalid email',
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTranslations();
    setupLanguageToggle();
});

document.getElementById("forgotPasswordForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    if (!email) {
        showModal(translations[currentLanguage]['please-enter-email'], true);
        return;
    }

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
            ${translations[currentLanguage]['sending']}
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
        const response = await fetch(getApiUrl("/requestotp"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store email in sessionStorage
            sessionStorage.setItem("email", email);

            // Show success message briefly
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center;">
                    <span style="color: #4CAF50; margin-right: 8px;">✓</span>
                    ${translations[currentLanguage]['sent-success']}
                </span>
            `;

            // Optional: debug
            console.log("Requested OTP for email:", email);

            // Redirect to OTP page after brief delay
            setTimeout(() => {
                window.location.href = "./OTP.html";
            }, 1000);
        } else {
            // Request failed - restore button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            showModal(data.message || translations[currentLanguage]['request-failed'], true);
        }
    } catch (err) {
        console.error("Error:", err);
        
        // Restore button on error
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showModal(translations[currentLanguage]['server-error'], true);
    }
});
