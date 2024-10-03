import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";
import "moment-timezone";
function StudentDetails() {
  const [loader, setLoader] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    gender: "",
    id_branch: "",
    id_board: "",
    id_medium: "",
    id_standard: "",
    id_batch: "",
    id_course: "",
    school: "",
    id_shift: "",
    id_reference_type: "",
    reference_name: "",
    birth_date: "",
    contact_1: "",
    contact_2: "",
    address: "",
    pincode: "",
    remark: "",
    fathers_name: "",
    fathers_occupation: "",
    fathers_contact: "",
    mothers_name: "",
    mothers_occupation: "",
    mothers_contact: "",
    sibling_name: "",
    sibling_relation: "",
    sibling_board: "",
    sibling_medium: "",
    sibling_standard: "",
    sibling_school: "",
    sibling_tution_name: "",
    last_result: "",
    final_fees: "",
    id_state: "",
    id_city: "",
    id_area: "",
    admission_date: "",
    password: "",
    email: "",
    photo: null,
    branch_name: "",
    board_name: "",
    medium_name: "",
    standard_name: "",
    batch_name: "",
    course_name: "",
    state_name: "",
    city_name: "",
    area_name: ""
  });

  const [data, setData] = useState([])
  const userData = JSON.parse(localStorage.getItem("userData"));
  const branchId = userData?.data.id_branch;

  const convertDateFormat = (dateString) => {
    const convertedDate = moment(dateString)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD");
    return convertedDate;
  };
  // console.log(values);
  const getStudentData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/student/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        const admissionDate = convertDateFormat(res.data.data[0].admission_date);

        setValues({
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
          final_fees: res.data.data[0].final_fees,
          id_state: res.data.data[0].id_state,
          id_city: res.data.data[0].id_city,
          id_area: res.data.data[0].id_area,
          admission_date: admissionDate,
          email: res.data.data[0].email,
          password: res.data.data[0].password,
          photo: res.data.data[0].photo,
          branch_name: res.data.data[0].branch_name,
          board_name: res.data.data[0].board_name,
          medium_name: res.data.data[0].medium_name,
          standard_name: res.data.data[0].standard_name,
          batch_name: res.data.data[0].batch_name,
          course_name: res.data.data[0].course_name,
          state_name: res.data.data[0].state_name,
          city_name: res.data.data[0].city_name,
          area_name: res.data.data[0].area_name,
          shift_name: res.data.data[0].shift_name,
          reference_type_name: res.data.data[0].reference_type_name
        });
        setData(res.data.data[0].sibling)

      } else {
        Swal.fire({
          icon: "error",
          title: "Attendance not found",
        });
        navigate("/attendance");
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);


  let addFormFields = () => {
    setData([
      ...data,
      { sibling_name: '', sibling_relation: '', sibling_board: '', sibling_medium: '', sibling_standard: '', sibling_school: '', sibling_tution_name: '' },
    ]);
  };


  const handleimg = (e) => {
    e.target.src = "/assets/img/user1.png";
    e.target.alt = "Image not found";
  };
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
            <form>
              <div className="row">
                {/* {/ <!-- [ breadcrumb ] start --> /} */}
                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                    <li className="breadcrumb-item"><NavLink to="/student">Student </NavLink>/</li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Student</li>
                  </ol>
                </nav>
                {/* {/ <!-- [ breadcrumb ] end --> /} */}
                <div className="col-lg-12 col-sm-12">
                  <div className="content-page-header">
                    <h5>Edit Student</h5>
                  </div>
                  <div className="d-flex">
                    <div className="col-3">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_BASE_URL}/uploads/${values.photo}`}
                        style={{
                          width: "140px",
                          height: "140px",
                          borderRadius: "50%",
                          margin: "5px 0",
                        }}
                        draggable={false}
                        onError={handleimg}
                      />
                    </div>
                    <div className="col-lg-2">
                      <div className="form-group">
                        <label>Admission Date</label>
                        <input
                          type="date"
                          name="admission_date"
                          className="form-control"
                          value={values.admission_date}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">


                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name"
                          disabled
                          value={values.name}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Gender</label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="male"
                            value="Male"
                            disabled
                            checked={values.gender === "male"}
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="female"
                            value="Female"
                            checked={values.gender === "female"}
                            disabled
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Branch</label>
                        <input type="text" className="form-control" disabled value={values.branch_name} />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="from-group">
                        <label> Board </label>
                        <input type="text" className="form-control" disabled value={values.board_name} />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="from-group mt-1">
                        <label> Medium </label>
                        <input type="text" className="form-control" disabled value={values.medium_name} />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="from-group mt-1">
                        <label> Standard </label>
                        <input type="text" className="form-control" disabled value={values.standard_name} />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="from-group mt-4">
                        <label> Batch </label>
                        <input type="text" className="form-control" disabled value={values.batch_name} />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="from-group mt-4">
                        <label> Course </label>
                        <input type="text" className="form-control" disabled value={values.course_name} />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-4">
                      <div className="form-group">
                        <label>Final Fees</label>
                        <input
                          type="number"
                          name="final_fees"
                          className="form-control"
                          placeholder="Final Fees"
                          value={values.final_fees}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-4">
                      <div className="form-group">
                        <label>School</label>
                        <input
                          type="text"
                          name="school"
                          className="form-control"
                          placeholder="School"
                          value={values.school}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <label>Shift</label>
                      <input type="text" className="form-control" disabled value={values.shift_name} />
                    </div>

                    <div class="col-lg-6">
                      <label>Reference Type</label>
                      <input type="text" className="form-control" disabled value={values.reference_type_name} />
                    </div>

                    <div className="col-lg-6 mt-4">
                      <div className="form-group">
                        <label>Referance Name</label>
                        <input
                          type="text"
                          name="reference_name"
                          className="form-control"
                          placeholder="Referance Name"
                          value={values.reference_name}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-4">
                      <div className="form-group">
                        <label>Date Of Birth</label>
                        <input
                          type="date"
                          name="birth_date"
                          className="form-control"
                          placeholder="Date Of Birth"
                          value={values.birth_date}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Contact 1</label>
                        <input
                          type="number"
                          name="contact_1"
                          className="form-control"
                          placeholder="Contact"
                          value={values.contact_1}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Contact 2</label>
                        <input
                          type="number"
                          name="contact_2"
                          className="form-control"
                          placeholder="Contact"
                          value={values.contact_2}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Pincode</label>
                        <input
                          type="nuber"
                          name="pincode"
                          className="form-control"
                          placeholder="Pincode"
                          value={values.pincode}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Remark</label>
                        <input
                          type="text"
                          name="remark"
                          className="form-control"
                          placeholder="Remark"
                          value={values.remark}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <label>State</label>
                      <input type="text" className="form-control" disabled value={values.state_name} />
                    </div>
                    <div className="col-lg-6">
                      <label>City</label>
                      <input type="text" className="form-control" disabled value={values.city_name} />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label>Area</label>
                      <input type="text" className="form-control" disabled value={values.area_name} />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="form-group">
                        <label>Last Result</label>
                        <input
                          type="number"
                          name="last_result"
                          className="form-control"
                          placeholder="Last Result"
                          value={values.last_result}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="text"
                          disabled
                          name="email"
                          className="form-control"
                          placeholder="Email"
                          value={values.email} />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Password</label>
                        <input type="text" name="password" className="form-control" placeholder="Please Enter Password"
                          value={values.password} disabled />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          type="text"
                          className="form-control"
                          placeholder="Address"
                          value={values.address}
                          name="address"
                          disabled
                        />
                      </div>
                    </div>

                    <h1 className="mt-5">Parents Details :</h1>

                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <label>Father's Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Father's Name"
                          value={values.fathers_name}
                          name="fathers_name"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <label>Father's Occupation</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="father's Occupation"
                          value={values.fathers_occupation}
                          name="fathers_occupation"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <label>Father's Contact</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Father's Contact"
                          value={values.fathers_contact}
                          name="fathers_contact"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <label>Mother's Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mother's Name"
                          value={values.mothers_name}
                          name="mothers_name"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <label>Mother's Occupation</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mother's Occupation"
                          value={values.mothers_occupation}
                          name="mothers_occupation"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-4">
                      <div className="form-group">
                        <label>Mother's Contact</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Mother's Contact"
                          value={values.mothers_contact}
                          name="mothers_contact"
                          disabled
                        />
                      </div>
                    </div>

                    <h1 className="mt-5">Sibling Details :</h1>

                    {data.map(
                      (element, i) => (
                        <div className="row">
                          <div className="col-lg-6 mt-4">
                            <div className="form-group">
                              <label>Sibling Name</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling Name"
                                value={data[i].sibling_name}
                                name="sibling_name"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mt-4">
                            <div className="form-group">
                              <label>Sibling Relation</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling Relation"
                                value={data[i].sibling_relation}
                                name="sibling_relation"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Sibling Board</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling Board"
                                value={data[i].sibling_board}
                                name="sibling_board"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Sibling Medium</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling Medium"
                                value={data[i].sibling_medium}
                                name="sibling_medium"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Sibling Standard</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling Standard"
                                value={data[i].sibling_standard}
                                name="sibling_standard"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Sibling School</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling School"
                                value={data[i].sibling_school}
                                name="sibling_school"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="form-group">
                              <label>Sibling Tuition Name</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Sibling tuition name"
                                value={data[i].sibling_tution_name}
                                name="sibling_tution_name"
                                disabled
                              />
                            </div>
                          </div>


                        </div>
                      )
                    )}
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <Link to={"/student"} className="btn btn-cancel me-3">
                          Back
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div >
        </div >
      }

    </>
  );
}
export default StudentDetails;
