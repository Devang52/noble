import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditConclusion() {
  const [loader, setLoader] = useState(false)
  const { id } = useParams();
  const [values, setValues] = useState({
    conclusion: "",
    done: [],
    pending: [],
    remark: "",
  });
  const [studentfilter, setStudentfilter] = useState({
    id_student: [],
  })

  const [student, setStudent] = useState([]);
  const navigate = useNavigate();

  const getStudentData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/student`
      );
      if (res.status === 200) {
        setStudent(res.data.data);
      } else {
        setStudent([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const getConclusionData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getbyidconclusion/${id}`
      );
      console.log(res.data);
      if (res.status === 200 && res.data.data.length > 0) {
        const done = Array.isArray(res.data.data[0].done)
          ? res.data.data[0].done
          : res.data.data[0].done
            ? res.data.data[0].done.split(",").map((id) => parseInt(id.trim(), 10))
            : [];

        const pending = Array.isArray(res.data.data[0].pending)
          ? res.data.data[0].pending
          : res.data.data[0].pending
            ? res.data.data[0].pending.split(",").map((id) => parseInt(id.trim(), 10))
            : [];
        const student = Array.isArray(res.data.data[0].id_student)
          ? res.data.data[0].id_student
          : res.data.data[0].id_student
            ? res.data.data[0].id_student.split(",").map((id) => parseInt(id.trim(), 10))
            : [];
        setValues({
          conclusion: res.data.data[0].purpose,
          done: done,
          pending: pending,
          remark: res.data.data[0].remark
        });
        setStudentfilter({
          id_student: student
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Batch not found",
        });
        // navigate('/batch');
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  useEffect(() => {
    getStudentData();
    getConclusionData();
  }, []);

  //              POST DATA
  const headleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!values.conclusion || !values.remark) {
        Swal.fire({
          title: "Please enter all data",
          icon: "warning",
        });
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/editconclusion/` + id,
          values
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: "Concluion insertion successful",
            timer: 1500,
          }).then(() => {
            navigate("/conclusion");
          });
        } else {
          // Unsuccessful request
          Swal.fire({
            title: "Concluion insertion failed",
            icon: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };

  const handleInputChange = (e, studentId) => {
    const { name, checked } = e.target;

    setValues((prevValues) => {
      let pendingArray = Array.isArray(prevValues.pending)
        ? prevValues.pending
        : [];

      if (name === "done") {
        if (checked) {
          return {
            ...prevValues,
            done: [...prevValues.done, studentId],
            pending: pendingArray.filter((id) => id !== studentId),
          };
        } else {
          return {
            ...prevValues,
            done: prevValues.done.filter((id) => id !== studentId),
            pending: [...pendingArray, studentId],
          };
        }
      } else {
        return {
          ...prevValues,
          [name]: checked ? [studentId] : [],
        };
      }
    });
  };

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
                    <li className="breadcrumb-item"><NavLink to="/conclusion">Concluion </NavLink>/</li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Concluion</li>
                  </ol>
                </nav>
                <div className="col-lg-12 col-sm-12">
                  <div className="content-page-header">
                    <h5>Conclusion</h5>
                  </div>

                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Purpose</label>
                        <select
                          className="form-control"
                          value={values.conclusion || ""}
                          onChange={(e) =>
                            setValues({ ...values, conclusion: e.target.value })
                          }
                        >
                          <option value="" disabled>
                            Select Purpose
                          </option>

                          <option value="Irregularities">Irregularities</option>
                          <option value="Poor Results">Poor Results</option>
                          <option value="Behaviour">Behaviour</option>
                          <option value="Study Improvement">
                            Study Improvement
                          </option>
                          <option value="General Awaverness">
                            General Awaverness
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Remark</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Remark"
                          name="remark"
                          value={values.remark}
                          onChange={(e) =>
                            setValues({ ...values, remark: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <h1>List Of Student</h1>
                      <div className="row">
                        <div className="col-12 ">
                          <div className="table-resposnive">
                            <table className="table datatable">
                              <thead>
                                <tr>
                                  <th>Index</th>
                                  <th>Select</th>
                                  <th>Student Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {student
                                  .filter((dataa) =>
                                    studentfilter.id_student.includes(dataa.id)
                                  )
                                  .map((dataa, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <div className="siderbar-toggle">
                                          Done
                                          <label className="switch">
                                            <input
                                              type="checkbox"
                                              name="done"
                                              checked={values.done.includes(
                                                dataa.id
                                              )}
                                              onChange={(e) =>
                                                handleInputChange(e, dataa.id)
                                              }
                                            />
                                            <span className="slider round"></span>
                                          </label>
                                        </div>
                                      </td>
                                      <td>{dataa.name}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="btn-path">
                        <Link to={"/conclusion"} className="btn btn-cancel me-3">
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
            </form>
          </div>
        </div>
      }

    </>
  );
}
