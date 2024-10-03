import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddExamMarks = () => {
  const [loader, setLoader] = useState(false)
  const [values, setValues] = useState({
    id_exam: "",
    id_student: "",
    marks: "",
    remark: "",
  });
  const [branch, setBranch] = useState([]);
  const [board, setBoard] = useState([]);
  const [medium, setMedium] = useState([]);
  const [standard, setStandard] = useState([]);
  const [subject, setSubject] = useState([]);
  const [batch, setBatch] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [exam, setExam] = useState([]);
  const [totalMarks, setTotalMarks] = useState({
    total_marks: "",
  });

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const branchId = userData?.data.id_branch;

  useEffect(() => {
    if (userData) {
      // if (userData.roll === "BranchManager") {
      //     getBranchData(branchId);
      // } else {
      //     getBranchData();
      // }
      if (userData.roll === "BranchManager" || userData.roll === "Clerk" || userData.roll === "Teacher") {
        getBranchData(branchId);
        getBoardData(branchId);
      } else {
        getBranchData();
      }
      // getBoardData(branchId);
    }
  }, [userData, branchId]);
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
  const getExamData = async (date, id_branch, id_board, id_medium, id_standard, id_batch, id_subject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getExambyBrBoMdStSub/?date=${date}&id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}&id_subject=${id_subject}&id_batch=${id_batch}`
      );
      console.log(res);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_exam") {
      const selectedExam = exam.find((exam) => exam.id === parseInt(value, 10));

      if (selectedExam) {
        const total_marks = selectedExam.total_marks;
        setValues((prevValues) => ({
          ...prevValues,
          id_exam: value,
          total_marks: total_marks,
        }));
        setTotalMarks({
          total_marks: total_marks,
        });
      } else {
        console.log("Total marks not found for the selected value:", value);
      }
    } else if (name === "marks") {
      const studentId = e.target.dataset.studentid;
      const marksValue = parseInt(value, 10);

      if (marksValue > totalMarks.total_marks) {
        Swal.fire({
          title: "Entered marks",
          text: "Entered marks cannot be more than total_marks",
          icon: "warning",
        });

        e.target.value = totalMarks.total_marks;
      } else {
        setStudentAttendance((prevStudents) =>
          prevStudents.map((student) =>
            student.id === parseInt(studentId, 10)
              ? { ...student, marks: marksValue }
              : student
          )
        );
      }
    } else if (name === "remark") {
      const studentId = e.target.dataset.studentid;
      const remarkValue = value; // Use the correct field name here

      setStudentAttendance((prevStudents) =>
        prevStudents.map((student) =>
          student.id === parseInt(studentId, 10)
            ? { ...student, remark: remarkValue } // Use the correct field name here
            : student
        )
      );
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };
  // console.log(values);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const attendanceData = studentAttendance.map((student) => ({
        id_exam: values.id_exam,
        id_student: student.id,
        marks: student.marks,
        remark: student.remark,
      }));
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/createexammarks`,
        attendanceData
      );
      if (res.data.msg === "Data insert Successfully") {
        Swal.fire({
          icon: "success",
          title: "Exam Attendance insertion successful",
          timer: 1500,
        }).then(() => {
          navigate("/viewexammarks");
        });
      } else {
        Swal.fire({
          title: res.data.msg,
          icon: "warning",
        });
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };
  useEffect(() => {
    getBranchData();
  }, []);

  if (loader) {
    return (<div className="page-wrapper page-settings">
      <div className="error">
        <svg data-name="Layer 1" width="1119.60911" height="699" viewBox="0 0 1119.60911 699">
          <title>server down</title>
          <circle cx="292.60911" cy="213" r="213" fill="#f2f2f2" /><path d="M31.39089,151.64237c0,77.49789,48.6181,140.20819,108.70073,140.20819" transform="translate(-31.39089 -100.5)" fill="#2f2e41" /><path d="M140.09162,291.85056c0-78.36865,54.255-141.78356,121.30372-141.78356" transform="translate(-31.39089 -100.5)" fill="#6b9647" />          <path d="M70.77521,158.66768c0,73.61476,31.00285,133.18288,69.31641,133.18288" transform="translate(-31.39089 -100.5)" fill="#6b9647" />          <path d="M140.09162,291.85056c0-100.13772,62.7103-181.16788,140.20819-181.16788" transform="translate(-31.39089 -100.5)" fill="#2f2e41" />          <path d="M117.22379,292.83905s15.41555-.47479,20.06141-3.783,23.713-7.2585,24.86553-1.95278,23.16671,26.38821,5.76263,26.5286-40.43935-2.711-45.07627-5.53549S117.22379,292.83905,117.22379,292.83905Z" transform="translate(-31.39089 -100.5)" fill="#a8a8a8" />          <path d="M168.224,311.78489c-17.40408.14042-40.43933-2.71094-45.07626-5.53548-3.53126-2.151-4.93843-9.86945-5.40926-13.43043-.32607.014-.51463.02-.51463.02s.97638,12.43276,5.61331,15.2573,27.67217,5.67589,45.07626,5.53547c5.02386-.04052,6.7592-1.82793,6.66391-4.47526C173.87935,310.756,171.96329,311.75474,168.224,311.78489Z" transform="translate(-31.39089 -100.5)" opacity="0.2" />          <ellipse cx="198.60911" cy="424.5" rx="187" ry="25.43993" fill="#3f3d56" />          <ellipse cx="198.60911" cy="424.5" rx="157" ry="21.35866" opacity="0.1" />          <ellipse cx="836.60911" cy="660.5" rx="283" ry="38.5" fill="#3f3d56" />          <ellipse cx="310.60911" cy="645.5" rx="170" ry="23.12721" fill="#3f3d56" />          <path d="M494,726.5c90,23,263-30,282-90" transform="translate(-31.39089 -100.5)" fill="none" stroke="#2f2e41" stroke-miterlimit="10" stroke-width="2" />          <path d="M341,359.5s130-36,138,80-107,149-17,172" transform="translate(-31.39089 -100.5)" fill="none" stroke="#2f2e41" stroke-miterlimit="10" stroke-width="2" />          <path d="M215.40233,637.78332s39.0723-10.82,41.47675,24.04449-32.15951,44.78287-5.10946,51.69566" transform="translate(-31.39089 -100.5)" fill="none" stroke="#2f2e41" stroke-miterlimit="10" stroke-width="2" />          <path d="M810.09554,663.73988,802.218,714.03505s-38.78182,20.60284-11.51335,21.20881,155.73324,0,155.73324,0,24.84461,0-14.54318-21.81478l-7.87756-52.719Z" transform="translate(-31.39089 -100.5)" fill="#2f2e41" />          <path d="M785.21906,734.69812c6.193-5.51039,16.9989-11.252,16.9989-11.252l7.87756-50.2952,113.9216.10717,7.87756,49.582c9.185,5.08711,14.8749,8.987,18.20362,11.97818,5.05882-1.15422,10.58716-5.44353-18.20362-21.38921l-7.87756-52.719-113.9216,3.02983L802.218,714.03506S769.62985,731.34968,785.21906,734.69812Z" transform="translate(-31.39089 -100.5)" opacity="0.1" /><rect x="578.43291" y="212.68859" width="513.25314" height="357.51989" rx="18.04568" fill="#2f2e41" /><rect x="595.70294" y="231.77652" width="478.71308" height="267.83694" fill="#3f3d56" /><circle cx="835.05948" cy="223.29299" r="3.02983" fill="#f2f2f2" /><path d="M1123.07694,621.32226V652.6628a18.04341,18.04341,0,0,1-18.04568,18.04568H627.86949A18.04341,18.04341,0,0,1,609.8238,652.6628V621.32226Z" transform="translate(-31.39089 -100.5)" fill="#2f2e41" /><polygon points="968.978 667.466 968.978 673.526 642.968 673.526 642.968 668.678 643.417 667.466 651.452 645.651 962.312 645.651 968.978 667.466" fill="#2f2e41" /><path d="M1125.828,762.03359c-.59383,2.539-2.83591,5.21743-7.90178,7.75032-18.179,9.08949-55.1429-2.42386-55.1429-2.42386s-28.4804-4.84773-28.4804-17.573a22.72457,22.72457,0,0,1,2.49658-1.48459c7.64294-4.04351,32.98449-14.02122,77.9177.42248a18.73921,18.73921,0,0,1,8.54106,5.59715C1125.07908,756.45353,1126.50669,759.15715,1125.828,762.03359Z" transform="translate(-31.39089 -100.5)" fill="#2f2e41" /><path d="M1125.828,762.03359c-22.251,8.526-42.0843,9.1622-62.43871-4.975-10.26507-7.12617-19.59089-8.88955-26.58979-8.75618,7.64294-4.04351,32.98449-14.02122,77.9177.42248a18.73921,18.73921,0,0,1,8.54106,5.59715C1125.07908,756.45353,1126.50669,759.15715,1125.828,762.03359Z" transform="translate(-31.39089 -100.5)" opacity="0.1" /><ellipse cx="1066.53846" cy="654.13477" rx="7.87756" ry="2.42386" fill="#f2f2f2" /><circle cx="835.05948" cy="545.66686" r="11.51335" fill="#f2f2f2" /><polygon points="968.978 667.466 968.978 673.526 642.968 673.526 642.968 668.678 643.417 667.466 968.978 667.466" opacity="0.1" /><rect x="108.60911" y="159" width="208" height="242" fill="#2f2e41" /><rect x="87.60911" y="135" width="250" height="86" fill="#3f3d56" /><rect x="87.60911" y="237" width="250" height="86" fill="#3f3d56" /><rect x="87.60911" y="339" width="250" height="86" fill="#3f3d56" /><rect x="271.60911" y="150" width="16" height="16" fill="#6b9647" opacity="0.4" /><rect x="294.60911" y="150" width="16" height="16" fill="#6b9647" opacity="0.8" /><rect x="317.60911" y="150" width="16" height="16" fill="#6b9647" /><rect x="271.60911" y="251" width="16" height="16" fill="#6b9647" opacity="0.4" /><rect x="294.60911" y="251" width="16" height="16" fill="#6b9647" opacity="0.8" /><rect x="317.60911" y="251" width="16" height="16" fill="#6b9647" /><rect x="271.60911" y="352" width="16" height="16" fill="#6b9647" opacity="0.4" /><rect x="294.60911" y="352" width="16" height="16" fill="#6b9647" opacity="0.8" /><rect x="317.60911" y="352" width="16" height="16" fill="#6b9647" /><circle cx="316.60911" cy="538" r="79" fill="#2f2e41" /><rect x="280.60911" y="600" width="24" height="43" fill="#2f2e41" /><rect x="328.60911" y="600" width="24" height="43" fill="#2f2e41" /><ellipse cx="300.60911" cy="643.5" rx="20" ry="7.5" fill="#2f2e41" /><ellipse cx="348.60911" cy="642.5" rx="20" ry="7.5" fill="#2f2e41" /><circle cx="318.60911" cy="518" r="27" fill="#fff" /><circle cx="318.60911" cy="518" r="9" fill="#3f3d56" /><path d="M271.36733,565.03228c-6.37889-28.56758,14.01185-57.43392,45.544-64.47477s62.2651,10.41,68.644,38.9776-14.51861,39.10379-46.05075,46.14464S277.74622,593.59986,271.36733,565.03228Z" transform="translate(-31.39089 -100.5)" fill="#6b9647" /><ellipse cx="417.21511" cy="611.34365" rx="39.5" ry="12.40027" transform="translate(-238.28665 112.98044) rotate(-23.17116)" fill="#2f2e41" /><ellipse cx="269.21511" cy="664.34365" rx="39.5" ry="12.40027" transform="translate(-271.07969 59.02084) rotate(-23.17116)" fill="#2f2e41" /><path d="M394,661.5c0,7.732-19.90861,23-42,23s-43-14.268-43-22,20.90861-6,43-6S394,653.768,394,661.5Z" transform="translate(-31.39089 -100.5)" fill="#fff" />
        </svg>
      </div>
    </div>)
  }
  return (
    <>
      {loader ||
        <div className="page-wrapper">
          <div className="content">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                    <li className="breadcrumb-item"><NavLink to="/viewexammarks">Exam Marks </NavLink>/</li>
                    <li className="breadcrumb-item active" aria-current="page">Add Exam Marks</li>
                  </ol>
                </nav>
                <div className="col-lg-12 col-sm-12">
                  <div className="content-page-header">
                    <h5>Add Exam Marks</h5>
                  </div>
                  <div className="row">
                    <div className="col-6">
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
                    <div className="col-6">
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
                                id_exam: "",
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
                    </div>
                    <div className="col-6">
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
                              id_exam: "",
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
                    </div>
                    <div className="col-6">
                      <div className="from-group">
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
                              id_exam: "",
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
                    </div>
                    <div className="col-6">
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
                              id_exam: "",
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
                    </div>
                    <div className="col-6">
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
                              value // Pass only the id_batch
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
                    </div>
                    <div className="col-6">
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
                              id_exam: "",
                            }));
                            getExamData(
                              values.date,
                              values.id_branch,
                              values.id_board,
                              values.id_medium,
                              values.id_standard,
                              values.id_batch,
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
                    </div>
                    <div className="col-6">
                      <div className="form-group mt-3">
                        <label> Exam </label>
                        <select
                          name="id_exam"
                          id="id_exam"
                          className="form-select"
                          required
                          onChange={handleInputChange}
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
                    <div className="col-6">
                      <div className="form-group mt-3">
                        <label>Total Marks</label>
                        <input
                          type="number"
                          name="total_marks"
                          className="form-control"
                          disabled
                          value={totalMarks.total_marks}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1>List Of Student</h1>
                    <div className="row">
                      <div className="col-12">
                        <div className="table-responsive">
                          <table className="table datatable">
                            <thead>
                              <tr>
                                <th>Index</th>
                                <th>Student Name</th>
                                <th>Marks</th>
                                <th>Remark</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentAttendance.map((dataa, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{dataa.name}</td>
                                  <td>
                                    <div className="siderbar-toggle">
                                      <input
                                        type="number"
                                        name="marks"
                                        data-studentid={dataa.id}
                                        className="form-control"
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      name="remark"
                                      className="form-control"
                                      placeholder="Remark"
                                      data-studentid={dataa.id}
                                      onChange={handleInputChange}
                                    />
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
                      <Link to={"/viewexammarks"} className="btn btn-cancel me-3">
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

export default AddExamMarks;
