import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FaBuilding,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaDownload,
    FaEnvelope,
    FaExclamationCircle,
    FaFileContract,
    FaFilePdf,
    FaHome,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaPlus,
    FaSearch,
    FaTimesCircle,
    FaUser
} from "react-icons/fa";

import ContractForm from "../components/ContractForm";
import {
    createContract,
    downloadContractPdf,
    getAllContracts,
    getContractOptions
} from "../services/contractService";
import "../styles/Management.css";
import "../styles/ContractPage.css";

const formatDate = (value) => {
    if (!value) return "Chưa cập nhật";

    const [year, month, day] = String(value).slice(0, 10).split("-");
    return year && month && day
        ? `${day}/${month}/${year}`
        : "Chưa cập nhật";
};

const getDaysRemaining = (value) => {
    if (!value) return null;

    const endDate = new Date(`${String(value).slice(0, 10)}T23:59:59`);
    const difference = endDate.getTime() - Date.now();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const getStatusMeta = (status) => {
    if (status === "HieuLuc") {
        return { label: "Đang hiệu lực", className: "is-active" };
    }
    if (status === "HetHan") {
        return { label: "Hết hạn", className: "is-expired" };
    }
    if (status === "DaHuy") {
        return { label: "Đã hủy", className: "is-cancelled" };
    }
    return { label: status || "Chưa cập nhật", className: "is-neutral" };
};

const getErrorMessage = (error, fallback) => (
    error?.response?.data?.message || fallback
);

const ContractPage = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";
    const [contracts, setContracts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [exportingId, setExportingId] = useState(null);
    const [pageError, setPageError] = useState("");
    const [notice, setNotice] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [options, setOptions] = useState({
        tenants: [],
        accounts: [],
        apartments: []
    });

    const loadContracts = useCallback(async () => {
        if (!isAdmin) return;

        setIsLoading(true);
        setPageError("");
        try {
            const [contractData, optionData] = await Promise.all([
                getAllContracts(),
                getContractOptions()
            ]);
            setContracts(Array.isArray(contractData) ? contractData : []);
            setOptions({
                tenants: Array.isArray(optionData?.tenants)
                    ? optionData.tenants
                    : [],
                accounts: Array.isArray(optionData?.accounts)
                    ? optionData.accounts
                    : [],
                apartments: Array.isArray(optionData?.apartments)
                    ? optionData.apartments
                    : []
            });
        } catch (error) {
            setPageError(getErrorMessage(
                error,
                "Không thể tải danh sách hợp đồng. Vui lòng thử lại."
            ));
        } finally {
            setIsLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        const timeoutId = window.setTimeout(loadContracts, 0);
        return () => window.clearTimeout(timeoutId);
    }, [loadContracts]);

    useEffect(() => {
        if (!notice) return undefined;
        const timeoutId = window.setTimeout(() => setNotice(""), 3500);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const filteredContracts = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLocaleLowerCase("vi");

        return contracts.filter((contract) => {
            const matchesKeyword = !normalizedKeyword || [
                contract.MaHopDong,
                contract.HoTen,
                contract.SoDienThoai,
                contract.Email,
                contract.TenCanHo,
                contract.TenToaNha,
                contract.DiaChiToaNha
            ].some((value) => (
                String(value || "")
                    .toLocaleLowerCase("vi")
                    .includes(normalizedKeyword)
            ));

            const matchesStatus = statusFilter === "all"
                || contract.TrangThai === statusFilter;

            return matchesKeyword && matchesStatus;
        });
    }, [contracts, keyword, statusFilter]);

    const statistics = useMemo(() => {
        const active = contracts.filter(
            (contract) => contract.TrangThai === "HieuLuc"
        ).length;
        const expiring = contracts.filter((contract) => {
            const daysRemaining = getDaysRemaining(contract.NgayKetThuc);
            return contract.TrangThai === "HieuLuc"
                && daysRemaining !== null
                && daysRemaining >= 0
                && daysRemaining <= 30;
        }).length;
        const ended = contracts.filter(
            (contract) => (
                contract.TrangThai === "HetHan"
                || contract.TrangThai === "DaHuy"
            )
        ).length;

        return {
            total: contracts.length,
            active,
            expiring,
            ended
        };
    }, [contracts]);

    const handleExport = async (contract) => {
        if (exportingId !== null) return;

        setExportingId(contract.MaHopDong);
        setPageError("");
        try {
            await downloadContractPdf(contract.MaHopDong);
            setNotice(`Đã xuất hợp đồng #${contract.MaHopDong}.`);
        } catch (error) {
            setPageError(getErrorMessage(
                error,
                `Không thể xuất hợp đồng #${contract.MaHopDong}.`
            ));
        } finally {
            setExportingId(null);
        }
    };

    const openCreateForm = () => {
        setFormError("");
        setShowCreateForm(true);
    };

    const closeCreateForm = () => {
        if (isSaving) return;
        setFormError("");
        setShowCreateForm(false);
    };

    const handleCreate = async (payload) => {
        if (isSaving) return;

        setIsSaving(true);
        setFormError("");
        try {
            const result = await createContract(payload);
            setShowCreateForm(false);
            setNotice(
                `Đã tạo hợp đồng #${result.MaHopDong} thành công.`
            );
            await loadContracts();
        } catch (error) {
            setFormError(getErrorMessage(
                error,
                "Không thể tạo hợp đồng. Vui lòng kiểm tra lại thông tin."
            ));
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="contract-page">
                <div className="contract-access-denied">
                    <FaExclamationCircle aria-hidden="true" />
                    <h2>Truy cập bị từ chối</h2>
                    <p>Chỉ tài khoản Admin mới có thể xem hợp đồng cho thuê.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="contract-page">
            {notice && (
                <div className="contract-toast" role="status">
                    <FaCheckCircle aria-hidden="true" />
                    {notice}
                </div>
            )}

            <section className="contract-heading">
                <div>
                    <span className="contract-eyebrow">Vận hành cho thuê</span>
                    <h1>Quản lý hợp đồng</h1>
                    <p>
                        Theo dõi người thuê, căn hộ, thời hạn và trạng thái hợp đồng.
                    </p>
                </div>
                <button
                    className="contract-create-button"
                    type="button"
                    onClick={openCreateForm}
                >
                    <FaPlus aria-hidden="true" />
                    Tạo hợp đồng
                </button>
            </section>

            <section className="contract-stat-grid" aria-label="Tổng quan hợp đồng">
                <article className="contract-stat-card is-purple">
                    <span><FaFileContract aria-hidden="true" /></span>
                    <div>
                        <small>Tổng hợp đồng</small>
                        <strong>{statistics.total}</strong>
                        <p>Đã ghi nhận</p>
                    </div>
                </article>
                <article className="contract-stat-card is-green">
                    <span><FaCheckCircle aria-hidden="true" /></span>
                    <div>
                        <small>Đang hiệu lực</small>
                        <strong>{statistics.active}</strong>
                        <p>Hợp đồng đang thuê</p>
                    </div>
                </article>
                <article className="contract-stat-card is-orange">
                    <span><FaClock aria-hidden="true" /></span>
                    <div>
                        <small>Sắp hết hạn</small>
                        <strong>{statistics.expiring}</strong>
                        <p>Trong vòng 30 ngày</p>
                    </div>
                </article>
                <article className="contract-stat-card is-slate">
                    <span><FaTimesCircle aria-hidden="true" /></span>
                    <div>
                        <small>Đã kết thúc</small>
                        <strong>{statistics.ended}</strong>
                        <p>Hết hạn hoặc đã hủy</p>
                    </div>
                </article>
            </section>

            <section className="contract-panel">
                <header className="contract-panel-header">
                    <div>
                        <h2>Danh sách hợp đồng</h2>
                        <p>
                            Hiển thị <strong>{filteredContracts.length}</strong>
                            {" "}trên {contracts.length} hợp đồng
                        </p>
                    </div>

                    <div className="contract-toolbar">
                        <label className="contract-search">
                            <FaSearch aria-hidden="true" />
                            <input
                                type="search"
                                aria-label="Tìm kiếm hợp đồng"
                                placeholder="Tìm người thuê, căn hộ, tòa nhà..."
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                            />
                        </label>
                        <select
                            className="contract-filter"
                            aria-label="Lọc trạng thái hợp đồng"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="HieuLuc">Đang hiệu lực</option>
                            <option value="HetHan">Hết hạn</option>
                            <option value="DaHuy">Đã hủy</option>
                        </select>
                    </div>
                </header>

                {pageError && (
                    <div className="contract-page-error" role="alert">
                        <FaExclamationCircle aria-hidden="true" />
                        <span>{pageError}</span>
                        <button type="button" onClick={loadContracts}>
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="contract-table-wrap">
                    <table className="contract-table">
                        <thead>
                            <tr>
                                <th>Hợp đồng</th>
                                <th>Người thuê</th>
                                <th>Căn hộ cho thuê</th>
                                <th>Địa chỉ</th>
                                <th>Thời hạn</th>
                                <th>Trạng thái</th>
                                <th aria-label="Xuất hợp đồng" />
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <tr className="contract-skeleton-row" key={index}>
                                        <td colSpan="7"><span /></td>
                                    </tr>
                                ))
                            ) : filteredContracts.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="contract-empty">
                                            <span>
                                                <FaFileContract aria-hidden="true" />
                                            </span>
                                            <h3>Không tìm thấy hợp đồng</h3>
                                            <p>
                                                Thử thay đổi từ khóa hoặc bộ lọc trạng thái.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredContracts.map((contract) => {
                                    const status = getStatusMeta(contract.TrangThai);
                                    const daysRemaining = getDaysRemaining(
                                        contract.NgayKetThuc
                                    );

                                    return (
                                        <tr key={contract.MaHopDong}>
                                            <td>
                                                <div className="contract-code">
                                                    <span>
                                                        <FaFileContract aria-hidden="true" />
                                                    </span>
                                                    <div>
                                                        <strong>
                                                            HĐ-{String(contract.MaHopDong).padStart(4, "0")}
                                                        </strong>
                                                        <small>
                                                            Mã #{contract.MaHopDong}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contract-tenant">
                                                    <span>
                                                        <FaUser aria-hidden="true" />
                                                    </span>
                                                    <div>
                                                        <strong>{contract.HoTen}</strong>
                                                        {contract.SoDienThoai && (
                                                            <small>
                                                                <FaPhoneAlt aria-hidden="true" />
                                                                {contract.SoDienThoai}
                                                            </small>
                                                        )}
                                                        {contract.Email && (
                                                            <small>
                                                                <FaEnvelope aria-hidden="true" />
                                                                {contract.Email}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contract-apartment">
                                                    <strong>
                                                        <FaHome aria-hidden="true" />
                                                        {contract.TenCanHo}
                                                    </strong>
                                                    <small>
                                                        <FaBuilding aria-hidden="true" />
                                                        {contract.TenToaNha}
                                                        {contract.Tang
                                                            ? ` · Tầng ${contract.Tang}`
                                                            : ""}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contract-address">
                                                    <FaMapMarkerAlt aria-hidden="true" />
                                                    <span>
                                                        {contract.DiaChiToaNha
                                                            || "Chưa cập nhật địa chỉ"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contract-term">
                                                    <strong>
                                                        <FaCalendarAlt aria-hidden="true" />
                                                        {formatDate(contract.NgayBatDau)}
                                                    </strong>
                                                    <span aria-hidden="true">→</span>
                                                    <strong>
                                                        {formatDate(contract.NgayKetThuc)}
                                                    </strong>
                                                    {contract.TrangThai === "HieuLuc"
                                                        && daysRemaining !== null
                                                        && (
                                                            <small className={
                                                                daysRemaining <= 30
                                                                    ? "is-warning"
                                                                    : ""
                                                            }>
                                                                {daysRemaining >= 0
                                                                    ? `Còn ${daysRemaining} ngày`
                                                                    : `Quá hạn ${Math.abs(daysRemaining)} ngày`}
                                                            </small>
                                                        )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`contract-status ${status.className}`}>
                                                    <i aria-hidden="true" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="contract-export-button"
                                                    type="button"
                                                    onClick={() => handleExport(contract)}
                                                    disabled={exportingId !== null}
                                                    aria-label={`Xuất hợp đồng ${contract.MaHopDong}`}
                                                >
                                                    {exportingId === contract.MaHopDong
                                                        ? <FaDownload aria-hidden="true" />
                                                        : <FaFilePdf aria-hidden="true" />}
                                                    <span>
                                                        {exportingId === contract.MaHopDong
                                                            ? "Đang xuất..."
                                                            : "Xuất PDF"}
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {showCreateForm && (
                <ContractForm
                    show
                    options={options}
                    onClose={closeCreateForm}
                    onSubmit={handleCreate}
                    isSaving={isSaving}
                    error={formError}
                />
            )}
        </div>
    );
};

export default ContractPage;
