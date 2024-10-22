import express from "express";
import fs from "fs";
import { generatePDF } from "../services/pdfService.js";
import { fetchData } from "../services/httpFetch.js";
import { sendEmail } from "../services/emailService.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const url = "https://6714fd1b33bc2bfe40b8fec4.mockapi.io/api/v1/student";
let student;

fetchData(url)
  .then((responseData) => {
    if (responseData && responseData.length > 0) {
      student = responseData[0]["student"];
    } else {
      throw new Error("No data found");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error.message);
  });

router.get("/send-email", async (req, res) => {
  try {
    if (!student) {
      throw new Error("Data not loaded");
    }

    const pdfBuffer = await generatePDF(student);

    // Define the file path
    let fileName = "studentInfo.pdf";
    const filePath = path.join(__dirname, fileName);

    // Write the buffer to a file
    await fs.writeFile(filePath, pdfBuffer, async (err) => {
      if (err) {
        console.error("Error writing PDF file:", err);
        res.status(500).send("Error generating PDF");
        return;
      }

      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; }
              .container { width: 80%; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
              .header { text-align: center; padding: 10px; background-color: #f2f2f2; border-bottom: 1px solid #ddd; }
              .content { padding: 20px; }
              .content h2 { color: #333; }
              .content p { line-height: 1.6; }
              .footer { text-align: center; padding: 10px; background-color: #f2f2f2; border-top: 1px solid #ddd; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Congratulations, ${student.firstName} ${
        student.lastName
      }!</h1>
              </div>
              <div class="content">
                  <h2>Student Information</h2>
                  <p><strong>ID:</strong> ${student.id}</p>
                  <p><strong>Name:</strong> ${student.firstName} ${
        student.lastName
      }</p>
                  <p><strong>Grade:</strong> ${student.grade}</p>
                  <p><strong>Age:</strong> ${student.age}</p>
                  <p><strong>Phone:</strong> ${student.phoneNumber}</p>
                  <p><strong>Email:</strong> ${student.email}</p>
                  <p><strong>Address:</strong> ${student.address.street}, ${
        student.address.city
      }, ${student.address.state}, ${student.address.postalCode}</p>
                  
                  <h2>Results</h2>
                  <p><strong>Total Marks:</strong> ${
                    student.results.totalMarks
                  }</p>
                  <p><strong>Percentage:</strong> ${
                    student.results.percentage
                  }%</p>
                  <p><strong>Grade:</strong> ${student.results.grade}</p>
                  
                  <h2>Subjects</h2>
                  <ul>
                      ${student.subjects
                        .map(
                          (subject) =>
                            `<li>${subject.name} (Teacher: ${subject.teacher}, Marks: ${subject.marks})</li>`
                        )
                        .join("")}
                  </ul>
              </div>
              <div class="footer">
                  <p>Keep up the great work, ${
                    student.firstName
                  }! We are proud of your achievements.</p>
              </div>
          </div>
      </body>
      </html>
      `;

      try {
        await sendEmail(
          "as3478989@gmail.com",
          "Congratulations on Your Results Hello World!",
          htmlContent,
          filePath,
          fileName
        );
        res.status(200).send("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } finally {
        // Delete the file after sending
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting PDF file:", err);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    res.status(500).send("Error generating PDF");
  }
});

export default router;
