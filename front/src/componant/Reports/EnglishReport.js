import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";


const EnglishReport = () => {
  const [loader, setLoader] = useState(false)
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [board, setBoard] = useState([]);
  const [medium, setMedium] = useState([]);
  const [standard, setStandard] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [filteredMedium, setFilteredMedium] = useState([]);
  const [filteredStandard, setFilteredStandard] = useState([]);
  const [filteredBatch, setFilteredBatch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const branchId = userData?.data.id_branch;
  const [currentPage, setCurrentPage] = useState(0); // Start from page 1
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (userData) {
      if (userData.roll === "BranchManager") {
        getBranchData(branchId);
      } else {
        getBranchData();
      }
    }
  }, [userData, branchId]);
  const getBatchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/batch`
      );
      if (res.status === 200) {
        if (userData.roll === 'Admin') {
          setData(res.data.data);
        } else {
          setData(res.data.data.filter(board => board.id_branch === branchId));
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };

  const getBranchData = async () => {
    try {
      let url = `${process.env.REACT_APP_BACKEND_BASE_URL}/branch`;
      const res = await axios.get(url);
      if (res.status === 200) {
        if (userData.roll === 'Admin') {
          setBranch(res.data.data);
        } else {
          setBranch(res.data.data.filter(branch => branch.id === branchId));
        }
      } else {
        setBranch([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getBoardData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/board`
      );

      if (res.status === 200) {
        setBoard(res.data.data);
      } else {
        setBoard([]);
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getMediumData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/medium`
      );

      if (res.status === 200) {
        setMedium(res.data.data);
      } else {
        setMedium([]);
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getStandardData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/standerd`
      );

      if (res.status === 200) {
        setStandard(res.data.data);
      } else {
        setStandard([]);
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getBoardFilterData = async (id_branch) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/boardbybr/?id_branch=${id_branch}`
      );
      if (res.status === 200) {
        setFilteredBoards(res.data.data);
      } else {
        setFilteredBoards([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getMediumFilterData = async (id_branch, id_board) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/mediumbybrbo/?id_branch=${id_branch}&id_board=${id_board}`
      );
      if (res.status === 200) {
        setFilteredMedium(res.data.data);
      } else {
        setFilteredMedium([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getStandardFilterData = async (id_branch, id_board, id_medium) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/standardbybrbomd/?branch_id=${id_branch}&id_board=${id_board}&id_medium=${id_medium}`
      );
      if (res.status === 200) {
        setFilteredStandard(res.data.data);
      } else {
        setFilteredStandard([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getBatchFilterData = async (id_branch, id_board, id_medium, id_standard) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/batchbybrbomdst/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}`
      );
      if (res.status === 200) {
        setFilteredBatch(res.data.data);
      } else {
        setFilteredBatch([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedMediumId, setSelectedMediumId] = useState("");

  const handleDropdownChange = async (e) => {
    const { name, value } = e.target;

    if (name === "id_branch") {
      let filtered = data;

      if (value !== "") {
        filtered = filtered.filter((item) => String(item[name]) === value);
      }

      if (filtered.length === 0) {
        setFilteredData([]);
        setFilteredBoards([]);
        setFilteredMedium([]);
        setFilteredStandard([]);
        setFilteredBatch([]);
      } else {
        setFilteredData(filtered);
        setSelectedBranchId(value);
        await getBoardFilterData(value);
      }
    } else if (name === "id_board") {
      let filtered = data;

      if (value !== "") {
        filtered = filtered.filter((item) => String(item[name]) === value);
      }

      if (filtered.length === 0) {
        setFilteredData([]);
        setFilteredMedium([]);
        setFilteredStandard([]);
        setFilteredBatch([]);
      } else {
        setFilteredData(filtered);
        setSelectedBoardId(value);
        await getMediumFilterData(selectedBranchId, value);
      }
    } else if (name === "id_medium") {
      let filtered = data;

      if (value !== "") {
        filtered = filtered.filter((item) => String(item[name]) === value);
      }

      if (filtered.length === 0) {
        setFilteredData([]);
        setFilteredStandard([]);
        setFilteredBatch([]);
      } else {
        setFilteredData(filtered);
        setSelectedMediumId(value);
        await getStandardFilterData(selectedBranchId, selectedBoardId, value);
      }
    } else if (name === "id_standard") {
      let filtered = data;

      if (value !== "") {
        filtered = filtered.filter((item) => String(item[name]) === value);
      }

      if (filtered.length === 0) {
        setFilteredData([]);
        setFilteredBatch([]);
      } else {
        setFilteredData(filtered);
        await getBatchFilterData(
          selectedBranchId,
          selectedBoardId,
          selectedMediumId,
          value
        );
      }
    } else if (name === "id_batch") {
      let filtered = data;

      if (value !== "") {
        filtered = filtered.filter((item) => String(item[name]) === value);
      }

      setFilteredData(filtered);
    } else {
      setFilteredData([]); // Reset to show all data if other dropdowns are changed
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const filterDataBySearch = (data) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    setFilteredData(filterDataBySearch(data));
  }, [data, searchQuery]);
  useEffect(() => {
    getBranchData();
    getBoardData();
    getMediumData();
    getStandardData();
    getBatchData();
  }, []);
  const getBranchNameById = (branchID) => {
    const foundBranch = branch.find((branch) => branch.id === branchID);
    return foundBranch ? foundBranch.name : "Unknown Branch";
  };
  const getBoardNameById = (boardID) => {
    const foundBoard = board.find((board) => board.id === boardID);
    return foundBoard ? foundBoard.board : "Unknown Board";
  };
  const getMediumNameById = (m_Id) => {
    const foundMedium = medium.find((medium) => medium.id === m_Id);
    return foundMedium ? foundMedium.medium : "Unknown medium";
  };
  const getStandardNameById = (standardId) => {
    const foundStandard = standard.find(
      (standard) => standard.id === standardId
    );
    return foundStandard ? foundStandard.standard : "Unknown standard";
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will be delete this Homework',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5000C0',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });
      if (result.isConfirmed) {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/deleteenglishreport/` + id);
        if (res.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: 'This Exam has been deleted.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            title: 'Deleted failed!',
            text: 'Exam deleted failed.',
            icon: 'error',
          });
        }
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };


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
    <div>
      {loader ||
        <div className="page-wrapper page-settings">
          <div className="content">
            <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                <li className="breadcrumb-item active" aria-current="page">English Report</li>
              </ol>
            </nav>
            <div className="content-page-header content-page-headersplit">
              <h5>English Report</h5>
              <div className="list-btn">
                <ul>
                  <li>
                    <Link to={'/createenghlishreport'} className="btn btn-primary"><i className="fa fa-plus me-2"></i>Create</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label>Branch</label>
                  <select name="id_branch" className="form-select" onChange={handleDropdownChange}>
                    <option value="">Select All Branch</option>
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
                  <label>Board</label>
                  <select name="id_board" className="form-select" onChange={handleDropdownChange}>
                    <option value="">Select Board</option>
                    {filteredBoards.map((boardItem) => (
                      <option key={boardItem.id} value={boardItem.id}>
                        {boardItem.board}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Medium</label>
                  <select name="id_medium" className="form-select" onChange={handleDropdownChange}>
                    <option value="">Select Medium</option>
                    {filteredMedium.map((mediumItem) => (
                      <option key={mediumItem.id} value={mediumItem.id}>
                        {mediumItem.medium}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label>Standard</label>
                  <select name="id_standard" className="form-select" onChange={handleDropdownChange}>
                    <option value="">Select Standard</option>
                    {filteredStandard.map((standardItem) => (
                      <option key={standardItem.id} value={standardItem.id}>
                        {standardItem.standard}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-4 mt-3">
                <div className="form-group">
                  <input
                    id="search"
                    className="form-control"
                    type="text"
                    placeholder="Search by Batch Name"
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
                        <th>Index</th>
                        <th>Batch</th>
                        <th>Branch</th>
                        <th>Board</th>
                        <th>Medium</th>
                        <th>Standard</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <td colSpan="12">No data available</td>
                      ) : (
                        currentItems.map((dataa, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{dataa.name}</td>
                              <td>{getBranchNameById(dataa.id_branch)}</td>
                              <td>{getBoardNameById(dataa.id_board)}</td>
                              <td>{getMediumNameById(dataa.id_medium)}</td>
                              <td>{getStandardNameById(dataa.id_standard)}</td>
                              <td>
                                <div className="table-actions d-flex">
                                  <Link className="delete-table me-2" to={`/editenghlishreport/${dataa.id}`}> <i className="fas fa-edit"></i> </Link>
                                  <div className="delete-table delll" onClick={() => handleDelete(dataa.id)}><img src="assets/img/icons/delete.svg" alt="svg" /></div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
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

    </div>
  )
}

export default EnglishReport
