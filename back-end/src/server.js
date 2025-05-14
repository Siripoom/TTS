const http = require("http");
const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5000;

// สร้าง HTTP Server
const server = http.createServer(app);

// เริ่มรันเซิร์ฟเวอร์
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
