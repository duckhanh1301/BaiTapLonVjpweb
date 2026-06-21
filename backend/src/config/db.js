const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "101db202",
  database: "quanly_toanha"
});

connection.connect((err) => {
  if (err) {
    console.log("Lỗi kết nối MySQL:", err);
  } else {
    console.log("Kết nối MySQL thành công");
  }
});

module.exports = connection;