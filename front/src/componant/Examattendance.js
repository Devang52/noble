import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Examattendance = () => {
  const [loader, setLoader] = useState(false)
  const [values, setValues] = useState({
    id_exam: "",
    id_student: "",
    status: "",

  });
  const [branch, setBranch] = useState([]);
  const [board, setBoard] = useState([]);
  const [medium, setMedium] = useState([]);
  const [standard, setStandard] = useState([]);
  const [subject, setSubject] = useState([]);
  const [batch, setBatch] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
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
  const navigate = useNavigate();

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
  const getBoardData = async (id_branch) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/boardbybr/?id_branch=${id_branch}`
      );
      if (res.status === 200) {
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
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/mediumbybrbo/?id_branch=${id_branch}&id_board=${id_board}`
      );
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
  const getStandardData = async (id_branch, id_board, id_medium) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/standardbybrbomd/?branch_id=${id_branch}&id_board=${id_board}&id_medium=${id_medium}`
      );
      if (res.status === 200) {
        setStandard(res.data.data);
      } else {
        setStandard([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  //          subject
  const getSubjectData = async (id_branch, id_board, id_medium, id_stands) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getSubjectByStanderd/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_stand=${id_stands}`
      );
      if (res.status === 200) {
        setSubject(res.data.data);
      } else {
        console.log(`Unexpected status: ${res.status}`);
        setSubject([]);
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };
  const getBatchData = async (id_branch, id_board, id_medium, id_standard) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/batchbybrbomdst/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}`
      );
      if (res.status === 200) {
        setBatch(res.data.data);
      } else {
        setBatch([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getStudentData = async (id_branch, id_board, id_medium, id_standard, id_batch) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getStudentbyBrBoMdStBt/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}&id_batch=${id_batch}`
      );
      if (res.status === 200) {
        setStudentAttendance(res.data.data);
      } else {
        setStudentAttendance([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const [exam, setExam] = useState([]);
  const getExamData = async (date, id_branch, id_board, id_medium, id_standard, id_subject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getExambyBrBoMdStSub/?date=${date}&id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}&id_subject=${id_subject}`
      );
      if (res.status === 200) {
        setExam(res.data.data);
      } else {
        setExam([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  useEffect(() => {
    getBranchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleAttendanceChange = (e, studentId) => {
    const { value } = e.target;
    setStudentAttendance((prevAttendance) =>
      prevAttendance.map((student) =>
        student.id === studentId ? { ...student, status: value } : student
      )
    );
  };
  //                  POST DATA
  // POST DATA
  const headleSubmit = async (event) => {
    event.preventDefault();
    try {
      const attendanceData = studentAttendance.map((student) => ({
        id_exam: values.id_exam,
        id_student: student.id,
        status: student.status,
      }));

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/createexamattendance`,
        attendanceData
      );

      if (res.status === 200) {
        // Successful request
        Swal.fire({
          icon: "success",
          title: "Exam Attendance insertion successful",
          timer: 1500,
        }).then(() => {
          navigate("/exam");
        });
      } else {
        // Unsuccessful request
        Swal.fire({
          title: "Exam Attendance insertion failed",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };
  console.log(values);

  return (
    <>
      {loader ||
        <div className="page-wrapper">
          <div className="content">
            <form onSubmit={headleSubmit}>
              <div className="row">
                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                    <li className="breadcrumb-item"><NavLink to="/examattendance">Exam Attendance </NavLink>/</li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Exam Attendance</li>
                  </ol>
                </nav>
                <div className="col-lg-12 col-sm-12">
                  <div className="content-page-header">
                    <h5>Exam Attendance</h5>
                  </div>
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="form-group">
                        <label> Date</label>
                        <input
                          type="date"
                          name="date"
                          className="form-control"
                          value={values.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="form-group">
                        <label>Branch</label>
                        <div>
                          <select
                            name="id_branch"
                            id="id_branch"
                            className="form-select"
                            required
                            placeholder="Branch"
                            onChange={(e) => {
                              const { value } = e.target;
                              setValues((prevValues) => ({
                                ...prevValues,
                                id_branch: value,
                                id_board: "",
                                id_medium: "",
                                id_standard: "",
                                id_batch: "",
                                id_subject: "",
                                id_exam: ""
                              }));
                              getBoardData(value);
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
                      <div className="from-group">
                        <label> Board </label>
                        <select
                          name="id_board"
                          id="id_board"
                          className="form-select"
                          required
                          onChange={(e) => {
                            const { value } = e.target;
                            setValues((prevValues) => ({
                              ...prevValues,
                              id_board: value,
                              id_medium: "",
                              id_standard: "",
                              id_batch: "",
                              id_subject: "",
                              id_exam: ""
                            }));
                            getMediumData(values.id_branch, value);
                          }}
                        >
                          <option value="-- Select Board--">
                            -- Select Board--
                          </option>
                          {board.length > 0
                            ? board.map((data) => (
                              <option
                                key={data.id}
                                data-key={data.id}
                                value={data.id}
                              >
                                {data.board}
                              </option>
                            ))
                            : null}
                        </select>
                      </div>
                      <div className="from-group mt-4">
                        <label> Medium </label>
                        <select
                          name="id_medium"
                          id="id_medium"
                          className="form-select"
                          required
                          onChange={(e) => {
                            const { value } = e.target;
                            setValues((prevValues) => ({
                              ...prevValues,
                              id_medium: value,
                              id_standard: "",
                              id_batch: "",
                              id_subject: "",
                              id_exam: ""
                            }));
                            getStandardData(
                              values.id_branch,
                              values.id_board,
                              value
                            );
                          }}
                        >
                          <option value="-- Select Medium--">
                            -- Select Medium--
                          </option>
                          {medium.length > 0
                            ? medium.map((data) => (
                              <option
                                key={data.id}
                                data-key={data.id}
                                value={data.id}
                              >
                                {data.medium}
                              </option>
                            ))
                            : null}
                        </select>
                      </div>

                      <div className="from-group mt-4">
                        <label> Standard </label>
                        <select
                          name="id_standard"
                          id="id_standard"
                          className="form-select"
                          required
                          onChange={(e) => {
                            const { value } = e.target;
                            setValues((prevValues) => ({
                              ...prevValues,
                              id_standard: value,
                              id_batch: "",
                              id_subject: "",
                              id_exam: ""
                            }));
                            getBatchData(
                              values.id_branch,
                              values.id_board,
                              values.id_medium,
                              value
                            );
                            getSubjectData(
                              values.id_branch,
                              values.id_board,
                              values.id_medium,
                              value
                            );
                          }}
                        >
                          <option value="-- Select Standard--">
                            -- Select Standard--
                          </option>
                          {standard.length > 0
                            ? standard.map((data) => (
                              <option
                                key={data.id}
                                data-key={data.id}
                                value={data.id}
                              >
                                {data.standard}
                              </option>
                            ))
                            : null}
                        </select>
                      </div>
                      <div className="from-group mt-4">
                        <label> Batch </label>
                        <select
                          name="id_batch"
                          id="id_batch"
                          className="form-select"
                          required
                          onChange={(e) => {
                            const { value } = e.target;
                            setValues((prevValues) => ({
                              ...prevValues,
                              id_batch: value,
                            }));
                            getStudentData(
                              values.id_branch,
                              values.id_board,
                              values.id_medium,
                              values.id_standard,
                              value  // Pass only the id_batch
                            );
                          }}
                        >

                          <option value="-- Select Batch--">
                            -- Select Batch--
                          </option>
                          {batch.length > 0
                            ? batch.map((data) => (
                              <option
                                key={data.id}
                                data-key={data.id}
                                value={data.id}
                              >
                                {data.name}
                              </option>
                            ))
                            : null}
                        </select>
                      </div>

                      <div className="from-group mt-3">
                        <label> Subject </label>
                        <select
                          name="id_subject"
                          id="id_subject"
                          className="form-select"
                          required
                          onChange={(e) => {
                            const { value } = e.target;
                            setValues((prevValues) => ({
                              ...prevValues,
                              id_subject: value,
                              id_exam: ""
                            }));
                            getExamData(
                              values.date,
                              values.id_branch,
                              values.id_board,
                              values.id_medium,
                              values.id_standard,
                              value
                            );
                          }}
                        >
                          <option value="-- Select Subject--">
                            -- Select Subject--
                          </option>
                          {subject.length > 0
                            ? subject.map((data) => (
                              <option
                                key={data.id}
                                data-key={data.id}
                                value={data.id}
                              >
                                {data.subject}
                              </option>
                            ))
                            : null}
                        </select>
                      </div>

                      <div className="from-group mt-3">
                        <label> Exam </label>
                        <select
                          name="id_exam"
                          id="id_exam"
                          className="form-select"
                          required
                          onChange={(e) => {
                            const { value } = e.target;
                            setValues((prevValues) => ({
                              ...prevValues,
                              id_exam: value,
                            }));
                          }}
                        >
                          <option value="-- Select Exam--">
                            -- Select Exam--
                          </option>
                          {exam.length > 0
                            ? exam.map((data) => (
                              <option
                                key={data.id}
                                data-key={data.id}
                                value={data.id}
                              >
                                {data.title}
                              </option>
                            ))
                            : null}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1>List Of Student</h1>
                    <div className="row">
                      <div className="col-12 ">
                        <div className="table-responsive">
                          <table className="table datatable">
                            <thead>
                              <tr>
                                <th>Index</th>
                                <th>Student Name</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentAttendance.map((dataa, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{dataa.name}</td>
                                  <td>
                                    <div className="siderbar-toggle">
                                      <select
                                        name="status"
                                        value={dataa.status}
                                        onChange={(e) =>
                                          handleAttendanceChange(e, dataa.id)
                                        }
                                      >
                                        <option value="1">Present</option>
                                        <option value="2">Absent</option>
                                        <option value="3">No Exam</option>
                                        <option value="4">Holiday</option>
                                      </select>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="btn-path">
                      <Link to={"/examattendance"} className="btn btn-cancel me-3">
                        Back
                      </Link>
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
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
};

export default Examattendance;
