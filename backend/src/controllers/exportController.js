const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const apartmentModel = require("../models/apartmentModel");
const tenantModel = require("../models/tenantModel");
const contractModel = require("../models/contractModel");

const toExcelDate = (value) => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    const [year, month, day] = String(value)
        .slice(0, 10)
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);
};

const formatDate = (value) => {
    if (!value) {
        return "";
    }

    if (value instanceof Date) {
        return value.toLocaleDateString("vi-VN");
    }

    const [year, month, day] = String(value)
        .slice(0, 10)
        .split("-");

    return `${day}/${month}/${year}`;
};

const formatMoney = (value) => {
    return `${new Intl.NumberFormat("vi-VN").format(Number(value))} VNĐ`;
};

const styleWorksheet = (worksheet) => {
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
        bold: true,
        color: { argb: "FFFFFFFF" }
    };

    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2563EB" }
    };

    headerRow.alignment = {
        vertical: "middle",
        horizontal: "center"
    };

    headerRow.height = 25;

    worksheet.views = [
        {
            state: "frozen",
            ySplit: 1
        }
    ];

    worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: worksheet.columnCount }
    };

    worksheet.eachRow((row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "FFD1D5DB" } },
                left: { style: "thin", color: { argb: "FFD1D5DB" } },
                bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
                right: { style: "thin", color: { argb: "FFD1D5DB" } }
            };

            cell.alignment = {
                ...cell.alignment,
                vertical: "middle",
                wrapText: true
            };
        });
    });
};

const sendWorkbook = async (res, workbook, filename) => {
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
    );

    await workbook.xlsx.write(res);
    res.end();
};

// GET /api/export/apartments
const exportApartments = async (req, res) => {
    try {
        const apartments = await apartmentModel.getAllApartments();

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Quan ly toa nha";

        const worksheet = workbook.addWorksheet("Can ho");

        worksheet.columns = [
            { header: "Mã căn hộ", key: "MaCanHo", width: 12 },
            { header: "Tòa nhà", key: "TenToaNha", width: 25 },
            { header: "Tên căn hộ", key: "TenCanHo", width: 20 },
            { header: "Giá thuê", key: "GiaThue", width: 18 },
            { header: "Diện tích", key: "DienTich", width: 15 },
            { header: "Tầng", key: "Tang", width: 10 },
            { header: "Phòng ngủ", key: "SoPhongNgu", width: 14 },
            { header: "Phòng tắm", key: "SoPhongTam", width: 14 },
            { header: "Trạng thái", key: "TrangThai", width: 16 },
            { header: "Mô tả", key: "MoTa", width: 35 }
        ];

        worksheet.addRows(
            apartments.map((apartment) => ({
                ...apartment,
                GiaThue:
                    apartment.GiaThue === null
                        ? null
                        : Number(apartment.GiaThue),
                DienTich:
                    apartment.DienTich === null
                        ? null
                        : Number(apartment.DienTich)
            }))
        );

        worksheet.getColumn("GiaThue").numFmt = "#,##0";
        worksheet.getColumn("DienTich").numFmt = "#,##0.00";

        styleWorksheet(worksheet);

        await sendWorkbook(
            res,
            workbook,
            "danh-sach-can-ho.xlsx"
        );
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: "Lỗi xuất danh sách căn hộ",
                error: error.message
            });
        }
    }
};

// GET /api/export/tenants
const exportTenants = async (req, res) => {
    try {
        const tenants = await tenantModel.getAllTenants();

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Quan ly toa nha";

        const worksheet = workbook.addWorksheet("Nguoi thue");

        worksheet.columns = [
            { header: "Mã người thuê", key: "MaNguoiThue", width: 16 },
            { header: "Họ tên", key: "HoTen", width: 25 },
            { header: "Số điện thoại", key: "SoDienThoai", width: 18 },
            { header: "Email", key: "Email", width: 28 },
            { header: "CCCD", key: "CCCD", width: 20 },
            { header: "Ngày sinh", key: "NgaySinh", width: 15 },
            { header: "Địa chỉ", key: "DiaChi", width: 35 },
            { header: "Ngày tạo", key: "NgayTao", width: 20 }
        ];

        worksheet.addRows(
            tenants.map((tenant) => ({
                ...tenant,
                NgaySinh: toExcelDate(tenant.NgaySinh),
                NgayTao: toExcelDate(tenant.NgayTao)
            }))
        );

        worksheet.getColumn("NgaySinh").numFmt = "dd/mm/yyyy";
        worksheet.getColumn("NgayTao").numFmt = "dd/mm/yyyy";

        styleWorksheet(worksheet);

        await sendWorkbook(
            res,
            workbook,
            "danh-sach-nguoi-thue.xlsx"
        );
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: "Lỗi xuất danh sách người thuê",
                error: error.message
            });
        }
    }
};

// GET /api/export/contracts
const exportContracts = async (req, res) => {
    try {
        const contracts = await contractModel.getAllContracts();

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Quan ly toa nha";

        const worksheet = workbook.addWorksheet("Hop dong");

        worksheet.columns = [
            { header: "Mã hợp đồng", key: "MaHopDong", width: 15 },
            { header: "Người thuê", key: "HoTen", width: 25 },
            { header: "CCCD", key: "CCCD", width: 20 },
            { header: "Căn hộ", key: "TenCanHo", width: 20 },
            { header: "Ngày bắt đầu", key: "NgayBatDau", width: 16 },
            { header: "Ngày kết thúc", key: "NgayKetThuc", width: 16 },
            { header: "Giá thuê", key: "GiaThue", width: 18 },
            { header: "Tiền cọc", key: "TienCoc", width: 18 },
            { header: "Trạng thái", key: "TrangThai", width: 16 },
            { header: "Ghi chú", key: "GhiChu", width: 35 }
        ];

        worksheet.addRows(
            contracts.map((contract) => ({
                ...contract,
                NgayBatDau: toExcelDate(contract.NgayBatDau),
                NgayKetThuc: toExcelDate(contract.NgayKetThuc),
                GiaThue: Number(contract.GiaThue),
                TienCoc: Number(contract.TienCoc)
            }))
        );

        worksheet.getColumn("NgayBatDau").numFmt = "dd/mm/yyyy";
        worksheet.getColumn("NgayKetThuc").numFmt = "dd/mm/yyyy";
        worksheet.getColumn("GiaThue").numFmt = "#,##0";
        worksheet.getColumn("TienCoc").numFmt = "#,##0";

        styleWorksheet(worksheet);

        await sendWorkbook(
            res,
            workbook,
            "danh-sach-hop-dong.xlsx"
        );
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: "Lỗi xuất danh sách hợp đồng",
                error: error.message
            });
        }
    }
};

// GET /api/contracts/:id/pdf
const exportContractPdf = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Mã hợp đồng không hợp lệ"
            });
        }

        const contract = await contractModel.getContractById(id);

        if (!contract) {
            return res.status(404).json({
                message: "Không tìm thấy hợp đồng"
            });
        }

        const regularFontPath = path.join(
            __dirname,
            "../assets/fonts/NotoSans-Regular.ttf"
        );

        const boldFontPath = path.join(
            __dirname,
            "../assets/fonts/NotoSans-Bold.ttf"
        );

        if (
            !fs.existsSync(regularFontPath) ||
            !fs.existsSync(boldFontPath)
        ) {
            return res.status(500).json({
                message: "Chưa có font tiếng Việt dùng để xuất PDF"
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
            info: {
                Title: `Hợp đồng ${contract.MaHopDong}`,
                Author: "Hệ thống quản lý tòa nhà"
            }
        });

        doc.registerFont("Regular", regularFontPath);
        doc.registerFont("Bold", boldFontPath);

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="hop-dong-${contract.MaHopDong}.pdf"`
        );

        doc.pipe(res);

        const writeField = (label, value) => {
            doc.font("Bold")
                .fontSize(11)
                .text(`${label}: `, { continued: true });

            doc.font("Regular")
                .fontSize(11)
                .text(value === null || value === undefined ? "" : String(value));
        };

        doc.font("Bold")
            .fontSize(18)
            .text("HỢP ĐỒNG THUÊ CĂN HỘ", {
                align: "center"
            });

        doc.moveDown(0.5);

        doc.font("Regular")
            .fontSize(11)
            .text(`Mã hợp đồng: ${contract.MaHopDong}`, {
                align: "center"
            });

        doc.moveDown(2);

        doc.font("Bold")
            .fontSize(13)
            .text("1. THÔNG TIN NGƯỜI THUÊ");

        doc.moveDown(0.5);

        writeField("Họ và tên", contract.HoTen);
        writeField("CCCD", contract.CCCD);
        writeField("Số điện thoại", contract.SoDienThoai);
        writeField("Email", contract.Email || "Không có");
        writeField("Địa chỉ", contract.DiaChiNguoiThue || "Không có");

        doc.moveDown();

        doc.font("Bold")
            .fontSize(13)
            .text("2. THÔNG TIN CĂN HỘ");

        doc.moveDown(0.5);

        writeField("Tên căn hộ", contract.TenCanHo);
        writeField("Tòa nhà", contract.TenToaNha);
        writeField("Địa chỉ tòa nhà", contract.DiaChiToaNha);

        doc.moveDown();

        doc.font("Bold")
            .fontSize(13)
            .text("3. THÔNG TIN HỢP ĐỒNG");

        doc.moveDown(0.5);

        writeField("Ngày bắt đầu", formatDate(contract.NgayBatDau));
        writeField("Ngày kết thúc", formatDate(contract.NgayKetThuc));
        writeField("Giá thuê", formatMoney(contract.GiaThue));
        writeField("Tiền cọc", formatMoney(contract.TienCoc));
        writeField("Trạng thái", contract.TrangThai);
        writeField("Ghi chú", contract.GhiChu || "Không có");

        doc.moveDown(1.5);

        doc.font("Regular")
            .fontSize(11)
            .text(
                "Hai bên xác nhận các thông tin trên là chính xác và đồng ý thực hiện đầy đủ các điều khoản của hợp đồng.",
                {
                    align: "justify"
                }
            );

        const signatureY = doc.y + 40;

        doc.font("Bold")
            .text("ĐẠI DIỆN BÊN CHO THUÊ", 50, signatureY, {
                width: 230,
                align: "center"
            });

        doc.font("Bold")
            .text("NGƯỜI THUÊ", 320, signatureY, {
                width: 230,
                align: "center"
            });

        doc.font("Regular")
            .fontSize(10)
            .text("(Ký và ghi rõ họ tên)", 50, signatureY + 22, {
                width: 230,
                align: "center"
            });

        doc.font("Regular")
            .fontSize(10)
            .text("(Ký và ghi rõ họ tên)", 320, signatureY + 22, {
                width: 230,
                align: "center"
            });

        doc.end();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: "Lỗi xuất PDF hợp đồng",
                error: error.message
            });
        }
    }
};

module.exports = {
    exportApartments,
    exportTenants,
    exportContracts,
    exportContractPdf
};