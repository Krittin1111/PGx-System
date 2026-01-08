# PGxSystem – Precision Medicine Support Platform  


---

##  1. Introduction

PGxSystem เป็นโปรเจกต์ที่พัฒนาภายใต้รายวิชา **CPE320 Software Engineering**  
โดยมีโจทย์ “พัฒนาระบบสนับสนุนการตัดสินใจด้านยาและพันธุกรรม (Pharmacogenomics: PGx)”  
เพื่อช่วยบุคลากรทางการแพทย์เข้าถึงข้อมูลพันธุกรรมผู้ป่วยได้ง่ายขึ้น และลดความเสี่ยงจากอาการไม่พึงประสงค์ของยา (ADR)

จากข้อมูลในสไลด์ *Painpoint* (หน้า 3) พบว่า  
แม้บริการตรวจพันธุกรรมมีมากขึ้น แต่ **การตีความผลตรวจยังยาก, ขาดข้อมูลภาษาไทย, และยังไม่มี Clinical Decision Support (CDS)**  
จึงเกิดแนวคิดในการสร้างระบบนี้ขึ้นมาเพื่อแก้ปัญหาเหล่านั้น  

---

##  2. Project Objectives

เป้าหมายหลักของโปรเจกต์ ได้แก่:

- ออกแบบระบบ PGx ที่ช่วยแพทย์, เภสัชกร, และบุคลากรทางการแพทย์เข้าถึงข้อมูลผู้ป่วย  
- จัดการข้อมูลผลตรวจพันธุกรรม, สั่งตรวจเพิ่มเติม และดูผลวิเคราะห์ได้ง่าย  
- ออกแบบ UX/UI ที่เหมาะสำหรับผู้ใช้งานจริงในสถานพยาบาล  
- พัฒนาฟังก์ชันพื้นฐาน เช่น Login, Dashboard, Patient Management, Order Test  
- สร้าง Workflow ที่สอดคล้องกับงานจริงของโรงพยาบาล  
- จัดทำ Software Engineering Document และวางแผนทดสอบระบบตามมาตรฐาน  

---

##  3. Problem Statement (Painpoints)

- ผลตรวจพันธุกรรมเข้าใจยาก ไม่เหมาะกับแพทย์ทั่วไป  
- รายงานส่วนใหญ่เป็นภาษาอังกฤษ และข้อมูลเชิงเทคนิคสูง  
- ไม่มีระบบ Decision Support ภาษาไทย  
- การใช้งาน PGx ยังไม่เข้าถึงระดับปฐมภูมิ  
- ทำให้การเลือกใช้ยาที่เหมาะสมตามพันธุกรรมยังทำได้จำกัด

ระบบ PGxSystem ถูกออกแบบมาเพื่อลด Painpoint เหล่านี้โดยตรง

---

##  4. Tools & Technologies

**Design & Development Tools**
- Canva  
- Figma  
- Visual Studio Code  
- GitHub  

**Programming Languages**
- HTML  
- CSS  
- JavaScript  

---

##  5. UX/UI Design

###  รวมหน้าที่ออกแบบ:
- Login & Authentication  
- Admin Dashboard + User Management  
- Doctor Dashboard + Order Test  
- Pharmacist Review Result  
- Staff Dashboard + Manage Samples  
- New Patient Registration  
- Patient List + Records  
- Lab Order & Test Result Forms  

ทีม UX/UI ได้ออกแบบให้:

- ใช้งานง่าย (User-Friendly)  
- สีสันปลอดภัยในสายตา (Green Medical Theme)  
- ช่องกรอกข้อมูลชัดเจน  
- Workflow สอดคล้องการใช้งานในโรงพยาบาล  

---

##  6. System Features

###  **Admin**
- จัดการบัญชีผู้ใช้งาน  
- ตรวจสอบการเข้าใช้งาน  
- จัดการข้อมูลผู้ป่วยพื้นฐาน  
- ตั้งค่าระบบและข้อความ PDPA  

###  **Doctor**
- Dashboard แสดงภาพรวมผู้ป่วย  
- สั่งตรวจพันธุกรรม (Order PGx Test)  
- ดูผลตรวจที่แปลผลแล้ว  
- กรอกข้อมูลทั่วไปของผู้ป่วย  

###  **Pharmacist**
- ตรวจสอบผลตรวจและคำแนะนำด้านยา  
- บันทึกข้อมูลประกอบการสั่งยา  

###  **Staff / Lab**
- รับตัวอย่างตรวจ  
- พิมพ์ Barcode  
- อัปโหลดผลตรวจ  
- ส่งต่อผลให้แพทย์  

---

##  7. Workflow

Workflow ครอบคลุม:

1. แพทย์ลงทะเบียนผู้ป่วย  
2. แพทย์สั่งตรวจ (Order Test)  
3. Staff รับตัวอย่างและส่งไปตรวจ  
4. Lab ประมวลผลและอัปโหลดผลตรวจ  
5. ระบบแสดงผลตรวจพร้อมคำแนะนำ PGx  
6. แพทย์และเภสัชกรนำไปใช้ประกอบการตัดสินใจ  

Workflow ถูกออกแบบให้ตรงตามสถานการณ์จริงของโรงพยาบาล  
และช่วยลดขั้นตอนที่ทำซ้ำและผิดพลาดง่าย

---

##  8. Software Testing Plan

ขั้นตอนการทดสอบประกอบด้วย:

- Requirements Analysis  
- Test Planning  
- Test Design  
- Setup Test Environment  
- Test Execution  
- Final Testing  

ทีมรับผิดชอบได้แก่:

- PM  
- UX/UI Team  
- Frontend & Backend Team  

---

##  9. Future Development

อัปเดตระบบเพิ่มเติมในอนาคต:

- ระบบประมวลผล Genotype อัตโนมัติ  
- ระบบ Login ที่ใช้งานจริงพร้อม Security  
- ระบบจัดการ PDPA ให้ครบถ้วน  
- การแจ้งเตือน Term of Service  
- ระบบสแกน Barcode  
- ระบบวิเคราะห์สถิติการใช้งาน  
- คลังเอกสารสำหรับเก็บ Knowledge PGx  

---

##  10. What We Learned

จากการพัฒนาโปรเจกต์นี้ ทีมได้เรียนรู้ดังนี้:

###  Software Engineering Process  
- การเก็บความต้องการ (Requirement Gathering)  
- การออกแบบ UX/UI จาก Painpoints จริง  
- การทำ Workflow, Wireframe, Prototype  

###  Team Collaboration  
- ใช้งาน Git/GitHub ในการจัดการเวอร์ชัน  
- แบ่งงานตาม Role: PM, UX/UI, Frontend, Backend  

###  Technical Skills  
- ออกแบบ Interface ให้เหมาะกับผู้ใช้งานจริง  
- พัฒนา Frontend ด้วย HTML/CSS/JS  
- เรียนรู้โครงสร้างระบบทางการแพทย์ (Clinical Workflow)  

###  Presentation & Documentation  
- ทำสไลด์นำเสนอ  
- ทำ Demo System  
- จัดทำเอกสาร SE เช่น Testing, Workflow  



