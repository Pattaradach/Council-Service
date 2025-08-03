// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// TODO: Replace the following with your app's Firebase project configuration
// *** ให้แทนที่โค้ด firebaseConfig ด้านล่างนี้ด้วยโค้ดที่คุณได้จาก Firebase Console ***
const firebaseConfig = {
    apiKey: "AIzaSyDIbLfo6zww5ReJZf_m78qfA7NIAxE5zC0",
    authDomain: "myapp-f54ce.firebaseapp.com",
    projectId: "myapp-f54ce",
    storageBucket: "myapp-f54ce.firebasestorage.app",
    messagingSenderId: "991770731305",
    appId: "1:991770731305:web:8204c50052d4c0f1e58d38",
    measurementId: "G-EFCJ9RJN9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// --- Mock User Data (ข้อมูลผู้ใช้ยังคงเก็บในไฟล์นี้) ---
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
const defaultStudentDuties = { tasks: ['ทำเวรประจำวันตามที่ได้รับมอบหมาย', 'รักษาความสะอาดห้องเรียน'] };

document.addEventListener('DOMContentLoaded', () => {

    // --- Firebase Functions ---
    // Function to fetch all reports from Firebase
    const getReports = async () => {
        try {
            const snapshot = await get(ref(database, 'reports'));
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            }
            return [];
        } catch (error) {
            console.error("Error fetching reports:", error);
            return [];
        }
    };

    // Function to fetch all duties from Firebase
    const getDuties = async () => {
        try {
            const snapshot = await get(ref(database, 'duties'));
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return {};
        } catch (error) {
            console.error("Error fetching duties:", error);
            return {};
        }
    };

    // Function to save a new report to Firebase
    const saveReport = async (newReport) => {
        try {
            const reportsRef = ref(database, 'reports');
            await push(reportsRef, newReport);
        } catch (error) {
            console.error("Error saving report:", error);
        }
    };

    // Function to save duties to Firebase
    const saveDuties = async (dutiesData) => {
        try {
            const dutiesRef = ref(database, 'duties');
            await set(dutiesRef, dutiesData);
        } catch (error) {
            console.error("Error saving duties:", error);
        }
    };

    // --- Login Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (allUsers[username] && allUsers[username].password === password) {
                const loggedInUser = { username: username, role: allUsers[username].role };
                sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                window.location.href = 'dashboard.html';
            } else {
                alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        });
    }

    // --- Dashboard Logic ---
    const mainContainer = document.querySelector('.container');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const logoutBtn = document.getElementById('logout-btn');
    const switchViewBtn = document.getElementById('switch-view-btn');
    const myDutiesBtn = document.getElementById('my-duties-btn');

    if (mainContainer && loggedInUser) {
        const role = loggedInUser.role;

        if (myDutiesBtn) {
            myDutiesBtn.style.display = ['admin', 'vice_admin', 'secretary', 'user', 'student_council', 'student'].includes(role) ? 'inline-block' : 'none';
        }
        
        if (switchViewBtn) {
            switchViewBtn.style.display = ['admin', 'vice_admin', 'secretary'].includes(role) ? 'inline-block' : 'none';
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
    async function renderAdminView() {
        mainContainer.innerHTML = `
            <div class="dashboard-content admin-view">
                <h2>รายงานและปัญหาทั้งหมด</h2>
                <div class="button-group">
                    <button id="show-reports-btn" class="btn-secondary">ดูรายงานทั้งหมด</button>
                    <button id="show-duties-assignment-btn" class="btn-secondary">มอบหมายหน้าที่</button>
                </div>
                <div id="admin-content-view">
                    <!-- เนื้อหาจะถูกสลับเข้ามาตรงนี้ -->
                </div>
            </div>
        `;

        const showReportsBtn = document.getElementById('show-reports-btn');
        const showDutiesAssignmentBtn = document.getElementById('show-duties-assignment-btn');
        const adminContentView = document.getElementById('admin-content-view');

        renderReportsTable(adminContentView);

        showReportsBtn.addEventListener('click', () => {
            renderReportsTable(adminContentView);
        });

        showDutiesAssignmentBtn.addEventListener('click', () => {
            renderAdminDutiesAssignment(adminContentView);
        });
    }

    async function renderReportsTable(container) {
        const reports = await getReports();
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
                    ${reports.map(report => `
                        <tr>
                            <td>${report.username}</td>
                            <td>${report.type}</td>
                            <td>${report.title}</td>
                            <td>${report.description}</td>
                            <td>${report.image ? `<img src="${report.image}" alt="รูปภาพประกอบ">` : 'ไม่มี'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async function renderAdminDutiesAssignment(container) {
        const dutiesData = await getDuties();
        const allUsernames = Object.keys(allUsers);
        const userOptions = allUsernames.map(username => 
            `<option value="${username}">${username} (${allUsers[username].role})</option>`
        ).join('');

        container.innerHTML = `
            <div class="admin-duties-assignment">
                <h3>มอบหมายหน้าที่</h3>
                <form id="assign-duties-form">
                    <div class="input-group">
                        <label for="assign-user">เลือกผู้ใช้:</label>
                        <select id="assign-user" required>
                            <option value="">-- เลือกผู้ใช้ --</option>
                            ${userOptions}
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
                <ul id="current-duties-list">
                    ${Object.keys(dutiesData).map(user => `
                        <li><strong>${user}:</strong> ${dutiesData[user].tasks.join(', ')}</li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        const form = document.getElementById('assign-duties-form');
        const statusMessage = document.getElementById('assign-duties-status');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const selectedUser = document.getElementById('assign-user').value;
            const dutiesText = document.getElementById('assign-duties-list').value;
            const newDuties = dutiesText.split(',').map(item => item.trim()).filter(item => item !== '');

            if (selectedUser && newDuties.length > 0) {
                const updatedDuties = { ...dutiesData, [selectedUser]: { tasks: newDuties } };
                await saveDuties(updatedDuties);
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

    async function renderDutiesView() {
        const username = loggedInUser.username;
        const dutiesData = await getDuties();
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
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fileInput = document.getElementById('report-image');
            const file = fileInput.files[0];
            let imageUrl = '';

            if (file) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    imageUrl = event.target.result;
                    await submitNewReport(imageUrl);
                };
                reader.readAsDataURL(file);
            } else {
                await submitNewReport('');
            }
        });
    }

    async function submitNewReport(imageUrl) {
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
        await saveReport(newReport);
        alert('ส่งข้อมูลเรียบร้อยแล้ว!');
        document.getElementById('report-form').reset();
    }
});
