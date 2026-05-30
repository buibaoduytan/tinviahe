const app = require("./app");
const { PORT } = require("./config/env");

app.listen(PORT, () => {
  console.log("====================================");
  console.log("TinViaHe Backend is running...");
  console.log(`Backend API: http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop the server");
  console.log("====================================");
});