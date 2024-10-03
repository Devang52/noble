import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import Swal from "sweetalert2";

export default function EditBoard() {
    const [loader, setLoader] = useState(false)
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        board: '',
        id_branch: ''
    })
    const [branch, setBranch] = useState([]);
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

    //    Branch
    const getBranchData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/branch`);
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    //    read data as per id
    useEffect(() => {
        getBranchData();
        axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/getedit-board/` + id)
            .then(res => {
                console.log(res);
                setValues({ ...values, board: res.data.data[0].board, id_branch: res.data.data[0].id_branch })
            })
            .catch(err => console.log(err))
    }, [])


    //    upadte 
    const headleUpdate = (e) => {
        e.preventDefault();
        try {
            const trimmedBoard = {
                board: values.board.trim(),
            };
            if (!trimmedBoard.board || !values.board || !values.id_branch) {
                Swal.fire({
                    title: 'Please enter all data',
                    icon: 'warning',
                });
            } else {
                axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/edit-board/` + id, values)
                    .then(res => {
                        console.log(res);
                        Swal.fire({
                            icon: "success",
                            title: "Board Updated Successfully",
                            timer: 1500,
                        }).then(() => {
                            navigate('/board');
                        });
                    })
                    .catch(err => console.log(err));
            }
        } catch (err) {
            console.error(err);
            setLoader(true);
        }

    }
    return (
        <div>
            {loader ||
                <div className="page-wrapper">
                    <div className="content">
                        <form onSubmit={headleUpdate} >
                            <div className="row">
                                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                                        <li className="breadcrumb-item"><NavLink to="/board">Board </NavLink>/</li>
                                        <li className="breadcrumb-item active" aria-current="page">Edit Board</li>
                                    </ol>
                                </nav>
                                <div className="col-lg-12 col-sm-12">
                                    <div className="content-page-header">
                                        <h5>Edit Board</h5>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="add-form">
                                                <label> Branch </label>
                                                <select
                                                    disabled
                                                    name="id_branch"
                                                    id="id_branch"
                                                    className="form-select"
                                                    required
                                                    placeholder="Select Branch"
                                                    value={values.id_branch}
                                                    onChange={handleInputChange}
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
                                        <div className="col-6 mt-3">
                                            <div className="form-group">
                                                <label>Board</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    className="form-control"
                                                    placeholder="Enter Board"
                                                    value={values.board}
                                                    onChange={e => setValues({ ...values, board: e.target.value })}
                                                />
                                                <br />
                                                <div className="btn-path">
                                                    <Link to={'/board'} className="btn btn-cancel me-3" >Back</Link>
                                                    <button type="submit" className="btn btn-submit">Submit</button>
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

        </div>
    )
}
