const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  apikey: process.env.apikey,
  PORT: process.env.PORT || 3001,
  MAX_PAGES: process.env.MAX_PAGES ? parseInt(process.env.MAX_PAGES, 10) : 3,
};