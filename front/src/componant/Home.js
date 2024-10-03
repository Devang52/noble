import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "moment-timezone";

function Home() {
  const today = new Date().toISOString().split('T')[0];
  const [loader, setLoader] = useState(false)

  const [selectedStartDate, setSelectedStartDate] = useState(today);
  const [selectedEndDate, setSelectedEndDate] = useState(today);
  const [attendance, setAttendance] = useState({});
  const [exam, setExam] = useState({});
  const [examattendance, setExamAttendance] = useState({});
  const [homework, setHomework] = useState({});
  const [homeworkstatus, setHomeworkStatus] = useState({});
  const [inquiry, setInquiry] = useState({});
  const [student, setStudent] = useState({});
  const [admin, setAdmin] = useState({});
  const [income, setIncome] = useState({});
  const [fees, setFees] = useState({});
  const [expense, setExpense] = useState({});
  const userData = JSON.parse(localStorage.getItem("userData"));
  const branchId = userData?.data.id_branch;

  const getAttendanceHome = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/attendancehome`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setAttendance(res.data.data);
        } else {
          setAttendance({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/attendancehome/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setAttendance(res.data.data);
        } else {
          setAttendance({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };


  const getExamHome = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };
      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/examhome`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setExam(res.data.data);
        } else {
          setExam({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/examhome/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setExam(res.data.data);
        } else {
          setExam({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getExamAttendanceHome = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/examattendancehome`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setExamAttendance(res.data.data);
        } else {
          setExamAttendance({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/examattendancehome/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setExamAttendance(res.data.data);
        } else {
          setExamAttendance({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getHomework = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeworkhome`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setHomework(res.data.data);
        } else {
          setHomework(0);
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeworkhome/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setHomework(res.data.data);
        } else {
          setHomework({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getHomeworkStatus = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeworkstatushome`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setHomeworkStatus(res.data.data);
        } else {
          setHomeworkStatus({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeworkstatushome/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setHomeworkStatus(res.data.data);
        } else {
          setHomeworkStatus({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getInquiry = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeinquiry`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setInquiry(res.data.data);
        } else {
          setInquiry(0);
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeinquiry/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setInquiry(res.data.data);
        } else {
          setInquiry({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getStudent = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homestudent`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setStudent(res.data.data);
        } else {
          setStudent({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homestudent/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setStudent(res.data.data);
        } else {
          setStudent({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getAdmin = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeadmin`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setAdmin(res.data.data);
        } else {
          setAdmin({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeadmin/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setAdmin(res.data.data);
        } else {
          setAdmin({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getIncome = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeincome`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setIncome(res.data.data);
        } else {
          setIncome({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeincome/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setIncome(res.data.data);
        } else {
          setIncome({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getFees = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homefees`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setFees(res.data.data);
        } else {
          setFees({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homefees/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setFees(res.data.data);
        } else {
          setFees({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };
  const getExpense = async (startDate, endDate) => {
    try {
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      if (userData.roll === "Admin") {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeexpense`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setExpense(res.data.data);
        } else {
          setExpense({});
        }
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/homeexpense/${branchId}`,
          {
            params: params,
          }
        );
        if (res.status === 200) {
          setExpense(res.data.data);
        } else {
          setExpense({});
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(true);
    }
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setSelectedStartDate(startDate);
  };

  const handleEndDateChange = (e) => {
    const endDate = e.target.value;
    setSelectedEndDate(endDate);
  };

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      getAttendanceHome(selectedStartDate, selectedEndDate);
      getExamAttendanceHome(selectedStartDate, selectedEndDate);
      getExamHome(selectedStartDate, selectedEndDate);
      getHomework(selectedStartDate, selectedEndDate);
      getHomeworkStatus(selectedStartDate, selectedEndDate);
      getInquiry(selectedStartDate, selectedEndDate);
      getStudent(selectedStartDate, selectedEndDate);
      getAdmin(selectedStartDate, selectedEndDate);
      getIncome(selectedStartDate, selectedEndDate);
      getFees(selectedStartDate, selectedEndDate);
      getExpense(selectedStartDate, selectedEndDate);
    } else {
      getAttendanceHome();
      getExamAttendanceHome();
      getExamHome();
      getHomework();
      getHomeworkStatus();
      getInquiry();
      getStudent();
      getAdmin();
      getIncome();
      getFees();
      getExpense();
    }
  }, [selectedStartDate, selectedEndDate]);

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
    <div>
      {loader ||
        <div className="page-wrapper">
          <div className="content">
            <div className="heding">
              <h1>Dashboard</h1>
            </div>
            <div className='row mt-3'>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>Start Date: </label>
                  <input type="date" className="form-control" value={selectedStartDate} onChange={handleStartDateChange} />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="form-group">
                  <label>End Date: </label>
                  <input type="date" className="form-control" value={selectedEndDate} onChange={handleEndDateChange} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="" >
                  <div className="card-body">
                    <div className="home-userhead" style={{ padding: "0 25px" }}>
                      <div className="home-usercount">
                        <h1>Attendance :</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user home-provider">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user-circle.svg" alt="img" /></span>
                          <h6>Schedule Batch</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{attendance.total_batch_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph2.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user home-provider">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user-circle.svg" alt="img" /></span>
                          <h6>Present Students</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{attendance.total_present_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph2.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user home-provider">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user-circle.svg" alt="img" /></span>
                          <h6>Absent Students</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{attendance.total_absent_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph2.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="" >
                  <div className="card-body">
                    <div className="home-userhead" style={{ padding: "0 25px" }}>
                      <div className="home-usercount">
                        <h1>Examination :</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user.svg" alt="img" /></span>
                          <h6>Schedule Exam</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{exam.total_exam}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph1.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user.svg" alt="img" /></span>
                          <h6>Exam Present</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{examattendance.total_present_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph1.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user.svg" alt="img" /></span>
                          <h6>Exam Absent</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{examattendance.total_absent_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph1.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="" >
                  <div className="card-body">
                    <div className="home-userhead" style={{ padding: "0 25px" }}>
                      <div className="home-usercount">
                        <h1>Homework :</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user home-service">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/service.svg" alt="img" /></span>
                          <h6>Assing Homework</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{homework.total_homework}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph3.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user home-service">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/service.svg" alt="img" /></span>
                          <h6>Homework Done</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{homeworkstatus.total_done_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph3.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user home-service">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/service.svg" alt="img" /></span>
                          <h6>Homework Not Done</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{homeworkstatus.total_not_done_count}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph3.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="" >
                  <div className="card-body">
                    <div className="home-userhead" style={{ padding: "0 25px" }}>
                      <div className="home-usercount">
                        <h1>Resources :</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card" >
                  <div class="card-body">
                    <div class="home-user home-subscription">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="/assets/img/icons/money.svg" alt="img" /></span>
                          <h6>Total Inquiry</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{inquiry.total_inquiry}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="/assets/img/graph/graph4.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user home-subscription">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="/assets/img/icons/money.svg" alt="img" /></span>
                          <h6>Total Students</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{student.total_student}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="/assets/img/graph/graph4.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user home-subscription">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="/assets/img/icons/money.svg" alt="img" /></span>
                          <h6>Total Staff</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{admin.total_admin}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="/assets/img/graph/graph4.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="" >
                  <div className="card-body">
                    <div className="home-userhead" style={{ padding: "0 25px" }}>
                      <div className="home-usercount">
                        <h1>Finance :</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user home-provider">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user-circle.svg" alt="img" /></span>
                          <h6>Total Income</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{income.total_amount}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph2.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user home-provider">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user-circle.svg" alt="img" /></span>
                          <h6>Total Fees</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{fees.total_amount}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph2.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 ">
                <div className="card">
                  <div class="card-body">
                    <div class="home-user home-provider">
                      <div class="home-userhead">
                        <div class="home-usercount">
                          <span><img src="assets/img/icons/user-circle.svg" alt="img" /></span>
                          <h6>Total Expenses</h6>
                        </div>
                      </div>
                      <div class="home-usercontent">
                        <div class="home-usercontents">
                          <div class="home-usercontentcount">
                            <span class="counters" style={{ paddingLeft: "13px" }}>{expense.total_amount}</span>
                          </div>
                        </div>
                        <div class="homegraph">
                          <img src="assets/img/graph/graph2.png" alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      }

    </div>
  );
}
export default Home;
