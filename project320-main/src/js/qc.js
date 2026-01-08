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

document.addEventListener("DOMContentLoaded", function () {
  // Add modal styles
  addModalStyles();
  
  // Initialize language and user functionality
  initializeLanguageToggle();
  loadUserInfo();
  initializeLogout();

  // --- Modal ทั้งหมด ---
  const modals = {
    detail: document.getElementById("qcModal"),
    iqc: document.getElementById("addIQCModal"),
    eqc: document.getElementById("addEQCModal"),
    inter: document.getElementById("addInterLabModal")
  };

  // 🔹 ปิด modal
  document.querySelectorAll(".close, .cancel").forEach(btn => {
    btn.addEventListener("click", e => {
      const modal = e.target.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  // ------------------------------------------------------
  // 🧾 เปิด modal แสดงรายละเอียด
  let currentRow = null;
  document.addEventListener("click", e => {
    if (e.target.classList.contains("view-detail")) {
      currentRow = e.target.closest(".qc-row");
      const data = currentRow.dataset;

      // แสดงข้อมูลใน Modal
      document.getElementById("modal-type").textContent = data.type;
      document.getElementById("modal-datetime").textContent = data.datetime;
      document.getElementById("modal-inspector").textContent = data.inspector || "-";
      document.getElementById("modal-sample").textContent = data.sample || "-";
      document.getElementById("modal-result").textContent = data.result;
      document.getElementById("modal-comment").textContent = data.comment || "-";
      document.getElementById("modal-file").textContent = data.file || "ไม่มีไฟล์";

      modals.detail.style.display = "block";
      toggleEditMode(false);
    }
  });

  // ------------------------------------------------------
  // 🧪 เปิดแต่ละ Modal
  const openModal = (selector, modal) => {
    const btn = document.querySelector(selector);
    if (btn && modal) {
      btn.addEventListener("click", () => (modal.style.display = "block"));
    }
  };
  openModal(".btn.iqc", modals.iqc);
  openModal(".btn.eqc", modals.eqc);
  openModal(".btn.interlab", modals.inter);

  // ------------------------------------------------------
  // 💾 ฟังก์ชันบันทึกผล (จำลอง backend + เพิ่มแถว)
  const handleSave = (idMap, typeLabel) => {
    const values = {};
    Object.entries(idMap).forEach(([key, id]) => {
      const el = document.getElementById(id);
      values[key] =
        el?.type === "file"
          ? el.files[0]?.name || "ไม่มีไฟล์"
          : el?.value || "";
    });

    console.log(`บันทึก ${typeLabel}:`, values);
    alert(`บันทึกผล ${typeLabel} เรียบร้อยแล้ว!`);

    // ✅ เพิ่มแถวใหม่ในหน้า (เฉพาะถ้าไม่ใช่ฝั่ง backend)
    const table = document.querySelector(".qc-list");
    if (table) {
      const newRow = document.createElement("div");
      newRow.className = "qc-row";
      newRow.dataset = { ...values, type: typeLabel };
      newRow.dataset.type = typeLabel;
      Object.entries(values).forEach(([k, v]) => (newRow.dataset[k] = v));

      newRow.innerHTML = `
        <div>${typeLabel}</div>
        <div>${values.datetime}</div>
        <div>${values.sample}</div>
        <div>${values.result}</div>
        <div>${values.inspector || values.lab || "-"}</div>
        <button class="view-detail">ดูรายละเอียด</button>
      `;
      table.appendChild(newRow);
    }

    // ปิด modal
    const modal = Object.values(modals).find(m =>
      m.contains(document.getElementById(Object.values(idMap)[0]))
    );
    if (modal) modal.style.display = "none";
  };

  // ✅ บันทึกปุ่มทั้งหมด
  document.getElementById("saveIQC")?.addEventListener("click", () =>
    handleSave(
      {
        datetime: "iqc-datetime",
        sample: "iqc-sample",
        inspector: "iqc-inspector",
        type: "iqc-type",
        result: "iqc-result",
        comment: "iqc-comment",
        file: "iqc-file"
      },
      "IQC"
    )
  );

  document.getElementById("saveEQC")?.addEventListener("click", () =>
    handleSave(
      {
        datetime: "eqc-datetime",
        sample: "eqc-sample",
        lab: "eqc-lab",
        result: "eqc-result",
        comment: "eqc-comment",
        file: "eqc-file"
      },
      "EQC"
    )
  );

  document.getElementById("saveInterLab")?.addEventListener("click", () =>
    handleSave(
      {
        datetime: "interlab-datetime",
        sample: "interlab-sample",
        lab: "interlab-lab",
        result: "interlab-result",
        comment: "interlab-comment",
        file: "interlab-file"
      },
      "Inter-Lab"
    )
  );

  // ------------------------------------------------------
  // ✏️ แก้ไข / ลบ ใน Modal รายละเอียด
  const modalDetail = modals.detail;
  const editBtn = modalDetail.querySelector(".edit-btn");
  const saveEditBtn = modalDetail.querySelector(".save-edit-btn");
  const deleteBtn = modalDetail.querySelector(".delete-btn");

  function toggleEditMode(enable) {
    const map = {
      "modal-datetime": "date",
      "modal-result": "select",
      "modal-file": "file"
    };

    const fields = [
      "modal-datetime",
      "modal-inspector",
      "modal-sample",
      "modal-result",
      "modal-comment",
      "modal-file"
    ];

    fields.forEach(id => {
      const el = document.getElementById(id);
      const type = map[id] || "text";

      if (enable) {
        let input;
        if (type === "select") {
          input = document.createElement("select");
          ["ผ่าน", "ไม่ผ่าน"].forEach(opt => {
            const o = document.createElement("option");
            o.value = opt;
            o.textContent = opt;
            if (opt === el.textContent) o.selected = true;
            input.appendChild(o);
          });
        } else if (type === "file") {
          input = document.createElement("div");
          input.innerHTML = `
            <span>${el.textContent}</span>
            <button class="remove-file">ลบ</button>
            <input type="file" style="display:none;">
            <button class="add-file">เพิ่มไฟล์ใหม่</button>
          `;
          input.classList.add("file-field");
        } else {
          input = document.createElement("input");
          input.type = type === "date" ? "date" : "text";
          input.value = el.textContent;
        }
        input.classList.add("edit-input");
        input.id = id;
        el.replaceWith(input);
      } else if (!enable && el.tagName !== "SPAN") {
        const span = document.createElement("span");
        span.id = id;
        if (el.tagName === "SELECT") {
          span.textContent = el.value;
        } else if (el.classList.contains("file-field")) {
          const fileName = el.querySelector("span")?.textContent || "ไม่มีไฟล์";
          span.textContent = fileName;
        } else {
          span.textContent = el.value;
        }
        el.replaceWith(span);
      }
    });

    editBtn.style.display = enable ? "none" : "inline-block";
    saveEditBtn.style.display = enable ? "inline-block" : "none";
  }

  // Event: ลบไฟล์ / เพิ่มไฟล์ในโหมดแก้ไข
  document.addEventListener("click", e => {
    if (e.target.classList.contains("remove-file")) {
      e.target.parentElement.querySelector("span").textContent = "ไม่มีไฟล์";
    } else if (e.target.classList.contains("add-file")) {
      e.target.previousElementSibling.click();
      e.target.previousElementSibling.onchange = ev => {
        const file = ev.target.files[0];
        if (file)
          e.target.parentElement.querySelector("span").textContent = file.name;
      };
    }
  });

  editBtn?.addEventListener("click", () => toggleEditMode(true));

  saveEditBtn?.addEventListener("click", () => {
    const newValues = {};
    ["datetime", "inspector", "sample", "result", "comment", "file"].forEach(
      k => {
        const el = document.getElementById(`modal-${k}`);
        newValues[k] =
          el.tagName === "SPAN"
            ? el.textContent
            : el.value || el.querySelector("span")?.textContent || "";
      }
    );

    Object.entries(newValues).forEach(([key, val]) => {
      currentRow.dataset[key] = val;
    });

    toggleEditMode(false);
    alert("แก้ไขข้อมูลเรียบร้อยแล้ว!");
  });

  deleteBtn?.addEventListener("click", () => {
    if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      currentRow.remove();
      modalDetail.style.display = "none";
      alert("ลบข้อมูลเรียบร้อยแล้ว!");
    }
  });
});
