import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

function Timetable() {
  const [loader, setLoader] = useState(false)
  const [values, setValues] = useState([
    { day: "monday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
  ]);
  const [tuesday, setTuesday] = useState([
    { day: "tuesday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "" },
  ]);
  const [wednesday, setWednesday] = useState([
    { day: "wednesday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "" },
  ]);
  const [thursday, setThursday] = useState([
    { day: "thursday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "" },
  ]);
  const [friday, setFriday] = useState([
    { day: "friday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "" },
  ]);
  const [saturday, setSaturday] = useState([
    { day: "saturday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "" },
  ]);
  const [sunday, setSunday] = useState([
    { day: "sunday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "" },
  ]);
  const [data, setData] = useState({
    branch_id: "",
    standard_id: "",
    batch_id: "",
  });
  // console.log(values);
  const [branch, setBranch] = useState([]);
  const [board, setBoard] = useState([]);
  const [medium, setMedium] = useState([]);
  const [standard, setStandard] = useState([]);
  const [batch, setBatch] = useState([]);
  const [subject, setSubject] = useState([]);
  const [classroom, setClassroom] = useState([]);
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
  const getBatchData = async (id_branch, id_board, id_medium, id_standard) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/batchbybrbomdst/?id_branch=${id_branch}&id_board=${id_board}&id_medium=${id_medium}&id_standard=${id_standard}`
      );
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
      console.error(err);
      setLoader(true);
    }
  };
  const getClassroomData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/getclassroom`
      );
      if (res.status === 200) {
        setClassroom(res.data.data);
      } else {
        setClassroom([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };
  const [user, setUser] = useState([]);
  const getUserData = async (id_branch) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/teacher/?id_branch=${id_branch}`
      );
      if (res.status === 200) {
        setUser(res.data.data);
      } else {
        setUser([]);
      }
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  const handleSubmitMonday = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of values) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };
  const handleSubmitTuesDay = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of tuesday) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };
  const handleSubmitWednesday = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of wednesday) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };
  const handleSubmitThursday = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of thursday) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };
  const handleSubmitFriday = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of friday) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };
  const handleSubmitSatuarday = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of saturday) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          // Successful request
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };
  const handleSubmitSunday = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the required fields are empty in the data object
      if (!data.branch_id || !data.standard_id || !data.batch_id) {
        Swal.fire({
          title: `Please enter all data `,
          icon: "warning",
        });
        return;
      }

      const isConflict = await checkDataExists();
      if (isConflict) {
        Swal.fire({
          title: "Conflict Found",
          text: "There is a timetable conflict.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      // Iterate over each day's data
      for (const dayData of sunday) {
        // Check if all required fields for the current day are filled
        if (
          !dayData.id_subject ||
          !dayData.id_class ||
          !dayData.id_teacher ||
          !dayData.time_to ||
          !dayData.time_from
        ) {
          Swal.fire({
            title: `Please enter all data for ${dayData.day}`,
            icon: "warning",
          });
          return; // Exit loop if any day's data is incomplete
        }
        const requestBody = {
          ...data,
          ...dayData,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/createTimetable`,
          requestBody
        );
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: `Timetable insertion successful for ${dayData.day}`,
            timer: 1500,
          }).then(() => {
            navigate('/gettimetable');
          });
          // setValues([])
        } else if (res.status === 400) {
          // Data already exists in the database
          Swal.fire({
            icon: "warning",
            title: `Selected data already exists in the database for ${dayData.day}`,
            timer: 1500,
          });
        } else {
          // Other error occurred
          Swal.fire({
            title: `Timetable insertion failed for ${dayData.day}`,
            icon: "error",
          });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message;
        Swal.fire({
          icon: "warning",
          title: errorMessage,
        });
      } else {
        setLoader(true);
      }
    }
  };

  const checkDataExists = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableMonday`;
      const res = await axios.get(url);
      const urltu = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableTuesday`;
      const tus = await axios.get(urltu);
      const urlwen = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableWednesday`;
      const wen = await axios.get(urlwen);
      const urlthur = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableThursday`;
      const thur = await axios.get(urlthur);
      const urlfri = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableFriday`;
      const fri = await axios.get(urlfri);
      const urlsat = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableSaturday`;
      const sat = await axios.get(urlsat);
      const urlsun = `${process.env.REACT_APP_BACKEND_BASE_URL}/getTimetableSunday`;
      const sun = await axios.get(urlsun);

      if (res.status === 200 || tus.status === 200 || wen.status === 200 || thur.status === 200 || fri.status === 200 || sat.status === 200 || sun.status === 200) {
        const existingTimetables = res.data.data;
        const existingTuesday = tus.data.data;
        const existingWednesday = wen.data.data;
        const existingThursday = thur.data.data;
        const existingFriday = fri.data.data;
        const existingSaturday = sat.data.data;
        const existingSunday = sun.data.data;

        for (let i = 0; i < values.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = values[i];
          const sameclass = existingTimetables.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime && time_to <= time_from) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime && time_to <= time_from)
            );
          });
          const sameteacher = existingTimetables.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingTimetables.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time Monday",
              icon: "warning",
            });
            const updatedValues = [...values];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setValues(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time Monday",
              icon: "warning",
            });
            const updatedValues = [...values];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: ""
            };
            setValues(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time Monday",
              icon: "warning",
            });
            const updatedValues = [...values];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: ""
            };
            setValues(updatedValues);
            return true; // Return true to indicate conflict
          }
        }
        for (let i = 0; i < tuesday.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = tuesday[i];

          const sameclass = existingTuesday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const sameteacher = existingTuesday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingTuesday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time tuesdayyy",
              icon: "warning",
            });
            const updatedValues = [...tuesday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setTuesday(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time tuesdayyy",
              icon: "warning",
            });
            const updatedValues = [...tuesday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setTuesday(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time tuesdayyy",
              icon: "warning",
            });
            const updatedValues = [...tuesday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setTuesday(updatedValues);
            return true; // Return true to indicate conflict
          }
        }
        for (let i = 0; i < wednesday.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = wednesday[i];

          const sameclass = existingWednesday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const sameteacher = existingWednesday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingWednesday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time Wednesday",
              icon: "warning",
            });
            const updatedValues = [...wednesday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setWednesday(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time Wednesday",
              icon: "warning",
            });
            const updatedValues = [...wednesday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setWednesday(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time Wednesday",
              icon: "warning",
            });
            const updatedValues = [...wednesday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setWednesday(updatedValues);
            return true; // Return true to indicate conflict
          }
        }
        for (let i = 0; i < thursday.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = thursday[i];

          const sameclass = existingThursday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const sameteacher = existingThursday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingThursday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time Thursday",
              icon: "warning",
            });
            const updatedValues = [...thursday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setThursday(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time Thursday",
              icon: "warning",
            });
            const updatedValues = [...thursday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setThursday(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time Thursday",
              icon: "warning",
            });
            const updatedValues = [...thursday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setThursday(updatedValues);
            return true; // Return true to indicate conflict
          }
        }
        for (let i = 0; i < friday.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = friday[i];

          const sameclass = existingFriday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const sameteacher = existingFriday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingFriday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time Friday",
              icon: "warning",
            });
            const updatedValues = [...friday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setFriday(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time Friday",
              icon: "warning",
            });
            const updatedValues = [...friday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setFriday(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time Friday",
              icon: "warning",
            });
            const updatedValues = [...friday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setFriday(updatedValues);
            return true; // Return true to indicate conflict
          }
        }
        for (let i = 0; i < saturday.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = saturday[i];

          const sameclass = existingSaturday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const sameteacher = existingSaturday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingSaturday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time Saturday",
              icon: "warning",
            });
            const updatedValues = [...saturday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setSaturday(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time Saturday",
              icon: "warning",
            });
            const updatedValues = [...saturday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setSaturday(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time Saturday",
              icon: "warning",
            });
            const updatedValues = [...saturday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setSaturday(updatedValues);
            return true; // Return true to indicate conflict
          }
        }
        for (let i = 0; i < sunday.length; i++) {
          const { id_subject, id_class, id_teacher, time_from, time_to } = sunday[i];

          const sameclass = existingSunday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            return (
              (classroom == id_class && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const sameteacher = existingSunday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const teacher = existing.id_teacher;
            return (
              (teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          const overlap = existingSunday.some(existing => {
            const existingStartTime = existing.time_from;
            const existingEndTime = existing.time_to;
            const classroom = existing.id_class;
            const teacher = existing.id_teacher;
            return (
              (classroom == id_class && teacher == id_teacher && time_from >= existingStartTime && time_from <= existingEndTime) ||
              (classroom == id_class && teacher == id_teacher && time_to >= existingStartTime && time_to <= existingEndTime)
            );
          });
          if (sameclass) {
            Swal.fire({
              title: "Selected class & time Sunday",
              icon: "warning",
            });
            const updatedValues = [...sunday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setSunday(updatedValues);
            return true;
          } else if (sameteacher) {
            Swal.fire({
              title: "Selected teacher & time Sunday",
              icon: "warning",
            });
            const updatedValues = [...sunday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setSunday(updatedValues);
            return true; // Return true to indicate conflict
          } else if (overlap) {
            Swal.fire({
              title: "Selected classroom, teacher & time Sunday",
              icon: "warning",
            });
            const updatedValues = [...sunday];
            updatedValues[i] = {
              ...updatedValues[i],
              time_from: "",
              time_to: "",
            };
            setSunday(updatedValues);
            return true; // Return true to indicate conflict
          }
        }

        return false;

      } else {
        console.error("Error fetching data:", res.statusText);
        return true;
      }
    } catch (error) {
      console.error("Error checking data:", error);
      setLoader(true);
      return true;
    }
  };

  useEffect(() => {
    getBranchData();
    getClassroomData();
    getUserData();
  }, []);


  //             monday
  let handleChange = (i, e) => {
    let newValues = [...values];
    newValues[i][e.target.name] = e.target.value;
    setValues(newValues);
  };
  let addFormFields = () => {
    setValues([
      ...values,
      { day: "monday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFields = (i) => {
    let newValues = [...values];
    newValues.splice(i, 1);
    setValues(newValues);
  };

  //             Tuesday
  let handleChangeTuesday = (i, e) => {
    let newTuesday = [...tuesday];
    newTuesday[i][e.target.name] = e.target.value;
    setTuesday(newTuesday);
  };
  let addFormFieldsTuesday = () => {
    setTuesday([
      ...tuesday,
      { day: "tuesday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFieldsTuesday = (i) => {
    let newTuesday = [...tuesday];
    newTuesday.splice(i, 1);
    setTuesday(newTuesday);
  };


  //          wednesday
  let handleChangeWednesday = (i, e) => {
    let newWednesday = [...wednesday];
    newWednesday[i][e.target.name] = e.target.value;
    setWednesday(newWednesday);
  };
  let addFormFieldsWednesday = () => {
    setWednesday([
      ...wednesday,
      { day: "wednesday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFieldsWednesday = (i) => {
    let newWednesday = [...wednesday];
    newWednesday.splice(i, 1);
    setWednesday(newWednesday);
  };

  //          Thursday
  let handleChangeThursday = (i, e) => {
    let newThursday = [...thursday];
    newThursday[i][e.target.name] = e.target.value;
    setThursday(newThursday);
  };
  let addFormFieldsThursday = () => {
    setThursday([
      ...thursday,
      { day: "thursday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFieldsThursday = (i) => {
    let newThursday = [...thursday];
    newThursday.splice(i, 1);
    setThursday(newThursday);
  };

  //          Friday
  let handleChangeFriday = (i, e) => {
    let newFriday = [...friday];
    newFriday[i][e.target.name] = e.target.value;
    setFriday(newFriday);
  };
  let addFormFieldsFriday = () => {
    setFriday([
      ...friday,
      { day: "friday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFieldsFriday = (i) => {
    let newFriday = [...friday];
    newFriday.splice(i, 1);
    setFriday(newFriday);
  };

  //          Saturday
  let handleChangeSaturday = (i, e) => {
    let newSaturday = [...saturday];
    newSaturday[i][e.target.name] = e.target.value;
    setSaturday(newSaturday);
  };
  let addFormFieldsSaturday = () => {
    setSaturday([
      ...saturday,
      { day: "saturday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFieldsSaturday = (i) => {
    let newSaturday = [...saturday];
    newSaturday.splice(i, 1);
    setSaturday(newSaturday);
  };

  //          Sunday
  let handleChangeSunday = (i, e) => {
    let newSunday = [...sunday];
    newSunday[i][e.target.name] = e.target.value;
    setSunday(newSunday);
  };
  let addFormFieldsSunday = () => {
    setSunday([
      ...sunday,
      { day: "sunday", id_subject: "", id_class: "", id_teacher: "", time_to: "", time_from: "", },
    ]);
  };
  let removeFormFieldsSunday = (i) => {
    let newSunday = [...sunday];
    newSunday.splice(i, 1);
    setSunday(newSunday);
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
        <div className="page-wrapper page-settings">
          <div className="content">
            {/* {/ <!-- [ breadcrumb ] start --> /} */}
            <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': 'none' }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><NavLink to="/">Dashboard </NavLink>/</li>
                <li className="breadcrumb-item"><NavLink to="/area">Time Table </NavLink>/</li>
                <li className="breadcrumb-item active" aria-current="page">Add Time Table</li>
              </ol>
            </nav>
            {/* {/ <!-- [ breadcrumb ] end --> /} */}
            <form
            // onSubmit={handleSubmit}
            >
              <div class="wrapper">
                <h1>
                  <b>Add TimeTable</b>
                </h1>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label>Branch</label>
                      <div>
                        <select
                          name="branch_id "
                          id="branch_id "
                          className="form-select"
                          required
                          placeholder="Branch"
                          onChange={(e) => {
                            const { value } = e.target;
                            setData((prevValues) => ({
                              ...prevValues,
                              branch_id: value,
                              id_board: "",
                              id_medium: "",
                              standard_id: "",
                              batch_id: "",
                              id_subject: "",
                            }));
                            getUserData(value)
                            getBoardData(value);
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
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label> Board </label>
                      <select
                        name="id_board"
                        id="id_board"
                        className="form-select"
                        required
                        onChange={(e) => {
                          const { value } = e.target;
                          setData((prevValues) => ({
                            ...prevValues,
                            id_board: value,
                            id_medium: "",
                            standard_id: "",
                            batch_id: "",
                            id_subject: "",
                          }));
                          getMediumData(data.branch_id, value);
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
                  <div className="col-4">
                    <div className="form-group">
                      <label> Medium </label>
                      <select
                        name="id_medium"
                        id="id_medium"
                        className="form-select"
                        required
                        onChange={(e) => {
                          const { value } = e.target;
                          setData((prevValues) => ({
                            ...prevValues,
                            id_medium: value,
                            standard_id: "",
                            batch_id: "",
                            id_subject: "",
                          }));
                          getStandardData(data.branch_id, data.id_board, value);
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
                  <div className="col-4">
                    <div className="form-group">
                      <label> Standard </label>
                      <select
                        name="standard_id "
                        id="standard_id "
                        className="form-select"
                        required
                        onChange={(e) => {
                          const { value } = e.target;
                          setData((prevValues) => ({
                            ...prevValues,
                            standard_id: value,
                            batch_id: "",
                            id_subject: "",
                          }));
                          getBatchData(
                            data.branch_id,
                            data.id_board,
                            data.id_medium,
                            value
                          );
                          getSubjectData(
                            data.branch_id,
                            data.id_board,
                            data.id_medium,
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
                  <div className="col-4">
                    <div className="form-group">
                      <label> Batch </label>
                      <select
                        name="batch_id "
                        id="batch_id "
                        className="form-select"
                        required
                        onChange={(e) => {
                          const { value } = e.target;
                          setData((prevValues) => ({
                            ...prevValues,
                            batch_id: value,
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
                </div>
                <div className="btn-path">
                  <Link to={"/gettimetable"} className="btn btn-cancel me-3">
                    Back
                  </Link>

                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Monday</b>
                      </label>
                      <div>
                        <div>
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
                      </div>
                      {values.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChange(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setValues((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>

                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setValues((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...values,
                                          id_teacher: value,
                                        };
                                        setValues((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setValues((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFields(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitMonday} className="btn btn-submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Tuesday</b>
                      </label>
                      <div>
                        <div>
                          <div className="list-btn">
                            <ul>
                              <li>
                                <div
                                  className="btn btn-primary"
                                  onClick={() => addFormFieldsTuesday()}
                                >
                                  <i className="fa fa-plus me-1"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {tuesday.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChangeTuesday(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setTuesday((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>

                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setTuesday((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...tuesday,
                                          id_teacher: value,
                                        };
                                        setTuesday((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setTuesday((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFieldsTuesday(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitTuesDay} className="btn btn-submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Wednesday</b>
                      </label>
                      <div>
                        <div>
                          <div className="list-btn">
                            <ul>
                              <li>
                                <div
                                  className="btn btn-primary"
                                  onClick={() => addFormFieldsWednesday()}
                                >
                                  <i className="fa fa-plus me-1"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {wednesday.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChangeWednesday(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setWednesday((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>

                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setWednesday((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...wednesday,
                                          id_teacher: value,
                                        };
                                        setWednesday((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setWednesday((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFieldsWednesday(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitWednesday} className="btn btn-submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Thursday</b>
                      </label>
                      <div>
                        <div>
                          <div className="list-btn">
                            <ul>
                              <li>
                                <div
                                  className="btn btn-primary"
                                  onClick={() => addFormFieldsThursday()}
                                >
                                  <i className="fa fa-plus me-1"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {thursday.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChangeThursday(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setThursday((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setThursday((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...thursday,
                                          id_teacher: value,
                                        };
                                        setThursday((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setThursday((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFieldsThursday(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitThursday} className="btn btn-submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Friday</b>
                      </label>
                      <div>
                        <div>
                          <div className="list-btn">
                            <ul>
                              <li>
                                <div
                                  className="btn btn-primary"
                                  onClick={() => addFormFieldsFriday()}
                                >
                                  <i className="fa fa-plus me-1"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {friday.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChangeFriday(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setFriday((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setFriday((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...friday,
                                          id_teacher: value,
                                        };
                                        setFriday((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setFriday((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFieldsFriday(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitFriday} className="btn btn-submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Saturday</b>
                      </label>
                      <div>
                        <div>
                          <div className="list-btn">
                            <ul>
                              <li>
                                <div
                                  className="btn btn-primary"
                                  onClick={() => addFormFieldsSaturday()}
                                >
                                  <i className="fa fa-plus me-1"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {saturday.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChangeSaturday(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setSaturday((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setSaturday((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...saturday,
                                          id_teacher: value,
                                        };
                                        setSaturday((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setSaturday((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFieldsSaturday(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitSatuarday} className="btn btn-submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <form>
                      <label>
                        <b>Sunday</b>
                      </label>
                      <div>
                        <div>
                          <div className="list-btn">
                            <ul>
                              <li>
                                <div
                                  className="btn btn-primary"
                                  onClick={() => addFormFieldsSunday()}
                                >
                                  <i className="fa fa-plus me-1"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {sunday.map(
                        (element, index) => (
                          <div className="form-inline" key={index}>
                            <div
                              className="row mt-2"
                              onChange={(e) => handleChangeSunday(index, e)}
                            >
                              <div className="col-3">
                                <div className="form-group">
                                  <label> Subject *</label>
                                  <select
                                    name="id_subject"
                                    id="id_subject"
                                    className="form-select"
                                    required
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      setSunday((prevValues) => ({
                                        ...prevValues,
                                        id_subject: value,
                                      }));
                                    }}
                                  >
                                    <option value="-- Select Subject--">
                                      -- Select Subject--
                                    </option>
                                    {subject.length > 0
                                      ? subject.map((data) => (
                                        <option
                                          key={data.id}
                                          data-key={data.id}
                                          value={data.id}
                                        >
                                          {data.subject}
                                        </option>
                                      ))
                                      : null}
                                  </select>
                                </div>
                              </div>
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Class *</label>
                                  <div>
                                    <select
                                      name="id_class"
                                      id="id_class"
                                      className="form-select"
                                      required
                                      placeholder="Select Class"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setSunday((prevValues) => ({
                                          ...prevValues,
                                          id_class: value,
                                        }));
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Class
                                      </option>
                                      {classroom.length > 0 &&
                                        classroom.map((data) => (
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
                              <div className="col-3">
                                <div className="form-group">
                                  <label>Teachers *</label>
                                  <div>
                                    <select
                                      name="id_teacher"
                                      id="id_teacher"
                                      className="form-select"
                                      required
                                      placeholder="Select Teacher"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const updatedDayData = {
                                          ...sunday,
                                          id_teacher: value,
                                        };
                                        setSunday((prevValues) => [
                                          ...prevValues.slice(0, index),
                                          updatedDayData,
                                          ...prevValues.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      <option selected disabled>
                                        Select Teachar
                                      </option>
                                      {user.length > 0 &&
                                        user.map((data) => (
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
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time From *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_from"
                                      name="time_from"
                                      className="inputs time"
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        setSunday((prevValues) => ({
                                          ...prevValues,
                                          time_from: value
                                        }));
                                        checkDataExists(value)
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="form-group">
                                  <label>Time To *</label>
                                  <div>
                                    <input
                                      type="time"
                                      id="time_to"
                                      name="time_to"
                                      className="inputs time"
                                      required
                                      onChange={checkDataExists}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              {index ? (
                                <div className="col-1">
                                  <div className="form-group">
                                    <div className="list-btn">
                                      <ul>
                                        <li>
                                          <div
                                            className="btn btn-danger mt-4 button remove"
                                            onClick={() =>
                                              removeFormFieldsSunday(index)
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
                          </div>
                        )
                      )}
                    </form>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <button type="submit" onClick={handleSubmitSunday} className="btn btn-submit">
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
export default Timetable;
