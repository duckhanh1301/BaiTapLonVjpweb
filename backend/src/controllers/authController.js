const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
        }

        const [rows] = await db.query('SELECT * FROM TaiKhoan WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

// Lấy thông tin user từ token
exports.registerTenant = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password, confirmPassword } = req.body;
        const fullName = req.body.fullName?.trim();
        const phone = req.body.phone?.trim();
        const citizenId = req.body.citizenId?.trim();

        if (!email || !password || !confirmPassword || !fullName || !phone || !citizenId) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Email không đúng định dạng.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Xác nhận mật khẩu không trùng khớp.' });
        }

        const [existingAccounts] = await db.query('SELECT id FROM TaiKhoan WHERE email = ? LIMIT 1', [email]);
        const [existingTenants] = await db.query('SELECT MaNguoiThue FROM NguoiThue WHERE CCCD = ? LIMIT 1', [citizenId]);
        if (existingAccounts.length > 0) {
            return res.status(409).json({ message: 'Email này đã được đăng ký.' });
        }
        if (existingTenants.length > 0) {
            return res.status(409).json({ message: 'CCCD này đã được đăng ký.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await db.getConnection();
        let result;
        try {
            await connection.beginTransaction();
            [result] = await connection.query(
                'INSERT INTO TaiKhoan (email, password, role) VALUES (?, ?, ?)',
                [email, hashedPassword, 'NguoiThue']
            );
            await connection.query(
                `INSERT INTO NguoiThue (MaTaiKhoan, HoTen, SoDienThoai, Email, CCCD, NgaySinh, DiaChi)
                 VALUES (?, ?, ?, ?, ?, NULL, NULL)`,
                [result.insertId, fullName, phone, email, citizenId]
            );
            await connection.commit();
        } catch (transactionError) {
            await connection.rollback();
            throw transactionError;
        } finally {
            connection.release();
        }

        return res.status(201).json({
            message: 'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
            user: { id: result.insertId, email, role: 'NguoiThue' }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, email, role FROM TaiKhoan WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới không trùng khớp.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        // Get current user
        const [rows] = await db.query('SELECT * FROM TaiKhoan WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const user = rows[0];

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu cũ không đúng.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query('UPDATE TaiKhoan SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};
