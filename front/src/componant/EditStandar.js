import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import '../alert.css';
function EditStandard() {
  const [loader, setLoader] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();

  const [standard, setStandard] = useState({
    standard: "",
    branch_id: "",
    id_board: "",
    id_medium: "",
  });
  const [branch, setBranch] = useState([]);
  const [board, setBoard] = useState([]);
  const [medium, setMedium] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const branchId = userData?.data.id_branch;

  useEffect(() => {
    if (userData) {
      if (userData.roll === "BranchManager") {
        getBranchData(branchId);
      } else {
        getBranchData();
      }
    }
  }, [userData, branchId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'branch_id') {
      setStandard((prevStandard) => ({
        ...prevStandard,
        branch_id: value,
      }));
    } else if (name === 'id_board') {
      setStandard({
        ...standard,
        id_board: value,
      });
    } else if (name === 'id_medium') {
      setStandard({
        ...standard,
        id_medium: value,
      });
    } else {
      setStandard((prevStandard) => ({
        ...prevStandard,
        [name]: value,
      }));
    }
  };

  const getBranchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/branch`);
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
  }
  const getBoardData = async (branch_id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/boardbybr/?id_branch=${branch_id}`);
      console.log(branch_id);
      if (res.status === 200) {
        console.log(res.data.data);
        setBoard(res.data.data);
      } else {
        setBoard([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getMediumData = async (id_branch, id_board) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/mediumbybrbo/?id_branch=${id_branch}&id_board=${id_board}`);
      if (res.status === 200) {
        setMedium(res.data.data);
      } else {
        setMedium([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  const getStandardData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getedit-standerd/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        setStandard({
          branch_id: res.data.data[0].branch_id,
          id_board: res.data.data[0].id_board,
          id_medium: res.data.data[0].id_medium,
          standard: res.data.data[0].standard,
        });
        getBoardData(res.data.data[0].branch_id);
        getMediumData(res.data.data[0].branch_id, res.data.data[0].id_board);
      } else {
        Swal.fire({
          icon: "error",
          title: "Standard not found",
        });
        // navigate("/standard");
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  console.log(standard);
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const trimmedStandard = {
        standard: standard.standard.trim()
      };
      if (
        !trimmedStandard.standard ||
        !standard.branch_id ||
        !standard.id_board ||
        !standard.id_medium ||
        !standard.id_board === "-- Select Board--" ||
        !standard.id_medium === "-- Select Medium--"
      ) {
        Swal.fire({
          title: "Please enter all data",
          icon: "warning",
        });
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/edit-standerd/${id}`,
          standard
        );

        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Standard Updated Successfully",
            timer: 1500,
          }).then(() => {
            navigate("/standard");
          });
        } else {
          Swal.fire({
            title: "standard updation failed",
            icon: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };

  useEffect(() => {
    getStandardData();
  }, []);
  return (
    <>
      {loader ||
        <div className="page-wrapper">
          <div className="content">
            <form onSubmit={handleUpdate}>
              <div className="row">
                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                    <li className="breadcrumb-item"><NavLink to="/standard">Standard </NavLink>/</li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Standard</li>
                  </ol>
                </nav>
                <div className="col-lg-12 col-sm-12">
                  <div className="content-page-header">
                    <h5>Edit Standard</h5>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Branch</label>
                        <div>
                          <select
                            disabled
                            name="branch_id"
                            id="branch_id"
                            className="form-select"
                            required
                            value={standard.branch_id}
                            onChange={(e) => {
                              setBoard([])
                              setMedium([])
                              getBoardData(e.target.value);
                              handleInputChange(e);
                            }}
                          >
                            <option selected disabled>
                              Select Branch
                            </option>
                            {branch.length > 0 &&
                              branch.map((data) => (
                                <option
                                  key={data.id}
                                  value={data.id}
                                  data-key={data.id}
                                >
                                  {data.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className='from-group'>
                        <label> Board </label>
                        <select
                          disabled
                          name="id_board"
                          id="id_board"
                          className="form-select"
                          required
                          value={standard.id_board}
                          onChange={(e) => {
                            handleInputChange(e);
                            getMediumData(standard.branch_id, e.target.value);
                          }}
                        >
                          <option value="--Select Board--">
                            Select Board
                          </option>
                          {board.length > 0 &&
                            board.map((data) => (
                              <option
                                key={data.id}
                                value={data.id}
                                data-key={data.id}
                              >
                                {data.board}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className='from-group mt-4'>
                        <label> Medium </label>
                        <select
                          disabled
                          name="id_medium"
                          id="id_medium"
                          className="form-select"
                          required
                          value={standard.id_medium}
                          onChange={handleInputChange}
                        >
                          <option value="--Select Medium--">
                            Select Medium
                          </option>
                          {medium.length > 0 &&
                            medium.map((data) => (
                              <option
                                key={data.id}
                                value={data.id}
                                data-key={data.id}
                              >
                                {data.medium}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group mt-3">
                        <label>Standard</label>
                        <input
                          type="text"
                          name="standard"
                          className="form-control"
                          onChange={handleInputChange}
                          placeholder="Enter Standard"
                          value={standard.standard}
                        />
                        <br />
                        <div className="btn-path">
                          <Link to={"/standard"} className="btn btn-cancel me-3">
                            Back
                          </Link>
                          <button type="submit" className="btn btn-submit">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      }

    </>
  );
}
export default EditStandard;
