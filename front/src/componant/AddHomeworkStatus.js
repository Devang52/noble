import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddHomeworkStatus() {
    const [loader, setLoader] = useState(false)
    const { id } = useParams();
    const [values, setValues] = useState({
        id_branch: "",
        id_board: "",
        id_medium: "",
        id_standard: "",
        id_batch: "",
        title: '',
    });
    const [data, setData] = useState({
        done: [],
        not_done: [],
    });
    const [student, setStudent] = useState([]);
    const navigate = useNavigate();

    const getStudentData = async (studentIds) => {
        try {
            const studentIdsArray = studentIds.split(',');
            const allStudentData = [];
            for (const studentId of studentIdsArray) {
                const res = await axios.get(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/student/${studentId}`
                );
                if (res.status === 200) {
                    allStudentData.push(res.data.data[0]);
                } else {
                    console.log(`No data found for student ${studentId}`);
                }
            }
            setStudent(allStudentData);
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getAssignHomeworkData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/getedit/assignHomeWork/${id}`);
            if (res.status === 200 && res.data.data.length > 0) {
                setValues({
                    id_branch: res.data.data[0].id_branch,
                    id_board: res.data.data[0].id_board,
                    id_medium: res.data.data[0].id_medium,
                    id_standard: res.data.data[0].id_standard,
                    id_batch: res.data.data[0].id_batch,
                    id_subject: res.data.data[0].id_subject,
                    title: res.data.data[0].title,
                    description: res.data.data[0].description,
                    branch_name: res.data.data[0].branch_name,
                    board_name: res.data.data[0].board_name,
                    medium_name: res.data.data[0].medium_name,
                    standard_name: res.data.data[0].standard_name,
                    subject_name: res.data.data[0].subject_name,
                    batch_name: res.data.data[0].batch_name
                });
            } else {
                Swal.fire({
                    type: 'error',
                    icon: 'error',
                    title: 'Assign HomeWork not found',
                });
                navigate('/assignhomework');
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getHomeworkStatusData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/statusHomeworkbyid/${id}`);
            if (res.status === 200 && res.data.data.length > 0) {
                let done = [];
                let not_done = [];
                if (res.data.data[0].done.trim() !== "") {
                    done = Array.isArray(res.data.data[0].done)
                        ? res.data.data[0].done
                        : res.data.data[0].done.split(',').map(id => parseInt(id.trim(), 10));
                }
                if (res.data.data[0].not_done.trim() !== "") {
                    not_done = Array.isArray(res.data.data[0].not_done)
                        ? res.data.data[0].not_done
                        : res.data.data[0].not_done.split(',').map(id => parseInt(id.trim(), 10));
                }
                setData({
                    done: done,
                    not_done: not_done,
                });
                if (res.data.data[0].done.trim() !== "" && res.data.data[0].not_done.trim() !== "") {
                    await getStudentData(done + ',' + not_done);
                } else if (res.data.data[0].done.trim() !== "") {
                    await getStudentData(done + "");
                } else if (res.data.data[0].not_done.trim() !== "") {
                    await getStudentData(not_done + '');
                }
            } else {
                Swal.fire({
                    type: 'error',
                    icon: 'error',
                    title: 'Assign HomeWork Status not found',
                });
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };

    useEffect(() => {
        getAssignHomeworkData();
        getHomeworkStatusData()
    }, []);
    //                  POST DATA
    const headleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.put(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/statusHomework/update/${id}`,
                data
            );
            if (res.status === 200) {
                // Successful request
                Swal.fire({
                    icon: "success",
                    title: "Homework Status Updated successful",
                    timer: 1500,
                }).then(() => {
                    navigate("/homeworkstatus");
                });
            } else {
                // Unsuccessful request
                Swal.fire({
                    title: "Homework Status insertion failed",
                    icon: "error",
                });
            }
        } catch (err) {
            console.error(err);
            setLoader(true);
        }
    };
    const handleInputChange = (e, studentId) => {
        const { name, checked } = e.target;
        setData((prevValues) => {
            if (name === "done") {
                if (checked) {
                    return {
                        ...prevValues,
                        done: [...prevValues.done, studentId],
                        not_done: prevValues.not_done.filter((id) => id !== studentId),
                    };
                } else {
                    return {
                        ...prevValues,
                        done: prevValues.done.filter((id) => id !== studentId),
                        not_done: [...prevValues.not_done, studentId],
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
        <div>
            {loader ||
                <div className="page-wrapper">
                    <div className="content">
                        <form onSubmit={headleSubmit}>
                            <div className="row">
                                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                                        <li className="breadcrumb-item"><NavLink to="/homeworkstatus">Homework Status </NavLink>/</li>
                                        <li className="breadcrumb-item active" aria-current="page">Add Homework Status</li>
                                    </ol>
                                </nav>
                                <div className="col-lg-12 col-sm-12">
                                    <div className="content-page-header">
                                        <h5>Homework Status</h5>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Branch</label>
                                                <div>
                                                    <input type="text"
                                                        value={values.branch_name}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group">
                                                <label> Board </label>
                                                <div>
                                                    <input type="text"
                                                        value={values.board_name}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group ">
                                                <label> Medium </label>
                                                <div>
                                                    <input type="text"
                                                        value={values.medium_name}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group ">
                                                <label> Standard </label>
                                                <div>
                                                    <input type="text"
                                                        value={values.standard_name}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group mt-4">
                                                <label> Subject </label>
                                                <div>
                                                    <input type="text"
                                                        value={values.subject_name}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group mt-4">
                                                <label> Batch </label>
                                                <div>
                                                    <input type="text"
                                                        value={values.batch_name}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6">

                                            <div className="form-group mt-4">
                                                <label>Assign HomeWork</label>
                                                <div>
                                                    <input type="text"
                                                        value={values.title}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </div>
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
                                                                    <th>Student Name</th>
                                                                    <th>status</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {student.map((dataa, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{dataa.name}</td>
                                                                        <td>
                                                                            <div className="siderbar-toggle">
                                                                                Done
                                                                                <label className="switch">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name="done"
                                                                                        defaultChecked={data.done.includes(dataa.id)}
                                                                                        onChange={(e) => handleInputChange(e, dataa.id)}
                                                                                    />
                                                                                    <span className="slider round"></span>
                                                                                </label>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <Link
                                                                                className="delete-table me-2"
                                                                                target="_blank"
                                                                                to={`https://wa.me/${dataa.contact_1}?text=Your children are not completing their homework`}
                                                                            >
                                                                                <i class="fa-brands fa-whatsapp" style={{ fontSize: '21px' }}></i>
                                                                            </Link>
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
                                                <Link to={"/homeworkstatus"} className="btn btn-cancel me-3">
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
        </div>
    )
}