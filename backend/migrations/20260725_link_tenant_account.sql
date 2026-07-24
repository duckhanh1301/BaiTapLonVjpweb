-- Liên kết một-một giữa hồ sơ người thuê và tài khoản đăng nhập.
-- Trong hệ thống hiện tại, tài khoản người thuê sử dụng role 'NhanVien'.
-- MaTaiKhoan tạm thời cho phép NULL để không gán sai dữ liệu cũ.

ALTER TABLE NguoiThue
    ADD COLUMN MaTaiKhoan INT NULL AFTER MaNguoiThue,
    ADD UNIQUE INDEX UQ_NguoiThue_MaTaiKhoan (MaTaiKhoan),
    ADD CONSTRAINT FK_NguoiThue_TaiKhoan
        FOREIGN KEY (MaTaiKhoan)
        REFERENCES TaiKhoan (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

DELIMITER $$

CREATE TRIGGER TRG_NguoiThue_ValidateTaiKhoan_Insert
BEFORE INSERT ON NguoiThue
FOR EACH ROW
BEGIN
    IF NEW.MaTaiKhoan IS NULL
       OR NOT EXISTS (
            SELECT 1
            FROM TaiKhoan
            WHERE id = NEW.MaTaiKhoan
              AND role = 'NhanVien'
       )
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'MaTaiKhoan phai tham chieu tai khoan co role NhanVien';
    END IF;
END$$

CREATE TRIGGER TRG_NguoiThue_ValidateTaiKhoan_Update
BEFORE UPDATE ON NguoiThue
FOR EACH ROW
BEGIN
    IF NEW.MaTaiKhoan IS NULL
       OR NOT EXISTS (
            SELECT 1
            FROM TaiKhoan
            WHERE id = NEW.MaTaiKhoan
              AND role = 'NhanVien'
       )
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'MaTaiKhoan phai tham chieu tai khoan co role NhanVien';
    END IF;
END$$

CREATE TRIGGER TRG_TaiKhoan_ProtectLinkedTenantRole
BEFORE UPDATE ON TaiKhoan
FOR EACH ROW
BEGIN
    IF OLD.role = 'NhanVien'
       AND (NEW.role IS NULL OR NEW.role <> 'NhanVien')
       AND EXISTS (
            SELECT 1
            FROM NguoiThue
            WHERE MaTaiKhoan = OLD.id
       )
    THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Khong the doi role cua tai khoan dang lien ket nguoi thue';
    END IF;
END$$

DELIMITER ;

-- Ví dụ backfill sau khi xác định đúng tài khoản của từng người thuê:
-- UPDATE NguoiThue
-- SET MaTaiKhoan = <ID_TAI_KHOAN_NGUOI_THUE>
-- WHERE MaNguoiThue = <ID_NGUOI_THUE>;
--
-- Sau khi không còn dữ liệu NULL:
-- ALTER TABLE NguoiThue
--     MODIFY COLUMN MaTaiKhoan INT NOT NULL;
