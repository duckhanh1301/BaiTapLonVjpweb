import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FaBuilding,
    FaEnvelope,
    FaExclamationCircle,
    FaFileContract,
    FaHome,
    FaMapMarkerAlt,
    FaPen,
    FaPhoneAlt,
    FaSearch,
    FaTrash,
    FaUserFriends
} from "react-icons/fa";

import TenantForm from "../components/TenantForm";
import {
    deleteTenant,
    getAllTenants,
    updateTenant
} from "../services/tenantService";
import "../styles/Management.css";
import "../styles/TenantPage.css";

const getInitials = (name = "") => (
    name
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "NT"
);

const getErrorMessage = (error, fallback) => (
    error?.response?.data?.message || fallback
);

const TenantPage = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isOwner = user?.role === "ChuThue";
    const [tenants, setTenants] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [notice, setNotice] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const loadTenants = useCallback(async () => {
        if (!isOwner) return;

        setIsLoading(true);
        setPageError("");
        try {
            const data = await getAllTenants();
            setTenants(Array.isArray(data) ? data : []);
        } catch (error) {
            setPageError(getErrorMessage(
                error,
                "Không thể tải danh sách người thuê. Vui lòng thử lại."
            ));
        } finally {
            setIsLoading(false);
        }
    }, [isOwner]);

    useEffect(() => {
        const timeoutId = window.setTimeout(loadTenants, 0);
        return () => window.clearTimeout(timeoutId);
    }, [loadTenants]);

    useEffect(() => {
        if (!notice) return undefined;
        const timeoutId = window.setTimeout(() => setNotice(""), 3500);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const filteredTenants = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLocaleLowerCase("vi");

        return tenants.filter((tenant) => {
            const matchesKeyword = !normalizedKeyword || [
                tenant.HoTen,
                tenant.SoDienThoai,
                tenant.Email,
                tenant.TenCanHo,
                tenant.TenToaNha,
                tenant.DiaChiToaNha
            ].some((value) => (
                String(value || "")
                    .toLocaleLowerCase("vi")
                    .includes(normalizedKeyword)
            ));

            const hasActiveContract = tenant.TrangThaiHopDong === "HieuLuc";
            const matchesStatus = statusFilter === "all"
                || (statusFilter === "active" && hasActiveContract)
                || (
                    statusFilter === "inactive"
                    && tenant.MaHopDong
                    && !hasActiveContract
                );

            return matchesKeyword && matchesStatus;
        });
    }, [keyword, statusFilter, tenants]);

    const statistics = useMemo(() => {
        const activeTenants = tenants.filter(
            (tenant) => tenant.TrangThaiHopDong === "HieuLuc"
        ).length;
        const buildings = new Set(
            tenants.map((tenant) => tenant.MaToaNha).filter(Boolean)
        ).size;
        const contracted = tenants.filter((tenant) => tenant.MaHopDong).length;

        return {
            total: tenants.length,
            active: activeTenants,
            buildings,
            contracted
        };
    }, [tenants]);

    const openEditModal = (tenant) => {
        setSelectedTenant(tenant);
        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (isSaving) return;
        setShowModal(false);
        setFormError("");
    };

    const handleSave = async (formData) => {
        setIsSaving(true);
        setFormError("");

        try {
            await updateTenant(selectedTenant.MaNguoiThue, formData);
            setNotice("Đã cập nhật thông tin người thuê.");

            setShowModal(false);
            await loadTenants();
        } catch (error) {
            setFormError(getErrorMessage(
                error,
                "Không thể lưu thông tin người thuê."
            ));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (tenant) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa hồ sơ của ${tenant.HoTen}?`
        );
        if (!confirmed) return;

        setPageError("");
        try {
            await deleteTenant(tenant.MaNguoiThue);
            setNotice("Đã xóa người thuê.");
            await loadTenants();
        } catch (error) {
            setPageError(getErrorMessage(
                error,
                "Không thể xóa người thuê này."
            ));
        }
    };

    if (!isOwner) {
        return (
            <div className="tenant-page">
                <div className="tenant-access-denied">
                    <FaExclamationCircle aria-hidden="true" />
                    <h2>Truy cập bị từ chối</h2>
                    <p>Chỉ chủ thuê mới có thể quản lý người thuê.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tenant-page">
            {notice && (
                <div className="tenant-toast" role="status">
                    {notice}
                </div>
            )}

            <section className="tenant-heading">
                <div>
                    <span className="tenant-eyebrow">Quản lý cư dân</span>
                    <h1>Người thuê</h1>
                    <p>
                        Danh sách chỉ gồm khách đã phát sinh hợp đồng thuê nhà.
                    </p>
                </div>
            </section>

            <section className="tenant-stat-grid" aria-label="Tổng quan người thuê">
                <article className="tenant-stat-card is-purple">
                    <span className="tenant-stat-icon">
                        <FaUserFriends aria-hidden="true" />
                    </span>
                    <div>
                        <small>Tổng người thuê</small>
                        <strong>{statistics.total}</strong>
                        <p>Hồ sơ trong hệ thống</p>
                    </div>
                </article>
                <article className="tenant-stat-card is-green">
                    <span className="tenant-stat-icon">
                        <FaFileContract aria-hidden="true" />
                    </span>
                    <div>
                        <small>Đang thuê</small>
                        <strong>{statistics.active}</strong>
                        <p>Hợp đồng hiệu lực</p>
                    </div>
                </article>
                <article className="tenant-stat-card is-blue">
                    <span className="tenant-stat-icon">
                        <FaBuilding aria-hidden="true" />
                    </span>
                    <div>
                        <small>Tòa nhà có người thuê</small>
                        <strong>{statistics.buildings}</strong>
                        <p>Đang được sử dụng</p>
                    </div>
                </article>
                <article className="tenant-stat-card is-orange">
                    <span className="tenant-stat-icon">
                        <FaHome aria-hidden="true" />
                    </span>
                    <div>
                        <small>Đã có hợp đồng</small>
                        <strong>{statistics.contracted}</strong>
                        <p>Ghi nhận từ thuê nhà</p>
                    </div>
                </article>
            </section>

            <section className="tenant-panel">
                <header className="tenant-panel-header">
                    <div>
                        <h2>Danh sách người thuê</h2>
                        <p>
                            Hiển thị <strong>{filteredTenants.length}</strong>
                            {" "}trên {tenants.length} hồ sơ
                        </p>
                    </div>

                    <div className="tenant-toolbar">
                        <label className="tenant-search">
                            <FaSearch aria-hidden="true" />
                            <input
                                type="search"
                                aria-label="Tìm kiếm người thuê"
                                placeholder="Tìm tên, căn hộ, số điện thoại..."
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                            />
                        </label>
                        <select
                            className="tenant-filter"
                            aria-label="Lọc trạng thái người thuê"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang thuê</option>
                            <option value="inactive">Hết hiệu lực</option>
                        </select>
                    </div>
                </header>

                {pageError && (
                    <div className="tenant-page-error" role="alert">
                        <FaExclamationCircle aria-hidden="true" />
                        <span>{pageError}</span>
                        <button type="button" onClick={loadTenants}>Thử lại</button>
                    </div>
                )}

                <div className="tenant-table-wrap">
                    <table className="tenant-table">
                        <thead>
                            <tr>
                                <th>Người thuê</th>
                                <th>Căn hộ</th>
                                <th>Tòa nhà &amp; địa chỉ</th>
                                <th>Liên hệ</th>
                                <th>Trạng thái</th>
                                <th aria-label="Thao tác" />
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <tr className="tenant-skeleton-row" key={index}>
                                        <td colSpan="6"><span /></td>
                                    </tr>
                                ))
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        <div className="tenant-empty">
                                            <span><FaUserFriends aria-hidden="true" /></span>
                                            <h3>Không tìm thấy người thuê</h3>
                                            <p>
                                                Người thuê sẽ xuất hiện sau khi hoàn tất thuê nhà.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => {
                                    const isActive = tenant.TrangThaiHopDong === "HieuLuc";
                                    return (
                                        <tr key={tenant.MaNguoiThue}>
                                            <td>
                                                <div className="tenant-person">
                                                    <span className="tenant-avatar">
                                                        {getInitials(tenant.HoTen)}
                                                    </span>
                                                    <div>
                                                        <strong>{tenant.HoTen}</strong>
                                                        <small>
                                                            Mã NT-{String(tenant.MaNguoiThue).padStart(3, "0")}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {tenant.TenCanHo ? (
                                                    <div className="tenant-apartment">
                                                        <span><FaHome aria-hidden="true" /></span>
                                                        <div>
                                                            <strong>{tenant.TenCanHo}</strong>
                                                            <small>
                                                                HĐ #{tenant.MaHopDong}
                                                            </small>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="tenant-muted">
                                                        Chưa có căn hộ
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {tenant.TenToaNha ? (
                                                    <div className="tenant-building">
                                                        <strong>
                                                            <FaBuilding aria-hidden="true" />
                                                            {tenant.TenToaNha}
                                                        </strong>
                                                        <small>
                                                            <FaMapMarkerAlt aria-hidden="true" />
                                                            {tenant.DiaChiToaNha || "Chưa cập nhật địa chỉ"}
                                                        </small>
                                                    </div>
                                                ) : (
                                                    <span className="tenant-muted">
                                                        Chưa xác định
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="tenant-contact">
                                                    <a href={`tel:${tenant.SoDienThoai}`}>
                                                        <FaPhoneAlt aria-hidden="true" />
                                                        {tenant.SoDienThoai}
                                                    </a>
                                                    {tenant.Email ? (
                                                        <a href={`mailto:${tenant.Email}`}>
                                                            <FaEnvelope aria-hidden="true" />
                                                            {tenant.Email}
                                                        </a>
                                                    ) : (
                                                        <small>Chưa có email</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`tenant-status ${
                                                        isActive
                                                            ? "is-active"
                                                            : tenant.MaCanHo
                                                                ? "is-inactive"
                                                                : "is-pending"
                                                    }`}
                                                >
                                                    <i aria-hidden="true" />
                                                    {isActive
                                                        ? "Đang thuê"
                                                        : tenant.MaCanHo
                                                            ? "Hết hiệu lực"
                                                            : "Chưa xếp căn"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="tenant-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(tenant)}
                                                        aria-label={`Sửa ${tenant.HoTen}`}
                                                        title="Chỉnh sửa"
                                                    >
                                                        <FaPen aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        className="is-delete"
                                                        type="button"
                                                        onClick={() => handleDelete(tenant)}
                                                        aria-label={`Xóa ${tenant.HoTen}`}
                                                        title="Xóa"
                                                    >
                                                        <FaTrash aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {showModal && (
                <TenantForm
                    key={selectedTenant.MaNguoiThue}
                    show
                    tenant={selectedTenant}
                    onClose={closeModal}
                    onSubmit={handleSave}
                    isSaving={isSaving}
                    error={formError}
                />
            )}
        </div>
    );
};

export default TenantPage;
