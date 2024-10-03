const db = require("../db/connection").db;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
// const upload = multer({ dest: 'uploads/' });

//      Admin
const getAdmin = (req, res) => {
  try {
    const sql = "SELECT * FROM admin ORDER BY id DESC";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in admin  query:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const createAdmin = (req, res) => {
  try {
    const userEmail = req.body.email;
    const checkIfExistsQuery = `SELECT * FROM admin WHERE email = ?`

    db.query(checkIfExistsQuery, [userEmail], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking admin existence:', checkErr);
        return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
      }
      if (checkResult.length > 0) {
        return res.status(400).json({ success: 1, data: null, error: null, msg: 'email already exists' });
      }
      const sql =
        "INSERT INTO admin (`date`, `email`,`password`,`user_type`,`name`, `id_branch`, `contact`, `address_1`, `address_2`, `pincode`, `state`, `city`, `area`) VALUES (?)";
      const values = [
        req.body.date,
        req.body.email,
        req.body.password,
        req.body.user_type,
        req.body.name,
        req.body.id_branch,
        req.body.contact,
        req.body.address_1,
        req.body.address_2,
        req.body.pincode,
        req.body.state,
        req.body.city,
        req.body.area,
      ];
      db.query(sql, [values], (err, result) => {
        if (err) {
          console.error("Error creating Admin ", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Inserted Failed", });
        }
        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Inserted Successfully", }); // 201 for successful creation
      });
    })
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error", });
  }
};
const getAdminById = (req, res) => {
  try {
    const sql = "SELECT * FROM admin WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error querying Admin  by ID:", err);
        return res
          .status(500)
          .json({
            success: 1,
            data: null,
            error: err,
            msg: "Data Get By Id Failed ",
          });
      }
      return res
        .status(200)
        .json({
          success: 0,
          data: result,
          error: null,
          msg: "Data Get By Id Successfully",
        });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({
        success: 1,
        data: null,
        error: error,
        msg: "Internal Server Error",
      });
  }
};
const getTeacher = (req, res) => {
  try {
    const sql = `
      SELECT 
        a.*, 
        st.staff_type AS staff_type_name,
        br.name AS branch_name,
        ct.city AS city_name,
        stt.state AS state_name,
        ar.area AS area_name
      FROM 
        admin a
      LEFT JOIN staff_type st ON a.user_type = st.id
      LEFT JOIN branch br ON a.id_branch = br.id
      LEFT JOIN city ct ON a.city = ct.id
      LEFT JOIN state stt ON a.state = stt.id
      LEFT JOIN area ar ON a.area = ar.id
      WHERE 
        a.user_type = (SELECT id FROM staff_type WHERE staff_type = 'teacher')
        AND
        a.id_branch = ?
    `;
    const sqll = `
    SELECT 
      a.*, 
      st.staff_type AS staff_type_name,
      br.name AS branch_name,
      ct.city AS city_name,
      stt.state AS state_name,
      ar.area AS area_name
    FROM 
      admin a
    LEFT JOIN staff_type st ON a.user_type = st.id
    LEFT JOIN branch br ON a.id_branch = br.id
    LEFT JOIN city ct ON a.city = ct.id
    LEFT JOIN state stt ON a.state = stt.id
    LEFT JOIN area ar ON a.area = ar.id
    WHERE a.user_type = (SELECT id FROM staff_type WHERE staff_type = 'teacher')
    `;
    const queryParams = req.query.id_branch;
    if (queryParams) {
      db.query(sql, queryParams, (err, result) => {
        if (err) {
          console.error("Error querying Admin by ID:", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
        }
        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
      });
    } else {
      db.query(sqll, (err, result) => {
        if (err) {
          console.error("Error querying Admin by ID:", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
        }
        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
      });
    }

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};

const editAdmin = (req, res) => {
  try {
    const sql =
      "UPDATE admin SET `email`=?,`password`=?,`user_type`=?,`name`=?, `id_branch`=?, `contact`=?, `address_1`=?, `address_2`=?, `pincode`=?, `state`=?, `city`=?, `area`=? WHERE  id=?";
    const id = req.params.id;
    db.query(
      sql,
      [
        req.body.email,
        req.body.password,
        req.body.user_type,
        req.body.name,
        req.body.id_branch,
        req.body.contact,
        req.body.address_1,
        req.body.address_2,
        req.body.pincode,
        req.body.state,
        req.body.city,
        req.body.area,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating Admin ", err);
          return res
            .status(500)
            .json({
              success: 1,
              data: null,
              error: err,
              msg: "Data Update Failed",
            });
        }
        return res
          .status(200)
          .json({
            success: 0,
            data: result,
            error: null,
            msg: "Data Update Successfully",
          });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({
        success: 1,
        data: null,
        error: error,
        msg: "Internal Server Error",
      });
  }
};
const deleteAdmin = (req, res) => {
  try {
    const sql = "DELETE FROM admin WHERE id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting admin", err);
        return res
          .status(500)
          .json({
            success: 1,
            data: null,
            error: err,
            msg: "Data Delete Failed ",
          });
      }
      return res
        .status(200)
        .json({
          success: 0,
          data: result,
          error: null,
          msg: "Data Delete Successfully",
        });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({
        success: 1,
        data: null,
        error: error,
        msg: "Internal Server Error",
      });
  }
};


//course
const addCourse = (req, res) => {
  try {
    const sql =
      "INSERT INTO course (`name`,`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_subject`,`duration`,`fees`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    function my_implode_js(separator, array) {
      var temp = "";
      for (var i = 0; i < array.length; i++) {
        temp += array[i];
        if (i != array.length - 1) {
          temp += separator;
        }
      } //end of the for loop

      return temp;
    }

    var id_subject = my_implode_js(",", req.body.id_subject);

    const values = [
      req.body.name,
      req.body.id_branch,
      req.body.id_board,
      req.body.id_medium,
      req.body.id_standard,
      id_subject,
      req.body.duration,
      req.body.fees,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error creating Course", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data inserted Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data inserted Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
  }
};
const getCourse = (req, res) => {
  try {
    const sql = `
    SELECT 
        n.*, 
        GROUP_CONCAT(DISTINCT b.name) AS branch_name,
        bo.board AS board_name, 
        me.medium AS medium_name, 
        st.standard AS standard_name,
        GROUP_CONCAT(DISTINCT s.subject) AS subject_names
    FROM 
        course n 
        LEFT JOIN branch b ON FIND_IN_SET(b.id, n.id_branch)
        LEFT JOIN board bo ON n.id_board = bo.id 
        LEFT JOIN medium me ON n.id_medium = me.id 
        LEFT JOIN standard st ON n.id_standard = st.id 
        LEFT JOIN subject s ON FIND_IN_SET(s.id, n.id_subject)
    GROUP BY
        n.id
    ORDER BY id DESC
`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in course query:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getCourseById = (req, res) => {
  try {
    const sql = `
      SELECT 
        c.*, 
        GROUP_CONCAT(b.name) AS branch_name,
        bo.board AS board_name,
        m.medium AS medium_name,
        s.standard AS standard_name,
        GROUP_CONCAT(sub.subject) AS subject_names
      FROM 
        course c
      LEFT JOIN branch b ON FIND_IN_SET(b.id, c.id_branch)
      LEFT JOIN board bo ON c.id_board = bo.id
      LEFT JOIN medium m ON c.id_medium = m.id
      LEFT JOIN standard s ON c.id_standard = s.id
      LEFT JOIN subject sub ON FIND_IN_SET(sub.id, c.id_subject) 
      WHERE 
        c.id = ?`;

    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error querying course by ID:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }

      // Process the data to convert id_subject and subject_names to arrays
      const processedResult = result.map(course => ({
        ...course,
        id_subject: course.id_subject.split(',').map(Number),
        subject_names: course.subject_names.split(',')
      }));

      return res.status(200).json({ success: 0, data: processedResult, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const editCourse = (req, res) => {
  try {
    const sql =
      "UPDATE course SET `name`=?, `id_branch`=? ,`id_board`=?,`id_medium`=?,`id_standard`=?,`id_subject`=?,`duration`=?,`fees`=? WHERE  id=?";

    function implode(separator, array) {
      if (Array.isArray(array)) {
        return array.join(separator);
      } else {
        return array || "";
      }
    }

    const id_branch = implode(",", req.body.id_branch);
    const id_subject = implode(",", req.body.id_subject);

    const id = req.params.id;
    db.query(
      sql,
      [
        req.body.name,
        id_branch,
        req.body.id_board,
        req.body.id_medium,
        req.body.id_standard,
        id_subject,
        req.body.duration,
        req.body.fees,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating course", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Updated Failed" });
        }
        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Updated Successfully" });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const deleteCourse = (req, res) => {
  try {
    const sql = "DELETE FROM course WHERE id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting course", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};

//    getCoursebyids
const getCoursebyids = (req, res) => {
  try {
    const standard = `
      SELECT 
          n.*, 
          b.name AS branch_name, 
          bo.board AS board_name, 
          me.medium AS medium_name, 
          st.standard AS standard_name,
          GROUP_CONCAT(s.subject) AS subject_names
      FROM 
        course n 
      LEFT JOIN branch b ON n.id_branch = b.id 
      LEFT JOIN board bo ON n.id_board = bo.id 
      LEFT JOIN medium me ON n.id_medium = me.id  
      LEFT JOIN standard st ON n.id_standard = st.id 
      LEFT JOIN subject s ON FIND_IN_SET(s.id, n.id_subject)
      WHERE 
          n.id_branch = ? 
          AND n.id_board = ? 
          AND n.id_medium = ? 
          AND n.id_standard = ? 
      GROUP BY
          n.id
    `;
    const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard];

    db.query(standard, queryParams, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      } else {
        // Concatenate subject_names directly
        result.forEach(course => {
          if (course.subject_names) {
            course.subject_names = course.subject_names.split(', ').join(', '); // Join the array with comma and space
          }
        });

        res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
      }
    });
  } catch (err) {
    res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
  }
};


//material
const getMaterial = (req, res) => {
  try {
    const sql = `
      SELECT 
        m.*, 
        b.name AS branch_name,
        bo.board AS board_name,
        me.medium AS medium_name,
        s.standard AS standard_name,
        sub.subject AS subject_name
      FROM 
        material m
      LEFT JOIN branch b ON m.id_branch = b.id
      LEFT JOIN board bo ON m.id_board = bo.id
      LEFT JOIN medium me ON m.id_medium = me.id
      LEFT JOIN standard s ON m.id_standard = s.id
      LEFT JOIN subject sub ON m.id_subject = sub.id
      ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in material query:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    cb(null, originalName);
  },
});
const fileFilter = (req, file, cb) => {
  // Allow pdf, doc, docx, jpg, png, and jpeg files
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only pdf, doc, docx, jpg, png, and jpeg files are allowed.'
      ),
      false
    );
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const createMaterial = (req, res) => {
  try {
    const requiredFields = ['id_branch', 'id_board', 'id_medium', 'id_standard', 'id_subject', 'name']
    const namerequiredFields = ['Branch', 'Board', 'Medium', 'Standard', 'Subject', 'Name']
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!req.body[field]) {
        const fieldName = namerequiredFields[i];
        return res.status(400).json({ success: 1, data: null, error: null, msg: `${fieldName} is required` })
      }
    }
    if (!req.file) {
      return res.status(400).json({ success: 1, data: null, error: null, msg: `File is required` });
    }

    const sql =
      "INSERT INTO material (`name`,`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_subject`,`files`) VALUES (?)";
    const values = [
      req.body.name,
      req.body.id_branch,
      req.body.id_board,
      req.body.id_medium,
      req.body.id_standard,
      req.body.id_subject,
      req.file.filename,
    ];

    db.query(sql, [values], (dbErr, result) => {
      if (dbErr) {
        console.error("Error creating material", dbErr);
        return res.status(500).json({ success: 1, data: null, error: dbErr, msg: "Data insert Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getMaterialById = (req, res) => {
  try {
    const sql = `
      SELECT  
        m.*, 
        b.name AS branch_name,
        bo.board AS board_name,
        me.medium AS medium_name,
        s.standard AS standard_name,
        sub.subject AS subject_name 
      FROM  
        material m
      LEFT JOIN branch b ON m.id_branch = b.id
      LEFT JOIN board bo ON m.id_board = bo.id
      LEFT JOIN medium me ON m.id_medium = me.id
      LEFT JOIN standard s ON m.id_standard = s.id
      LEFT JOIN subject sub ON m.id_subject = sub.id 
      WHERE 
        m.id = ?`;

    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error querying material by ID:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
// const editMaterialOld = (req, res) => {
//   try {
//     const sql =
//       "UPDATE material SET `name`=?,`id_branch`=?, `id_board`=?, `id_medium`=?, `id_standard`=?, `id_subject`=? WHERE id=?";
//     const id = req.params.id;
//     db.query(
//       sql,
//       [
//         req.body.name,
//         req.body.id_branch,
//         req.body.id_board,
//         req.body.id_medium,
//         req.body.id_standard,
//         req.body.id_subject,
//         id,
//       ],
//       (err, result) => {
//         if (err) {
//           console.error("Error updating Income ", err);
//           return res.status(500).json({ success: 1, data: null, error: err, msg: "Data updated Failed" });
//         }
//         return res.status(200).json({ success: 0, data: result, error: null, msg: "Data updated Successfully" });
//       }
//     );
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
//   }
// };
const editMaterial = (req, res) => {
  try {
    const { id } = req.params;
    const { name, id_subject } = req.body;

    const updateFields = [];
    const materialValues = [];

    const fields = ['name', 'id_subject']

    fields.forEach(field => {
      if (req.body[field]) {
        updateFields.push(`\`${field}\`=?`);
        materialValues.push(req.body[field]);
      }
    })

    const files = req.file ? req.file.filename : null;
    if (req.file) {
      updateFields.push('files=?');
      materialValues.push(files)
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ success: 1, data: null, error: null, msg: "No data provided for update" });
    }

    const materialSql = `UPDATE material SET ${updateFields.join(', ')} WHERE id=?`;
    materialValues.push(id);

    const getPhotoSql = 'SELECT files FROM material WHERE id = ?';


    if (files) {
      db.query(getPhotoSql, [id], (getPhotoErr, getPhotoResult) => {
        if (getPhotoErr) {
          console.error('Error getting current files filename:', getPhotoErr);
          return res.status(500).json({ success: 1, data: null, error: getPhotoErr, msg: "Error getting current photo filename" });
        }
        db.query(materialSql, materialValues, (materialErr, materialResult) => {
          if (materialErr) {
            console.error('Error updating material', materialErr);
            return res.status(500).json({ success: 1, data: null, error: materialErr, msg: "Material data update failed" });
          }

          const oldPhotoFilename = getPhotoResult[0].files;
          if (oldPhotoFilename && fs.existsSync(`./uploads/${oldPhotoFilename}`)) {
            fs.unlinkSync(`./uploads/${oldPhotoFilename}`);
          }
          return res.status(200).json({ success: 0, data: { material: materialResult }, error: null, msg: "Data updated successfully" });
        });
      });
    } else {
      db.query(materialSql, materialValues, (materialErr, materialResult) => {
        if (materialErr) {
          console.error('Error updating material', materialErr);
          return res.status(500).json({ success: 1, data: null, error: materialErr, msg: "Material data update failed" });
        }
        return res.status(200).json({ success: 0, data: { material: materialResult }, error: null, msg: "Data updated successfully" });
      });
    }

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
// const deleteMateriala = (req, res) => {
//   try {
//     const id = req.params.id;
//     db.query(
//       "SELECT files FROM material WHERE id = ?",
//       [id],
//       (selectErr, selectResult) => {
//         if (selectErr) {
//           console.error("Error selecting user:", selectErr);
//           return res.status(500).json({ success: 1, data: null, error: selectErr, msg: "Error inside server" });
//         }

//         const photoFilename = JSON.parse(selectResult[0].files)[0]; // Parse the JSON array

//         db.query(
//           "DELETE FROM material WHERE id = ?",
//           [id],
//           (deleteErr, deleteResult) => {
//             if (deleteErr) {
//               console.error("Error deleting user:", deleteErr);
//               return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data Get Failed" });
//             }

//             if (photoFilename) {
//               const photoPath = `./uploads/${photoFilename}`;
//               fs.unlink(photoPath, (unlinkErr) => {
//                 if (unlinkErr) {
//                   console.error("Error deleting photo image:", unlinkErr);
//                 }

//                 return res
//                   .status(200)
//                   .json({ success: 0, data: deleteResult, error: null, msg: "Data delete Successfully" });
//               });
//             } else {
//               return res
//                 .status(200)
//                 .json({ success: 0, data: deleteResult, error: null, msg: "Data delete Successfully" });
//             }
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return res
//       .status(500)
//       .json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
//   }
// };
const deleteMaterial = (req, res) => {
  try {
    const id = req.params.id;
    db.query('SELECT files FROM material WHERE id = ?', [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error selecting user:', selectErr);
        return res.status(500).json({ success: 1, data: null, error: selectErr, msg: "Data Get Failed" });
      }
      db.query('DELETE FROM material WHERE id = ?', [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Error deleting material:', deleteErr);
          return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data delete Failed" });
        }
        const profileFilename = selectResult[0].files;
        if (profileFilename) {
          const profilePath = `uploads/${profileFilename}`;
          fs.unlink(profilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting files:', unlinkErr);
            }

            return res.status(200).json({ success: 0, data: null, error: null, msg: 'material deleted successfully' });
          });
        } else {
          return res.status(200).json({ success: 0, data: null, error: null, msg: 'material deleted successfully' });
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getMetiraltByBrBoMdStSub = (req, res) => {
  try {
    const sql = `
      SELECT 
        S.*, 
        B.name AS branch_name,
        Bo.board AS board_name,
        M.medium AS medium_name,
        St.standard AS standard_name,
        Sub.subject AS subject_name
      FROM 
        material AS S 
      INNER JOIN branch AS B ON S.id_branch = B.id
      INNER JOIN board AS Bo ON S.id_board = Bo.id
      INNER JOIN medium AS M ON S.id_medium = M.id
      INNER JOIN standard AS St ON S.id_standard = St.id
      INNER JOIN subject AS Sub ON S.id_subject = Sub.id
      WHERE 
        S.id_branch = ? 
        AND S.id_board = ? 
        AND S.id_medium = ? 
        AND S.id_standard = ? 
        AND S.id_subject = ?
    `;
    db.query(sql, [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_subject], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      } else {
        // Parse the files field as JSON
        // const parsedResults = results.map(result => {
        //   return {
        //     ...result,
        //     files: JSON.parse(result.files)
        //   };
        // });
        res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
  }
};


//      income
const getIncome = (req, res) => {
  try {
    const sql = "SELECT * FROM income ORDER BY id DESC";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in Income  query:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const createIncome = (req, res) => {
  try {
    const sql =
      "INSERT INTO income (`income_title`,`id_branch`,`income_type`,`amount`) VALUES (?)";
    const values = [
      req.body.income_title,
      req.body.id_branch,
      req.body.income_type,
      req.body.amount,
    ];
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error creating Income ", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data inserted Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data inserted Successfully" }); // 201 for successful creation
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getIncomeById = (req, res) => {
  try {
    const sql = "SELECT * FROM income WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error querying Income  by ID:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const editIncome = (req, res) => {
  try {
    const sql =
      "UPDATE income SET `income_title`=?,`id_branch`=?,`income_type`=?,`amount`=? WHERE  id=?";
    const id = req.params.id;
    db.query(
      sql,
      [
        req.body.income_title,
        req.body.id_branch,
        req.body.income_type,
        req.body.amount,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating Income ", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data updated Failed" });
        }
        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data updated Successfully" });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const deleteIncome = (req, res) => {
  try {
    const sql = "DELETE FROM income WHERE id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting Income ", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getIncomeByBranch = (req, res) => {
  try {
    const sql = `
      SELECT 
        Income.*, 
        B.name AS branch,
        I.income_type AS income_type_name 
      FROM 
        income AS Income 
      INNER JOIN 
        branch AS B 
      ON 
        Income.id_branch = B.id 
      INNER JOIN 
        income_type AS I 
      ON 
        Income.income_type = I.id 
      WHERE 
        Income.id_branch = ?`;

    db.query(sql, [req.query.id_branch], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      } else {
        res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
  }
};

//      expanse
const getExpanse = (req, res) => {
  try {
    const sql = "SELECT * FROM expense ORDER BY id DESC";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error in Expanse  query:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const createExpanse = (req, res) => {
  try {
    const sql =
      "INSERT INTO expense (`expense_name`,`id_branch`,`expense_type`,`amount`) VALUES (?)";
    const values = [
      req.body.expense_name,
      req.body.id_branch,
      req.body.expense_type,
      req.body.amount,
    ];
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error creating Expanse ", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data inserted Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data inseted Successfully" }); // 201 for successful creation
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getExpanseById = (req, res) => {
  try {
    const sql = "SELECT * FROM expense WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error querying Expanse  by ID:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const editExpanse = (req, res) => {
  try {
    const sql =
      "UPDATE expense SET `expense_name`=?,`id_branch`=?,`expense_type`=?,`amount`=? WHERE  id=?";
    const id = req.params.id;
    db.query(
      sql,
      [
        req.body.expense_name,
        req.body.id_branch,
        req.body.expense_type,
        req.body.amount,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating Expanse ", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data updated Failed" });
        }
        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data updated Successfully" });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const deleteExpanse = (req, res) => {
  try {
    const sql = "DELETE FROM expense WHERE id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting Expanse ", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};
const getExpenseByBranch = (req, res) => {
  try {
    const sql = `
      SELECT 
        Expense.*, 
        B.name AS branch,
        I.expanse_type AS expense_type_name 
      FROM 
        expense AS Expense 
      INNER JOIN 
        branch AS B 
      ON 
        Expense.id_branch = B.id 
      INNER JOIN 
        expanse_type AS I 
      ON 
        Expense.expense_type = I.id 
      WHERE 
        Expense.id_branch = ?
    `;

    db.query(sql, [req.query.id_branch], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
      } else {
        res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
  }
};


//      Login
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Query to check if the user is a student
    const studentQuery = `
    SELECT 
        s.*, 
        st.id AS id_user,
        stt.staff_type AS userType,
        b.name AS branch_name,
        bo.board AS board_name,
        me.medium AS medium_name,
        stn.standard AS standard_name,
        bt.name AS batch_name,
        co.name AS course_name,
        GROUP_CONCAT(DISTINCT su.subject) AS subject_name, 
        co.id_subject,
        sf.shift AS shift_name,
        rt.name AS referencetype_name,
        ste.state AS state_name,
        cy.city AS city_name,
        ar.area AS area_name
    FROM student AS s 
    INNER JOIN admin AS st ON s.email = st.email 
    INNER JOIN staff_type AS stt ON st.user_type = stt.id
    LEFT JOIN branch AS b ON s.id_branch = b.id 
    LEFT JOIN board AS bo ON s.id_board = bo.id 
    LEFT JOIN medium AS me ON s.id_medium = me.id
    LEFT JOIN standard AS stn ON s.id_standard = stn.id
    LEFT JOIN batch AS bt ON s.id_batch = bt.id
    LEFT JOIN course AS co ON s.id_course = co.id
    LEFT JOIN shift AS sf ON s.id_shift = sf.id
    LEFT JOIN reference_type AS rt ON s.id_reference_type = rt.id
    LEFT JOIN state AS ste ON s.id_state = ste.id
    LEFT JOIN city AS cy ON s.id_city = cy.id
    LEFT JOIN area AS ar ON s.id_area = ar.id
    LEFT JOIN subject AS su ON FIND_IN_SET(su.id, co.id_subject) > 0
    WHERE 
        s.email = ? AND st.password = ?
    GROUP BY 
        s.id`;

    db.query(studentQuery, [email, password], (errStudent, studentData) => {
      if (errStudent) {
        console.error("Error during student login ", errStudent);
        return res.status(500).json({ Message: "Internal Server Error" });
      }

      if (studentData.length > 0) {
        // If the email is found in the student table, it's a student
        const student = studentData[0];
        const roll = student.userType;
        const token = jwt.sign({ email }, "our-jsonwebtoken-secret-key", {
          expiresIn: "1d",
        });
        res.cookie("token", token);
        return res.status(200).json({ data: student, Message: "Login successful Student", roll });
      }

      // If the user is not a student, proceed to check other roles
      const adminQuery = `
        SELECT 
          l.*, 
          b.name AS branch_name,
          S.state AS state_name,
          C.city AS city_name,
          A.area AS area_name,
          st.staff_type AS userType
        FROM 
          admin AS l 
        INNER JOIN 
          branch AS b ON l.id_branch = b.id 
        INNER JOIN 
          state AS S ON l.state = S.id 
        INNER JOIN 
          city AS C ON l.city = C.id 
        INNER JOIN 
          area AS A ON l.area = A.id 
        INNER JOIN 
          staff_type AS st ON l.user_type = st.id
        WHERE 
          l.email = ? AND l.password = ?`;

      db.query(adminQuery, [email, password], (errAdmin, adminData) => {
        if (errAdmin) {
          console.error("Error during admin login ", errAdmin);
          return res.status(500).json({ Message: "Internal Server Error" });
        }

        if (adminData.length > 0) {
          // If the email is found in the admin table, it's another role
          const admin = adminData[0];
          const roll = admin.userType; // Now userType will contain the name from staff_type
          const token = jwt.sign({ email }, "our-jsonwebtoken-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          return res.status(200).json({ data: admin, Message: "Login successful", roll });
        }

        // If the email is not found in any table, it's an invalid user
        return res.status(400).json({ Message: "Invalid email or password" });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ Message: "Internal Server Error" });
  }
};

const logoutRoute = (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
};

const timetables = (req, res) => {
  try {
    const {
      standard_id,
      batch_id,
      branch_id,
      id_class,
      id_teacher,
      id_subject,
      time_to,
      time_from,
      day,
    } = req.body;

    // Check if the timetable exists
    db.query(
      "SELECT * FROM timetables WHERE branch_id = ? AND standard_id = ? AND batch_id = ?",
      [branch_id, standard_id, batch_id],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data get failed" });
        }

        if (results.length === 0) {
          // If the timetable doesn't exist, create a new one
          db.query(
            "INSERT INTO timetables (standard_id, batch_id, branch_id) VALUES (?, ?, ?)",
            [standard_id, batch_id, branch_id],
            (err, results) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ success: 1, data: null, error: err, msg: "Data insertion failed" });
              }

              const id_timetable = results.insertId;

              // Now that we have the id_timetable, proceed to insert the timetable entry for the specified day
              insertTimetableEntry(
                res,
                day,
                id_timetable,
                id_class,
                id_teacher,
                id_subject,
                time_to,
                time_from
              );
            }
          );
        } else {
          // If the timetable already exists, proceed to insert the timetable entry for the specified day
          const id_timetable = results[0].id;
          insertTimetableEntry(
            res,
            day,
            id_timetable,
            id_class,
            id_teacher,
            id_subject,
            time_to,
            time_from
          );
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};

function insertTimetableEntry(
  res,
  day,
  id_timetable,
  id_class,
  id_teacher,
  id_subject,
  time_to,
  time_from
) {
  // Validate input data
  if (!id_timetable || !id_class || !id_teacher || !id_subject || !time_to || !time_from) {
    return res.status(400).json({ success: 1, data: null, error: error, msg: "Missing required fields" });
  }

  // Check if any conflicting entry exists for the given day, time, and branch
  db.query(
    `SELECT ${day}.*, classroom.name AS class_name, admin.name AS teacher_name, subject.subject AS subject
     FROM ${day}
     INNER JOIN classroom ON ${day}.id_class = classroom.id
     INNER JOIN admin ON ${day}.id_teacher = admin.id
     INNER JOIN subject ON ${day}.id_subject = subject.id
     WHERE (${day}.id_class = ? OR ${day}.id_teacher = ? OR ${day}.id_subject = ?)
     AND ((? BETWEEN ${day}.time_from AND ${day}.time_to) OR (? BETWEEN ${day}.time_from AND ${day}.time_to))`,
    [id_class, id_teacher, id_subject, time_to, time_from],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data get Failed" });
      }

      if (results.length > 0) {
        const conflictingEntries = results.map(entry => ` Subject: ${entry.subject},Class: ${entry.class_name}, Teacher: ${entry.teacher_name}, Time: ${entry.time_from} - ${entry.time_to}`).join(', ');
        return res.status(400).json({ success: 1, data: null, error: err, msg: `Conflicting timetable entries already exist for ${day}: ${conflictingEntries}` });
      }

      // Insert timetable entry for the specified day
      db.query(
        `INSERT INTO ${day} (id_timetable, id_class, id_teacher, id_subject, time_to, time_from) VALUES (?, ?, ?, ?, ?, ?)`,
        [id_timetable, id_class, id_teacher, id_subject, time_to, time_from],
        (err) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: 1, data: null, error: err, msg: `Error creating ${day} timetable` });
          }

          // Send success response
          res.status(200).json({ success: 0, data: results, error: null, msg: `${day} timetable created successfully` });
        }
      );
    }
  );
}

const getTimetableByDay = (req, res, day) => {
  try {
    let sql = `
      SELECT 
        m.*, 
        t.standard_id, t.batch_id, t.branch_id, 
        c.name AS class,
        s.subject AS subject,
        st.standard AS standard,
        b.name AS batch,
        br.name AS branch,
        a.name AS teacher
      FROM ${day} m
      JOIN timetables t ON m.id_timetable = t.id
      LEFT JOIN classroom c ON m.id_class = c.id
      LEFT JOIN subject s ON m.id_subject = s.id
      LEFT JOIN standard st ON t.standard_id = st.id
      LEFT JOIN batch b ON t.batch_id = b.id
      LEFT JOIN branch br ON t.branch_id = br.id
      LEFT JOIN admin a ON m.id_teacher = a.id
    `;

    const queryParams = [];

    if (req.query.id_branch) {
      sql += ' WHERE t.branch_id = ?';
      queryParams.push(req.query.id_branch);
    }

    if (req.query.id_standard) {
      if (queryParams.length === 0) {
        sql += ' WHERE';
      } else {
        sql += ' AND';
      }
      sql += ' t.standard_id = ?';
      queryParams.push(req.query.id_standard);
    }
    if (req.query.batch_id) {
      if (queryParams.length === 0) {
        sql += ' WHERE';
      } else {
        sql += ' AND';
      }
      sql += ' t.batch_id = ?';
      queryParams.push(req.query.batch_id);
    }

    if (req.query.id_teacher) {
      if (queryParams.length === 0) {
        sql += ' WHERE';
      } else {
        sql += ' AND';
      }
      sql += ' m.id_teacher = ?';
      queryParams.push(req.query.id_teacher);
    }

    db.query(
      sql,
      queryParams,
      (err, result) => {
        if (err) {
          console.error("Error in SQL query:", err);
          return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
        }

        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};


// SELECT m.id AS day_id, m.id_timetable, m.id_class, m.id_subject, m.id_teacher, m.time_to,m.time_from, t.*
// FROM ${day} m
// JOIN timetables t;
const getTimetableMnday = (req, res) => {
  getTimetableByDay(req, res, 'monday');
};

const getTimetableTuesday = (req, res) => {
  getTimetableByDay(req, res, 'tuesday');
};

const getTimetableWednesday = (req, res) => {
  getTimetableByDay(req, res, 'wednesday');
};

const getTimetableThursday = (req, res) => {
  getTimetableByDay(req, res, 'thursday');
};

const getTimetableFriday = (req, res) => {
  getTimetableByDay(req, res, 'friday');
};

const getTimetableSaturday = (req, res) => {
  getTimetableByDay(req, res, 'saturday');
};

const getTimetableSunday = (req, res) => {
  getTimetableByDay(req, res, 'sunday');
};

const deleteTimetableEntry = (req, res, tableName) => {
  try {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Error deleting entry from ${tableName}`, err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
      }
      return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
  }
};

// Now you can use this function for all days of the week

const deleteMonday = (req, res) => {
  deleteTimetableEntry(req, res, "monday");
};

const deleteTuesday = (req, res) => {
  deleteTimetableEntry(req, res, "tuesday");
};

const deleteWednesday = (req, res) => {
  deleteTimetableEntry(req, res, "wednesday");
};

const deleteThursday = (req, res) => {
  deleteTimetableEntry(req, res, "thursday");
};

const deleteFriday = (req, res) => {
  deleteTimetableEntry(req, res, "friday");
};

const deleteSaturday = (req, res) => {
  deleteTimetableEntry(req, res, "saturday");
};

const deleteSunday = (req, res) => {
  deleteTimetableEntry(req, res, "sunday");
};

module.exports = {
  //Admin
  getAdmin,
  createAdmin,
  getAdminById,
  editAdmin,
  deleteAdmin,
  getTeacher,

  //course
  addCourse,
  getCourse,
  getCourseById,
  editCourse,
  deleteCourse,
  getCoursebyids,

  //material
  getMaterial,
  createMaterial,
  getMaterialById,
  editMaterial,
  deleteMaterial,
  getMetiraltByBrBoMdStSub,

  //Income
  getIncome,
  createIncome,
  getIncomeById,
  editIncome,
  deleteIncome,
  getIncomeByBranch,

  //Expanse
  getExpanse,
  createExpanse,
  getExpanseById,
  editExpanse,
  deleteExpanse,
  getExpenseByBranch,

  login,
  logoutRoute,

  timetables,
  getTimetableMnday,
  getTimetableTuesday,
  getTimetableWednesday,
  getTimetableThursday,
  getTimetableFriday,
  getTimetableSaturday,
  getTimetableSunday,
  deleteMonday,
  deleteTuesday,
  deleteWednesday,
  deleteThursday,
  deleteFriday,
  deleteSaturday,
  deleteSunday
};
