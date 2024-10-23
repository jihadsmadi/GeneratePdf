import nodemailer from "nodemailer";

let myEmail = "jihadsmadi41@gmail.com";

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: myEmail,
    pass: "yourGeneratedPassword",
  },
});

// Function to send email
export const sendEmail = async (
  to,
  subject,
  htmlContent,
  pdfPath,
  fileName
) => {
  try {
    let info = await transporter.sendMail({
      from: myEmail,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
