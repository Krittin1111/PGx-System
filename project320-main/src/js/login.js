// Language Translation System
const translations = {
    th: {
        'login-title': 'เข้าสู่ระบบ',
        'email-label': 'อีเมล',
        'password-label': 'รหัสผ่าน',
        'email-placeholder': 'กรอกอีเมล',
        'password-placeholder': 'กรอกรหัสผ่าน',
        'login-button': 'เข้าสู่ระบบ',
        'forgot-password': 'ลืมรหัสผ่าน?',
        'please-enter-email-password': 'กรุณากรอกอีเมลและรหัสผ่าน',
        'login-failed': 'เข้าสู่ระบบไม่สำเร็จ',
        'server-error': 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
        'logging-in': 'กำลังเข้าสู่ระบบ...',
        'login-success': 'เข้าสู่ระบบสำเร็จ!',
        'ok-button': 'ตกลง',
        // Server message translations
        'User not found': 'ไม่พบผู้ใช้งาน',
        'Invalid password': 'รหัสผ่านไม่ถูกต้อง',
        'Server error': 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
    },
    en: {
        'login-title': 'Login',
        'email-label': 'Email',
        'password-label': 'Password',
        'email-placeholder': 'Enter your email',
        'password-placeholder': 'Enter your password',
        'login-button': 'Login',
        'forgot-password': 'Forgot Password?',
        'please-enter-email-password': 'Please enter email and password.',
        'login-failed': 'Login failed.',
        'server-error': 'Server error. Please try again later.',
        'logging-in': 'Logging in...',
        'login-success': 'Login successful!',
        'ok-button': 'OK',
        // Server message translations
        'User not found': 'User not found',
        'Invalid password': 'Invalid password',
        'Server error': 'Server error'
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

    updateActiveLanguageOption();
}

function updateActiveLanguageOption() {
    updateSwitchPosition(currentLanguage);
}

function translate(key) {
    return translations[currentLanguage][key] || key;
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
            <p style="margin: 0 0px 15px 0; font-size: 16px;">${translatedMessage}</p>
            <button class="modal-button ${isError ? 'error' : ''}" autofocus>
                ${translate('ok-button')}
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

// Initialize language toggle when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageToggle();
});

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showModal(translate('please-enter-email-password'), true);
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
${translate('logging-in')}
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
        const response = await fetch(getApiUrl("/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center;">
                    <span style="color: #4CAF50; margin-right: 8px;">✓</span>
${translate('login-success')}
                </span>
            `;

            // Store full user info in sessionStorage
            sessionStorage.setItem("user", JSON.stringify(data.user));

            // Optional: debug
            console.log("Logged in user:", data.user);

            // Check if user is admin and redirect accordingly
            setTimeout(() => {
                if (data.user.role === "Admin") {
                    console.log("Admin user detected, redirecting to Admin.html");
                    window.location.href = "./Admin.html";
                } else {
                    console.log("Regular user, redirecting to home.html");
                    window.location.href = "./Main.html";
                }
            }, 1000);
        } else {
            // Login failed - restore button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            showModal(data.message || translate('login-failed'), true);
        }
    } catch (err) {
        console.error("Error:", err);
        
        // Restore button on error
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showModal(translate('server-error'), true);
    }
});
