const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/news", require("./routes/news.routes"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => {
  res.send('Hello World!');
});
module.exports = app;