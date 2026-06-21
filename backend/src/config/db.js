const mysql = require("mysql2/promise")

const db = mysql.createPool({
    host: "mysql-14fe164a-khanhkk173-433f.i.aivencloud.com",
    user: "avnadmin",
    port: "21512",
    password: "AVNS_gVBbYgSCkudpEXgB_xc",
    database: "defaultdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

db.getConnection()
    .then((connection) => {
        console.log("Kết nối MySQL thành công");
        connection.release();
    })
    .catch((err) => {
        console.error("Lỗi kết nối MySQL:", err.message);
    });

module.exports = db;
