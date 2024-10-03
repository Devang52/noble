import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";
import "moment-timezone";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ViewAbsentReport() {
  const [loader, setLoader] = useState(false)
  const { id } = useParams();
  const [absent, setAbsent] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [data, setData] = useState([]);
  const [medium, setMedium] = useState([]);
  const [standard, setStandard] = useState([]);
  const pdfRef = useRef();
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    setLoading(true);
    const input = pdfRef.current;
    // html2canvas(input)
    //   .then((canvas) => {
    //     const pdf = new jsPDF('p', 'mm', 'legal');
    //     pdf.addImage(canvas.toDataURL('image/jpg'), 'JPG', 0, 0, 250, 400);
    //     pdf.save('webpage.pdf');
    //     setLoading(false);
    //   });
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'legal', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      // Centering image horizontally and vertically
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('Portfolio.pdf');
      setLoading(false);
    })

    // html2canvas(input).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('p', 'mm', 'letter', true);
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = pdf.internal.pageSize.getHeight();
    //   const imgWidth = canvas.width;
    //   const imgHeight = canvas.height;
    //   const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    //   const imgX = (pdfWidth - imgWidth * ratio) / 2;
    //   const imgY = 30;
    //   pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    //   pdf.save('invoice.pdf');
    //   setLoading(false);
    // })
  };
  //student data
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
      setLoader(true)
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
      setLoader(true)
    }
  };
  const getStudentData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/student/${id}`
      );
      if (res.status === 200) {
        setData({
          name: res.data.data[0].name,
          gender: res.data.data[0].gender,
          id_branch: res.data.data[0].id_branch,
          id_board: res.data.data[0].id_board,
          id_medium: res.data.data[0].id_medium,
          id_standard: res.data.data[0].id_standard,
          id_batch: res.data.data[0].id_batch,
          id_course: res.data.data[0].id_course,
          id_reference_type: res.data.data[0].id_reference_type,
          school: res.data.data[0].school,
          id_shift: res.data.data[0].id_shift,
          reference_name: res.data.data[0].reference_name,
          contact_1: res.data.data[0].contact_1,
          contact_2: res.data.data[0].contact_2,
          birth_date: res.data.data[0].birth_date,
          address: res.data.data[0].address,
          pincode: res.data.data[0].pincode,
          remark: res.data.data[0].remark,
          last_result: res.data.data[0].last_result,
          fathers_name: res.data.data[0].fathers_name,
          fathers_occupation: res.data.data[0].fathers_occupation,
          fathers_contact: res.data.data[0].fathers_contact,
          mothers_name: res.data.data[0].mothers_name,
          mothers_occupation: res.data.data[0].mothers_occupation,
          mothers_contact: res.data.data[0].mothers_contact,
          sibling_name: res.data.data[0].sibling_name,
          sibling_relation: res.data.data[0].sibling_relation,
          sibling_board: res.data.data[0].sibling_board,
          sibling_medium: res.data.data[0].sibling_medium,
          sibling_standard: res.data.data[0].sibling_standard,
          sibling_school: res.data.data[0].sibling_school,
          sibling_tution_name: res.data.data[0].sibling_tution_name,
          admission_date: res.data.data[0].admission_date,
          photo: res.data.data[0].photo,
        });
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setLoader(true)
    }
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
  const handleimg = (e) => {
    e.target.src = "/assets/img/user1.png";
    e.target.alt = "Image not found";
  };
  //maths report
  const [maths, setMaths] = useState([]);
  const getMathsReportData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getbyidmathsreportstudent/${id}`
      );

      if (res.status === 200) {
        setMaths(res.data.data);
        console.log("maths", maths);
      } else {
        setMaths([]);
      }
    } catch (error) {
      console.log(error);
      setLoader(true)
    }
  };
  //attendance
  const getAttendanceData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getWeeklyAttendance/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        setAbsent(res.data.data);
      } else {
        setAbsent([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  const getSubjectData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getsubject`
      );
      if (res.status === 200) {
        setSubjects(res.data.data);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  const getSubjectNameById = (subjectId) => {
    const foundSubject = subjects.find((subject) => subject.id === subjectId);
    return foundSubject ? foundSubject.subject : "Unknown subject";
  };
  const organizeData = (apiData) => {
    const organizedData = {};

    apiData.forEach((item) => {
      const { month, week, id_subject, absentCount } = item;

      if (!organizedData[month]) {
        organizedData[month] = {};
      }

      if (!organizedData[month][id_subject]) {
        organizedData[month][id_subject] = {};
      }

      organizedData[month][id_subject][week] = absentCount;
    });

    return organizedData;
  };

  const organizedData = organizeData(absent);
  const uniqueSubjects = new Set();
  // Home work data
  const [homework, setHomework] = useState([]);
  const getHomeWorData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/homeworkstatus/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        setHomework(res.data.data);
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  const organizeDataHomework = (apiData) => {
    const organizedDataHomework = {};

    apiData.forEach((item) => {
      const { month, week, id_subject, notDoneCount } = item;

      if (!organizedDataHomework[month]) {
        organizedDataHomework[month] = {};
      }

      if (!organizedDataHomework[month][id_subject]) {
        organizedDataHomework[month][id_subject] = {};
      }

      organizedDataHomework[month][id_subject][week] = notDoneCount;
    });

    return organizedDataHomework;
  };
  const organizedDataHomework = organizeDataHomework(homework);
  const uniqueSubjectsHomework = new Set();
  //Weekly Exam Result
  const [weeklyExam, SetWeeklyExam] = useState([]);
  const getWeeklyExamData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/exammarksreport/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        SetWeeklyExam(res.data.data);
        console.log(res.data.data);
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  const calculatePercentage = (marks, totalMarks) => {
    if (totalMarks === 0) {
      return "N/A"; // to handle division by zero
    }

    const percentage = ((marks / totalMarks) * 100).toFixed(2);
    return percentage;
  };
  const convertDateFormat = (dateString) => {
    const convertedDate = moment(dateString)
      .tz("Asia/Kolkata")
      .format("DD-MM-YYYY");
    return convertedDate;
  };
  //weeklyexamresultreport
  const [monthlyData, setMonthlyData] = useState({});
  useEffect(() => {
    getWeeklyExamResultData();
  }, [id]); // Trigger the API call whenever the 'id' prop changes
  const getMonthName = (monthKey) => {
    const monthNumber = parseInt(monthKey.split("_")[1]);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1] || "";
  };
  const getWeeklyExamResultData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getexammarksportfoliyo/${id}`
      );
      if (
        res.status === 200 &&
        res.data.success === 0 &&
        res.data.data.length > 0
      ) {
        setMonthlyData(
          res.data.data.reduce((acc, item) => {
            const monthKey = Object.keys(item)[0]; // Get the month key
            acc[getMonthName(monthKey)] = item[monthKey];
            return acc;
          }, {})
        );
      } else {
        setMonthlyData({});
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  //PTM Report
  const [ptm, setPtm] = useState([]);
  const [user, setUser] = useState([]);
  const getPTMReport = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ptmreport/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        setPtm(res.data.data);
        console.log(res.data.data);
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/admin`
      );
      if (res.status === 200) {
        setUser(res.data.data);
      } else {
        setUser([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true)
    }
  };
  const getTeacherNameById = (teacherId) => {
    const foundTeacher = user.find((teacher) => teacher.id === teacherId);
    return foundTeacher ? foundTeacher.name : "Unknown Teacher";
  };
  useEffect(() => {
    getAttendanceData();
    getHomeWorData();
    getSubjectData();
    getWeeklyExamData();
    getPTMReport();
    getUserData();
    getStudentData();
    getMediumData();
    getStandardData();
    getMathsReportData();
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
  // const date = data.admission_date.split('T')[0];
  const date = data.admission_date ? data.admission_date.split('T')[0] : 'Default Date';


  return (
    <>
      {loader ||
        <div className="">
          <div className="content">
            <div ref={pdfRef} className="portpholiopd">
              <div class="main">
                <div class="hedar">
                  <div class="noble-logo">
                    <img
                      src="/assets/img/nobel2.png"
                      class="img-fluid logo"
                      alt=""
                    />
                  </div>
                  <div class="noble-text">
                    <h2>NOBLE ACADEMY</h2>
                    <h1>
                      <b>STUDENTS PORTFOLIO</b>
                    </h1>
                  </div>
                  <div class="hedar-roght">
                    <p>STD :- {getStandardNameById(data.id_standard)}</p>
                    <p>Medium :- {getMediumNameById(data.id_medium)}</p>
                    <p>Year :- {convertDateFormat(data.admission_date)}</p>
                    <p>STD ID NO :- {id}</p>
                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-3">
                      <div className="sec-2">
                        <div className="name">
                          <h5>Name :-</h5>
                        </div>
                        <div className="address">
                          <h5>Address :-</h5>
                        </div>
                      </div>
                    </div>

                    <div className="col-7">
                      <div className="text-name">
                        <div className="col-8">
                          <div className="add-form">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              disabled
                              value={data.name}
                              placeholder="Enter Course Name"
                            />
                          </div>
                        </div>
                        <div className="col-8 mt-3">
                          <div className="form-group">
                            <textarea
                              type="text"
                              disabled
                              className="form-control"
                              placeholder="Address"
                              value={data.address}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="studemt-img">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_BASE_URL}/uploads/${data.photo}`}
                          className="img-fluid logo"
                          onError={handleimg}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <div className="details">
                        <div className="admission-date mt-4">
                          <h5>Admission Date:-</h5>
                        </div>
                        <div className="whatsapp-no mt-4">
                          <h5>Contact Number:-</h5>
                        </div>
                        <div className="occupation mt-2">
                          <h5>Parents Contact No. :-</h5>
                        </div>
                        <div className="last-results mt-2">
                          <h5>Last Year Results :-</h5>
                        </div>
                        <div className="school-name mt-2">
                          <h5>School Name:- </h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-9">
                      <div className="text-details">
                        <div className="col-3">
                          <div className="add-form">
                            <input
                              type="date"
                              name="name"
                              className="form-control"
                              disabled
                              value={date}
                              placeholder="Enter Course Name"
                            />
                          </div>
                        </div>
                        {/* <div className="admission-date">
                          <p>{convertDateFormat(data.admission_date)}</p>
                        </div> */}
                        <div className="whatsapp-no1" style={{ gap: '10px' }}>
                          <p style={{ fontSize: '18px' }}>(Self)</p>{" "}
                          <div className="col-3">
                            <div className="add-form">
                              <input
                                type="number"
                                name="name"
                                className="form-control"
                                disabled
                                value={data.contact_1}
                                placeholder="Enter Course Name"
                              />
                            </div>
                          </div>
                          {/* <span>
                            <p>{data.contact_1}</p>
                          </span> */}
                          <p style={{ fontSize: '18px' }}>(F)</p>{" "}
                          <div className="col-3">
                            <div className="add-form">
                              <input
                                type="number"
                                name="name"
                                className="form-control"
                                disabled
                                value={data.contact_2}
                                placeholder="Enter Course Name"
                              />
                            </div>
                          </div>
                          {/* <span>
                            <p>{data.contact_2}</p>
                          </span> */}
                        </div>

                        <div className="whatsapp-no1" style={{ gap: '16px' }}>
                          <p style={{ fontSize: '18px' }}>(F)</p>{" "}
                          <div className="col-3">
                            <div className="add-form">
                              <input
                                type="number"
                                name="name"
                                className="form-control"
                                disabled
                                value={data.fathers_contact}
                                placeholder="Enter Course Name"
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: '18px' }}>(M)</p>{" "}
                          <div className="col-3">
                            <div className="add-form">
                              <input
                                type="number"
                                name="name"
                                className="form-control"
                                disabled
                                value={data.mothers_contact}
                                placeholder="Enter Course Name"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-2">
                          <div className="add-form">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              disabled
                              value={data.last_result + '%'}
                              placeholder="Enter Course Name"
                            />
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="add-form">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              disabled
                              value={data.school}
                              placeholder="Enter Course Name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-page-header content-page-headersplit mt-5">
                <h5>Maths Report</h5>
              </div>

              {/*      Welcome Test Results      */}
              <div className="welcome-test">
                <div className="row bord">
                  <div className="col-12 subject">
                    <div className="row">
                      <div className="col-12 mainmonth">
                        <table style={{ width: "100%" }} className="month">
                          <thead>
                            <tr>
                              <th colSpan="12">A.Welcome Test Results</th>
                            </tr>
                            <tr>
                              <th>Date</th>
                              <th>Exam Marks</th>
                              <th>Simple (+)</th>
                              <th>Point (+)</th>
                              <th>Simple (-)</th>
                              <th>Point (-)</th>
                              <th>Simple (x)</th>
                              <th>Point (x)</th>
                              <th>Simple (÷)</th>
                              <th>Point (÷)</th>
                              <th>Marks</th>
                              <th>Percent %</th>
                            </tr>
                          </thead>
                          <tbody style={{ textAlign: "center" }}>
                            {maths.length === 0 ? (
                              <td colSpan="12">No data available</td>
                            ) : (
                              maths.map((dataa, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{convertDateFormat(dataa.created_at)}</td>
                                    <td>{dataa.total_marks}</td>
                                    <td>
                                      {dataa.plus_s
                                        ? dataa.plus_s.charAt(0).toUpperCase() +
                                        dataa.plus_s.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.plus_p
                                        ? dataa.plus_p.charAt(0).toUpperCase() +
                                        dataa.plus_p.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.minus_s
                                        ? dataa.minus_s.charAt(0).toUpperCase() +
                                        dataa.minus_s.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.minus_p
                                        ? dataa.minus_p.charAt(0).toUpperCase() +
                                        dataa.minus_p.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.multiplied_by_s
                                        ? dataa.multiplied_by_s
                                          .charAt(0)
                                          .toUpperCase() +
                                        dataa.multiplied_by_s.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.multiplied_by_p
                                        ? dataa.multiplied_by_p
                                          .charAt(0)
                                          .toUpperCase() +
                                        dataa.multiplied_by_p.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.divided_by_s
                                        ? dataa.divided_by_s
                                          .charAt(0)
                                          .toUpperCase() +
                                        dataa.divided_by_s.slice(1)
                                        : "-"}
                                    </td>
                                    <td>
                                      {dataa.divided_by_p
                                        ? dataa.divided_by_p
                                          .charAt(0)
                                          .toUpperCase() +
                                        dataa.divided_by_p.slice(1)
                                        : "-"}
                                    </td>
                                    <td>{dataa.marks}</td>
                                    <td>
                                      {calculatePercentage(
                                        dataa.marks,
                                        dataa.total_marks
                                      )}
                                      %
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
                </div>
              </div>

              <div className="content-page-header content-page-headersplit mt-5">
                <h5>Absent Report</h5>
              </div>
              <div className="row bord">
                <div className="col-1 subject">
                  <table style={{ width: "100%" }}>
                    <thead>
                      <th>Subject</th>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                      {absent.map((subject) => {
                        if (!uniqueSubjects.has(subject.id_subject)) {
                          uniqueSubjects.add(subject.id_subject);
                          return (
                            <tr key={subject.id_subject}>
                              <td>{getSubjectNameById(subject.id_subject)}</td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="col-11 subject">
                  <div className="row">
                    {Object.keys(organizedData).map((month) => (
                      <div key={month} className="col-4 mainmonth">
                        <table style={{ width: "100%" }} className="month">
                          <thead>
                            <tr>
                              <th colSpan="6">
                                {moment()
                                  .month(month - 1)
                                  .format("MMMM")}
                              </th>
                            </tr>
                            <tr>
                              <th>1st</th>
                              <th>2nd</th>
                              <th>3rd</th>
                              <th>4th</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from(uniqueSubjects).map((subjectId) => (
                              <tr key={subjectId}>
                                {[1, 2, 3, 4, "total"].map((weekDay) => (
                                  <td key={weekDay}>
                                    {organizedData[month] &&
                                      organizedData[month][subjectId]
                                      ? weekDay === "total"
                                        ? Object.keys(
                                          organizedData[month][subjectId]
                                        ).reduce(
                                          (total, wk) =>
                                            total +
                                            (organizedData[month][subjectId][
                                              wk
                                            ] || 0),
                                          0
                                        )
                                        : organizedData[month][subjectId][
                                        weekDay
                                        ] || "-"
                                      : "-"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/*  Homework Report */}
              <div className="content-page-header content-page-headersplit mt-5">
                <h5>Homework Report</h5>
              </div>
              <div className="row bord">
                <div className="col-1 subject">
                  <table style={{ width: "100%" }}>
                    <thead>
                      <th>Subject</th>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                      {homework.map((subject) => {
                        if (!uniqueSubjectsHomework.has(subject.id_subject)) {
                          uniqueSubjectsHomework.add(subject.id_subject);
                          return (
                            <tr key={subject.id_subject}>
                              <td>{getSubjectNameById(subject.id_subject)}</td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="col-11 subject">
                  <div className="row">
                    {Object.keys(organizedDataHomework).map((month) => (
                      <div key={month} className="col-4 mainmonth">
                        <table style={{ width: "100%" }} className="month">
                          <thead>
                            <tr>
                              <th colSpan="6">
                                {moment()
                                  .month(month - 1)
                                  .format("MMMM")}
                              </th>
                            </tr>
                            <tr>
                              <th>1st</th>
                              <th>2nd</th>
                              <th>3rd</th>
                              <th>4th</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from(uniqueSubjectsHomework).map((subjectId) => (
                              <tr key={subjectId}>
                                {[1, 2, 3, 4, "total"].map((weekDay) => (
                                  <td key={weekDay}>
                                    {weekDay === "total"
                                      ? // Calculate the total homework count for the subject in the month
                                      Object.keys(
                                        organizedDataHomework[month][subjectId]
                                      ).reduce(
                                        (total, wk) =>
                                          total +
                                          (organizedDataHomework[month][
                                            subjectId
                                          ][wk] || 0),
                                        0
                                      )
                                      : // Render the homework count for the specific week
                                      organizedDataHomework[month][subjectId][
                                      weekDay
                                      ] || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="content-page-header content-page-headersplit mt-5">
                <h5>Weekly Exam Result Report</h5>
              </div>
              <div className="row">
                <div className="col-12 ">
                  <div className="table-responsive">
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Date</th>
                          <th>Exam</th>
                          <th>Syllabus</th>
                          <th>Total</th>
                          <th>Obtain</th>
                          <th>%</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeklyExam.length === 0 ? (
                          <td colSpan="12">No data available</td>
                        ) : (
                          weeklyExam.map((dataa, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{convertDateFormat(dataa.date)}</td>
                                <td>{dataa.title}</td>
                                <td>{dataa.description}</td>
                                <td>{dataa.total_marks}</td>
                                <td>{dataa.marks}</td>
                                <td>
                                  {calculatePercentage(
                                    dataa.marks,
                                    dataa.total_marks
                                  )}
                                  %
                                </td>
                                <td>{dataa.remark}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/*        Weekly Short Exam Result        */}

              <div className="content-page-header content-page-headersplit mt-5">
                <h5>Weekly Short Exam Result</h5>
              </div>

              <div className="welcome-test">
                <div className="row bord">
                  <div className="col-12 subject">
                    <div className="row">
                      <div className="col-12 mainmonth">
                        <div >
                          <table style={{ width: "100%" }} className="month">
                            <thead>
                              <tr>
                                {/* {index === 0 && <th>Months</th>}{" "} */}
                                <th>Month</th>
                                <th>Week</th>
                                <th>Subject</th>
                                <th>Exam</th>
                                <th>Syllabus</th>
                                <th>Total Marks</th>
                                <th>Result</th>
                                <th>Remarks</th>
                              </tr>
                            </thead>

                            {Object.keys(monthlyData).map((month, index) => (
                              <tbody>
                                {monthlyData[month].length === 0 ? (
                                  <tr>
                                    <td colSpan="8">No data available</td>
                                  </tr>
                                ) : (
                                  monthlyData[month].map((item, index) => (
                                    <tr key={index}>
                                      {index === 0 && (
                                        <td rowSpan={monthlyData[month].length}>
                                          {month}
                                        </td>
                                      )}{" "}
                                      <td>{item.week_number}</td>
                                      <td>
                                        <table style={{ width: "100%" }}>
                                          <tr>
                                            <td style={{ border: "none" }}>
                                              {getSubjectNameById(item.subject)}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td>
                                        <table style={{ width: "100%" }}>
                                          <tr>
                                            <td style={{ border: "none" }}>
                                              {item.exam}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td>
                                        <table style={{ width: "100%" }}>
                                          <tr>
                                            <td style={{ border: "none" }}>
                                              {item.syllabus}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td>
                                        <table style={{ width: "100%" }}>
                                          <tr>
                                            <td style={{ border: "none" }}>
                                              {item.total_marks}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td>
                                        <table style={{ width: "100%" }}>
                                          <tr>
                                            <td style={{ border: "none" }}>
                                              {item.result}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td>
                                        <table style={{ width: "100%" }}>
                                          <tr>
                                            <td style={{ border: "none" }}>
                                              {item.remark}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            ))}

                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*   PTM Report    */}
              <div className="content-page-header content-page-headersplit mt-5">
                <h5>PTM Report</h5>
              </div>
              <div className="row">
                <div className="col-12 ">
                  <div className="table-responsive">
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th>Index</th>
                          <th>Meering Date</th>
                          <th>Teacher</th>
                          <th>Reason</th>
                          <th>Purpose</th>
                          <th>Presence Either Attend Yes/No </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ptm.length === 0 ? (
                          <td colSpan="12">No data available</td>
                        ) : (
                          ptm.map((dataa, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{dataa.meeting_date}</td>
                                <td>{getTeacherNameById(dataa.id_teachar)}</td>
                                <td>{dataa.meeting_title}</td>
                                <td>{dataa.meeting_purpose}</td>
                                <td>{dataa.presence_parent}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {
              loading
                ?
                <>
                  <button class="btn btn-primary protbut" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" style={{ marginRight: "10px" }} aria-hidden="true"></span>
                    Loading...
                  </button>
                </>
                :
                <button onClick={generatePDF} className="btn btn-primary protbut">Download PDF</button>
            }

          </div>
        </div>
      }

    </>
  );
}

export default ViewAbsentReport;
