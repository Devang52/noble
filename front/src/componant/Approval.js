import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";


export default function Approval() {
    const [loader, setLoader] = useState(false)
    const [country, setCountry] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Start from page 1
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [del, setDel] = useState([])

    const getCountryData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/getApproval`);
            if (res.status === 200) {
                setCountry(res.data.data ?? []);
            } else {
                setCountry([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getDeleted = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/getDeleted`);
            if (res.status === 200) {
                setDel(res.data.data ?? []);
            } else {
                setDel([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };

    useEffect(() => {
        getCountryData();
        getDeleted();
    }, []);

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = country.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(country.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0); // Reset current page when items per page changes
    };


    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You want to accepte this request",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#5000C0",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, accepte it!",
            });
            if (result.isConfirmed) {
                const res = await axios.put(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/deleteApproval/${id}?status=${1}`
                );
                if (res.status === 200) {
                    getCountryData();
                    getDeleted()
                    Swal.fire({
                        title: "Accepted!",
                        text: "This Request has been Accepted.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        title: "Deleted failed!",
                        text: "Student deleted failed.",
                        icon: "error",
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setLoader(true);
        }
    };
    const handleCancle = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You want to reject this request",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#5000C0",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, reject it!",
            });
            if (result.isConfirmed) {
                const res = await axios.put(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/deleteApproval/${id}?status=${2}`
                );
                if (res.status === 200) {
                    getCountryData();
                    getDeleted()
                    Swal.fire({
                        title: "Rejected!",
                        text: "This Request has been rejected.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        title: "Deleted failed!",
                        text: "Student deleted failed.",
                        icon: "error",
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setLoader(true);
        }
    };
    const handleActivate = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You want to Active this student",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#5000C0",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, activated it!",
            });
            if (result.isConfirmed) {
                const res = await axios.put(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/deleteApproval/${id}?status=${2}`
                );
                if (res.status === 200) {
                    getCountryData();
                    getDeleted()
                    Swal.fire({
                        title: "Activated!",
                        text: "This sutdent has been activated.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        title: "Activated failed!",
                        text: "Student activated failed.",
                        icon: "error",
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setLoader(true);
        }
    };
    return (
        <>
            {loader ||
                <div className="page-wrapper page-settings">
                    <div className="content">
                        <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                                <li className="breadcrumb-item active" aria-current="page">Delete Request</li>
                            </ol>
                        </nav>
                        <div className="content-page-header content-page-headersplit">
                            <h5>Delete Request</h5>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table datatable">
                                        <thead>
                                            <tr>
                                                <th>Index</th>
                                                <th>Name</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="12">No data available</td>
                                                </tr>
                                            ) : (
                                                currentItems.map((dataa, index) => (
                                                    <tr key={index}>
                                                        <td>{indexOfFirstItem + index + 1}</td>
                                                        <td>{dataa.name}</td>
                                                        <td>
                                                            <div className="table-actions d-flex gap-2">
                                                                <NavLink
                                                                    className="delete-table"
                                                                    onClick={() => handleDelete(dataa.id)} // Pass a function reference
                                                                >
                                                                    <i class="fa-solid fa-check"></i>
                                                                </NavLink>
                                                                <NavLink
                                                                    className="delete-table delll"
                                                                    onClick={() => handleCancle(dataa.id)} // Pass a function reference
                                                                >
                                                                    <img
                                                                        src="assets/img/icons/delete.svg"
                                                                        alt="svg"
                                                                    />
                                                                </NavLink>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* Pagination */}
                        <nav className="mt-4 pagination justify-content-end gap-2">
                            <select
                                className="form-select" style={{ width: "70px", padding: "0 13px" }}
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                            </select>
                            <ReactPaginate
                                className="pagination justify-content-center"
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                pageClassName={"page-link"}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                previousLinkClassName={"page-link"}
                                nextLinkClassName={"page-link"}
                                disabledClassName={"disabled"}
                                activeClassName={"active"}
                            />
                        </nav>

                        <div className="content-page-header content-page-headersplit">
                            <h5>Delete List</h5>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table datatable">
                                        <thead>
                                            <tr>
                                                <th>Index</th>
                                                <th>Name</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {del.length === 0 ? (
                                                <tr>
                                                    <td colSpan="12">No data available</td>
                                                </tr>
                                            ) : (
                                                del.map((dataa, index) => (
                                                    <tr key={index}>
                                                        <td>{indexOfFirstItem + index + 1}</td>
                                                        <td>{dataa.name}</td>
                                                        <td>
                                                            <div className="table-actions d-flex gap-2">
                                                                <NavLink
                                                                    className="delete-table delll"
                                                                    onClick={() => handleActivate(dataa.id)} // Pass a function reference
                                                                >
                                                                    <img
                                                                        src="assets/img/icons/delete.svg"
                                                                        alt="svg"
                                                                    />
                                                                </NavLink>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }


        </>
    )
}
