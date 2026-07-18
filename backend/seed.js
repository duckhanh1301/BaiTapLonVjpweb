const bcrypt = require('bcryptjs');
const db = require('./src/config/db');
async function seed(){
    try{
        const hashedPasswordAdmin = await bcrypt.hash('123456', 10);
        const hashedPasswordNhanVien = await bcrypt.hash('123456', 10);
        await db.query(
            `INSERT INTO TaiKhoan (email, password, role) VALUES (?, ?, ?), (?, ?, ?)`,
           ['admin@gmail.com', hashedPasswordAdmin, 'Admin', 'nhanvien@gmail.com', hashedPasswordNhanVien, 'NhanVien']
        );
        console.log('Dữ liệu đã được seed thành công');
    } catch (error){
        console.error('Lỗi khi seed dữ liệu:', error.message);
    } finally {
        process.exit();
    }
}
seed();