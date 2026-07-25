import axios from "./axiosConfig";

const EXCEL_MIME_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const getFilename = (contentDisposition) => {
    if (!contentDisposition) return "danh-sach-can-ho.xlsx";

    const utf8Filename = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i
    );
    if (utf8Filename?.[1]) {
        return decodeURIComponent(utf8Filename[1].replace(/"/g, ""));
    }

    const basicFilename = contentDisposition.match(
        /filename="?([^";]+)"?/i
    );
    return basicFilename?.[1] || "danh-sach-can-ho.xlsx";
};

export const exportApartmentList = async () => {
    const response = await axios.get("/export/apartments", {
        responseType: "blob"
    });

    const file = new Blob([response.data], {
        type: response.headers["content-type"] || EXCEL_MIME_TYPE
    });
    const objectUrl = window.URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = objectUrl;
    downloadLink.download = getFilename(
        response.headers["content-disposition"]
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
    }, 1000);
};
