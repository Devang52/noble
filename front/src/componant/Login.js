import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: ""
  });
  axios.defaults.withCredentials = true;
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const ValidateEmail = () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return values.email.match(validRegex);
  };
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!values.email || !values.password) {
        Swal.fire({
          title: 'Please enter all data',
          icon: 'warning',
        });
      } else if (!ValidateEmail()) {
        Swal.fire({
          type: "warning",
          icon: "warning",
          title: "Invalid Email Address",
        });
      } else {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/login`, values);

        if (res.status === 200) {
          localStorage.setItem("userData", JSON.stringify(res.data));

          switch (res.data.roll) {
            case "Admin":
              Swal.fire({
                icon: "success",
                title: "Admin Login successfully",
                timer: 1500,
              }).then(() => {
                navigate("/");
              });
              break;
            case "Clerk":
              Swal.fire({
                icon: "success",
                title: "Clerk Login successfully",
                timer: 1500,
              }).then(() => {
                navigate("/");
              });
              break;
            case "Teacher":
              Swal.fire({
                icon: "success",
                title: "Teacher Login successfully",
                timer: 1500,
              }).then(() => {
                navigate("/");
              });
              break;
            case "Student":
              Swal.fire({
                icon: "success",
                title: "Student Login successfully",
                timer: 1500,
              }).then(() => {
                navigate("/");
              });
              break;
            case "BranchManager":
              Swal.fire({
                icon: "success",
                title: "BranchManager Login successfully",
                timer: 1500,
              }).then(() => {
                const branchId = res.data.data.id_branch;
                localStorage.setItem("branchId", branchId);
                navigate("/");
              });
              break;
            default:
              Swal.fire({
                icon: "success",
                title: `${res.data.Message} Login successfully`,
                timer: 1500,
              }).then(() => {
                navigate("/");
              });
              break;
          }
        } else {
          Swal.fire({
            title: 'Login insertion failed',
            icon: 'error',
          });
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        if (err.response.data.message === "Invalid email or password") {
          Swal.fire({
            icon: "error",
            title: "Invalid Email or Password",
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Invalid Email or Password",
          });
        }
      }
    }
  };

  return (
    <>
      <div class="main-wrapper wrapper-login">
        <div class="login-pages">
          <div class="container-fluid">
            <div class="row align-items-center justify-content-center">
              <div class="col-lg-12">
                <div class="login-logo">
                  <img src="assets/img/nobel2.png" alt="img" />
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div class="col-lg-6 col-xl-5 mx-auto">
                  <div class="login-wrap">
                    <div class="login-content">
                      <div class="login-contenthead text-center">
                        {/* <div class="login-logo">
                        <img src="assets/img/nobel2.png" alt="img" />
                      </div> */}
                        <h5>Login</h5>
                      </div>
                      <div class="login-input">
                        <div class="form-group">
                          <label>E-mail</label>
                          <input
                            type="text"
                            name="email"
                            className="form-control"
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                          />
                        </div>
                        <div class="form-group">
                          <div class="d-flex justify-content-between">
                            <label>Password</label>
                          </div>
                          <div class="pass-group">
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              onChange={handleInputChange}
                              placeholder="Enter Password"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="login-button">
                        <button type="submit" class="btn btn-login">Login</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
export default Login;