CREATE TABLE YeuCauSuaChua (
    MaYeuCau INT AUTO_INCREMENT PRIMARY KEY,
    MaNguoiThue INT NOT NULL,
    MaHopDong INT NULL,
    LoaiSuCo VARCHAR(100) NOT NULL,
    MoTa TEXT NOT NULL,
    MucDoUuTien ENUM('BinhThuong','KhanCap','RatKhanCap') NOT NULL DEFAULT 'BinhThuong',
    TrangThai ENUM('ChoXuLy','DangXuLy','HoanThanh','TuChoi') NOT NULL DEFAULT 'ChoXuLy',
    GhiChuXuLy TEXT NULL,
    NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_YCSC_NguoiThue FOREIGN KEY (MaNguoiThue) REFERENCES NguoiThue(MaNguoiThue),
    CONSTRAINT FK_YCSC_HopDong FOREIGN KEY (MaHopDong) REFERENCES HopDong(MaHopDong)
);

CREATE TABLE HoaDonThanhToan (
    MaHoaDon INT AUTO_INCREMENT PRIMARY KEY,
    MaHopDong INT NOT NULL,
    KyThanhToan DATE NOT NULL,
    SoTien DECIMAL(15,2) NOT NULL,
    HanThanhToan DATE NOT NULL,
    NgayThanhToan DATE NULL,
    TrangThai ENUM('ChoThanhToan','DaThanhToan','QuaHan','TuChoi') NOT NULL DEFAULT 'ChoThanhToan',
    GhiChu VARCHAR(500) NULL,
    NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY UQ_HoaDon_KyHopDong (MaHopDong, KyThanhToan),
    CONSTRAINT FK_HoaDon_HopDong FOREIGN KEY (MaHopDong) REFERENCES HopDong(MaHopDong)
);
