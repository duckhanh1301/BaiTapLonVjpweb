const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const contractModel = require("../models/contractModel");

const DOTS = "........................................................";

const formatDate = (value) => {
    if (!value) {
        return "";
    }

    const date = value instanceof Date ? value : new Date(value);

    return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString("vi-VN");
};

const getDateParts = (value) => {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return {
            day: "....",
            month: "....",
            year: "...."
        };
    }

    return {
        day: String(date.getDate()).padStart(2, "0"),
        month: String(date.getMonth() + 1).padStart(2, "0"),
        year: date.getFullYear()
    };
};

const formatMoney = (value) => {
    return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} VNĐ`;
};

const envValue = (name) => {
    const value = process.env[name];
    return typeof value === "string" && value.trim() ? value.trim() : DOTS;
};

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
            margins: {
                top: 46,
                right: 52,
                bottom: 52,
                left: 52
            },
            bufferPages: true,
            info: {
                Title: `Hợp đồng thuê nhà số ${contract.MaHopDong}`,
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

        const paragraph = (text, options = {}) => {
            doc.font("Regular")
                .fontSize(10.5)
                .fillColor("#111111")
                .text(text, {
                    align: "justify",
                    lineGap: 2.2,
                    ...options
                });

            doc.moveDown(0.35);
        };

        const field = (label, value) => {
            doc.font("Bold")
                .fontSize(10.5)
                .text(`${label}: `, {
                    continued: true,
                    lineGap: 2
                });

            doc.font("Regular")
                .fontSize(10.5)
                .text(value || DOTS, {
                    lineGap: 2
                });
        };

        const article = (title, paragraphs) => {
            doc.moveDown(0.35);
            doc.font("Bold")
                .fontSize(11)
                .fillColor("#111111")
                .text(title, {
                    lineGap: 2
                });

            doc.moveDown(0.25);

            paragraphs.forEach((text) => paragraph(text));
        };

        const bullet = (text) => {
            paragraph(`• ${text}`, {
                indent: 14
            });
        };

        const issuedAt = getDateParts(contract.NgayTao || new Date());
        const place = process.env.CONTRACT_PLACE || contract.TenToaNha;

        doc.font("Bold")
            .fontSize(13)
            .text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", {
                align: "center"
            });

        doc.font("Bold")
            .fontSize(12)
            .text("Độc lập - Tự do - Hạnh phúc", {
                align: "center"
            });

        const underlineY = doc.y + 3;
        doc.moveTo(215, underlineY)
            .lineTo(380, underlineY)
            .lineWidth(0.8)
            .strokeColor("#111111")
            .stroke();

        doc.moveDown(1.2);

        doc.font("Regular")
            .fontSize(10.5)
            .text(
                `${place}, ngày ${issuedAt.day} tháng ${issuedAt.month} năm ${issuedAt.year}`,
                {
                    align: "right"
                }
            );

        doc.moveDown(0.8);

        doc.font("Bold")
            .fontSize(16)
            .text("HỢP ĐỒNG THUÊ NHÀ", {
                align: "center"
            });

        doc.font("Regular")
            .fontSize(10)
            .text(`Số: ${contract.MaHopDong}/HĐTN`, {
                align: "center"
            });

        doc.moveDown(1);

        paragraph("Căn cứ Bộ luật Dân sự năm 2015 và các quy định pháp luật có liên quan;");
        paragraph("Căn cứ vào nhu cầu và sự thỏa thuận tự nguyện của các bên tham gia Hợp đồng;");
        paragraph(
            `Hôm nay, ngày ${issuedAt.day} tháng ${issuedAt.month} năm ${issuedAt.year}, các bên gồm:`
        );

        doc.moveDown(0.25);
        doc.font("Bold").fontSize(11.5).text("BÊN CHO THUÊ (BÊN A)");
        field("Ông/Bà", envValue("LANDLORD_NAME"));
        field("CCCD số", envValue("LANDLORD_CCCD"));
        field("Ngày cấp", envValue("LANDLORD_CCCD_ISSUED_DATE"));
        field("Nơi cấp", envValue("LANDLORD_CCCD_ISSUED_BY"));
        field("Địa chỉ thường trú", envValue("LANDLORD_ADDRESS"));
        field("Số điện thoại", envValue("LANDLORD_PHONE"));

        doc.moveDown(0.55);
        doc.font("Bold").fontSize(11.5).text("BÊN THUÊ (BÊN B)");
        field("Ông/Bà", contract.HoTen);
        field("Ngày sinh", formatDate(contract.NgaySinh));
        field("CCCD số", contract.CCCD);
        field("Ngày cấp", DOTS);
        field("Nơi cấp", DOTS);
        field("Địa chỉ thường trú", contract.DiaChiNguoiThue || DOTS);
        field("Số điện thoại", contract.SoDienThoai);
        field("Email", contract.Email || DOTS);

        doc.moveDown(0.5);
        paragraph(
            "Bên A và Bên B sau đây gọi riêng là “Bên” và gọi chung là “Hai Bên”. Sau khi thảo luận, Hai Bên thống nhất ký kết Hợp đồng thuê nhà với các điều khoản dưới đây:"
        );

        article("Điều 1. Nhà ở và tài sản cho thuê kèm theo nhà ở", [
            `1.1. Bên A đồng ý cho Bên B thuê căn hộ ${contract.TenCanHo}, thuộc ${contract.TenToaNha}, tầng ${contract.Tang ?? DOTS}, tại địa chỉ ${contract.DiaChiToaNha}. Diện tích sử dụng: ${contract.DienTich ?? DOTS} m². Mục đích thuê: sử dụng làm nơi ở.`,
            "1.2. Bên A cam kết căn hộ nêu trên thuộc quyền quản lý, sử dụng hợp pháp của Bên A, không có tranh chấp và đủ điều kiện cho thuê. Bên A chịu trách nhiệm trước pháp luật về cam kết này.",
            "1.3. Tài sản, thiết bị kèm theo căn hộ được Hai Bên kiểm tra và ghi nhận tại biên bản bàn giao (nếu có)."
        ]);

        article("Điều 2. Bàn giao và sử dụng diện tích thuê", [
            `2.1. Bên A bàn giao căn hộ cho Bên B vào ngày ${formatDate(contract.NgayBatDau)}.`,
            "2.2. Bên B được quyền sử dụng căn hộ kể từ thời điểm nhận bàn giao và có trách nhiệm sử dụng đúng mục đích đã thỏa thuận."
        ]);

        article("Điều 3. Thời hạn thuê", [
            `3.1. Thời hạn thuê bắt đầu từ ngày ${formatDate(contract.NgayBatDau)} đến hết ngày ${formatDate(contract.NgayKetThuc)}.`,
            "3.2. Khi hết thời hạn thuê, nếu Bên B có nhu cầu tiếp tục thuê thì phải thông báo cho Bên A. Việc gia hạn chỉ có hiệu lực khi được Hai Bên thống nhất bằng văn bản."
        ]);

        article("Điều 4. Đặt cọc tiền thuê nhà", [
            `4.1. Bên B giao cho Bên A số tiền đặt cọc là ${formatMoney(contract.TienCoc)} ngay sau khi ký Hợp đồng để bảo đảm thực hiện các nghĩa vụ thuê nhà.`,
            "4.2. Nếu Bên B đơn phương chấm dứt Hợp đồng mà không thực hiện nghĩa vụ báo trước thì Bên A có quyền xử lý tiền đặt cọc theo thỏa thuận và thiệt hại thực tế.",
            "4.3. Nếu Bên A đơn phương chấm dứt Hợp đồng trái thỏa thuận thì Bên A phải hoàn trả tiền đặt cọc và bồi thường theo thỏa thuận của Hai Bên.",
            "4.4. Khi Hợp đồng kết thúc, Bên A hoàn trả tiền đặt cọc sau khi khấu trừ các khoản nợ, chi phí sửa chữa hư hỏng do lỗi của Bên B và nghĩa vụ tài chính khác (nếu có)."
        ]);

        article("Điều 5. Tiền thuê nhà", [
            `5.1. Tiền thuê căn hộ là ${formatMoney(contract.GiaThue)}/tháng.`,
            "5.2. Tiền thuê không bao gồm tiền điện, nước, internet, phí dịch vụ, vệ sinh và các chi phí phát sinh khác. Bên B thanh toán các khoản này theo mức sử dụng thực tế và quy định của đơn vị cung cấp."
        ]);

        article("Điều 6. Phương thức thanh toán tiền thuê nhà", [
            "6.1. Tiền thuê được thanh toán theo từng tháng, chậm nhất vào ngày 05 của tháng thuê.",
            "6.2. Việc thanh toán được thực hiện bằng đồng Việt Nam, bằng tiền mặt hoặc chuyển khoản theo thông tin do Bên A cung cấp.",
            "6.3. Các chi phí dịch vụ khác do Bên B trực tiếp thanh toán cho đơn vị có liên quan khi đến hạn."
        ]);

        doc.moveDown(0.35);
        doc.font("Bold").fontSize(11).text("Điều 7. Quyền và nghĩa vụ của Bên cho thuê");
        doc.moveDown(0.25);
        doc.font("Bold").fontSize(10.5).text("7.1. Quyền của Bên A");
        bullet("Yêu cầu Bên B thanh toán đầy đủ, đúng hạn tiền thuê và các khoản chi phí khác theo Hợp đồng.");
        bullet("Yêu cầu Bên B sửa chữa hoặc bồi thường phần hư hỏng do lỗi của Bên B gây ra.");
        doc.font("Bold").fontSize(10.5).text("7.2. Nghĩa vụ của Bên A");
        bullet("Bàn giao căn hộ cho Bên B đúng thời điểm và đúng hiện trạng đã thỏa thuận.");
        bullet("Bảo đảm quyền sử dụng căn hộ ổn định, độc lập và liên tục của Bên B trong thời hạn thuê.");
        bullet("Sửa chữa kịp thời những hư hỏng không do lỗi của Bên B và bảo đảm an toàn khi sử dụng.");
        bullet("Không xâm phạm trái pháp luật đến tài sản, đời sống riêng tư và việc sử dụng hợp pháp căn hộ của Bên B.");

        doc.moveDown(0.35);
        doc.font("Bold").fontSize(11).text("Điều 8. Quyền và nghĩa vụ của Bên thuê");
        doc.moveDown(0.25);
        doc.font("Bold").fontSize(10.5).text("8.1. Quyền của Bên B");
        bullet("Nhận bàn giao và sử dụng căn hộ theo đúng thỏa thuận trong Hợp đồng.");
        bullet("Yêu cầu Bên A sửa chữa những hư hỏng không do lỗi của Bên B gây ra.");
        bullet("Được tháo dỡ, di chuyển tài sản của mình khi kết thúc Hợp đồng, với điều kiện hoàn trả hiện trạng căn hộ.");
        doc.font("Bold").fontSize(10.5).text("8.2. Nghĩa vụ của Bên B");
        bullet("Sử dụng căn hộ đúng mục đích, giữ gìn tài sản và tuân thủ nội quy của tòa nhà.");
        bullet("Thanh toán đầy đủ, đúng hạn tiền thuê, tiền cọc và các chi phí phát sinh.");
        bullet("Không tự ý sửa chữa, cải tạo hoặc thay đổi kết cấu căn hộ nếu chưa có sự đồng ý bằng văn bản của Bên A.");
        bullet("Hoàn trả căn hộ khi hết thời hạn thuê hoặc khi Hợp đồng chấm dứt.");

        article("Điều 9. Đơn phương chấm dứt Hợp đồng", [
            "9.1. Bên muốn đơn phương chấm dứt Hợp đồng trước thời hạn phải thông báo bằng văn bản cho Bên còn lại ít nhất 30 (ba mươi) ngày, trừ trường hợp Hai Bên có thỏa thuận khác.",
            "9.2. Bên vi phạm nghĩa vụ báo trước hoặc nghĩa vụ cơ bản của Hợp đồng phải chịu trách nhiệm đối với thiệt hại thực tế phát sinh.",
            "9.3. Việc thanh toán công nợ, hoàn trả tiền cọc và bàn giao căn hộ phải được hoàn thành khi Hợp đồng chấm dứt."
        ]);

        const finalNotes = [
            "10.1. Hợp đồng có hiệu lực kể từ ngày Hai Bên ký, trừ khi Hai Bên có thỏa thuận khác bằng văn bản.",
            "10.2. Mọi sửa đổi, bổ sung Hợp đồng phải được lập thành văn bản và có chữ ký của Hai Bên.",
            "10.3. Hai Bên cam kết thực hiện nghiêm chỉnh các thỏa thuận trên tinh thần hợp tác và thiện chí. Tranh chấp trước hết được giải quyết bằng thương lượng; nếu không đạt được thỏa thuận thì được giải quyết theo quy định pháp luật.",
            "10.4. Hợp đồng được lập thành 02 (hai) bản có giá trị như nhau, mỗi Bên giữ 01 (một) bản."
        ];

        if (contract.GhiChu) {
            finalNotes.push(`10.5. Thỏa thuận bổ sung: ${contract.GhiChu}`);
        }

        article("Điều 10. Điều khoản thi hành", finalNotes);

        if (doc.y > doc.page.height - 180) {
            doc.addPage();
        }

        const signatureY = doc.y + 28;

        doc.font("Bold")
            .fontSize(11)
            .text("BÊN CHO THUÊ", 52, signatureY, {
                width: 220,
                align: "center"
            });

        doc.font("Bold")
            .fontSize(11)
            .text("BÊN THUÊ", 323, signatureY, {
                width: 220,
                align: "center"
            });

        doc.font("Regular")
            .fontSize(9.5)
            .text("(Ký và ghi rõ họ tên)", 52, signatureY + 20, {
                width: 220,
                align: "center"
            });

        doc.font("Regular")
            .fontSize(9.5)
            .text("(Ký và ghi rõ họ tên)", 323, signatureY + 20, {
                width: 220,
                align: "center"
            });

        doc.font("Bold")
            .fontSize(10.5)
            .text(
                process.env.LANDLORD_NAME || "",
                52,
                signatureY + 105,
                {
                    width: 220,
                    align: "center"
                }
            );

        doc.font("Bold")
            .fontSize(10.5)
            .text(contract.HoTen, 323, signatureY + 105, {
                width: 220,
                align: "center"
            });

        const pageRange = doc.bufferedPageRange();

        for (
            let pageIndex = pageRange.start;
            pageIndex < pageRange.start + pageRange.count;
            pageIndex += 1
        ) {
            doc.switchToPage(pageIndex);
            doc.font("Regular")
                .fontSize(8.5)
                .fillColor("#666666")
                .text(
                    `Trang ${pageIndex + 1}/${pageRange.count} - Hợp đồng số ${contract.MaHopDong}`,
                    52,
                    doc.page.height - 34,
                    {
                        width: doc.page.width - 104,
                        align: "center",
                        lineBreak: false
                    }
                );
        }

        doc.end();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: "Lỗi xuất PDF hợp đồng",
                error: error.message
            });
        } else {
            res.end();
        }
    }
};

module.exports = {
    exportContractPdf
};
