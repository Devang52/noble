import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import Select from 'react-select';
import moment from "moment-timezone";
function CreateStudent() {
    const [loader, setLoader] = useState(false)
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        let day = currentDate.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const [values, setValues] = useState({
        name: '',
        gender: '',
        id_branch: '',
        id_board: '',
        id_medium: '',
        id_standard: '',
        id_batch: '',
        id_course: '',
        school: '',
        id_shift: '',
        id_reference_type: '',
        reference_name: '',
        birth_date: '',
        contact_1: '',
        contact_2: '',
        address: '',
        pincode: '',
        remark: '',
        fathers_name: '',
        fathers_occupation: '',
        fathers_contact: '',
        mothers_name: '',
        mothers_occupation: '',
        mothers_contact: '',
        last_result: '',
        photo: null,
        final_fees: '',
        id_state: "",
        id_city: "",
        id_area: "",
        admission_date: getCurrentDate(),
        password: "",
        email: ""
    })
    const [data, setData] = useState([{
        sibling_name: '',
        sibling_relation: '',
        sibling_board: '',
        sibling_medium: '',
        sibling_standard: '',
        sibling_school: '',
        sibling_tution_name: '',
    }])
    const alldata = {
        ...values,
        sibling: JSON.stringify(data)
    }
    console.log(alldata);
    const [branch, setBranch] = useState([])
    const [board, setBoard] = useState([])
    const [medium, setMedium] = useState([])
    const [standard, setStandard] = useState([])
    const [batch, setBatch] = useState([])
    const [course, setCourse] = useState([])
    const [shift, setShift] = useState([]);
    const [referance, setReferance] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [area, setArea] = useState([]);
    const [inquiry, setInquiry] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const branchId = userData?.data.id_branch;
    // console.log(values);
    // useEffect(() => {
    //     if (userData) {
    //         if (userData.roll === "BranchManager") {
    //             getBranchData(branchId);
    //         } else {
    //             getBranchData();
    //         }
    //     }
    // }, [userData, branchId]);
    const navigate = useNavigate();
    const getInquiryData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/inquiry`);

            if (res.status === 200) {
                setInquiry(res.data.data);
            } else {
                setInquiry([]);
            }
        } catch (error) {
            console.log(error);
            setLoader(true);
        }
    };
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
    const getBoardData = async (id_branch) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/boardbybr/?id_branch=${id_branch}`);
            if (res.status === 200) {
                setBoard(res.data.data);
            } else {
                setBoard([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getMediumData = async (id_branch, id_board) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/mediumbybrbo/?id_branch=${id_branch}&id_board=${id_board}`);
            if (res.status === 200) {
                setMedium(res.data.data);
            } else {
                setMedium([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getStandardData = async (id_branch, id_board, id_medium) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/standardbybrbomd/?branch_id=${id_branch}&id_board=${id_board}&id_medium=${id_medium}`);
            if (res.status === 200) {
                setStandard(res.data.data);
            } else {
                setStandard([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getBatchData = async (id_branch, id_board, id_medium, id_standard) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/batchbybrbomdst/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}`);
            if (res.status === 200) {
                setBatch(res.data.data);
            } else {
                setBatch([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getCourseData = async (id_branch, id_board, id_medium, id_standard) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/getCoursebyids/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}`);
            if (res.status === 200) {
                setCourse(res.data.data);
            } else {
                setCourse([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getShift = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/shift`
            );
            if (res.status === 200) {
                setShift(res.data.data);
            } else {
                setShift([]);
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const getReferanceData = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/referencetype`
            );
            if (res.status === 200) {
                setReferance(res.data.data);
            } else {
                setReferance([]);
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
    const convertDateFormat = (dateString) => {
        const convertedDate = moment(dateString)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");
        return convertedDate;
    };
    const getInquireData = async (id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/inquiry/${id}?is_inquiry=0`);
            if (res.status === 200 && res.data.data.length > 0) {
                console.log(res.data.data);
                const inquiryDate = convertDateFormat(res.data.data[0].inquiry_date);
                setValues({
                    name: res.data.data[0].name,
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
                    address: res.data.data[0].address_line1,
                    pincode: res.data.data[0].pincode,
                    id_state: res.data.data[0].id_state,
                    id_city: res.data.data[0].id_city,
                    id_area: res.data.data[0].id_area,
                    id_reference_type: res.data.data[0].id_reference_type,
                    reference_name: res.data.data[0].refence_name,
                    remark: res.data.data[0].remark,
                    final_fees: res.data.data[0].final_fees,
                    inquiry_date: inquiryDate,
                    email: res.data.data[0].email,
                    fathers_name: " ",
                    fathers_occupation: " ",
                    mothers_name: " ",
                    mothers_occupation: " ",
                    password: " "
                });
                getCityData(res.data.data[0].id_state);
                getAreaData(res.data.data[0].id_city);
                getBoardData(res.data.data[0].id_branch);
                getMediumData(res.data.data[0].id_branch, res.data.data[0].id_board);
                getStandardData(res.data.data[0].id_branch, res.data.data[0].id_board, res.data.data[0].id_medium);
                getCourseData(res.data.data[0].id_branch, res.data.data[0].id_board, res.data.data[0].id_medium, res.data.data[0].id_standard);
                getBatchData(res.data.data[0].id_branch, res.data.data[0].id_board, res.data.data[0].id_medium, res.data.data[0].id_standard);
            } else {
                Swal.fire({
                    type: 'error',
                    icon: 'error',
                    title: 'Inquire not found',
                });
            }
        } catch (err) {
            console.log(err);
            setLoader(true);
        }
    };
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    //              POST DATA
    const headleSubmit = async (e) => {
        e.preventDefault();
        try {
            const contactRegex = /^\d{10}$/;
            const isValidPincode = /^\d{6}$/;
            const emailValid = validateEmail(values.email);

            const trimmedStudent = {
                name: values.name.trim(),
                school: values.school.trim(),
                referance_name: values.reference_name.trim(),
                remark: values.remark.trim(),
                address: values.address.trim(),
                fathers_name: values.fathers_name.trim(),
                fathers_occupation: values.fathers_occupation.trim(),
                mothers_name: values.mothers_name.trim(),
                mothers_occupation: values.mothers_occupation.trim(),
                password: values.password.trim(),
                email: values.email.trim()
            };
            if (!emailValid) {
                Swal.fire({
                    title: "Please enter valid email",
                    icon: "warning",
                });
            } else if (
                !values.id_branch ||
                !values.id_board ||
                !values.id_medium ||
                !values.id_standard ||
                !values.id_batch ||
                !values.id_course ||
                !values.school ||
                !values.id_shift ||
                !values.id_reference_type ||
                values.id_board === "-- Select Board--" ||
                values.id_medium === "-- Select Medium--" ||
                values.id_standard === "-- Select Standard--" ||
                values.id_batch === "-- Select Batch--" ||
                values.id_course === "-- Select Course--" ||
                !values.reference_name ||
                !values.birth_date ||
                !values.contact_1 ||
                !values.contact_2 ||
                !values.address ||
                !values.pincode ||
                !values.remark ||
                !values.fathers_name ||
                !values.fathers_occupation ||
                !values.fathers_contact ||
                !values.mothers_name ||
                !values.mothers_occupation ||
                !values.mothers_contact ||
                !values.final_fees ||
                !values.id_state ||
                !values.id_city ||
                !values.id_area ||
                !values.last_result ||
                !values.photo ||
                !values.admission_date ||
                !values.password ||
                !values.email
            ) {
                Swal.fire({
                    title: 'Please enter all data',
                    icon: 'warning',
                });
            } else if (
                !trimmedStudent.name ||
                !trimmedStudent.school ||
                !trimmedStudent.referance_name ||
                !trimmedStudent.remark ||
                !trimmedStudent.address ||
                !trimmedStudent.fathers_name ||
                !trimmedStudent.fathers_occupation ||
                !trimmedStudent.mothers_name ||
                !trimmedStudent.mothers_occupation ||
                !trimmedStudent.email
            ) {
                Swal.fire({
                    title: 'Please enter valide data',
                    icon: 'warning',
                });
            } else if (
                !contactRegex.test(values.contact_1) ||
                !contactRegex.test(values.contact_2) ||
                !contactRegex.test(values.fathers_contact) ||
                !contactRegex.test(values.mothers_contact)
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

                const formDataObject = new FormData();
                for (const key in alldata) {
                    formDataObject.append(key, alldata[key]);
                }

                const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/createstudent`, formDataObject)
                if (res.status === 200) {
                    // Successful request
                    Swal.fire({
                        icon: 'success',
                        title: 'Student insertion successful',
                        timer: 1500,
                    }).then(() => {
                        navigate('/student');
                    });
                } else {
                    // Unsuccessful request
                    Swal.fire({
                        title: 'Attendance insertion failed',
                        icon: 'error',
                    });
                }
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400) {
                Swal.fire({
                    icon: "warning",
                    title: "This Email is Already Exists",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#06bdff",
                });
            } else {
                // setLoader(true);
            }
        }
    }

    const [feesfin, setFeesfin] = useState({
        final_feess: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "id_reference_type") {
            setValues({
                ...values,
                id_reference_type: value,
            });
        } else if (name === 'id_course') {
            const selectedCourse = course.find((c) => c.id === parseInt(value, 10));
            if (selectedCourse) {
                const finalFees = selectedCourse.fees;
                setValues((prevValues) => ({
                    ...prevValues,
                    id_course: value,
                    final_fees: finalFees,
                }));
                setFeesfin((prevValuesss) => ({
                    ...prevValuesss,
                    final_feess: finalFees,
                }))
            } else {
                console.log('Course not found for the selected value:', value);
            }
        } else if (name === "final_fees") {
            if (value > feesfin.final_feess) {
                Swal.fire({
                    title: "Final Fees",
                    text: "Final Fees cannot be more than course fees",
                    icon: "warning",
                });
            } else {
                setValues({
                    ...values,
                    final_fees: value,
                });
            }
        } else if (name === 'last_result') {
            if (value < 0) {
                Swal.fire({
                    title: "Please enter valide data",
                    icon: "warning",
                });
            } else {
                setValues({ ...values, [name]: value });
            }
        } else {
            setValues({
                ...values,
                [name]: value,
            });
        }
    };
    const [selectedFile, setSelectedFile] = useState(null);
    // console.log(selectedFile);
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = e.target.files[0];
        setSelectedFile(file);
        setValues({
            ...values,
            [name]: files[0], // Use files array for file inputs
        });
    };

    useEffect(() => {
        getBranchData();
        getShift();
        getReferanceData();
        getStateData();
        getInquiryData();
        setValues(prevState => ({
            ...prevState,
            admission_date: getCurrentDate()
        }));

    }, [])
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() - 10;
    const tenYearsAgo = currentYear - 50;
    const minDate = `${tenYearsAgo}-01-01`;
    const maxDate = `${currentYear}-12-31`;
    const handleDateChange = (e) => {
        setValues({ ...values, birth_date: e.target.value });
    };

    //             Sibling
    let handleChange = (i, e) => {
        let newValues = [...data];
        newValues[i][e.target.name] = e.target.value;
        setData(newValues);
    };
    let addFormFields = () => {
        setData([
            ...data,
            { sibling_name: '', sibling_relation: '', sibling_board: '', sibling_medium: '', sibling_standard: '', sibling_school: '', sibling_tution_name: '' },
        ]);
    };
    let removeFormFields = (i) => {
        let newValues = [...data];
        newValues.splice(i, 1);
        setData(newValues);
    };

    const [selectedOption, setSelectedOption] = useState(null);
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
                        <form onSubmit={headleSubmit}>
                            <div className="row">
                                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                                        <li className="breadcrumb-item"><NavLink to="/student">Student </NavLink>/</li>
                                        <li className="breadcrumb-item active" aria-current="page">Add Student</li>
                                    </ol>
                                </nav>
                                <div className="col-lg-12 col-sm-12">
                                    <div className="content-page-header">
                                        <h5>Create Student</h5>
                                    </div>

                                    <div className='row'>
                                        <div className='col-lg-3'>
                                            <label>Inquiry</label>
                                            <Select
                                                id='id_inquiry'
                                                defaultValue={selectedOption}
                                                onChange={(selectedOption) => {
                                                    const value = selectedOption.value;
                                                    setSelectedOption(selectedOption); setValues(prevState => ({
                                                        ...prevState,
                                                        admission_date: ''
                                                    }));
                                                    getInquireData(value);
                                                }}
                                                options={inquiry
                                                    .filter(item => item.is_inquiry === 0) // Filter the inquiry array based on is_inquiry value
                                                    .map((item) => ({ value: item.id, label: item.name }))
                                                }
                                            />

                                        </div>
                                        <div className='col-lg-3'>
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
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Admission Date</label>
                                            <input
                                                type="date"
                                                name="admission_date"
                                                className="form-control"
                                                value={values.admission_date}
                                                onChange={e => setValues({ ...values, admission_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input type="text" className="form-control" placeholder="Name"
                                                    value={values.name}
                                                    onChange={e => setValues({ ...values, name: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-2">
                                            <div className="form-group">
                                                <label>Gender</label>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="male"
                                                        value="male"
                                                        checked={values.gender === 'male'}
                                                        onChange={(e) =>
                                                            setValues({ ...values, gender: e.target.value })
                                                        }
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
                                                        checked={values.gender === 'female'}
                                                        onChange={(e) =>
                                                            setValues({ ...values, gender: e.target.value })
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlFor="female">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="file-input">
                                                <input
                                                    type="file"
                                                    name="photo"
                                                    id="file-input"
                                                    className="file-input__input"
                                                    onChange={handleFileChange} // Handle file selection
                                                />
                                                <label className="file-input__label" htmlFor="file-input">
                                                    <i className="fa-solid fa-upload"></i>
                                                    <span>Upload Profile</span>
                                                </label>
                                            </div>
                                            {selectedFile && (
                                                <div>
                                                    Selected file: {selectedFile.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className='col-lg-6'>
                                            <div className="form-group">
                                                <label>Branch</label>
                                                <div>
                                                    <select
                                                        name="id_branch"
                                                        id="id_branch"
                                                        className="form-select"
                                                        required
                                                        placeholder="Branch"
                                                        value={values.id_branch}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            setValues((prevValues) => ({
                                                                ...prevValues,
                                                                id_branch: value,
                                                                id_board: "",
                                                                id_medium: "",
                                                                id_standard: "",
                                                                id_batch: "",
                                                                id_course: "",
                                                            }));
                                                            getBoardData(value);
                                                        }}
                                                    >
                                                        <option selected >
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
                                        </div>

                                        <div className='col-lg-6'>
                                            <div className='from-group'>
                                                <label> Board </label>
                                                <select
                                                    name="id_board"
                                                    id="id_board"
                                                    className="form-select"
                                                    required
                                                    value={values.id_board}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevValues) => ({
                                                            ...prevValues,
                                                            id_board: value,
                                                            id_medium: "",
                                                            id_standard: "",
                                                            id_batch: "",
                                                            id_course: "",
                                                        }));
                                                        getMediumData(values.id_branch, value);
                                                    }}
                                                >
                                                    <option value="-- Select Board--">
                                                        -- Select Board--
                                                    </option>
                                                    {board.length > 0
                                                        ? board.map((data) => (
                                                            <option
                                                                key={data.id}
                                                                data-key={data.id}
                                                                value={data.id}
                                                            >
                                                                {data.board}
                                                            </option>
                                                        ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>

                                        <div className='col-lg-6'>
                                            <div className='from-group'>
                                                <label> Medium </label>
                                                <select
                                                    name="id_medium"
                                                    id="id_medium"
                                                    className="form-select"
                                                    required
                                                    value={values.id_medium}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevValues) => ({
                                                            ...prevValues,
                                                            id_medium: value,
                                                            id_standard: "", // Clear standard on medium change
                                                            id_batch: "",
                                                            id_course: "",
                                                        }));
                                                        getStandardData(values.id_branch, values.id_board, value);
                                                    }}
                                                >
                                                    <option value="-- Select Medium--">
                                                        -- Select Medium--
                                                    </option>
                                                    {medium.length > 0
                                                        ? medium.map((data) => (
                                                            <option
                                                                key={data.id}
                                                                data-key={data.id}
                                                                value={data.id}
                                                            >
                                                                {data.medium}
                                                            </option>
                                                        ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>

                                        <div className='col-lg-6'>
                                            <div className='from-group'>
                                                <label> Standard </label>
                                                <select
                                                    name="id_standard"
                                                    id="id_standard"
                                                    className="form-select"
                                                    required
                                                    value={values.id_standard}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevValues) => ({
                                                            ...prevValues,
                                                            id_standard: value,
                                                            id_batch: "",
                                                            id_course: "",
                                                        }));
                                                        getBatchData(values.id_branch, values.id_board, values.id_medium, value);
                                                        getCourseData(values.id_branch, values.id_board, values.id_medium, value);
                                                    }}
                                                >
                                                    <option value="-- Select Standard--">
                                                        -- Select Standard--
                                                    </option>
                                                    {standard.length > 0
                                                        ? standard.map((data) => (
                                                            <option
                                                                key={data.id}
                                                                data-key={data.id}
                                                                value={data.id}
                                                            >
                                                                {data.standard}
                                                            </option>
                                                        ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>

                                        <div className='col-lg-6'>
                                            <div className='from-group mt-4'>
                                                <label> Batch </label>
                                                <select
                                                    name="id_batch"
                                                    id="id_batch"
                                                    className="form-select"
                                                    required
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevValues) => ({
                                                            ...prevValues,
                                                            id_batch: value,
                                                        }));
                                                    }}
                                                >
                                                    <option value="-- Select Batch--">
                                                        -- Select Batch--
                                                    </option>
                                                    {batch.length > 0
                                                        ? batch.map((data) => (
                                                            <option
                                                                key={data.id}
                                                                data-key={data.id}
                                                                value={data.id}
                                                            >
                                                                {data.name}
                                                            </option>
                                                        ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mt-4">
                                            <label>Course</label>
                                            <div>
                                                <select
                                                    name="id_course"
                                                    id="id_course"
                                                    className="form-select"
                                                    required
                                                    value={values.id_course}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevValues) => ({
                                                            ...prevValues,
                                                            id_course: value,
                                                        }));
                                                        handleInputChange(e)
                                                    }}
                                                >
                                                    <option value="-- Select Course--">
                                                        -- Select Course--
                                                    </option>
                                                    {course.length > 0
                                                        ? course.map((data) => (
                                                            <option
                                                                key={data.id}
                                                                data-key={data.id}
                                                                value={data.id}
                                                            >
                                                                {data.name}
                                                            </option>
                                                        ))
                                                        : null}
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
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>School</label>
                                                <input type="text" className="form-control" placeholder="School"
                                                    value={values.school}
                                                    onChange={e => setValues({ ...values, school: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <label>Shift</label>
                                            <div>
                                                <select
                                                    className="form-select"
                                                    required
                                                    value={values.id_shift}
                                                    placeholder="Select shift"
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevValues) => ({
                                                            ...prevValues,
                                                            id_shift: value,
                                                        }));
                                                        // handleInputChange(e)
                                                    }}
                                                // onChange={shiftdata}
                                                >
                                                    <option value="-- Select Shift --">
                                                        -- Select Shift --
                                                    </option>
                                                    {shift.map((data) => (
                                                        <option
                                                            key={data.id}
                                                            value={data.id}
                                                            data-key={data.id}
                                                        >
                                                            {data.shift}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 ">
                                            <label>Reference Type</label>
                                            <div>
                                                <select
                                                    name="id_reference_type"
                                                    id="id_reference_type"
                                                    className="form-select"
                                                    required
                                                    value={values.id_reference_type}
                                                    placeholder="Select Reference Type"
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="-- Select Reference Type --">
                                                        -- Select Reference Type --
                                                    </option>
                                                    {referance.length > 0 ? (
                                                        referance.map((data) => (
                                                            <option
                                                                key={data.id}
                                                                value={data.id}
                                                                data-key={data.id}
                                                            >
                                                                {data.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Reference type available</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>Reference Name</label>
                                                <input type="text" className="form-control" placeholder="Reference Name"
                                                    value={values.reference_name}
                                                    onChange={e => setValues({ ...values, reference_name: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>Date of birth</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Date of Birth"
                                                    value={values.birth_date}
                                                    onChange={handleDateChange}
                                                    min={minDate}
                                                    max={maxDate}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Contact 1</label>
                                                <input type="number" className="form-control" placeholder="Contact 1"
                                                    value={values.contact_1}
                                                    onChange={e => setValues({ ...values, contact_1: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Contact 2</label>
                                                <input type="number" className="form-control" placeholder="Contact 2"
                                                    value={values.contact_2}
                                                    onChange={e => setValues({ ...values, contact_2: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className='col-lg-6'>
                                            <div className="form-group">
                                                <label>Pincode</label>
                                                <input type="number" className="form-control" placeholder="Pincode"
                                                    value={values.pincode}
                                                    onChange={(e) => setValues({ ...values, pincode: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Remark</label>
                                                <input type="text" className="form-control" placeholder="Remark"
                                                    value={values.remark}
                                                    onChange={e => setValues({ ...values, remark: e.target.value })} />
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
                                                    value={values.id_state} // Set defaultValue instead of value
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevState) => ({
                                                            ...prevState,
                                                            id_state: value,
                                                            id_city: "",
                                                        }));
                                                        getCityData(value);
                                                    }}
                                                >
                                                    <option value="">
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
                                        <div className="col-lg-6 ">
                                            <label>City</label>
                                            <div>
                                                <select
                                                    name="id_city"
                                                    id="id_city"
                                                    className="form-select"
                                                    required
                                                    value={values.id_city}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevState) => ({
                                                            ...prevState,
                                                            id_city: value,
                                                            id_area: "",
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
                                        <div className="col-lg-6 mt-3">
                                            <label>Area</label>
                                            <div>
                                                <select
                                                    name="id_area"
                                                    id="id_area"
                                                    className="form-select"
                                                    required
                                                    value={values.id_area}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setValues((prevState) => ({
                                                            ...prevState,
                                                            id_area: value,
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

                                        <div className="col-lg-6 mt-3">
                                            <div className="form-group">
                                                <label>Last Result</label>
                                                <input name='last_result' type="number" className="form-control" placeholder="Last Result"
                                                    onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Email"
                                                    value={values.email}
                                                    onChange={(e) => setValues({ ...values, email: e.target.value, })} />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input type="text" className="form-control" placeholder="Please Enter Password"
                                                    onChange={e => setValues({ ...values, password: e.target.value })} />
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
                                                    onChange={(e) => setValues({ ...values, address: e.target.value, })} />
                                            </div>
                                        </div>

                                        <h1 className='mt-5'>Parents Details :</h1>

                                        <div className="col-lg-4 mt-4">
                                            <div className="form-group">
                                                <label>Father's Name</label>
                                                <input type="text" className="form-control" placeholder="Father's Name"
                                                    onChange={e => setValues({ ...values, fathers_name: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-4 mt-4">
                                            <div className="form-group">
                                                <label>Father's Occupation</label>
                                                <input type="text" className="form-control" placeholder="father's Occupation"
                                                    onChange={e => setValues({ ...values, fathers_occupation: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-4 mt-4">
                                            <div className="form-group">
                                                <label>Father's Contact</label>
                                                <input type="number" className="form-control" placeholder="Father's Contact"
                                                    onChange={e => setValues({ ...values, fathers_contact: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-4 mt-4">
                                            <div className="form-group">
                                                <label>Mother's Name</label>
                                                <input type="text" className="form-control" placeholder="Mother's Name"
                                                    onChange={e => setValues({ ...values, mothers_name: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-4 mt-4">
                                            <div className="form-group">
                                                <label>Mother's Occupation</label>
                                                <input type="text" className="form-control" placeholder="Mother's Occupation"
                                                    onChange={e => setValues({ ...values, mothers_occupation: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="col-lg-4 mt-4">
                                            <div className="form-group">
                                                <label>Mother's Contact</label>
                                                <input type="number" className="form-control" placeholder="Mother's Contact"
                                                    onChange={e => setValues({ ...values, mothers_contact: e.target.value })} />
                                            </div>
                                        </div>

                                        <h1 className='mt-5'>Sibling Details :</h1>
                                        <div className="btn-path">
                                            <div className="list-btn">
                                                <ul>
                                                    <li>
                                                        <div
                                                            className="btn btn-primary"
                                                            onClick={() => addFormFields()}
                                                        >
                                                            <i className="fa fa-plus me-1"></i>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {data.map(
                                            (element, i) => (
                                                <div className='row'>
                                                    <div className="col-lg-6 mt-4">
                                                        <div className="form-group">
                                                            <label>Sibling Name <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling Name"
                                                                name='sibling_name' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 mt-4">
                                                        <div className="form-group">
                                                            <label>Sibling Relation <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling Relation"
                                                                name='sibling_relation' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Sibling Board <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling Board"
                                                                name='sibling_board' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Sibling Medium <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling Medium"
                                                                name='sibling_medium' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Sibling Standard <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling Standard"
                                                                name='sibling_standard' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Sibling School <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling School"
                                                                name='sibling_school' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Sibling Tuition Name <q>*</q></label>
                                                            <input type="text" className="form-control" placeholder="Sibling tuition name"
                                                                name='sibling_tution_name' onChange={(e) => handleChange(i, e)} />
                                                        </div>
                                                    </div>
                                                    {i ? (
                                                        <div className="col-1">
                                                            <div className="form-group">
                                                                <div className="list-btn">
                                                                    <ul>
                                                                        <li>
                                                                            <div
                                                                                className="btn btn-danger mt-4 button remove"
                                                                                onClick={() =>
                                                                                    removeFormFields(i)
                                                                                }
                                                                            >
                                                                                <i className="fa fa-remove me-1"></i>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>

                                            )
                                        )}

                                        <div className="col-lg-12">
                                            <div className="btn-path">
                                                <Link to={'/student'} className="btn btn-cancel me-3">Back</Link>
                                                <button type="submit" className="btn btn-submit">Submit</button>
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

export default CreateStudent;