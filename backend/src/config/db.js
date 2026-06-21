const mysql = require("mysql2/promise")

const db = mysql.createPool({
    host: "mysql-14fe164a-khanhkk173-433f.i.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_gVBbYgSCkudpEXgB_xc",
    database: "QLToanha"
})

module.exports = db

connection.connect((err) => {
  if (err) {
    console.log("Lỗi kết nối MySQL:", err);
  } else {
    console.log("Kết nối MySQL thành công");
  }
});

module.exports = connection;
