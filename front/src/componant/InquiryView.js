import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment-timezone";

export default function InquiryView() {
    const [loader, setLoader] = useState(false)
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        inquiry_date: "",
        gender: "",
        id_branch: "",
        school: "",
        id_shift: "",
        id_board: "",
        id_medium: "",
        id_standard: "",
        id_course: "",
        contact_1: "",
        contact_2: "",
        address_line1: "",
        address_line2: "",
        pincode: "",
        id_state: "",
        id_city: "",
        id_area: "",
        id_reference_type: "",
        refence_name: "",
        remark: "",
        final_fees: "",
        followup_date: "",
        email: "",
        branch_name: "",
        board_name: "",
        medium_name: "",
        shift_name: "",
        standard_name: "",
        course_name: "",
        referencetype_name: "",
        state_name: "",
        city_name: "",
        area_name: ""
    });
    const convertDateFormat = (dateString) => {
        const convertedDate = moment(dateString)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");
        return convertedDate;
    };
    const getInquireData = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/inquiry/${id}`
            );
            if (res.status === 200 && res.data.data.length > 0) {
                const formattedStartDate = convertDateFormat(
                    res.data.data[0].inquiry_date
                );
                const formattedEndDate = convertDateFormat(
                    res.data.data[0].followup_date
                );

                setValues({
                    name: res.data.data[0].name,
                    inquiry_date: formattedStartDate,
                    gender: res.data.data[0].gender,
                    id_branch: res.data.data[0].id_branch,
                    school: res.data.data[0].school,
                    id_shift: res.data.data[0].id_shift,
                    id_board: res.data.data[0].id_board,
                    id_medium: res.data.data[0].id_medium,
                    id_standard: res.data.data[0].id_standard,
                    id_course: res.data.data[0].id_course,
                    contact_1: res.data.data[0].contact_1,
                    contact_2: res.data.data[0].contact_2,
                    address_line1: res.data.data[0].address_line1,
                    address_line2: res.data.data[0].address_line2,
                    pincode: res.data.data[0].pincode,
                    id_state: res.data.data[0].id_state,
                    id_city: res.data.data[0].id_city,
                    id_area: res.data.data[0].id_area,
                    id_reference_type: res.data.data[0].id_reference_type,
                    refence_name: res.data.data[0].refence_name,
                    remark: res.data.data[0].remark,
                    final_fees: res.data.data[0].final_fees,
                    followup_date: formattedEndDate,
                    email: res.data.data[0].email,
                    branch_name: res.data.data[0].branch_name,
                    board_name: res.data.data[0].board_name,
                    medium_name: res.data.data[0].medium_name,
                    shift_name: res.data.data[0].shift_name,
                    standard_name: res.data.data[0].standard_name,
                    course_name: res.data.data[0].course_name,
                    referencetype_name: res.data.data[0].referencetype_name,
                    state_name: res.data.data[0].state_name,
                    city_name: res.data.data[0].city_name,
                    area_name: res.data.data[0].area_name
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Inquire not found",
                });
                navigate("/inquiry");
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    useEffect(() => {
        getInquireData();
    }, []);
    return (
        <>
            {loader ||
                <div className="page-wrapper">
                    <div className="content">
                        <form>
                            <div className="row">
                                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                                        <li className="breadcrumb-item"><NavLink to="/inquiry">Inquiry </NavLink>/</li>
                                        <li className="breadcrumb-item active" aria-current="page">View Inquiry</li>
                                    </ol>
                                </nav>
                                <div className="col-lg-12 col-sm-12">
                                    <div className="content-page-header">
                                        <h5>View Inquiry</h5>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Inquiry Date</label>
                                            <input
                                                type="date"
                                                name="inquiry_date"
                                                className="form-control"
                                                value={values.inquiry_date}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Student Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Name"
                                                    value={values.name}
                                                    disabled
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
                                                        value="male"
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
                                                        value="female"
                                                        checked={values.gender === "female"} // Check if gender is 'female'
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
                                                <label>Contact 1</label>
                                                <input
                                                    type="number"
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
                                                    className="form-control"
                                                    placeholder="Contact"
                                                    value={values.contact_2}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Address 1</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Address"
                                                    value={values.address_line1}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Address 2</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Address"
                                                    value={values.address_line2}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Email"
                                                    value={values.email}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Pincode</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Pincode"
                                                    value={values.pincode}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Branch</label>
                                                <div>
                                                    <select
                                                        name="id_branch"
                                                        id="id_branch"
                                                        className="form-select"
                                                        required
                                                        placeholder="Branch"
                                                        disabled
                                                    >
                                                        <option selected disabled>
                                                            {values.branch_name}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group">
                                                <label> Board </label>
                                                <select
                                                    name="id_board"
                                                    id="id_board"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option value="-- Select Board--">
                                                        {values.board_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group mb-4">
                                                <label> Medium </label>
                                                <select
                                                    name="id_medium"
                                                    id="id_medium"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option value="-- Select Medium--">
                                                        {values.medium_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="from-group">
                                                <label> Standard </label>
                                                <select
                                                    name="id_standard"
                                                    id="id_standard"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option value="-- Select Standard--">
                                                        {values.standard_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <label>Course</label>
                                            <div>
                                                <select
                                                    name="id_course"
                                                    id="id_course"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option value="-- Select Course--">
                                                        {values.course_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <label>Final Fees</label>
                                            <div>
                                                <input
                                                    type="number"
                                                    name="final_fees"
                                                    className="form-control"
                                                    value={values.final_fees}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>School</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={values.school}
                                                    placeholder="Select School"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <label>Shift</label>
                                            <div>
                                                <input
                                                    className="form-control"
                                                    required
                                                    placeholder="Select shift"
                                                    disabled
                                                    value={values.shift_name}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 ">
                                            <label>State</label>
                                            <div>
                                                <select
                                                    name="id_state"
                                                    id="id_state"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option selected disabled>
                                                        {values.state_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>City</label>
                                            <div>
                                                <select
                                                    name="id_city"
                                                    id="id_city"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option value="-- Select City --">
                                                        {values.city_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <label>Area</label>
                                            <div>
                                                <select
                                                    name="id_area"
                                                    id="id_area"
                                                    className="form-select"
                                                    required
                                                    disabled
                                                >
                                                    <option value="-- Select Area--">
                                                        {values.area_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mt-3">
                                            <label>Reference Type</label>
                                            <div>
                                                <select
                                                    name="id_reference_type "
                                                    id="id_reference_type "
                                                    className="form-select"
                                                    required
                                                    placeholder="Select Reference Type"
                                                    disabled
                                                >
                                                    <option selected disabled>
                                                        {values.referencetype_name}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>Refence Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Refence Name"
                                                    value={values.refence_name}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>Remark</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Remark"
                                                    value={values.remark}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <label>Follow-up Date</label>
                                            <div>
                                                <input
                                                    type="date"
                                                    name="followup_date"
                                                    className="form-control"
                                                    value={values.followup_date}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="btn-path">
                                                <Link to={"/inquiry"} className="btn btn-cancel me-3">
                                                    Back
                                                </Link>
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
    )
}
