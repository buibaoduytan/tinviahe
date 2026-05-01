const express = require("express");
const { fetchNews } = require("./news.controllers");
const router = express.Router();

router.get("/", fetchNews);

module.exports = router;