import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Function to replace placeholders in the HTML template
function replacePlaceholders(template, data) {
  return template.replace(/{{(\w+)}}/g, (match, key) => data[key] || "");
}

export async function generatePDF(student) {
  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            font-family: "Roboto", sans-serif;
            margin: 0;
            padding: 10px;
            background-color: #f8f8f8;
        }

        header {
            text-align: center;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
        }

        header .title {
            max-width: 200px;
        }

        header img {
            max-width: 100px;
        }

        .container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 0 auto;
            max-width: 1000px;
        }

        .personal-info,
        .parents-info,
        .emergencyContact,
        .subjects,
        .results,
        .enroll-status {
            background-color: #fff;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 10px;
            margin: 2px 0;
        }


        .personal-info {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }

        .personal-info div {
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid #eee;
            background-color: #fafafa;
            margin-bottom: 5px;
            padding: 5px;
            border-radius: 5px;

        }

        .parents-info {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
        }

        .parents-info .content {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        .parents-info .content>div {
            border: 1px solid #eee;
            background-color: #fafafa;
            height: 150px;
            display: flex;
            justify-content: space-evenly;
            flex-direction: column;
            padding: 10px;
            width: 100%;
        }


        .emergencyContact {
            grid-column: 1 / 3;
            grid-row: 2 / 3;
        }

        .emergencyContact .contant {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .emergencyContact .contant div {
            border: 1px solid #eee;
            background-color: #fafafa;
            padding: 10px 40px;
            border-radius: 5px;

        }

        .emergencyContact .contant .name {
            flex: 1;
        }

        .subjects {
            grid-column: 1 / 2;
            grid-row: 3 / 4;
        }

        .results {
            grid-column: 2 / 3;
            grid-row: 3 / 4;

        }

        .results .content {
            border: 1px solid #eee;
            background-color: #fafafa;
            border-radius: 5px;
            padding: 20px;
            width: 225px;
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .enroll-status {
            grid-column: 1 / 3;
            grid-row: 4 / 5;
        }

        h1 {
            color: #1e5edf;
        }

        h2 {
            font-size: 18px;
            font-weight: 500;
            color: #444;
            margin-bottom: 5px;
        }

        span {
            font-size: 14px;
            color: #666;
        }

        .card {
            border: 1px solid #eee;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: #fafafa;
        }

        .card .name,
        .card .techerName,
        .card .marks {
            margin: 3px 0;
        }

        .results  {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

        }

        .results .total,
        .results .percentage,
        .results .gradeSympol {
            font-size: 14px;
            color: #ff6e00;
            margin: 5px 0;
        }

        .enroll-status {
            font-weight: bold;
            text-align: center;
            padding: 10px;
            background-color: #cbf0e8;
            color: #00796b;
            border-radius: 5px;
            margin: 5px 0;
        }
          .enrollmentStatus{
           color: #1e5edf;
          }
    </style>
</head>

<body>
    <header>
        <img src="https://apostrophe.com.tr/wp-content/uploads/2021/02/apostrophe-Logo-short-form.png" alt="">
        <img src="https://apostrophe.com.tr/wp-content/uploads/2020/08/output-onlinepngtools.png" alt="" class="title">
    </header>
    <div class="container">
    <div class="personal-info">
      <h1>Personal Information</h1>
      <div class="id">
        <span>Student ID:</span>
        <span id="student-id">${student.id}</span>
      </div>
      <div class="name">
        <span>Full Name:</span>
        <span id="student-name">${student.firstName} ${student.lastName}</span>
      </div>
      <div class="age">
        <span>Age:</span>
        <span id="student-age">${student.age}</span>
      </div>
      <div class="grade">
        <span>Grade:</span>
        <span id="student-grade">${student.grade}</span>
      </div>
      <div class="phone">
        <span>Phone Number:</span>
        <span id="student-phone">${student.phoneNumber}</span>
      </div>
      <div class="address">
        <span>Address:</span>
        <span id="student-address">${student.address.street}, ${
    student.address.city
  }, ${student.address.state}, ${student.address.postalCode}</span>
      </div>
    </div>
    <div class="parents-info">
      <h1>Parents Information</h1>
      <div class="content">
        <div class="father">
          <div class="name"><span>Father Name:</span> <span id="father-name">${
            student.parentDetails.father.name
          }</span></div>
          <div class="occupation"><span>Occupation:</span> <span id="father-occupation">${
            student.parentDetails.father.occupation
          }</span></div>
          <div class="phone"><span>Phone Number:</span> <span id="father-phone">${
            student.parentDetails.father.phoneNumber
          }</span></div>
        </div>
        <div class="mother">
          <div class="name"><span>Mother Name:</span> <span id="mother-name">${
            student.parentDetails.mother.name
          }</span></div>
          <div class="occupation"><span>Occupation:</span> <span id="mother-occupation">${
            student.parentDetails.mother.occupation
          }</span></div>
          <div class="phone"><span>Phone Number:</span> <span id="mother-phone">${
            student.parentDetails.mother.phoneNumber
          }</span></div>
        </div>
      </div>
    </div>
    <div class="emergencyContact">
      <h1>Emergency Contact Information</h1>
      <div class="contant">
        <div class="name"><span>Name:</span> <span id="emergency-name">${
          student.emergencyContact.name
        }</span></div>
        <div class="relationship"><span>Relationship:</span> <span id="emergency-relationship">${
          student.emergencyContact.relationship
        }</span></div>
        <div class="phone"><span>Phone Number:</span> <span id="emergency-phone">${
          student.emergencyContact.phoneNumber
        }</span></div>
      </div>
    </div>
    <div class="subjects">
      <h1>Subjects</h1>
        ${student.subjects
          .map(
            (subject) => `
          <div class="card">
            <div class="subject-name"><span>Subject Name:</span> <span>${subject.name}</span></div>
            <div class="subject-teacher"><span>Teacher:</span> <span>${subject.teacher}</span></div>
            <div class="subject-marks"><span>Marks:</span> <span>${subject.marks}</span></div>
          </div>
        `
          )
          .join("")}
    </div>
    <div class="results">
  <h1>Results</h1>
  <div class="content">
    <div><span>Total Marks:</span> <span class="total">${
      student.results.totalMarks
    }</span></div>
    <div><span>Percentage:</span> <span class="percentage">${
      student.results.percentage
    }</span></div>
    <div><span>Grade:</span> <span class="gradeSympol">${
      student.results.grade
    }</span></div>
  </div>
</div>
    <div class="enroll-status">Enrollment Status: <span class="enrollmentStatus">${
      student.enrollmentStatus
    }</span></div>
  </div>

    <script src="services/pdfService.js"></script>
</body>
</html> `;

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\chrome-win\\chrome.exe", // Update this path if needed
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}
