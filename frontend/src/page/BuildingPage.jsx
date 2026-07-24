import { useEffect, useState } from "react";

import {
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    searchBuildings
} from "../services/buildingService";

import BuildingForm from "../components/BuildingForm";

const BuildingPage = () => {

    const [buildings, setBuildings] = useState([]);

    const [keyword, setKeyword] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [selectedBuilding, setSelectedBuilding] = useState(null);

    useEffect(() => {

        loadBuildings();

    }, []);

    const loadBuildings = async () => {

        try {

            const data = await getAllBuildings();

            setBuildings(data);

        } catch (err) {

            console.log(err);

            alert("Không tải được danh sách");

        }

    };

    const handleSearch = async () => {

        try {

            if (keyword.trim() === "") {

                loadBuildings();

                return;

            }

            const data = await searchBuildings(keyword);

            setBuildings(data);

        } catch (err) {

            console.log(err);

        }

    };

    const handleAdd = () => {

        setSelectedBuilding(null);

        setShowModal(true);

    };

    const handleEdit = (building) => {

        setSelectedBuilding(building);

        setShowModal(true);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa?"))
            return;

        try {

            await deleteBuilding(id);

            loadBuildings();

        } catch (err) {

            console.log(err);

            alert("Không thể xóa");

        }

    };

    const handleSave = async (data) => {

        try {

            if (selectedBuilding) {

                await updateBuilding(
                    selectedBuilding.MaToaNha,
                    data
                );

            } else {

                await createBuilding(data);

            }

            setShowModal(false);

            loadBuildings();

        } catch (err) {

            console.log(err);

            alert("Có lỗi xảy ra");

        }

    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">

                <h2>Quản lý tòa nhà</h2>

                <button
                    className="btn btn-success"
                    onClick={handleAdd}
                >
                    + Thêm
                </button>

            </div>

            <div className="input-group mb-3">

                <input
                    className="form-control"
                    placeholder="Tìm tên hoặc địa chỉ..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>

            </div>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Tên tòa nhà</th>

                        <th>Địa chỉ</th>

                        <th>Mô tả</th>

                        <th width="170">
                            Thao tác
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        buildings.length === 0 ?

                            (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center"
                                    >
                                        Không có dữ liệu
                                    </td>

                                </tr>

                            )

                            :

                            (

                                buildings.map((item) => (

                                    <tr key={item.MaToaNha}>

                                        <td>{item.MaToaNha}</td>

                                        <td>{item.TenToaNha}</td>

                                        <td>{item.DiaChi}</td>

                                        <td>{item.MoTa}</td>

                                        <td>

                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(item.MaToaNha)}
                                            >
                                                Xóa
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )

                    }

                </tbody>

            </table>

            <BuildingForm

                show={showModal}

                building={selectedBuilding}

                onClose={() => setShowModal(false)}

                onSubmit={handleSave}

            />

        </div>

    );

};

export default BuildingPage;