import axios from "./axiosConfig";

const PDF_MIME_TYPE = "application/pdf";

const getContractFilename = (contentDisposition, contractId) => {
    if (!contentDisposition) return `hop-dong-${contractId}.pdf`;

    const utf8Filename = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i
    );
    if (utf8Filename?.[1]) {
        return decodeURIComponent(utf8Filename[1].replace(/"/g, ""));
    }

    const basicFilename = contentDisposition.match(
        /filename="?([^";]+)"?/i
    );
    return basicFilename?.[1] || `hop-dong-${contractId}.pdf`;
};

export const getAllContracts = async () => {
    const response = await axios.get("/contracts");
    return response.data;
};

export const getMyContracts = async () => {
    const response = await axios.get("/contracts/my-contracts");
    return response.data;
};

export const getContractOptions = async () => {
    const response = await axios.get("/contracts/options");
    return response.data;
};

export const createContract = async (data) => {
    const response = await axios.post("/contracts", data);
    return response.data;
};

export const downloadContractPdf = async (contractId) => {
    const response = await axios.get(`/contracts/${contractId}/pdf`, {
        responseType: "blob"
    });
    const file = new Blob([response.data], {
        type: response.headers["content-type"] || PDF_MIME_TYPE
    });
    const objectUrl = window.URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = objectUrl;
    downloadLink.download = getContractFilename(
        response.headers["content-disposition"],
        contractId
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
    }, 1000);
};
