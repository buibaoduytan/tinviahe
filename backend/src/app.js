const express = require("express");
const cors = require("cors");
const app = express();
const { PORT } = require("./config/env");

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api/news", require("./modules/news/news.routes.js"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => {
  res.send('Server đang chạy tại port ' + PORT);
});

app.listen(PORT, () => {
  console.log("====================================");
  console.log("TinViaHe Backend is running...");
  console.log(`Backend API: http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop the server");
  console.log("====================================");
});
module.exports = app;