const path = require("path");
const dotenv = require("dotenv");

// __dirname = backend/src/config
// Cần đi lên 3 cấp để đến root của backend
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  apikey: process.env.apikey,
  PORT: process.env.PORT || 3001,
};