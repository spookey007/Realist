import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || "Production"; // Default to 'Production'

(async () => {
  let app;

  if (MODE === "Development") {
    const { default: devApp } = await import("./dev.js");
    app = devApp;
  } else {
    const { default: prodApp } = await import("./server.js");
    app = prodApp;
  }

  app.listen(PORT, () => {
    console.log(`App is running in ${MODE} mode on port ${PORT}`);
  });
})();
