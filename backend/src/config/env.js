require('dotenv').config();

module.exports = {
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  PORT: process.env.PORT || 3000,
};