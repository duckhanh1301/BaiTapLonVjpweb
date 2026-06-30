const express = require("express");
const path = require("path");
const db = require("./config/db");

const app = express();

app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.get("/", (req, res) => {

    res.send("Backend quản lý tòa nhà đang chạy");

});

app.listen(3000, () => {

    console.log("Server đang chạy tại http://localhost:3000");

});