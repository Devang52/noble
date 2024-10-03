import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../src/alert.css";
import Multiselect from "multiselect-react-dropdown";
const EditCourse = () => {
  const [loader, setLoader] = useState(false)
  const [course, setCourse] = useState({
    name: "",
    id_branch: "",
    id_board: "",
    id_medium: "",
    id_standard: "",
    id_subject: [],
    duration: "",
    fees: "",
    subject_names: []
  });
  const [branch, setBranch] = useState([]);
  const [board, setBoard] = useState([]);
  const [medium, setMedium] = useState([]);
  const [standard, setStandard] = useState([]);
  const [subject, setSubject] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const getBranchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/branch`
      );
      if (res.status === 200) {
        setBranch(res.data.data);
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
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/boardbybr/?id_branch=${id_branch}`
      );
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
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/mediumbybrbo/?id_branch=${id_branch}&id_board=${id_board}`
      );
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
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/standardbybrbomd/?branch_id=${id_branch}&id_board=${id_board}&id_medium=${id_medium}`
      );
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

  const getSubjectData = async (id_branch, id_board, id_medium, id_stands) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getSubjectByStanderd/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_stand=${id_stands}`
      );
      if (res.status === 200) {
        setSubject(res.data.data);
      } else {
        setSubject([]);
      }
    } catch (err) {
      console.error(err); // Log the error details
      setLoader(true);
    }
  };
  useEffect(() => {
    getBranchData();
  }, []);
  const getCourseData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getcourse/${id}`
      );
      if (res.status === 200 && res.data.data.length > 0) {
        setCourse({
          name: res.data.data[0].name,
          id_branch: res.data.data[0].id_branch,
          id_board: res.data.data[0].id_board,
          id_medium: res.data.data[0].id_medium,
          id_standard: res.data.data[0].id_standard,
          id_subject: res.data.data[0].id_subject,
          duration: res.data.data[0].duration,
          fees: res.data.data[0].fees,
          subject_names: res.data.data[0].subject_names
        });
        getBoardData(res.data.data[0].id_branch);
        getMediumData(res.data.data[0].id_branch, res.data.data[0].id_board);
        getStandardData(
          res.data.data[0].id_branch,
          res.data.data[0].id_board,
          res.data.data[0].id_medium
        );
        getSubjectData(
          res.data.data[0].id_branch,
          res.data.data[0].id_board,
          res.data.data[0].id_medium,
          res.data.data[0].id_standard
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Course not found",
        });
        navigate("/course");
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_branch") {
      setCourse({
        ...course,
        id_branch: value,
      });
    } else if (name === "id_subject") {
      setCourse({
        ...course,
        [name]: Array.isArray(value) ? value : [value],
      });
    } else if (name === "id_board") {
      setCourse({
        ...course,
        id_board: value,
      });
    } else if (name === "id_medium") {
      setCourse({
        ...course,
        id_medium: value,
      });
    } else if (name === "id_standard") {
      setCourse({
        ...course,
        id_standard: value,
      });
    } else {
      setCourse({
        ...course,
        [name]: value,
      });
    }
  };
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const trimmedCourse = {
        name: course.name.trim(),
      };
      if (
        !trimmedCourse.name ||
        !course.name ||
        !course.id_branch ||
        !course.id_board ||
        !course.id_medium ||
        !course.id_standard ||
        !course.id_subject.length ||
        !course.duration ||
        !course.fees
      ) {
        Swal.fire({
          title: "Please enter Course Data",
          icon: "warning",
        });
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/course/update/${id}`,
          course
        );
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Course updated successfully",
            timer: 1500,
          }).then(() => {
            navigate("/course");
          });
        } else {
          Swal.fire({
            title: "Course updation failed",
            icon: "error",
          });
        }
      }
    } catch (err) {
      console.error(err);
      setLoader(true);
    }
  };


  useEffect(() => {
    getBranchData();
    getMediumData();
    getCourseData();
  }, []);
  const handleRemoveSubject = (removedItem) => {
    console.log(removedItem);
    const index = course.id_subject.findIndex(id => id != removedItem.id);
    if (index == 0) {
      // Create a copy of the id_subject and subject_names arrays
      const updatedIds = [...course.id_subject];
      const updatedNames = [...course.subject_names];

      // Remove the item at the found index
      updatedIds.splice(index, 1);
      updatedNames.splice(index, 1);
      console.log(updatedIds);

      // Update the course state with the modified arrays
      setCourse(prevState => ({
        ...prevState,
        id_subject: updatedIds,
        subject_names: updatedNames,
      }));
    }
  };
  const handleSelectSubject = (selectedList) => {
    // Extracting IDs and names from the selected list
    const selectedIds = selectedList.map((item) => item.id);
    const selectedNames = selectedList.map((item) => item.name);

    // Updating the course state with the selected IDs and names
    setCourse((prevState) => ({
      ...prevState,
      id_subject: selectedIds,
      subject_names: selectedNames,
    }));
  };
  return (
    <>
      {loader ||
        <div className="page-wrapper page-settings">
          <div className="content">
            <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                <li className="breadcrumb-item"><NavLink to="/course">Course </NavLink>/</li>
                <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
              </ol>
            </nav>
            <form onSubmit={handleUpdate}>
              <h1>Edit Course</h1>
              <div className="row">
                <div className="col-6">
                  <div className="add-form">
                    <label> Course Name </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      onChange={handleInputChange}
                      value={course.name}
                      placeholder="Enter Course Name"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Branch </label>
                    <select
                      disabled
                      name="id_branch"
                      id="id_branch"
                      className="form-select"
                      required
                      value={course.id_branch}
                      onChange={(e) => {
                        const { value } = e.target;
                        setCourse((prevValues) => ({
                          ...prevValues,
                          id_branch: value,
                          id_board: "",
                          id_medium: "",
                          id_standard: "",
                          id_subject: "",
                        }));
                        getBoardData(value);
                      }}
                    >
                      <option value="-- Select Branch--">-- Select Branch--</option>
                      {branch.length > 0
                        ? branch.map((data) => (
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

                <div className="col-lg-7">
                  <div className="from-group">
                    <label> Board </label>
                    <select
                      disabled
                      name="id_board"
                      id="id_board"
                      className="form-select"
                      required
                      value={course.id_board}
                      onChange={(e) => {
                        const { value } = e.target;
                        setCourse((prevValues) => ({
                          ...prevValues,
                          id_board: value,
                          id_medium: "",
                          id_standard: "",
                        }));
                        getMediumData(course.id_branch, value);
                      }}
                    >
                      <option value="-- Select Board--">-- Select Board--</option>
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
                  <div className="from-group mt-4">
                    <label> Medium </label>
                    <select
                      disabled
                      name="id_medium"
                      id="id_medium"
                      className="form-select"
                      required
                      value={course.id_medium}
                      onChange={(e) => {
                        const { value } = e.target;
                        setCourse((prevValues) => ({
                          ...prevValues,
                          id_medium: value,
                          id_standard: "", // Clear standard on medium change
                        }));
                        getStandardData(course.id_branch, course.id_board, value);
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

                  <div className="from-group mt-4">
                    <label> Standard </label>
                    <select
                      disabled
                      name="id_standard"
                      id="id_standard"
                      className="form-select"
                      required
                      value={course.id_standard}
                      onChange={(e) => {
                        const { value } = e.target;
                        setCourse((prevValues) => ({
                          ...prevValues,
                          id_standard: value,
                          id_subject: "",
                        }));
                        getSubjectData(
                          course.id_branch,
                          course.id_board,
                          course.id_medium,
                          value
                        );
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
                <div className="col-6">
                  <div className="add-form">
                    <label> Subject </label>
                    <Multiselect
                      displayValue="name" // Assuming you want to display the name property
                      onKeyPressFn={() => { }} // Assuming you want to provide empty functions for these props
                      onRemove={(removedItem) => handleRemoveSubject(removedItem)}
                      onSearch={() => { }}
                      onSelect={(selectedList) => handleSelectSubject(selectedList)}

                      options={subject.map((item) => ({
                        name: item.subject,
                        id: item.id,
                      }))}

                      selectedValues={course.id_subject.map((id, index) => ({
                        name: course.subject_names[index], // Assuming subject_names is an array of strings
                        id: id, // Assuming id_subject is an array of numbers
                      })).filter(item => item.id)}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Duration (in Months) </label>
                    <input
                      type="text"
                      name="duration"
                      placeholder="Duration (in Months)"
                      className="form-control"
                      value={course.duration}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="add-form">
                    <label> Fees (in INR) </label>
                    <input
                      name="fees"
                      type="text"
                      placeholder="Fees (in INR)"
                      className="form-control"
                      value={course.fees}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                  </div>
                </div>
                <div className="btn-path">
                  <Link to={"/course"} className="btn btn-cancel me-3">
                    Back
                  </Link>
                  <button type="submit" className="btn btn-submit ">
                    {" "}
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      }

    </>
  );
};

export default EditCourse;
