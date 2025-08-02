document.addEventListener('DOMContentLoaded', () => {

    // --- ส่วนนี้คือการเชื่อมต่อกับเซิร์ฟเวอร์จริง ๆ ---
    // เปลี่ยนจาก mockServer มาเป็นการเรียกใช้ API
    const API_BASE_URL = 'http://localhost:3000';

    const getDuties = async () => {
        const res = await fetch(`${API_BASE_URL}/duties`);
        return res.json();
    };

    const getReports = async () => {
        const res = await fetch(`${API_BASE_URL}/reports`);
        return res.json();
    };

    const saveReport = async (newReport) => {
        const res = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReport)
        });
        return res.json();
    };

    const saveDuties = async (dutiesData) => {
        const res = await fetch(`${API_BASE_URL}/duties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dutiesData)
        });
        return res.json();
    };
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

    // โค้ดส่วน Login, Dashboard และการแสดงผลต่าง ๆ เหมือนเดิม
    // แต่จะใช้ฟังก์ชัน async/await ในการเรียกข้อมูลจาก server
    // เพื่อให้โค้ดส่วนนี้สั้นลง ผมจะแสดงเฉพาะส่วนที่เปลี่ยนแปลงสำคัญเท่านั้น

    const loginForm = document.getElementById('login-form');
    // ... โค้ดส่วน Login เหมือนเดิม ...
    
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
        const defaultStudentDuties = { tasks: ['ทำเวรประจำวันตามที่ได้รับมอบหมาย', 'รักษาความสะอาดห้องเรียน'] };
        
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
                    await saveNewReport(imageUrl);
                };
                reader.readAsDataURL(file);
            } else {
                await saveNewReport('');
            }
        });
    }

    async function saveNewReport(imageUrl) {
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

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            // ... โค้ดส่วน Login เหมือนเดิม ...
        });
    }
    // ... โค้ดส่วน Login เหมือนเดิม ...
    
});
2. โค้ด Back-end (นอกโฟลเดอร์ public)
package.json
สร้างไฟล์นี้เพื่อติดตั้งไลบรารีที่จำเป็น (Node.js)

JSON

{
  "name": "my-school-app",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5"
  }
}
data.json
สร้างไฟล์นี้เพื่อเป็นที่เก็บข้อมูลจริง ๆ

JSON

{
  "reports": [],
  "duties": {}
}
server.js
สร้างไฟล์นี้เพื่อทำหน้าที่เป็นเซิร์ฟเวอร์และฐานข้อมูล

JavaScript

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// ฟังก์ชันสำหรับอ่านข้อมูลจากไฟล์ data.json
const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { reports: [], duties: {} };
    }
};

// ฟังก์ชันสำหรับเขียนข้อมูลลงไฟล์ data.json
const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// API Endpoint สำหรับ Reports
app.get('/reports', async (req, res) => {
    const data = await readData();
    res.json(data.reports);
});

app.post('/reports', async (req, res) => {
    const newReport = req.body;
    const data = await readData();
    data.reports.push(newReport);
    await writeData(data);
    res.status(201).json(newReport);
});

// API Endpoint สำหรับ Duties
app.get('/duties', async (req, res) => {
    const data = await readData();
    res.json(data.duties);
});

app.post('/duties', async (req, res) => {
    const newDuties = req.body;
    const data = await readData();
    data.duties = newDuties;
    await writeData(data);
    res.status(200).json(newDuties);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
