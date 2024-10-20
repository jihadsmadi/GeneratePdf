import express from "express";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", pdfRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const gracefulShutdown = () => {
  console.log("Received kill signal, shutting down gracefully");
  app.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  // Force close server after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
