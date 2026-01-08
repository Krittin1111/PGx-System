// === ตัวอย่างข้อมูลผู้ป่วย ===
const mockData = [
  { date: "7/10/2568", testCode: "400001", patientName: "ศุรศัก ประตูบ้านทอง", testType: "BloodEDTA", status: "pending" },
  { date: "8/10/2568", testCode: "400002", patientName: "อารีย์ สุขใจ", testType: "BloodEDTA", status: "pending" },
  { date: "9/10/2568", testCode: "400003", patientName: "สมศรี ศรีสม", testType: "BloodEDTA", status: "pending" }
];

// === โหลดข้อมูล ===
function loadResults() {
  const table = document.getElementById('result-table');
  table.innerHTML = '';

  mockData.forEach((item, index) => {
    // ✅ ดึงสถานะล่าสุดจาก localStorage
    const savedStatus = localStorage.getItem(item.testCode);
    if (savedStatus) {
      item.status = savedStatus;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.testCode}</td>
      <td>${item.patientName}</td>
      <td>${item.testType}</td>
      <td><span class="status ${item.status}" id="status-${index}">${getStatusText(item.status)}</span></td>
      <td><button class="action-btn ${getActionClass(item.status)}" id="btn-${index}">${getActionText(item.status)}</button></td>
    `;
    table.appendChild(row);
  });

  // ✅ ผูก event ให้ปุ่มในแต่ละแถว
  mockData.forEach((item, index) => {
    document.getElementById(`btn-${index}`).addEventListener('click', () => handleActionClick(index));
  });
}

// === เมื่อกดปุ่มดำเนินการ ===
function handleActionClick(index) {
  const item = mockData[index];
  if (item.status === 'pending') {
    window.location.href = `process.html?testCode=${item.testCode}`;
  }
  else if (item.status === 'rejected') {
    window.location.href = `edit.html?testCode=${item.testCode}`;
  }
}

// === ตัวช่วยแสดงข้อความและคลาส ===
function getStatusText(status) {
  switch(status) {
    case 'pending': return 'รอดำเนินการ';
    case 'approved': return 'ผ่าน';
    case 'rejected': return 'รอแก้ไข';
    default: return '-';
  }
}

function getActionText(status) {
  switch(status) {
    case 'pending': return 'ดำเนินการ';
    case 'approved': return 'อ่านผลแล้ว';
    case 'rejected': return 'แก้ไขผลตรวจ';
    default: return '';
  }
}

function getActionClass(status) {
  switch(status) {
    case 'pending': return 'processing';
    case 'approved': return 'done';
    case 'rejected': return 'failed';
    default: return '';
  }
}

loadResults();
