// Admin Page JavaScript
class AdminPanel {
    constructor() {
        this.apiUrl = this.getApiUrl();
        this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
        this.init();
    }

    getApiUrl() {
        return window.location.protocol === 'file:' 
            ? 'http://localhost:3000/api' 
            : '/api';
    }

    async init() {
        this.setupEventListeners();
        this.initializeLanguageSystem();
        this.initializeModalStyles(); // Initialize custom modal styles
        await this.loadUsers();
        this.updateUserInfo();
    }

    setupEventListeners() {
        // Create Modal controls
        const openBtn = document.getElementById('openCreate');
        const createModal = document.getElementById('createModal');
        const closeCreateBtn = document.getElementById('closeCreate');
        
        if (openBtn) openBtn.addEventListener('click', () => this.openCreateModal());
        if (closeCreateBtn) closeCreateBtn.addEventListener('click', () => this.closeCreateModal());

        // Edit Modal controls
        const editModal = document.getElementById('editModal');
        const closeEditBtn = document.getElementById('closeEdit');
        const cancelEditBtn = document.getElementById('cancelEdit');
        const deleteUserBtn = document.getElementById('deleteUserBtn');
        
        if (closeEditBtn) closeEditBtn.addEventListener('click', () => this.closeEditModal());
        if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        if (deleteUserBtn) deleteUserBtn.addEventListener('click', () => this.handleDeleteFromModal());

        // Form submissions
        const createForm = createModal?.querySelector('form');
        const editForm = editModal?.querySelector('form');
        
        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreateUser(e));
        }
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditUser(e));
        }

        // Close modal on backdrop click
        if (createModal) {
            createModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    this.closeCreateModal();
                }
            });
        }
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    this.closeEditModal();
                }
            });
        }

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (createModal?.classList.contains('show')) {
                    this.closeCreateModal();
                } else if (editModal?.classList.contains('show')) {
                    this.closeEditModal();
                }
            }
        });

        // Language toggle functionality
        this.setupLanguageToggle();

        // Logout functionality
        const logoutBtn = document.querySelector('a[href="#"]:last-child');
        if (logoutBtn && logoutBtn.textContent.includes('ออกจากระบบ')) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Filter functionality
        this.setupFilterEventListeners();
    }

    setupFilterEventListeners() {
        // Username filter
        const usernameFilter = document.querySelector('.filters input[type="text"]');
        if (usernameFilter) {
            usernameFilter.addEventListener('input', () => this.applyFilters());
            // Add placeholder translation
            this.updateFilterPlaceholder(usernameFilter);
        }

        // Role filter dropdown
        const roleFilter = document.querySelector('.filters select');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    updateFilterPlaceholder(input) {
        const currentLang = localStorage.getItem('language') || 'th';
        const placeholder = currentLang === 'th' ? 'ค้นหาชื่อผู้ใช้...' : 'Search username...';
        input.placeholder = placeholder;
    }

    applyFilters() {
        if (!this.allUsers || this.allUsers.length === 0) {
            return;
        }

        const usernameFilter = document.querySelector('.filters input[type="text"]');
        const roleFilter = document.querySelector('.filters select');

        const usernameValue = usernameFilter ? usernameFilter.value.toLowerCase().trim() : '';
        const roleValue = roleFilter ? roleFilter.value : '';

        let filteredUsers = this.allUsers;

        // Apply username filter
        if (usernameValue) {
            filteredUsers = filteredUsers.filter(user => {
                const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
                const email = user.email.toLowerCase();
                return fullName.includes(usernameValue) || email.includes(usernameValue);
            });
        }

        // Apply role filter
        if (roleValue && roleValue.trim() !== '') {
            filteredUsers = filteredUsers.filter(user => user.role === roleValue);
        }

        // Display filtered results
        if (filteredUsers.length === 0) {
            this.showNoResultsState(usernameValue, roleValue);
        } else {
            this.displayUsers(filteredUsers);
        }
        
        // Update results count
        this.updateResultsCount(filteredUsers.length, this.allUsers.length);
    }

    updateResultsCount(filtered, total) {
        const cardTitle = document.querySelector('.card-title');
        if (cardTitle) {
            const currentLang = localStorage.getItem('language') || 'th';
            let countText;
            
            if (filtered === total) {
                countText = currentLang === 'th' 
                    ? `แสดงผู้ใช้ทั้งหมด ${total} คน`
                    : `Showing all ${total} users`;
            } else {
                countText = currentLang === 'th' 
                    ? `แสดง ${filtered} จาก ${total} ผู้ใช้`
                    : `Showing ${filtered} of ${total} users`;
            }
            
            // Find or create results counter
            let resultsCounter = cardTitle.querySelector('.results-count');
            if (!resultsCounter) {
                resultsCounter = document.createElement('span');
                resultsCounter.className = 'results-count';
                cardTitle.appendChild(resultsCounter);
            }
            resultsCounter.textContent = ` (${countText})`;
        }
    }

    async loadUsers() {
        try {
            // Show loading state
            this.showLoadingState();

            const response = await fetch(`${this.apiUrl}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const users = await response.json();
            console.log('📊 Loaded users from database:', users);
            
            // Store all users for filtering
            this.allUsers = users;
            
            this.displayUsers(users);
            this.updateResultsCount(users.length, users.length);
        } catch (error) {
            console.error('❌ Error loading users:', error);
            this.showErrorState(error.message);
        }
    }

    showLoadingState() {
        const tbody = document.getElementById('userTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="loadingRow">
                    <td colspan="7" style="text-align: center; padding: 20px;">
                        <div class="loading-spinner">
                            <div class="spinner-icon">⏳</div>
                            กำลังโหลดข้อมูลผู้ใช้...
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showErrorState(errorMessage) {
        const tbody = document.getElementById('userTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="errorRow">
                    <td colspan="7" style="text-align: center; padding: 20px;">
                        <div class="error-state">
                            <div class="error-icon">❌</div>
                            <div class="error-message">ไม่สามารถโหลดข้อมูลผู้ใช้ได้</div>
                            <div class="error-details">${errorMessage}</div>
                            <button class="btn-retry" onclick="adminPanel.loadUsers()">ลองใหม่</button>
                        </div>
                    </td>
                </tr>
            `;
        }
        this.showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล', 'error');
    }

    showEmptyState() {
        const tbody = document.getElementById('userTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr id="emptyRow">
                    <td colspan="7" style="text-align: center; padding: 20px;">
                        <div class="empty-state">
                            <div class="empty-icon">👥</div>
                            <div class="empty-message">ยังไม่มีผู้ใช้ในระบบ</div>
                            <button class="btn-outline" onclick="adminPanel.openCreateModal()">สร้างผู้ใช้แรก</button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showNoResultsState(searchTerm = '', roleFilter = '') {
        const tbody = document.getElementById('userTableBody');
        if (tbody) {
            const currentLang = localStorage.getItem('language') || 'th';
            
            let message = '';
            let suggestion = '';
            
            if (searchTerm && roleFilter) {
                message = currentLang === 'th' 
                    ? `ไม่พบผู้ใช้ที่มีชื่อ "${searchTerm}" และบทบาท "${roleFilter}"`
                    : `No users found with name "${searchTerm}" and role "${roleFilter}"`;
                suggestion = currentLang === 'th' 
                    ? 'ลองเปลี่ยนเงื่อนไขการค้นหา'
                    : 'Try changing your search criteria';
            } else if (searchTerm) {
                message = currentLang === 'th' 
                    ? `ไม่พบผู้ใช้ที่มีชื่อ "${searchTerm}"`
                    : `No users found with name "${searchTerm}"`;
                suggestion = currentLang === 'th' 
                    ? 'ลองค้นหาด้วยชื่ออื่น'
                    : 'Try searching with a different name';
            } else if (roleFilter) {
                message = currentLang === 'th' 
                    ? `ไม่พบผู้ใช้ที่มีบทบาท "${roleFilter}"`
                    : `No users found with role "${roleFilter}"`;
                suggestion = currentLang === 'th' 
                    ? 'ลองเลือกบทบาทอื่น'
                    : 'Try selecting a different role';
            } else {
                message = currentLang === 'th' 
                    ? 'ไม่พบผู้ใช้ตามเงื่อนไขที่ระบุ'
                    : 'No users found matching the criteria';
                suggestion = currentLang === 'th' 
                    ? 'ลองเปลี่ยนเงื่อนไขการค้นหา'
                    : 'Try changing your search criteria';
            }
            
            tbody.innerHTML = `
                <tr id="noResultsRow">
                    <td colspan="7" style="text-align: center; padding: 30px;">
                        <div class="no-results-state">
                            <div class="no-results-icon">🔍</div>
                            <div class="no-results-message">${message}</div>
                            <div class="no-results-suggestion">${suggestion}</div>
                            <button class="btn-outline" onclick="adminPanel.clearFilters()" style="margin-top: 15px;">
                                ${currentLang === 'th' ? 'ล้างตัวกรอง' : 'Clear Filters'}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    clearFilters() {
        // Clear username filter
        const usernameFilter = document.querySelector('.filters input[type="text"]');
        if (usernameFilter) {
            usernameFilter.value = '';
        }

        // Clear role filter
        const roleFilter = document.querySelector('.filters select');
        if (roleFilter) {
            roleFilter.value = '';
        }

        // Show all users
        this.displayUsers(this.allUsers);
        this.updateResultsCount(this.allUsers.length, this.allUsers.length);
    }

    displayUsers(users) {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;

        // Store current users for language toggle refresh
        this.currentUsers = users;

        // Check if users array is empty
        if (!users || users.length === 0) {
            this.showEmptyState();
            return;
        }

        // Display users with proper event handlers and translated values
        tbody.innerHTML = users.map((user, index) => `
            <tr data-user-id="${this.escapeHtml(user.id)}">
                <td>${this.escapeHtml(user.firstname)} ${this.escapeHtml(user.lastname)}</td>
                <td>${this.escapeHtml(user.email)}</td>
                <td>${this.translateRole(user.role || 'User')}</td>
                <td>${this.translateAccess(user.access || 'Lab Assistant')}</td>
                <td>${this.formatDate(user.created_at)}</td>
                <td>${this.formatDate(user.last_login)}</td>
                <td class="center">
                    <button class="icon-btn" data-user-index="${index}" title="แก้ไขข้อมูลผู้ใช้">⚙️</button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to gear buttons
        const gearButtons = tbody.querySelectorAll('.icon-btn[data-user-index]');
        gearButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const user = users[index];
                console.log(`🔧 Opening edit modal for user: ${user.firstname} ${user.lastname} (ID: ${user.id})`);
                this.openEditModal(user.id, user.firstname, user.lastname, user.email, user.role || 'User', user.access || 'User');
            });
        });

        // Store users data for reference
        this.currentUsers = users;

        console.log(`✅ Displayed ${users.length} users in table`);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeQuotes(text) {
        if (!text) return '';
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
    }

    translateRole(role) {
        const currentLang = this.currentLanguage || localStorage.getItem('language') || 'th';
        
        const roleTranslations = {
            'User': {
                'th': 'ผู้ใช้',
                'en': 'User'
            },
            'Admin': {
                'th': 'ผู้ดูแลระบบ',
                'en': 'Admin'
            }
        };

        return roleTranslations[role] && roleTranslations[role][currentLang] 
            ? roleTranslations[role][currentLang] 
            : role;
    }

    translateAccess(access) {
        const currentLang = this.currentLanguage || localStorage.getItem('language') || 'th';
        
        const accessTranslations = {
            'Lab Assistant': {
                'th': 'ผู้ช่วยห้องปฏิบัติการ',
                'en': 'Lab Assistant'
            },
            'Lab Manager': {
                'th': 'ผู้จัดการห้องปฏิบัติการ',
                'en': 'Lab Manager'
            },
            'Developer': {
                'th': 'นักพัฒนา',
                'en': 'Developer'
            }
        };

        return accessTranslations[access] && accessTranslations[access][currentLang] 
            ? accessTranslations[access][currentLang] 
            : access;
    }



    formatDate(dateString) {
        const noDataText = this.currentLanguage === 'th' ? 'ไม่มีข้อมูล' : 'No Data';
        
        if (!dateString || dateString === null || dateString === 'null') {
            return noDataText;
        }
        
        try {
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return noDataText;
            }
            
            // Format as DD/MM/YY (Thai style)
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = (date.getFullYear() + 543).toString().slice(-2); // Convert to Buddhist year
            
            return `${day}/${month}/${year}`;
        } catch {
            return noDataText;
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            const accessElement = document.querySelector('.access');
            if (accessElement) {
                accessElement.textContent = `Access : ${this.currentUser.access || 'Admin'}`;
            }
        }
    }

    openCreateModal() {
        const modal = document.getElementById('createModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCreateModal() {
        const modal = document.getElementById('createModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }

    openEditModal(userId, firstname, lastname, email, role, access) {
        // Store current user ID for delete functionality
        this.currentEditingUserId = userId;
        
        // Populate form fields
        document.getElementById('editUserId').value = userId;
        document.getElementById('editFirstname').value = firstname;
        document.getElementById('editLastname').value = lastname;
        document.getElementById('editEmail').value = email;
        document.getElementById('editRole').value = role;
        document.getElementById('editAccess').value = access;
        
        // Clear password fields
        document.getElementById('editPassword').value = '';
        document.getElementById('editConfirmPassword').value = '';
        
        // Show modal
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    handleDeleteFromModal() {
        if (!this.currentEditingUserId) {
            this.showAlert('ไม่พบข้อมูลผู้ใช้ที่จะลบ', 'error');
            return;
        }
        
        const currentLang = localStorage.getItem('language') || 'th';
        const confirmMessage = currentLang === 'th' 
            ? 'คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
            : 'Are you sure you want to delete this user? This action cannot be undone.';
            
        this.showConfirm(confirmMessage, () => {
            this.deleteUser(this.currentEditingUserId, true); // true = called from modal
        });
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form and clear current editing user
            const form = modal.querySelector('form');
            if (form) form.reset();
            this.currentEditingUserId = null;
        }
    }

    async handleCreateUser(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Get form values
        const userData = {
            firstname: formData.get('firstname') || form.querySelector('.fn input').value,
            lastname: formData.get('lastname') || form.querySelector('.ln input').value,
            email: formData.get('email') || form.querySelector('.email input').value,
            password: formData.get('password') || form.querySelector('.pass input').value,
            confirmPassword: formData.get('confirm') || form.querySelector('.confirm input').value,
            role: formData.get('role') || form.querySelector('.role select').value,
            access: formData.get('access') || form.querySelector('.access select').value
        };

        // Validation
        if (!userData.firstname || !userData.lastname || !userData.email || !userData.password) {
            this.showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            this.showAlert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', 'error');
            return;
        }

        if (userData.password.length < 6) {
            this.showAlert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role,
                    access: userData.access
                })
            });

            const result = await response.json();

            if (response.ok) {
                const newUser = result.user;
                this.showAlert(`สร้างผู้ใช้ใหม่สำเร็จ: ${newUser.firstname} ${newUser.lastname}`, 'success');
                this.closeCreateModal();
                await this.loadUsers(); // Refresh user list
                console.log(`✅ Created new user in both 'user' and 'restorepassword' tables: ${newUser.firstname} ${newUser.lastname} (${newUser.id})`);
            } else {
                this.showAlert(result.message || 'เกิดข้อผิดพลาดในการสร้างผู้ใช้', 'error');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            this.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์', 'error');
        }
    }

    async handleEditUser(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const userId = formData.get('userId');
        const userData = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            role: formData.get('role'),
            access: formData.get('access'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validation
        if (!userData.firstname || !userData.lastname || !userData.email) {
            this.showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        // Password validation (if provided)
        if (userData.password || userData.confirmPassword) {
            if (userData.password !== userData.confirmPassword) {
                this.showAlert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', 'error');
                return;
            }
            if (userData.password.length < 6) {
                this.showAlert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
                return;
            }
        }

        try {
            const updateData = {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                role: userData.role,
                access: userData.access
            };

            // Add password to update data if provided
            if (userData.password) {
                updateData.password = userData.password;
            }

            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showAlert('อัปเดตข้อมูลผู้ใช้สำเร็จ', 'success');
                this.closeEditModal();
                await this.loadUsers(); // Refresh user list
            } else {
                this.showAlert(result.message || 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้', 'error');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            this.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์', 'error');
        }
    }

    async deleteUser(userId, fromModal = false) {
        // If not called from modal, show confirmation
        if (!fromModal) {
            const currentLang = localStorage.getItem('language') || 'th';
            const confirmMessage = currentLang === 'th' 
                ? 'คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?'
                : 'Are you sure you want to delete this user?';
                
            this.showConfirm(confirmMessage, () => {
                this.deleteUser(userId, true); // Retry with fromModal = true
            });
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                this.showAlert('ลบผู้ใช้สำเร็จ', 'success');
                
                // If called from modal, close it first
                if (fromModal) {
                    this.closeEditModal();
                }
                
                await this.loadUsers(); // Refresh user list
            } else {
                const result = await response.json();
                this.showAlert(result.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้', 'error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์', 'error');
        }
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
                    ${this.currentLanguage === 'th' ? 'ตกลง' : 'OK'}
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
        // Basic message translations for admin panel
        const messageTranslations = {
            'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล': 
                this.currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล' : 'Error loading data. Please check database connection.',
            'ไม่พบข้อมูลผู้ใช้ที่จะลบ': 
                this.currentLanguage === 'th' ? 'ไม่พบข้อมูลผู้ใช้ที่จะลบ' : 'User data not found for deletion.',
            'กรุณากรอกข้อมูลให้ครบถ้วน': 
                this.currentLanguage === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill in all required information.',
            'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน': 
                this.currentLanguage === 'th' ? 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' : 'Password and confirm password do not match.',
            'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร': 
                this.currentLanguage === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters.',
            'เกิดข้อผิดพลาดในการสร้างผู้ใช้': 
                this.currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' : 'Error creating user.',
            'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์': 
                this.currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์' : 'Error connecting to server.',
            'อัปเดตข้อมูลผู้ใช้สำเร็จ': 
                this.currentLanguage === 'th' ? 'อัปเดตข้อมูลผู้ใช้สำเร็จ' : 'User data updated successfully.',
            'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้': 
                this.currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้' : 'Error updating user.',
            'ลบผู้ใช้สำเร็จ': 
                this.currentLanguage === 'th' ? 'ลบผู้ใช้สำเร็จ' : 'User deleted successfully.',
            'เกิดข้อผิดพลาดในการลบผู้ใช้': 
                this.currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการลบผู้ใช้' : 'Error deleting user.'
        };
        
        // Check if message contains success indicators
        if (message.includes('สำเร็จ') || message.includes('successfully')) {
            // Handle dynamic success messages
            if (message.includes('สร้างผู้ใช้ใหม่สำเร็จ:')) {
                return this.currentLanguage === 'th' ? message : message.replace('สร้างผู้ใช้ใหม่สำเร็จ:', 'User created successfully:');
            }
        }
        
        return messageTranslations[message] || message;
    }

    showConfirm(message, onConfirm, onCancel = null) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        const confirmText = this.currentLanguage === 'th' ? 'ยืนยัน' : 'Confirm';
        const cancelText = this.currentLanguage === 'th' ? 'ยกเลิก' : 'Cancel';
        
        modal.innerHTML = `
            <div class="modal-content">
                <p style="margin: 0 0px 15px 0; font-size: 16px;">${message}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="modal-button cancel-button">${cancelText}</button>
                    <button class="modal-button confirm-button error" autofocus>${confirmText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const confirmBtn = modal.querySelector('.confirm-button');
        const cancelBtn = modal.querySelector('.cancel-button');
        
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
        
        this.initializeModalStyles();
    }

    initializeModalStyles() {
        if (!document.getElementById('adminModalStyles')) {
            const style = document.createElement('style');
            style.id = 'adminModalStyles';
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
            `;
            document.head.appendChild(style);
        }
    }
    
    setupLanguageToggle() {
        const languageSwitch = document.getElementById('languageSwitch');
        if (!languageSwitch) return;

        // If we have the shared language manager, use it
        if (this.languageManager) {
            const leftOption = languageSwitch.querySelector('.lang-option.left');
            const rightOption = languageSwitch.querySelector('.lang-option.right');

            // Set initial state
            const currentLang = this.languageManager.getCurrentLanguage();
            languageSwitch.className = `lang-switch ${currentLang}`;
            this.updateLanguageToggle(currentLang, leftOption, rightOption);

            // Add click handlers
            leftOption.addEventListener('click', () => {
                this.languageManager.setLanguage('en');
                this.updateLanguageToggle('en', leftOption, rightOption);
                this.currentLanguage = 'en';
                this.refreshUserTable();
            });

            rightOption.addEventListener('click', () => {
                this.languageManager.setLanguage('th');
                this.updateLanguageToggle('th', leftOption, rightOption);
                this.currentLanguage = 'th';
                this.refreshUserTable();
            });
        } else {
            // Fallback to old click handler
            languageSwitch.addEventListener('click', () => this.toggleLanguage());
        }
    }

    updateLanguageToggle(lang, leftOption, rightOption) {
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
    
    refreshUserTable() {
        // Refresh the user table to update role/access translations
        if (this.currentUsers && this.currentUsers.length > 0) {
            this.displayUsers(this.currentUsers);
        }
        
        // Update filter placeholders and results count
        const usernameFilter = document.querySelector('.filters input[type="text"]');
        if (usernameFilter) {
            this.updateFilterPlaceholder(usernameFilter);
        }
        
        // Refresh results count if filters are applied
        if (this.currentUsers && this.allUsers) {
            this.updateResultsCount(this.currentUsers.length, this.allUsers.length);
        }
    }

    toggleLanguage() {
        const langSwitch = document.getElementById('languageSwitch');
        const currentLang = localStorage.getItem('language') || 'th';
        const newLang = currentLang === 'th' ? 'en' : 'th';
        
        // Update localStorage
        localStorage.setItem('language', newLang);
        
        // Update UI
        this.updateLanguageDisplay(newLang);
        
        // Apply translations
        this.applyTranslations(newLang);
        
        // Store current language for reference
        this.currentLanguage = newLang;
        
        // Refresh the user table to update role/access translations
        if (this.currentUsers && this.currentUsers.length > 0) {
            this.displayUsers(this.currentUsers);
        }
        
        // Update filter placeholders and results count
        const usernameFilter = document.querySelector('.filters input[type="text"]');
        if (usernameFilter) {
            this.updateFilterPlaceholder(usernameFilter);
        }
        
        // Refresh results count if filters are applied
        if (this.currentUsers && this.allUsers) {
            this.updateResultsCount(this.currentUsers.length, this.allUsers.length);
        }
        
        console.log(`🌐 Language switched to: ${newLang}`);
    }

    updateLanguageDisplay(lang) {
        const langSwitch = document.getElementById('languageSwitch');
        const langOptions = langSwitch?.querySelectorAll('.lang-option');
        
        if (langOptions) {
            langOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.lang === lang) {
                    option.classList.add('active');
                }
            });
        }
        
        // Update slider position
        if (langSwitch) {
            langSwitch.className = `lang-switch ${lang}`;
        }
    }

    applyTranslations(lang) {
        const translations = {
            th: {
                'admin-title': 'แอดมิน',
                'user-list': 'รายชื่อผู้ใช้',
                'system-usage': 'การใช้งานระบบ',
                'activity-log': 'การตั้งค่าทั่วไป',
                'logout': 'ออกจากระบบ',
                'create-account': 'สร้างบัญชีใหม่',
                'username': 'ชื่อผู้ใช้งาน',
                'role': 'บทบาท',
                'all': 'ทั้งหมด',
                
                // Table headers
                'table-name': 'ชื่อ',
                'table-email': 'อีเมล',
                'table-role': 'บทบาท',
                'table-access': 'ระดับการเข้าถึง',
                'table-register-date': 'วันที่ลงทะเบียน',
                'table-last-login': 'ใช้งานล่าสุด',
                
                // Modal titles
                'modal-create-title': 'สร้างผู้ใช้ใหม่',
                'modal-edit-title': 'แก้ไขข้อมูลผู้ใช้',
                
                // Form fields
                'field-firstname': 'ชื่อผู้ใช้',
                'field-lastname': 'นามสกุล',
                'field-role': 'บทบาท',
                'field-access': 'ระดับการเข้าถึง',
                'field-email': 'อีเมล',
                'field-password': 'รหัสผ่าน',
                'field-confirm-password': 'ยืนยันรหัสผ่าน',
                'field-new-password': 'รหัสผ่านใหม่ (เว้นว่างหากไม่ต้องการเปลี่ยน)',
                'field-confirm-new-password': 'ยืนยันรหัสผ่านใหม่',
                
                // Role options
                'role-user': 'ผู้ใช้',
                'role-admin': 'ผู้ดูแลระบบ',
                
                // Access level options
                'access-lab-assistant': 'ผู้ช่วยห้องปฏิบัติการ',
                'access-lab-manager': 'ผู้จัดการห้องปฏิบัติการ',
                'access-developer': 'นักพัฒนา',
                
                // Buttons
                'btn-cancel': 'ยกเลิก',
                'btn-create': 'สร้าง',
                'btn-save': 'บันทึก',
                'btn-delete': 'ลบผู้ใช้'
            },
            en: {
                'admin-title': 'Admin',
                'user-list': 'User List',
                'system-usage': 'System Usage',
                'activity-log': 'General Settings',
                'logout': 'Logout',
                'create-account': 'Create New Account',
                'username': 'Username',
                'role': 'Role',
                'all': 'All',
                
                // Table headers
                'table-name': 'Name',
                'table-email': 'Email',
                'table-role': 'Role',
                'table-access': 'Access Level',
                'table-register-date': 'Registration Date',
                'table-last-login': 'Last Login',
                
                // Modal titles
                'modal-create-title': 'Create New User',
                'modal-edit-title': 'Edit User Information',
                
                // Form fields
                'field-firstname': 'First Name',
                'field-lastname': 'Last Name',
                'field-role': 'Role',
                'field-access': 'Access Level',
                'field-email': 'Email',
                'field-password': 'Password',
                'field-confirm-password': 'Confirm Password',
                'field-new-password': 'New Password (leave blank to keep current)',
                'field-confirm-new-password': 'Confirm New Password',
                
                // Role options
                'role-user': 'User',
                'role-admin': 'Admin',
                
                // Access level options
                'access-lab-assistant': 'Lab Assistant',
                'access-lab-manager': 'Lab Manager',
                'access-developer': 'Developer',
                
                // Buttons
                'btn-cancel': 'Cancel',
                'btn-create': 'Create',
                'btn-save': 'Save',
                'btn-delete': 'Delete User'
            }
        };

        // Apply translations to elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = translations[lang][key];
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update page title and card title
        const cardTitle = document.querySelector('.card-title');
        if (cardTitle) {
            if (lang === 'th') {
                cardTitle.innerHTML = '<strong>PGX System ADMIN PAGE</strong><span class="sep">|</span><span>ตารางจัดการผู้ใช้งาน</span>';
            } else {
                cardTitle.innerHTML = '<strong>PGX System ADMIN PAGE</strong><span class="sep">|</span><span>User Management Table</span>';
            }
        }
    }

    initializeLanguageSystem() {
        // Page-specific translations that extend the shared ones
        const pageTranslations = {
            th: {
                // Modal titles
                'modal-create-title': 'สร้างผู้ใช้ใหม่',
                'modal-edit-title': 'แก้ไขข้อมูลผู้ใช้',
                
                // Form fields
                'field-firstname': 'ชื่อผู้ใช้',
                'field-lastname': 'นามสกุล',
                'field-role': 'บทบาท',
                'field-access': 'ระดับการเข้าถึง',
                'field-email': 'อีเมล',
                'field-password': 'รหัสผ่าน',
                'field-confirm-password': 'ยืนยันรหัสผ่าน',
                'field-new-password': 'รหัสผ่านใหม่ (เว้นว่างหากไม่ต้องการเปลี่ยน)',
                'field-confirm-new-password': 'ยืนยันรหัสผ่านใหม่',
                
                // Roles and access levels
                'role-user': 'User',
                'role-admin': 'Admin',
                'access-lab-assistant': 'Lab Assistant',
                'access-lab-manager': 'Lab Manager',
                'access-developer': 'Developer',
                
                // Table headers
                'table-name': 'ชื่อ',
                'table-email': 'อีเมล',
                'table-role': 'บทบาท',
                'table-access': 'ระดับการเข้าถึง',
                'table-register-date': 'วันที่ลงทะเบียน',
                'table-last-login': 'ใช้งานล่าสุด',
                
                // Buttons
                'btn-cancel': 'ยกเลิก',
                'btn-create': 'สร้าง',
                'btn-save': 'บันทึก',
                'btn-delete': 'ลบผู้ใช้',
                'create-account': 'สร้างบัญชีใหม่',
                
                // Other
                'username': 'ชื่อผู้ใช้งาน',
                'activity-log': 'การตั้งค่าทั่วไป'
            },
            en: {
                // Modal titles
                'modal-create-title': 'Create New User',
                'modal-edit-title': 'Edit User Information',
                
                // Form fields
                'field-firstname': 'First Name',
                'field-lastname': 'Last Name',
                'field-role': 'Role',
                'field-access': 'Access Level',
                'field-email': 'Email',
                'field-password': 'Password',
                'field-confirm-password': 'Confirm Password',
                'field-new-password': 'New Password (leave blank if no change)',
                'field-confirm-new-password': 'Confirm New Password',
                
                // Roles and access levels
                'role-user': 'User',
                'role-admin': 'Admin',
                'access-lab-assistant': 'Lab Assistant',
                'access-lab-manager': 'Lab Manager',
                'access-developer': 'Developer',
                
                // Table headers
                'table-name': 'Name',
                'table-email': 'Email',
                'table-role': 'Role',
                'table-access': 'Access Level',
                'table-register-date': 'Registration Date',
                'table-last-login': 'Last Login',
                
                // Buttons
                'btn-cancel': 'Cancel',
                'btn-create': 'Create',
                'btn-save': 'Save',
                'btn-delete': 'Delete User',
                'create-account': 'Create New Account',
                
                // Other
                'username': 'Username',
                'activity-log': 'General Settings'
            }
        };

        // Initialize language manager
        if (typeof LanguageManager !== 'undefined') {
            this.languageManager = new LanguageManager(pageTranslations);
            this.currentLanguage = this.languageManager.getCurrentLanguage();
        } else {
            console.warn('LanguageManager not found. Language switching disabled.');
            // Fallback to old system
            this.initializeFallbackLanguage();
        }
    }
    
    initializeFallbackLanguage() {
        const savedLang = localStorage.getItem('language') || 'th';
        this.updateLanguageDisplay(savedLang);
        this.applyTranslations(savedLang);
        this.currentLanguage = savedLang;
    }

    logout() {
        const currentLang = localStorage.getItem('language') || 'th';
        const message = currentLang === 'th' 
            ? 'คุณแน่ใจหรือไม่ที่จะออกจากระบบ?' 
            : 'Are you sure you want to logout?';
            
        this.showConfirm(message, () => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});