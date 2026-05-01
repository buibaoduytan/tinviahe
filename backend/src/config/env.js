const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

module.exports = {
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  PORT: process.env.PORT || 3001,
};