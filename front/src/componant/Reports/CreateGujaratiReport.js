
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";

export default function CreateGujaratiReport() {
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState([{
        id_student: "",
        recognition_alphabets: "",
        barakshari: "",
        simple_words: "",
        vovels: "",
        half_lettered: "",
        stops_reads: "",
        mouth_sore: "",
        hand_writing: "",
        reading: "",
        id_branch: "",
        id_batch: ""
    }]);
    const navigate = useNavigate();
    const [branch, setBranch] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);
    const [filteredMedium, setFilteredMedium] = useState([]);
    const [filteredStandard, setFilteredStandard] = useState([]);
    const [filteredBatch, setFilteredBatch] = useState([]);
    const [filteredStudent, setFilteredStudent] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [selectedBoardId, setSelectedBoardId] = useState("");
    const [selectedMediumId, setSelectedMediumId] = useState("");
    const [selectedStandardId, setSelectedStandardId] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");

    useEffect(() => {
        if (selectedBranchId) {
            getBoardFilterData(selectedBranchId);
        }
    }, [selectedBranchId]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const branchId = userData?.data.id_branch;


    const [branchSel, setBranchSel] = useState()

    useEffect(() => {
        if (userData) {
            if (userData.roll === "Admin") {
                getBranchData();
                setBranchSel('')
            } else {
                getBranchData(branchId);
                getBoardFilterData(branchId)
                setBranchSel(branchId)
                setSelectedBranchId(branchId)
            }
        }
    }, []);

    const getBranchData = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/branch`
            );
            if (res.status === 200) {
                if (userData.roll === 'Admin') {
                    setBranch(res.data.data);
                } else {
                    const branchData = res.data.data.filter(branch => branch.id === branchId);
                    if (branchData.length > 0) {
                        setBranch(branchData);
                    } else {
                        setBranch([]);
                    }
                }
            } else {
                setBranch([]);
            }
        } catch (error) {
            console.log(error);
            setLoader(true);
        }
    };
    const getBoardFilterData = async (id_branch) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/boardbybr/?id_branch=${id_branch}`
            );
            if (res.status === 200) {
                setFilteredBoards(res.data.data);
            } else {
                setFilteredBoards([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getMediumFilterData = async (id_branch, id_board) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/mediumbybrbo/?id_branch=${id_branch}&id_board=${id_board}`
            );
            if (res.status === 200) {
                setFilteredMedium(res.data.data);
            } else {
                setFilteredMedium([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getStandardFilterData = async (id_branch, id_board, id_medium) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/standardbybrbomd/?branch_id=${id_branch}&id_board=${id_board}&id_medium=${id_medium}`
            );
            if (res.status === 200) {
                setFilteredStandard(res.data.data);
            } else {
                setFilteredStandard([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getBatchFilterData = async (id_branch, id_board, id_medium, id_standard) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/batchbybrbomdst/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}`
            );
            if (res.status === 200) {
                setFilteredBatch(res.data.data);
            } else {
                setFilteredBatch([]);
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
                const students = res.data.data.map(student => ({
                    ...student,
                    id_student: student.id // Assuming 'id' field represents 'id_student'
                }));
                setFilteredStudent(students);
            } else {
                setFilteredStudent([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const handleDropdownChange = async (e) => {
        const { name, value } = e.target;

        if (name === "id_branch") {
            setSelectedBranchId(value);
            getBoardFilterData(value);
        } else if (name === "id_board") {
            setSelectedBoardId(value);
            getMediumFilterData(selectedBranchId, value);
        } else if (name === "id_medium") {
            setSelectedMediumId(value);
            getStandardFilterData(selectedBranchId, selectedBoardId, value);
        } else if (name === "id_standard") {
            setSelectedStandardId(value);
            getBatchFilterData(
                selectedBranchId,
                selectedBoardId,
                selectedMediumId,
                value
            );
        } else if (name === "id_batch") {
            setSelectedBatchId(value);
            // Call getStudentData and pass the selected IDs along with the filtered student ID
            getStudentData(
                selectedBranchId,
                selectedBoardId,
                selectedMediumId,
                selectedStandardId,
                value
            );
        }
    };


    useEffect(() => {
        if (filteredStudent.length > 0) {
            setData(prevData => ([
                ...prevData,
                ...filteredStudent.map(({ id }) => ({
                    id_student: id,
                    id_branch: selectedBranchId,
                    id_batch: selectedBatchId
                }))
            ]));
        } else {
            setData([]);
        }
    }, [filteredStudent]);
    console.log(data);
    const handleInputChange = (e, studentId) => {
        const { name, checked } = e.target;

        setData(prevValues => {
            const newData = prevValues.map(student => {
                if (student.id_student === studentId) {
                    return {
                        ...student,
                        id_student: studentId,
                        recognition_alphabets: name === "present" ? (checked ? "yes" : "no") : student.recognition_alphabets,
                        barakshari: name === "barakshari" ? (checked ? "yes" : "no") : student.barakshari,
                        simple_words: name === 'simple_words' ? (checked ? "yes" : "no") : student.simple_words,
                        vovels: name === 'vovels' ? (checked ? "yes" : "no") : student.vovels,
                        half_lettered: name === 'half_lettered' ? (checked ? "yes" : "no") : student.half_lettered,
                        stops_reads: name === 'stops_reads' ? (checked ? "yes" : "no") : student.stops_reads,
                    };
                }
                return student;
            });
            return newData;
        });
    };

    const handleInputChangedrop = (e, studentId) => {
        const { name, value } = e.target;

        setData(prevValues => {
            const newData = prevValues.map(student => {
                if (student.id_student === studentId) {
                    return {
                        ...student,
                        [name]: value
                    };
                }
                return student;
            });
            return newData;
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const dataWithStudentId = data.map((student, index) => ({
                ...student,
                id_student: filteredStudent[index]?.id_student // Access id_student using index
            }));

            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/creategujaratireport`,
                dataWithStudentId
            );

            if (res.status === 200) {
                console.log(res.data);
                Swal.fire({
                    icon: "success",
                    title: "Gujarati Report insertion successful",
                    timer: 1500,
                }).then(() => {
                    navigate('/gujaratireport');
                });
            } else {
                Swal.fire({
                    title: "Gujarati Report insertion failed",
                    icon: "error",
                });
            }
        } catch (err) {
            console.error(err);
            setLoader(true);
        }
    };

    const [selectedValues, setSelectedValues] = useState([]);
    const handleDropdownChangee = (selectedOptions) => {
        setSelectedValues(selectedOptions.map((option) => option.value));
        const selectedValues = selectedOptions.map((option) => option.value);

        selectedValues.forEach((value) => {
            switch (value) {
                case "મૂળાક્ષર ની ઓળખ":
                    setData(prevData => (
                        prevData.map(student => ({
                            ...student,
                            recognition_alphabets: 'yes'
                        }))
                    ));
                    break;
                case "બારાક્ષરી":
                    setData(prevData => (
                        prevData.map(student => ({
                            ...student,
                            barakshari: 'yes'
                        }))
                    ));
                    break;
                case "સાદા શબ્દો":
                    setData(prevData => (
                        prevData.map(student => ({
                            ...student,
                            simple_words: 'yes'
                        }))
                    ));
                    break;
                case "કાના માત્રા વાળા શબ્દ":
                    setData(prevData => (
                        prevData.map(student => ({
                            ...student,
                            vovels: 'yes'
                        }))
                    ));
                    break;
                case "અર્ધ અક્ષર વાળા શબ્દ":
                    setData(prevData => (
                        prevData.map(student => ({
                            ...student,
                            half_lettered: 'yes'
                        }))
                    ));
                    break;
                case "અટકી અટકી ને વાચે છે":
                    setData(prevData => (
                        prevData.map(student => ({
                            ...student,
                            stops_reads: 'yes'
                        }))
                    ));
                    break;
                default:
                    break;
            }
        });
    };

    const options = [
        { value: "મૂળાક્ષર ની ઓળખ", label: "મૂળાક્ષર ની ઓળખ" },
        { value: "બારાક્ષરી", label: "બારાક્ષરી" },
        { value: "સાદા શબ્દો", label: "સાદા શબ્દો" },
        { value: "કાના માત્રા વાળા શબ્દ", label: "કાના માત્રા વાળા શબ્દ" },
        { value: "અર્ધ અક્ષર વાળા શબ્દ", label: "અર્ધ અક્ષર વાળા શબ્દ" },
        { value: "અટકી અટકી ને વાચે છે", label: "અટકી અટકી ને વાચે છે" },
        { value: "મોઢે લખાણ કેવુ છે", label: "મોઢે લખાણ કેવુ છે" },
        { value: "Hand Writing", label: "Hand Writing" },
        { value: "Reading", label: "Reading" }
    ];
    return (
        <>
            {loader ||
                <div className="page-wrapper page-settings">
                    <div className="content">
                        <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                                <li className="breadcrumb-item"><NavLink to="/gujaratireport">Gujarati Report </NavLink>/</li>
                                <li className="breadcrumb-item active" aria-current="page">Add Gujarati Report</li>
                            </ol>
                        </nav>
                        <div className="content-page-header content-page-headersplit">
                            <h5>Add Gujarati Report</h5>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Branch</label>
                                    <select
                                        name="id_branch"
                                        className="form-select"
                                        value={branchSel ? branchSel : selectedBranchId}
                                        onChange={handleDropdownChange}
                                    >
                                        <option value="">Select All Branch</option>
                                        {branch.map((branchItem) => (
                                            <option key={branchItem.id} value={branchItem.id}>
                                                {branchItem.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Board</label>
                                    <div>
                                        <select
                                            name="id_board"
                                            className="form-select"
                                            onChange={handleDropdownChange}
                                        >
                                            <option value="">Select Board</option>
                                            {filteredBoards.map((boardItem) => (
                                                <option key={boardItem.id} value={boardItem.id}>
                                                    {boardItem.board}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Medium</label>
                                    <div>
                                        <select
                                            name="id_medium"
                                            className="form-select"
                                            onChange={handleDropdownChange}
                                        >
                                            <option value="">Select Medium</option>
                                            {filteredMedium.map((mediumItem) => (
                                                <option key={mediumItem.id} value={mediumItem.id}>
                                                    {mediumItem.medium}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Standard</label>
                                    <div>
                                        <select
                                            name="id_standard"
                                            className="form-select"
                                            onChange={handleDropdownChange}
                                        >
                                            <option value="">Select standard</option>
                                            {filteredStandard.map((standardItem) => (
                                                <option key={standardItem.id} value={standardItem.id}>
                                                    {standardItem.standard}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label>Batch</label>
                                    <div>
                                        <select
                                            name="id_batch"
                                            className="form-select"
                                            onChange={handleDropdownChange}
                                        >
                                            <option value="">Select Batch</option>
                                            {filteredBatch.map((batchItem) => (
                                                <option key={batchItem.id} value={batchItem.id}>
                                                    {batchItem.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 mt-3">
                                <Select
                                    options={options}
                                    onChange={handleDropdownChangee}
                                    isMulti
                                />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table datatable">
                                        <thead>
                                            <tr>
                                                <th>Index</th>
                                                <th>Student Name</th>
                                                {selectedValues.map((value, index) => (
                                                    <th key={index}>{value}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudent.length === 0 ? (
                                                <tr>
                                                    <td colSpan={2 + selectedValues.length}>
                                                        No data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredStudent.map((dataa, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{dataa.name}</td>
                                                        {selectedValues.map((value, columnIndex) => {
                                                            if (value === "મૂળાક્ષર ની ઓળખ") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <div className="siderbar-toggle">
                                                                            Done
                                                                            <label className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="present"
                                                                                    defaultChecked
                                                                                    onChange={(e) =>
                                                                                        handleInputChange(e, dataa.id)
                                                                                    }
                                                                                />
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (value === "બારાક્ષરી") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <div className="siderbar-toggle">
                                                                            Done
                                                                            <label className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="barakshari"
                                                                                    defaultChecked
                                                                                    onChange={(e) =>
                                                                                        handleInputChange(e, dataa.id)
                                                                                    }
                                                                                />
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (value === "સાદા શબ્દો") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <div className="siderbar-toggle">
                                                                            Done
                                                                            <label className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="simple_words"
                                                                                    defaultChecked
                                                                                    onChange={(e) =>
                                                                                        handleInputChange(e, dataa.id)
                                                                                    }
                                                                                />
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (value === "કાના માત્રા વાળા શબ્દ") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <div className="siderbar-toggle">
                                                                            Done
                                                                            <label className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="vovels"
                                                                                    defaultChecked
                                                                                    onChange={(e) =>
                                                                                        handleInputChange(e, dataa.id)
                                                                                    }
                                                                                />
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (value === "અર્ધ અક્ષર વાળા શબ્દ") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <div className="siderbar-toggle">
                                                                            Done
                                                                            <label className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="half_lettered"
                                                                                    defaultChecked
                                                                                    onChange={(e) =>
                                                                                        handleInputChange(e, dataa.id)
                                                                                    }
                                                                                />
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (value === "અટકી અટકી ને વાચે છે") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <div className="siderbar-toggle">
                                                                            Done
                                                                            <label className="switch">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="stops_reads"
                                                                                    defaultChecked
                                                                                    onChange={(e) =>
                                                                                        handleInputChange(e, dataa.id)
                                                                                    }
                                                                                />
                                                                                <span className="slider round"></span>
                                                                            </label>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (value === "મોઢે લખાણ કેવુ છે") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <select
                                                                            className="form-control"
                                                                            name="mouth_sore"
                                                                            onChange={(e) =>
                                                                                handleInputChangedrop(e, dataa.id)
                                                                            }
                                                                        >
                                                                            <option value="" >
                                                                                Select
                                                                            </option>
                                                                            <option value="good">Good</option>
                                                                            <option value="average">Average</option>
                                                                            <option value="poor">Poor</option>
                                                                            <option value="very poor">Very Poor</option>
                                                                        </select>
                                                                    </td>
                                                                );
                                                            } else if (value === "Hand Writing") {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <select
                                                                            className="form-control"
                                                                            name="hand_writing"
                                                                            onChange={(e) =>
                                                                                handleInputChangedrop(e, dataa.id)
                                                                            }
                                                                        >
                                                                            <option value="" >
                                                                                Select
                                                                            </option>
                                                                            <option value="good">Good</option>
                                                                            <option value="average">Average</option>
                                                                            <option value="poor">Poor</option>
                                                                        </select>
                                                                    </td>
                                                                );
                                                            } else {
                                                                return (
                                                                    <td key={columnIndex}>
                                                                        <select
                                                                            className="form-control"
                                                                            name="reading"
                                                                            onChange={(e) => {
                                                                                handleInputChangedrop(e, dataa.id)
                                                                            }}
                                                                        >
                                                                            <option value="" >
                                                                                Select
                                                                            </option>
                                                                            <option value="good">Good</option>
                                                                            <option value="ok">Ok</option>
                                                                            <option value="poor">Poor</option>
                                                                        </select>
                                                                    </td>
                                                                );
                                                            }
                                                        })}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-lg-12">
                                    <div className="btn-path">
                                        <Link to={"/gujaratireport"} className="btn btn-cancel me-3">
                                            Back
                                        </Link>
                                        <button
                                            type="submit"
                                            className="btn btn-submit"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}
