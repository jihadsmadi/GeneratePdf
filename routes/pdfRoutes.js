import express from "express";
import fs from "fs";
import { generatePDF } from "../services/pdfService.js";
import { fetchData } from "../services/httpFetch.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const url = "https://6714fd1b33bc2bfe40b8fec4.mockapi.io/api/v1/student";
let data;

fetchData(url)
  .then((responseData) => {
    if (responseData && responseData.length > 0) {
      data = responseData[0]["student"];
    } else {
      throw new Error("No data found");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error.message);
  });

router.get("/generate-pdf", async (req, res) => {
  try {
    if (!data) {
      throw new Error("Data not loaded");
    }

    const pdfBuffer = await generatePDF(data);

    // Define the file path
    const filePath = path.join(__dirname, "studentInfo.pdf");

    // Write the buffer to a file
    fs.writeFile(filePath, pdfBuffer, (err) => {
      if (err) {
        console.error("Error writing PDF file:", err);
        res.status(500).send("Error generating PDF");
        return;
      }

      res.setHeader(
        "Content-disposition",
        'attachment; filename="studentInfo.pdf"'
      );
      res.setHeader("Content-type", "application/pdf");
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending PDF file:", err);
          res.status(500).send("Error sending PDF");
        } else {
          // Delete the file after sending
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting PDF file:", err);
            }
          });
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    res.status(500).send("Error generating PDF");
  }
});

export default router;
