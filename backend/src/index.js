const app = require("./app");
const { PORT } = require("./config/env");

app.listen(PORT, () => {
  console.log(`Backend API: http://localhost:${PORT}`);
});