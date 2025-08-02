document.addEventListener('DOMContentLoaded', () => {
    // User and role data
    const allUsers = {
    'ภัทราวุธ สังข์มัน': { role: 'user', password: 'Don1234' },
        'ณัฐชญา พันธุรัตน์': { role: 'user', password: 'Namtal1234' },
        'ชัยภัทร สุขสัยญาติ': { role: 'user', password: 'Tae1234' },
        'ปัทมา จะโรรัมย์': { role: 'user', password: 'Pat1234' },
        'นิธิกร จันศรี': { role: 'user', password: 'Bas1234' },
        'จันทกร ถนนนา': { role: 'user', password: 'Mix1234' },
        'สิรวิชญ์ บุญอมร': { role: 'student_council', password: 'nksk1234' },
        'ฐิติพงศ์ สุขจันทร์': { role: 'student_council', password: 'nksk1234' },
        'ขนิษฐา บุญแสวง': { role: 'student_council', password: 'nksk1234' },
        'กรรณิการ์ ซ้ายชูจีน': { role: 'student_council', password: 'nksk1234' },
        'ภัทรพล พรพินิชการ': { role: 'student_council', password: 'nksk1234' },
        'พรพรรณ โยธารักษ์': { role: 'student_council', password: 'nksk1234' },
        'ศศิกานต์ หมื่นชน': { role: 'student_council', password: 'nksk1234' },
        'สุพรรษา เทศเดช': { role: 'student_council', password: 'nksk1234' },
        'สิรวิชญ์ เสนสกุล': { role: 'student_council', password: 'nksk1234' },
        'ชญานนท์ หนูเมือง': { role: 'student_council', password: 'nksk1234' },
        'สุภาพ แอบบัว': { role: 'student_council', password: 'nksk1234' },
        'ภัทรเดช พรพินิชการ': { role: 'admin', password: 'admin1234' },
        'ศุภสุตา ไกรทอง': { role: 'vice_admin', password: '121212' },
        'สมิทธ์ โสตเมต': { role: 'vice_admin', password: '121212' },
        'กานต์พิชา บุญรักษ์': { role: 'secretary', password: '01234' },
    };

     // กำหนดหน้าที่เริ่มต้นสำหรับนักเรียนที่ไม่ได้ลงทะเบียน
    const defaultStudentDuties = { tasks: ['ทำเวรประจำวันตามที่ได้รับมอบหมาย', 'รักษาความสะอาดห้องเรียน'] };

    // โหลดข้อมูลหน้าที่จาก localStorage ถ้าไม่มีให้สร้างเป็น object ว่าง
    let dutiesData = JSON.parse(localStorage.getItem('duties')) || {};

    // จำลองฐานข้อมูลสำหรับเก็บรายงาน (ใช้ LocalStorage)
    const reports = JSON.parse(localStorage.getItem('reports')) || [];

    // --- ส่วนการจัดการหน้า Login ---
    const loginForm = document.getElementById('login-form');
    const userRoleSelect = document.getElementById('user-role');
    const fixedUsernameGroup = document.getElementById('fixed-username-group');
    const usernameSelect = document.getElementById('username-select');
    const studentUsernameGroup = document.getElementById('student-username-group');
    const studentUsernameInput = document.getElementById('student-username-input');
    const passwordGroup = document.getElementById('password-group');
    const passwordInput = document.getElementById('password');

    if (userRoleSelect) {
        userRoleSelect.addEventListener('change', () => {
            const role = userRoleSelect.value;
            fixedUsernameGroup.style.display = 'none';
            studentUsernameGroup.style.display = 'none';
            passwordGroup.style.display = 'none';
            usernameSelect.required = false;
            studentUsernameInput.required = false;
            passwordInput.required = false;

            if (role === 'student') {
                studentUsernameGroup.style.display = 'block';
                studentUsernameInput.required = true;
            } else if (role !== '') {
                fixedUsernameGroup.style.display = 'block';
                usernameSelect.required = true;
                usernameSelect.innerHTML = '<option value="">-- เลือกชื่อของคุณ --</option>';
                for (const username in allUsers) {
                    if (allUsers[username].role === role) {
                        const option = document.createElement('option');
                        option.value = username;
                        option.textContent = username;
                        usernameSelect.appendChild(option);
                    }
                }
            }

            if (['admin', 'vice_admin', 'secretary', 'student_council', 'user'].includes(role)) {
                passwordGroup.style.display = 'block';
                passwordInput.required = true;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = userRoleSelect.value;
            const password = passwordInput.value;
            const errorMessage = document.getElementById('error-message');
            let username;

            if (role === 'student') {
                username = studentUsernameInput.value.trim();
            } else {
                username = usernameSelect.value;
            }

            const user = allUsers[username];
            if (role === 'student') {
                if (username !== '') {
                    sessionStorage.setItem('loggedInUser', JSON.stringify({ username: username, role: role }));
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = 'กรุณาใส่ชื่อของคุณ';
                    errorMessage.style.display = 'block';
                }
            } else if (user && user.role === role) {
                if (['admin', 'vice_admin', 'secretary', 'student_council', 'user'].includes(role)) {
                    if (user.password === password) {
                        sessionStorage.setItem('loggedInUser', JSON.stringify({ username: username, role: role }));
                        window.location.href = 'dashboard.html';
                    } else {
                        errorMessage.textContent = 'รหัสผ่านไม่ถูกต้อง';
                        errorMessage.style.display = 'block';
                    }
                } else {
                    sessionStorage.setItem('loggedInUser', JSON.stringify({ username: username, role: role }));
                    window.location.href = 'dashboard.html';
                }
            } else {
                errorMessage.textContent = 'ข้อมูลไม่ถูกต้อง';
                errorMessage.style.display = 'block';
            }
        });
    }

    // --- ส่วนการจัดการ Dashboard ---
    const mainContainer = document.querySelector('.container');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const logoutBtn = document.getElementById('logout-btn');
    const switchViewBtn = document.getElementById('switch-view-btn');
    const myDutiesBtn = document.getElementById('my-duties-btn');

    if (mainContainer && loggedInUser) {
        const role = loggedInUser.role;

        if (myDutiesBtn) {
            if (['admin', 'vice_admin', 'secretary', 'user', 'student_council', 'student'].includes(role)) {
                myDutiesBtn.style.display = 'inline-block';
            } else {
                myDutiesBtn.style.display = 'none';
            }
        }
        
        if (switchViewBtn) {
            if (['admin', 'vice_admin', 'secretary'].includes(role)) {
                switchViewBtn.style.display = 'inline-block';
            } else {
                switchViewBtn.style.display = 'none';
            }
        }
        
        if (['admin', 'vice_admin', 'secretary'].includes(role)) {
            renderAdminView();
        } else {
            renderUserView();
        }
    } else if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }

    // Event listeners สำหรับปุ่มใหม่
    let isUserView = false;
    let isDutiesView = false;

    if (switchViewBtn) {
        switchViewBtn.addEventListener('click', () => {
            if (isUserView) {
                renderAdminView();
                switchViewBtn.textContent = 'สลับไปหน้าส่งรายงาน';
            } else {
                renderUserView();
                switchViewBtn.textContent = 'สลับกลับหน้า Admin';
            }
            isUserView = !isUserView;
            isDutiesView = false;
        });
    }
    
    if (myDutiesBtn) {
        myDutiesBtn.addEventListener('click', () => {
            if (isDutiesView) {
                if (['admin', 'vice_admin', 'secretary'].includes(loggedInUser.role)) {
                    renderAdminView();
                } else {
                    renderUserView();
                }
                myDutiesBtn.textContent = 'หน้าที่ของฉัน';
            } else {
                renderDutiesView();
                myDutiesBtn.textContent = 'สลับกลับ';
            }
            isDutiesView = !isDutiesView;
            isUserView = false;
        });
    }
    
    // ฟังก์ชันสำหรับสร้างหน้า Admin
    function renderAdminView() {
        mainContainer.innerHTML = `
            <div class="dashboard-content admin-view">
                <h2>รายงานและปัญหาทั้งหมด</h2>
                <div class="button-group">
                    <button id="show-reports-btn" class="btn-secondary">ดูรายงานทั้งหมด</button>
                    <button id="show-duties-assignment-btn" class="btn-secondary">มอบหมายหน้าที่</button>
                </div>
                <div id="admin-content-view">
                    </div>
            </div>
        `;

        const showReportsBtn = document.getElementById('show-reports-btn');
        const showDutiesAssignmentBtn = document.getElementById('show-duties-assignment-btn');
        const adminContentView = document.getElementById('admin-content-view');

        // แสดงหน้าดูรายงานเป็นค่าเริ่มต้น
        renderReportsTable(adminContentView);

        // Event listeners สำหรับปุ่ม Admin view
        showReportsBtn.addEventListener('click', () => {
            renderReportsTable(adminContentView);
        });

        showDutiesAssignmentBtn.addEventListener('click', () => {
            renderAdminDutiesAssignment(adminContentView);
        });
    }

    // ฟังก์ชันสำหรับสร้างตารางรายงาน
    function renderReportsTable(container) {
        container.innerHTML = `
            <table class="report-table">
                <thead>
                    <tr>
                        <th>ผู้แจ้ง</th>
                        <th>ประเภท</th>
                        <th>หัวข้อ</th>
                        <th>รายละเอียด</th>
                        <th>รูปภาพ</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `;
        const tableBody = container.querySelector('.report-table tbody');
        reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.username}</td>
                <td>${report.type}</td>
                <td>${report.title}</td>
                <td>${report.description}</td>
                <td>${report.image ? `<img src="${report.image}" alt="รูปภาพประกอบ">` : 'ไม่มี'}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // ฟังก์ชันสำหรับสร้างหน้ามอบหมายหน้าที่
    function renderAdminDutiesAssignment(container) {
        // สร้างตัวเลือกผู้ใช้ทั้งหมด (รวมนักเรียน)
        const allUsernames = Object.keys(allUsers);
        const userOptions = allUsernames.map(username => 
            `<option value="${username}">${username} (${allUsers[username] ? allUsers[username].role : 'student'})</option>`
        ).join('');
        // เพิ่มตัวเลือก "นักเรียน" แยกต่างหากเพื่อรองรับนักเรียนที่ไม่ได้ลงทะเบียน
        const studentOption = '<option value="นักเรียน">นักเรียน (ไม่ระบุชื่อ)</option>';

        container.innerHTML = `
            <div class="admin-duties-assignment">
                <h3>มอบหมายหน้าที่</h3>
                <form id="assign-duties-form">
                    <div class="input-group">
                        <label for="assign-user">เลือกผู้ใช้:</label>
                        <select id="assign-user" required>
                            <option value="">-- เลือกผู้ใช้ --</option>
                            ${userOptions}
                            ${studentOption}
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="assign-duties-list">หน้าที่ (แต่ละรายการคั่นด้วย , ):</label>
                        <textarea id="assign-duties-list" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn">บันทึกหน้าที่</button>
                </form>
                <div id="assign-duties-status" class="status-message"></div>
                
                <h3>หน้าที่ที่มอบหมายแล้ว</h3>
                <ul id="current-duties-list"></ul>
            </div>
        `;
        
        const form = document.getElementById('assign-duties-form');
        const statusMessage = document.getElementById('assign-duties-status');
        const currentDutiesList = document.getElementById('current-duties-list');

        // แสดงหน้าที่ที่มอบหมายอยู่
        for (const user in dutiesData) {
            const dutyItem = document.createElement('li');
            dutyItem.innerHTML = `<strong>${user}:</strong> ${dutiesData[user].tasks.join(', ')}`;
            currentDutiesList.appendChild(dutyItem);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedUser = document.getElementById('assign-user').value;
            const dutiesText = document.getElementById('assign-duties-list').value;
            const newDuties = dutiesText.split(',').map(item => item.trim()).filter(item => item !== '');

            if (selectedUser && newDuties.length > 0) {
                dutiesData[selectedUser] = { tasks: newDuties };
                localStorage.setItem('duties', JSON.stringify(dutiesData));
                statusMessage.textContent = `มอบหมายหน้าที่ให้ ${selectedUser} เรียบร้อยแล้ว!`;
                statusMessage.style.color = 'green';
                form.reset();
                renderAdminDutiesAssignment(container);
            } else {
                statusMessage.textContent = 'กรุณาเลือกผู้ใช้และกรอกหน้าที่ให้ครบถ้วน';
                statusMessage.style.color = 'red';
            }
        });
    }

    // ฟังก์ชันสำหรับสร้างหน้าดูหน้าที่
    function renderDutiesView() {
        const username = loggedInUser.username;
        let userDuties;
        if (loggedInUser.role === 'student') {
            userDuties = dutiesData[username] || defaultStudentDuties;
        } else {
            userDuties = dutiesData[username] || { tasks: ['ไม่มีหน้าที่ที่ได้รับมอบหมาย'] };
        }
        
        let dutiesList = userDuties.tasks.map(task => `<li>${task}</li>`).join('');

        mainContainer.innerHTML = `
            <div class="dashboard-content duties-view">
                <h2>หน้าที่ของ ${username}</h2>
                <div class="duties-list">
                    <ul>
                        ${dutiesList}
                    </ul>
                </div>
            </div>
        `;
    }

    // ฟังก์ชันสำหรับสร้างหน้า User
    function renderUserView() {
        const userRole = loggedInUser.role;
        let formTitle = `ส่งรายงาน/แจ้งปัญหา`;
        let reportTypeOptions = `
            <option value="">-- เลือกประเภท --</option>
            <option value="report">รายงานประจำสัปดาห์</option>
            <option value="problem">แจ้งปัญหาที่พบ</option>
        `;

        if (['student_council', 'student'].includes(userRole)) {
            formTitle = `ส่งรายงานปัญหา`;
            reportTypeOptions = `
                <option value="problem">แจ้งปัญหาที่พบ</option>
            `;
        } else if (userRole === 'secretary') {
             formTitle = `ส่งรายงานประจำสัปดาห์`;
             reportTypeOptions = `
                <option value="report">รายงานประจำสัปดาห์</option>
            `;
        }

        mainContainer.innerHTML = `
            <div class="dashboard-content user-form">
                <h2>${formTitle}</h2>
                <form id="report-form">
                    <div class="input-group">
                        <label for="report-type">ประเภท:</label>
                        <select id="report-type" required>
                            ${reportTypeOptions}
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="report-title">หัวข้อ:</label>
                        <input type="text" id="report-title" required>
                    </div>

                    <div class="input-group">
                        <label for="report-description">รายละเอียด:</label>
                        <textarea id="report-description" required></textarea>
                    </div>

                    <div class="input-group">
                        <label for="report-image">แนบรูปภาพ:</label>
                        <input type="file" id="report-image" accept="image/*">
                    </div>
                    
                    <button type="submit" class="btn">ส่งข้อมูล</button>
                </form>
            </div>
        `;
        
        const reportForm = document.getElementById('report-form');
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fileInput = document.getElementById('report-image');
            const file = fileInput.files[0];
            let imageUrl = '';

            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageUrl = event.target.result;
                    saveReport(imageUrl);
                };
                reader.readAsDataURL(file);
            } else {
                saveReport('');
            }
        });
    }

    // ฟังก์ชันสำหรับบันทึกรายงาน
    function saveReport(imageUrl) {
        const type = document.getElementById('report-type').value;
        const title = document.getElementById('report-title').value;
        const description = document.getElementById('report-description').value;
        const newReport = {
            username: loggedInUser.username,
            type: type === 'report' ? 'รายงานประจำสัปดาห์' : 'แจ้งปัญหา',
            title,
            description,
            image: imageUrl,
            timestamp: new Date().toLocaleString()
        };
        reports.push(newReport);
        localStorage.setItem('reports', JSON.stringify(reports));
        alert('ส่งข้อมูลเรียบร้อยแล้ว!');
        document.getElementById('report-form').reset();
    }
});