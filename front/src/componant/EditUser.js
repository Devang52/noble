import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditUser() {
  const [loader, setLoader] = useState(false)
  const { id } = useParams();
  const [values, setValues] = useState({
    user_type: "",
    name: "",
    id_branch: "",
    email: "",
    password: "",
    contact: "",
    address_1: "",
    address_2: "",
    pincode: "",
    state: "",
    city: "",
    area: "",
  });
  const [branch, setBranch] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [area, setArea] = useState([]);
  const [staffType, setStaffType] = useState([]);
  const navigate = useNavigate();
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
  const getStateData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getstatesbycountry/?c_id=${1}`
      );
      if (res.status === 200) {
        setState(res.data.data);
      } else {
        setState([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getCityData = async (s_id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getCitiesByCountryAndState/?s_id=${s_id}`
      );
      if (res.status === 200) {
        setCity(res.data.data);
      } else {
        setCity([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getAreaData = async (city_id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getareabycountryandstateandcity/?city_id=${city_id}`
      );
      if (res.status === 200) {
        setArea(res.data.data);
      } else {
        setArea([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getStaffType = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/staff-type`
      );
      if (res.status === 200) {
        setStaffType(res.data.data);
      } else {
        setStaffType([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getUserData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/getadmin/${id}`);
      if (res.status === 200 && res.data.data.length > 0) {
        setValues({
          user_type: res.data.data[0].user_type,
          name: res.data.data[0].name,
          id_branch: res.data.data[0].id_branch,
          email: res.data.data[0].email,
          password: res.data.data[0].password,
          contact: res.data.data[0].contact,
          address_1: res.data.data[0].address_1,
          address_2: res.data.data[0].address_2,
          pincode: res.data.data[0].pincode,
          state: res.data.data[0].state,
          city: res.data.data[0].city,
          area: res.data.data[0].area
        });

        await getCityData(res.data.data[0].state);
        await getAreaData(res.data.data[0].city);
      } else {
        Swal.fire({
          type: 'error',
          icon: 'error',
          title: 'Attendance not found',
        });
        // navigate('/attendance');
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  useEffect(() => {
    getUserData();
    getBranchData();
    getStateData()
    getStaffType()
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const contactRegex = /^\d{10}$/;
      const isValidPincode = /^\d{6}$/;

      const trimmedStudent = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        address_1: values.address_1.trim(),
      };
      if (
        !trimmedStudent.name ||
        !trimmedStudent.email ||
        !trimmedStudent.password ||
        !trimmedStudent.address_1 ||
        !values.name ||
        !values.user_type ||
        !values.name ||
        !values.id_branch ||
        !values.email ||
        !values.password ||
        !values.contact ||
        !values.address_1 ||
        !values.pincode ||
        !values.state ||
        !values.city ||
        !values.area ||
        values.city === "-- Select City --" ||
        values.area === "-- Select Area --"
      ) {
        Swal.fire({
          title: "Please enter User Data",
          icon: "warning",
        });
      } else if (
        !contactRegex.test(values.contact)
      ) {
        Swal.fire({
          title: "Invalid Contact Format",
          text: "Contact number must be exactly 10 digits",
          icon: "warning",
        });
      } else if (!isValidPincode.test(values.pincode)) {
        Swal.fire({
          title: "Invalid Pin Code Format",
          text: "Invalid pincode. Please enter a 6-digit number.",
          icon: "warning",
        });
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/admin/update/${id}`,
          values
        );

        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "User insertion successful",
            timer: 1500,
          }).then(() => {
            navigate("/user");
          });
        } else {
          Swal.fire({
            title: "User insertion failed",
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
                <li className="breadcrumb-item"><NavLink to="/user">User </NavLink>/</li>
                <li className="breadcrumb-item active" aria-current="page">Edit User</li>
              </ol>
            </nav>
            <form onSubmit={handleSubmit}>
              <h1>Edit User</h1>
              <div className="row">
                <div className="row">
                  <div className="col-6">
                    <div className="add-form">
                      <label> User Type</label>
                      <select
                        name="user_type"
                        className="form-select"
                        required
                        disabled
                        value={values.user_type}
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prevValues) => ({
                            ...prevValues,
                            user_type: value,
                          }));
                        }}
                      >
                        <option selected disabled>
                          Select Staff Type
                        </option>
                        {staffType.map((data) => (
                          <option
                            key={data.id}
                            value={data.id}
                            data-key={data.id}
                          >
                            {data.staff_type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="add-form">
                      <label> User Name </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Name"
                        value={values.name}
                        onChange={(e) =>
                          setValues({ ...values, name: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="add-form">
                      <label> User Branch </label>
                      <select
                        name="id_branch"
                        id="id_branch"
                        disabled
                        className="form-select"
                        required
                        placeholder="Branch"
                        value={values.id_branch}
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prevValues) => ({
                            ...prevValues,
                            id_branch: value,
                          }));
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

                  <div className="col-6">
                    <div className="add-form">
                      <label> User Email </label>
                      <input
                        type="email"
                        placeholder="User Email"
                        className="form-control"
                        value={values.email}
                        onChange={(e) =>
                          setValues({ ...values, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="add-form">
                      <label> User Password </label>
                      <input
                        type="text"
                        placeholder="User Password"
                        className="form-control"
                        value={values.password}
                        onChange={(e) =>
                          setValues({ ...values, password: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="add-form">
                      <label> User Contact </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contact"
                        value={values.contact}
                        onChange={(e) =>
                          setValues({ ...values, contact: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Address Line1 </label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      value={values.address_1}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address_1: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Address Line2 <span className="mand">*</span> </label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      value={values.address_2}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address_2: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Pincode </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Pincode"
                      value={values.pincode}
                      onChange={(e) =>
                        setValues({ ...values, pincode: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> State </label>
                    <select
                      name="state"
                      id="state"
                      className="form-select"
                      required
                      value={values.state}
                      onChange={(e) => {
                        const { value } = e.target;
                        setValues((prevState) => ({
                          ...prevState,
                          state: value,
                          city: "",
                        }));
                        getCityData(value);
                      }}
                    >
                      <option selected disabled>
                        -- Select State --
                      </option>

                      {state.length > 0
                        ? state.map((data) => {
                          return (
                            <option
                              key={data.id}
                              data-key={data.id}
                              value={data.id}
                            >
                              {data.state}
                            </option>
                          );
                        })
                        : null}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> City </label>
                    <select
                      name="city"
                      id="city"
                      className="form-select"
                      required
                      value={values.city}
                      onChange={(e) => {
                        const { value } = e.target;
                        setValues((prevState) => ({
                          ...prevState,
                          city: value,
                          area: "",
                        }));
                        getAreaData(value)
                      }}
                    >
                      <option value="-- Select City --">
                        -- Select City--
                      </option>

                      {city.length > 0
                        ? city.map((data) => {
                          return (
                            <option
                              key={data.id}
                              data-key={data.id}
                              value={data.id}
                            >
                              {data.city}
                            </option>
                          );
                        })
                        : null}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Area </label>
                    <select
                      name="area"
                      id="area"
                      className="form-select"
                      required
                      value={values.area}
                      onChange={(e) => {
                        const { value } = e.target;
                        setValues((prevState) => ({
                          ...prevState,
                          area: value,
                        }));
                      }}
                    >
                      <option value="-- Select Area--">
                        -- Select Area--
                      </option>

                      {area.length > 0
                        ? area.map((data) => {
                          return (
                            <option
                              key={data.id}
                              data-key={data.id}
                              value={data.id}
                            >
                              {data.area}
                            </option>
                          );
                        })
                        : null}
                    </select>
                  </div>
                </div>
                <div className="btn-path">
                  <Link to={"/user"} className="btn btn-cancel me-3">
                    Back
                  </Link>
                  <button type="submit" className="btn btn-submit ">
                    {" "}
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      }

    </>
  )
}