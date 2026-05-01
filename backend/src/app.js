const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/news", require("./modules/news/news.routes.js"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => {
  res.send('Server đang chạy tại port 3001');
});
module.exports = app;