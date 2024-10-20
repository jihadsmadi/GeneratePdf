import express from "express";
import { generatePDF } from "../services/pdfService.js";
import { fetchData } from "../services/httpFetch.js";

const router = express.Router();
const url = "https://6714fd1b33bc2bfe40b8fec4.mockapi.io/api/v1/student";
let data;
fetchData(url)
  .then((data) => {
    if (data && data.length > 0) {
      return data[0]["student"];
    } else {
      throw new Error("No data found");
    }
  })
  .then((student) => (data = student))
  .catch((error) => {
    console.error("Error:", error.message);
  });

router.get("/generate-pdf", async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(data); // Call the function directly
    res.setHeader(
      "Content-disposition",
      'attachment; filename="studentInfo.pdf"'
    );
    res.setHeader("Content-type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error generating PDF");
  }
});

export default router;
