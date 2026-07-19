const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function seed() {
    try {
        // Xóa dữ liệu cũ trước
        await db.query('DELETE FROM TaiKhoan');
        console.log('🗑️ Đã xóa dữ liệu cũ');

        // Hash mật khẩu
        const hashedAdmin = await bcrypt.hash('123456', 10);
        const hashedNhanVien = await bcrypt.hash('123456', 10);

        // Chèn dữ liệu mới
        await db.query(
            'INSERT INTO TaiKhoan (email, password, role) VALUES (?, ?, ?), (?, ?, ?)',
            ['admin@gmail.com', hashedAdmin, 'Admin', 'nhanvien@gmail.com', hashedNhanVien, 'NhanVien']
        );

        console.log('✅ Seed dữ liệu thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi seed dữ liệu:', error.message);
    } finally {
        process.exit();
    }
}

seed();