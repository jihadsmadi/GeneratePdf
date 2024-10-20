import PDFDocument from "pdfkit";

export function generatePDF(studentData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: { top: 10, left: 50, right: 30, bottom: 30 }, // Adjusted margins
    });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    let imagePath =
      "D:/Work Space/Programming/Back End/Node Js/project/images/output-onlinepngtools.png";

    // Get the width of the page to center the image
    const pageWidth = doc.page.width;
    const imageWidth = 200; // Reduced image size
    const imageX = (pageWidth - imageWidth) / 2;

    // Add the image at the top center
    doc.image(imagePath, imageX, 10, {
      // Adjusted top position
      width: imageWidth,
    });
    doc.moveDown(1); // Reduced space after the image

    // Add student details with colors
    doc
      .fontSize(18) // Reduced font size
      .fillColor("#1e5edf")
      .text("Student Details", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("black").text(`ID: ${studentData["id"]}`);
    doc.text(
      `Name: ${studentData["firstName"] + " " + studentData["lastName"]}`
    );
    doc.text(`Age: ${studentData["age"]}`);
    doc.text(`Grade: ${studentData["grade"]}`);
    doc.text(`Phone Number: ${studentData["phoneNumber"]}`);
    doc.text(`Email:${studentData["email"]}`);
    let address = studentData["address"];
    doc.text(
      `Address: ${address["street"]},${address["city"]}, ${address["state"]},${address["postalCode"]}`
    );
    doc.moveDown(0.5);

    // Add subjects and marks with colors
    doc.fontSize(14).fillColor("#ff6e00").text("Subjects", { underline: true });
    doc.moveDown(0.5);
    const subjects = studentData["subjects"];

    subjects.forEach((subject) => {
      doc.fontSize(10).fillColor("black").text(`Subject: ${subject.name}`);
      doc.text(`Teacher: ${subject.teacher}`);
      doc.text(`Marks: ${subject.marks}`);
      doc.moveDown(0.5);
    });

    // Add results with colors
    doc.fontSize(14).fillColor("#1e5edf").text("Results", { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor("black")
      .text(`Total Marks: ${studentData["results"].totalMarks}`);
    doc.text(`Percentage: ${studentData["results"].percentage}%`);
    doc.text(`Grade: ${studentData["results"].grade}`);
    doc.moveDown(0.5);

    // Add parent details with colors
    doc
      .fontSize(14)
      .fillColor("#ff6e00")
      .text("Parent Details", { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor("black")
      .text(
        `Father: ${studentData["parentDetails"]["father"].name}, Occupation: ${studentData["parentDetails"]["father"].occupation}, Phone: ${studentData["parentDetails"]["father"].phoneNumber}`
      );
    doc.text(
      `Mohter: ${studentData["parentDetails"]["mother"].name}, Occupation: ${studentData["parentDetails"]["mother"].occupation}, Phone: ${studentData["parentDetails"]["mother"].phoneNumber}`
    );
    doc.moveDown(0.5);

    // Add emergency contact with colors
    doc
      .fontSize(14)
      .fillColor("#1e5edf")
      .text("Emergency Contact", { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor("black")
      .text(
        `Name: ${studentData["emergencyContact"].name}, Relationship: ${studentData["emergencyContact"].relationship}, Phone: ${studentData["emergencyContact"].phoneNumber}`
      );
    doc.moveDown(0.5);

    // Add enrollment status with colors
    doc
      .fontSize(14)
      .fillColor("#ff6e00")
      .text("Enrollment Status", { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor("black")
      .text(`Status: ${studentData["enrollmentStatus"]}`);

    // Finalize the PDF and end the stream
    doc.end();
  });
}
