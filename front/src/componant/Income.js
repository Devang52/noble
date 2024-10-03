import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";


const Income = () => {
  const [loader, setLoader] = useState(false)
  const [income, setIncome] = useState([]);
  const [branch, setBranch] = useState([]);
  const [incomeType, setIncomeType] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const branchId = userData?.data.id_branch;
  const [currentPage, setCurrentPage] = useState(0); // Start from page 1
  const [itemsPerPage, setItemsPerPage] = useState(5);
  useEffect(() => {
    if (userData) {
      if (userData.roll === "BranchManager") {
        getBranchData(branchId);
        getFeesData(branchId);
      } else {
        getBranchData();
        getFeesData();
      }
    }
  }, [userData, branchId]);
  const getBranchData = async () => {
    try {
      let url = `${process.env.REACT_APP_BACKEND_BASE_URL}/branch`;
      const res = await axios.get(url);
      if (res.status === 200) {
        if (userData.roll === "Admin") {
          setBranch(res.data.data);
        } else {
          setBranch(res.data.data.filter((branch) => branch.id === branchId));
        }
      } else {
        setBranch([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getIncometypeData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/income-type`
      );
      if (res.status === 200) {
        setIncomeType(res.data.data);
      } else {
        setIncomeType([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getIncomeData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getincome`
      );
      if (res.status === 200) {
        if (userData.roll === "Admin") {
          setIncome(res.data.data);
        } else {
          setIncome(
            res.data.data.filter((board) => board.id_branch === branchId)
          );
        }
      } else {
        setIncome([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const [fees, setFees] = useState([]);
  const getFeesData = async () => {
    try {
      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/totalfees`
        );
        if (res.status === 200) {
          setFees(res.data.data);
        } else {
          setFees(0);
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/totalfees/${branchId}`
        );
        if (res.status === 200) {
          setFees(res.data.data);
        } else {
          setFees(0);
        }
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  useEffect(() => {
    getIncometypeData();
    getIncomeData();
  }, []);
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this Income",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5000C0",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const res = await axios.delete(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/income/delete/` + id
        );
        if (res.status === 200) {
          getIncomeData();
          Swal.fire({
            title: "Deleted!",
            text: "This Income has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: "Deleted failed!",
            text: "Income deleted failed.",
            icon: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response.data.error.sqlMessage.includes('Cannot delete or update a parent row')) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "This data is connected with many modules, so it won't be deleted.",
        });
      } else {
        setLoader(true)
      }
    }
  };
  const getBranchNameById = (bId) => {
    const foundBranch = branch.find((b) => b.id === bId);
    return foundBranch ? foundBranch.name : "Unknown Branch";
  };
  const getIncomeTypeNameById = (I_Id) => {
    const foundIncomeType = incomeType.find((iId) => iId.id === I_Id);
    return foundIncomeType ? foundIncomeType.income_type : "Unknown IncomeType";
  };


  const [filteredData, setFilteredData] = useState([]);
  const handleDropdownChange = async (e) => {
    const { name, value } = e.target;
    if (name === "id_branch") {
      let filtered = income;

      if (value !== "") {
        filtered = filtered.filter((item) => String(item[name]) === value);
      }

      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    setFilteredData(income);
  }, [income]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterDataBySearch = (data, query) => {
    if (!query) return data; // If query is empty, return all data
    return data.filter((item) =>
      item.income_title && item.income_title.toLowerCase().includes(query.toLowerCase())
    );
  };


  useEffect(() => {
    setFilteredData(filterDataBySearch(income ?? [], searchQuery));
  }, [income, searchQuery]);


  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(0); // Reset current page when items per page changes
  };

  return (
    <>
      {loader ||
        <div className="page-wrapper page-settings">
          <div className="content">
            <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                <li className="breadcrumb-item active" aria-current="page">Income</li>
              </ol>
            </nav>
            <div className="content-page-header content-page-headersplit">
              <h5>Income</h5>
              <div className="list-btn">
                <ul>
                  <li>
                    <Link to={"/addincome"} className="btn btn-primary">
                      <i className="fa fa-plus me-2"></i>Create
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Branch</label>
                  <select name="id_branch" className="form-select" onChange={handleDropdownChange}>
                    <option value="">Select Branch</option>
                    {branch.map((branchItem) => (
                      <option key={branchItem.id} value={branchItem.id}>
                        {branchItem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Search </label>
                  <input
                    id="search"
                    className="form-control"
                    type="text"
                    placeholder="Search Income Title"
                    aria-label="Search Input"
                    autoFocus
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 ">
                <div className="table-resposnive">
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th> Index</th>
                        <th>Branch</th>
                        <th>Income Title</th>
                        <th>Income Type</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Branch</td>
                        <td>Fees</td>
                        <td>Fees</td>
                        <td>{fees}</td>
                        <td>
                          <div className="table-actions d-flex">
                            <Link className="delete-table me-2" to={`/fees`}>
                              <i class="fa-solid fa-eye"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="12">No data available</td>
                        </tr>
                      ) : (
                        currentItems.map((income, index) => (
                          <tr key={index}>
                            <td>{index + 2}</td>
                            <td>{getBranchNameById(income.id_branch)}</td>
                            <td>{income.income_title}</td>
                            <td>{getIncomeTypeNameById(income.income_type)}</td>
                            <td>{income.amount}</td>
                            <td>
                              <div className="table-actions d-flex">
                                <Link
                                  className="delete-table me-2"
                                  to={`/editincome/${income.id}`}
                                >
                                  <i className="fas fa-edit"></i>
                                </Link>
                                <NavLink
                                  className="delete-table delll"
                                  onClick={() => handleDelete(income.id)} // Pass a function reference
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
            <nav className="mt-4 pagination justify-content-end gap-2">
              <select
                className="form-select" style={{ width: "70px", padding: "0 13px" }}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
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
          </div>
        </div>
      }

    </>
  );
};

export default Income;
