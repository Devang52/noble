const db = require("../db/connection").db;
const multer = require('multer');
const path = require('path');
const fs = require('fs');


//      batch

const getBatch = (req, res) => {
    try {
        const sql = `
        SELECT
            b.*,
            br.name AS branch_name,
            bo.board AS board_name,
            me.medium AS medium_name,
            st.standard AS standard_name,
            sf.shift AS shift_name
        FROM
            batch AS b
            INNER JOIN branch AS br ON b.id_branch = br.id
            INNER JOIN board AS bo ON b.id_board = bo.id
            INNER JOIN medium AS me ON b.id_medium = me.id
            INNER JOIN standard AS st ON b.id_standard = st.id
            INNER JOIN shift AS sf ON b.id_shift = sf.id
        ORDER BY b.id DESC
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in batch query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getBatchByBrSt = ((req, res) => {
    try {
        const sql = `
            SELECT B.*, 
                   BR.name AS branch, 
                   BO.board AS board, 
                   M.medium AS medium, 
                   S.standard AS standard, 
                   SH.shift AS shift
            FROM batch B
            INNER JOIN branch BR ON B.id_branch = BR.id
            INNER JOIN board BO ON B.id_board = BO.id
            INNER JOIN medium M ON B.id_medium = M.id
            INNER JOIN standard S ON B.id_standard = S.id
            INNER JOIN shift SH ON B.id_shift = SH.id
            WHERE B.id_branch = ? AND B.id_standard = ?
            ORDER BY id DESC
        `;
        db.query(sql, [req.query.id_branch, req.query.id_standard], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});
const createBatch = (req, res) => {
    try {
        const sql = 'INSERT INTO batch (`name`,`id_branch`,`id_shift`,`id_board`,`id_medium`,`id_standard`) VALUES (?)';
        const values = [
            req.body.name,
            req.body.id_branch,
            req.body.id_shift,
            req.body.id_board,
            req.body.id_medium,
            req.body.id_standard,
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating reference', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getBatchById = (req, res) => {
    try {
        const sql = 'SELECT * FROM batch WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying standard by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editBatch = (req, res) => {
    try {
        const sql =
            "UPDATE batch SET `name`=?,`id_branch`=?,`id_shift`=?,`id_board`=?,`id_medium`=?,`id_standard`=? WHERE  id=?";
        const id = req.params.id;
        db.query(
            sql,
            [
                req.body.name,
                req.body.id_branch,
                req.body.id_shift,
                req.body.id_board,
                req.body.id_medium,
                req.body.id_standard,
                id
            ],
            (err, result) => {
                if (err) {
                    console.error("Error updating batch", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data update Failed" });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: "Data update Successfully" });
            }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteBatch = (req, res) => {
    try {
        const sql = 'DELETE FROM batch WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting batch', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};



//              branch
const getBranch = (req, res) => {
    try {
        const sql = `
        SELECT 
          b.*, 
          c.country AS country_name,
          s.state AS state_name,
          city.city AS city_name,
          area.area AS area_name
        FROM 
          branch b
        LEFT JOIN country c ON b.id_country = c.id
        LEFT JOIN state s ON b.id_state = s.id
        LEFT JOIN city ON b.id_city = city.id
        LEFT JOIN area ON b.id_area = area.id
        ORDER BY id DESC
      `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error in branch query:", err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createBranch = (req, res) => {
    try {
        const branchName = [
            req.body.name,
            req.body.email
        ]
        const values = [
            req.body.name,
            req.body.email,
            req.body.contact,
            req.body.id_country,
            req.body.id_state,
            req.body.id_city,
            req.body.id_area
        ];
        const checkIfExistsQuery = `SELECT * FROM branch WHERE name = ? OR email = ?`

        db.query(checkIfExistsQuery, [req.body.name, req.body.email], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking country existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'branch name already exists' });
            }
            const sql = 'INSERT INTO branch (`name`,`email`,`contact`,`id_country`,`id_state`,`id_city`,`id_area`) VALUES (?)';
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error creating branch', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
            });
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editBranch = (req, res) => {
    try {
        const sql = 'UPDATE branch SET `name`=?, `email`=?, `contact`=?, `id_country`=? ,`id_state`=? , `id_area`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.name, req.body.email, req.body.contact, req.body.id_country, req.body.id_state, req.body.id_area, id], (err, result) => {
            if (err) {
                console.error('Error updating branch', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Updated Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Updated Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getBranchById = (req, res) => {
    try {
        const sql = `SELECT  b.*, 
        c.country AS country_name,
        s.state AS state_name,
        city.city AS city_name,
        area.area AS area_name FROM  branch b
        LEFT JOIN country c ON b.id_country = c.id
        LEFT JOIN state s ON b.id_state = s.id
        LEFT JOIN city ON b.id_city = city.id
        LEFT JOIN area ON b.id_area = area.id WHERE b.id = ?`;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying branch by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteBranch = (req, res) => {
    try {
        const sql = 'DELETE FROM branch WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting branch', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

//                                  Student
const getStudent = (req, res) => {
    try {
        const sql = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                bt.name AS batch_name,
                co.name AS course_name,
                rft.name AS reference_type_name,
                s.state AS state_name,
                c.city AS city_name,
                a.area AS area_name
            FROM 
                student AS n 
                LEFT JOIN branch AS b ON n.id_branch = b.id 
                LEFT JOIN board AS bo ON n.id_board = bo.id 
                LEFT JOIN medium AS me ON n.id_medium = me.id 
                LEFT JOIN shift AS sh ON n.id_shift = sh.id 
                LEFT JOIN standard AS st ON n.id_standard = st.id 
                LEFT JOIN batch AS bt ON n.id_batch = bt.id 
                LEFT JOIN course AS co ON n.id_course = co.id 
                LEFT JOIN reference_type AS rft ON n.id_reference_type = rft.id 
                LEFT JOIN state AS s ON n.id_state = s.id
                LEFT JOIN city AS c ON n.id_city = c.id
                LEFT JOIN area AS a ON n.id_area = a.id
            WHERE n.del_stu <> 1
            GROUP BY
                n.id
                ORDER BY id DESC`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in student query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

//              create student

const createStudent = (req, res) => {
    try {
        const requiredFields = ['name', 'gender', 'id_branch', 'id_board', 'id_medium', 'id_standard', 'id_batch', 'id_course', 'school', 'id_shift', 'id_reference_type', 'reference_name', 'birth_date', 'contact_1', 'contact_2', 'address', 'pincode', 'fathers_name', 'fathers_occupation', 'fathers_contact', 'mothers_name', 'mothers_occupation', 'mothers_contact', 'admission_date', 'last_result', 'final_fees', 'id_state', 'id_city', 'id_area', 'password', 'email'];
        const namerequiredFields = ['Name', 'Gender', 'Branch', 'Board', 'Medium', 'Standard', 'Batch', 'Course', 'School', 'Shift', 'Reference Type', 'Reference Name', 'Dirth Date', 'Contact 1', 'Contact 2', 'Address', 'Pincode', 'Fathers Occupation', 'Fathers Contact', 'Mothers Name', 'Mothers Occupation', 'Mothers Contact', 'Admission Date', 'Last Result', 'Final Fees', 'State', 'City', 'Area', 'Password', 'Email'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!req.body[field]) {
                const fieldName = namerequiredFields[i];
                return res.status(400).json({ success: 1, data: null, error: null, msg: `${fieldName} is required` })
            }
        }
        if (!req.file) {
            return res.status(400).json({ success: 1, data: null, error: null, msg: `Photo is required` });
        }

        const studentName = req.body.email;
        const checkIfExistsQuery = 'SELECT * FROM student WHERE email = ?';

        db.query(checkIfExistsQuery, [studentName], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking student existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'email already exists' });
            }
            // Check if student already filled an inquiry form
            const inquiryCheckSql = 'SELECT * FROM inquiry WHERE email = ?';
            const inquiryCheckValues = [req.body.email];
            db.query(inquiryCheckSql, inquiryCheckValues, (inquiryCheckErr, inquiryCheckResult) => {
                if (inquiryCheckErr) {
                    console.error('Error checking inquiry', inquiryCheckErr);
                    return res.status(500).json({ success: 1, data: null, error: inquiryCheckErr, msg: "Error checking inquiry" });
                }

                // If inquiry exists, update is_inquiry to 1
                if (inquiryCheckResult.length > 0) {
                    const updateInquirySql = 'UPDATE inquiry SET is_inquiry = 1 WHERE email = ?';
                    db.query(updateInquirySql, [req.body.email], (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('Error updating inquiry', updateErr);
                            return res.status(500).json({ success: 1, data: null, error: updateErr, msg: "Error updating inquiry" });
                        }
                    });
                }

                // Proceed with student registration
                const studentSql = 'INSERT INTO student (`name`, `gender`, `id_branch`, `id_board`, `id_medium`, `id_standard`, `id_batch`, `id_course`, `school`, `id_shift`, `id_reference_type`, `reference_name`, `birth_date`, `contact_1`, `contact_2`, `address`, `pincode`, `remark`, `fathers_name`, `fathers_occupation`, `fathers_contact`, `mothers_name`, `mothers_occupation`, `mothers_contact`, `last_result`, `photo`, `final_fees`, `id_state`, `id_city`, `id_area`, `admission_date`, `password`, `email`) VALUES (?)';
                const studentValues = [
                    req.body.name,
                    req.body.gender,
                    req.body.id_branch,
                    req.body.id_board,
                    req.body.id_medium,
                    req.body.id_standard,
                    req.body.id_batch,
                    req.body.id_course,
                    req.body.school,
                    req.body.id_shift,
                    req.body.id_reference_type,
                    req.body.reference_name,
                    req.body.birth_date,
                    req.body.contact_1,
                    req.body.contact_2,
                    req.body.address,
                    req.body.pincode,
                    req.body.remark,
                    req.body.fathers_name,
                    req.body.fathers_occupation,
                    req.body.fathers_contact,
                    req.body.mothers_name,
                    req.body.mothers_occupation,
                    req.body.mothers_contact,
                    req.body.last_result,
                    req.file.filename,
                    req.body.final_fees,
                    req.body.id_state,
                    req.body.id_city,
                    req.body.id_area,
                    req.body.admission_date,
                    req.body.password,
                    req.body.email
                ];

                db.query(studentSql, [studentValues], (studentErr, studentResult) => {
                    if (studentErr) {
                        console.error('Error creating student', studentErr);
                        return res.status(500).json({ success: 1, data: null, error: studentErr, msg: "Student data insertion failed" });
                    }

                    // Proceed with creating admin record
                    const user = 3;
                    const address_1 = req.body.address;
                    const adminSql = "INSERT INTO admin (`date`, `email`, `password`, `user_type`, `name`, `id_branch`, `contact`, `address_1`, `pincode`, `state`, `city`, `area`, `id_student`) VALUES (?)";
                    const adminValues = [
                        req.body.admission_date,
                        req.body.email,
                        req.body.password,
                        user,
                        req.body.name,
                        req.body.id_branch,
                        req.body.contact_1,
                        address_1,
                        req.body.pincode,
                        req.body.id_state,
                        req.body.id_city,
                        req.body.id_area,
                        studentResult.insertId
                    ];

                    db.query(adminSql, [adminValues], (adminErr, adminResult) => {
                        if (adminErr) {
                            console.error("Error creating Admin ", adminErr);
                            return res.status(500).json({ success: 1, data: null, error: adminErr, msg: "Admin data insertion failed" });
                        }

                        const id_student = studentResult.insertId;
                        let { sibling } = req.body;

                        // Parse sibling back to JSON if it's a string
                        if (typeof sibling === 'string') {
                            sibling = JSON.parse(sibling);
                        }

                        if (Array.isArray(sibling) && sibling.length > 0) {
                            const siblingValues = sibling.flatMap(siblingObj => [
                                id_student,
                                siblingObj.sibling_name,
                                siblingObj.sibling_relation,
                                siblingObj.sibling_board,
                                siblingObj.sibling_medium,
                                siblingObj.sibling_standard,
                                siblingObj.sibling_school,
                                siblingObj.sibling_tution_name
                            ]);

                            const placeholders = sibling.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
                            const siblingSql = `INSERT INTO sibling (id_student, sibling_name, sibling_relation, sibling_board, sibling_medium, sibling_standard, sibling_school, sibling_tution_name) VALUES ${placeholders}`;

                            db.query(siblingSql, siblingValues, (siblingErr) => {
                                if (siblingErr) {
                                    console.error('Error creating sibling', siblingErr);
                                    return res.status(500).json({ success: 1, data: null, error: siblingErr, msg: 'Sibling data insertion failed' });
                                }

                                return res.status(200).json({ success: 0, data: { student: studentResult, admin: adminResult }, error: null, msg: 'Data inserted successfully' });
                            });
                        } else {
                            return res.status(200).json({ success: 0, data: { student: studentResult, admin: adminResult }, error: null, msg: 'Data inserted successfully' });
                        }

                    });
                });
            });
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

const editStudentOldstaticupdate = (req, res) => {
    try {
        const { id } = req.params; // Extract student ID from request parameters
        const {
            name,
            gender,
            id_branch,
            id_board,
            id_medium,
            id_standard,
            id_batch,
            id_course,
            school,
            id_shift,
            id_reference_type,
            reference_name,
            birth_date,
            contact_1,
            contact_2,
            address,
            pincode,
            remark,
            fathers_name,
            fathers_occupation,
            fathers_contact,
            mothers_name,
            mothers_occupation,
            mothers_contact,
            sibling_name,
            sibling_relation,
            sibling_board,
            sibling_medium,
            sibling_standard,
            sibling_school,
            sibling_tution_name,
            last_result,
            final_fees,
            id_state,
            id_city,
            id_area,
            admission_date,
            email,
            password,
        } = req.body; // Extract updated student data from request body

        // Check if photo is being updated
        const photo = req.file ? req.file.filename : null;

        const studentSql = 'UPDATE student SET `name`=?, `gender`=?, `id_branch`=?, `id_board`=?, `id_medium`=?, `id_standard`=?, `id_batch`=?, `id_course`=?, `school`=?, `id_shift`=?, `id_reference_type`=?, `reference_name`=?, `birth_date`=?, `contact_1`=?, `contact_2`=?, `address`=?, `pincode`=?, `remark`=?, `fathers_name`=?, `fathers_occupation`=?, `fathers_contact`=?, `mothers_name`=?, `mothers_occupation`=?, `mothers_contact`=?, `sibling_name`=?, `sibling_relation`=?, `sibling_board`=?, `sibling_medium`=?, `sibling_standard`=?, `sibling_school`=?, `sibling_tution_name`=?, `last_result`=?, `final_fees`=?, `id_state`=?, `id_city`=?, `id_area`=?, `admission_date`=?, `email`=?, `password`=?, photo = ? WHERE  id=?';

        // Get the current photo filename
        const getPhotoSql = 'SELECT photo FROM student WHERE id = ?';
        db.query(getPhotoSql, [id], (getPhotoErr, getPhotoResult) => {
            if (getPhotoErr) {
                console.error('Error getting current photo filename:', getPhotoErr);
                return res.status(500).json({ success: 1, data: null, error: getPhotoErr, msg: "Error getting current photo filename" });
            }

            const studentValues = [
                name,
                gender,
                id_branch,
                id_board,
                id_medium,
                id_standard,
                id_batch,
                id_course,
                school,
                id_shift,
                id_reference_type,
                reference_name,
                birth_date,
                contact_1,
                contact_2,
                address,
                pincode,
                remark,
                fathers_name,
                fathers_occupation,
                fathers_contact,
                mothers_name,
                mothers_occupation,
                mothers_contact,
                sibling_name,
                sibling_relation,
                sibling_board,
                sibling_medium,
                sibling_standard,
                sibling_school,
                sibling_tution_name,
                last_result,
                final_fees,
                id_state,
                id_city,
                id_area,
                admission_date,
                email,
                password,
                photo,
                id
            ];

            db.query(studentSql, studentValues, (studentErr, studentResult) => {
                if (studentErr) {
                    console.error('Error updating student', studentErr);
                    return res.status(500).json({ success: 1, data: null, error: studentErr, msg: "Student data update failed" });
                }

                const oldPhotoFilename = getPhotoResult[0].photo;
                if (oldPhotoFilename && fs.existsSync(`./uploads/${oldPhotoFilename}`)) {
                    fs.unlinkSync(`./uploads/${oldPhotoFilename}`);
                }

                return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editStudent = (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, gender, school, id_shift, id_reference_type, reference_name, birth_date, contact_1, contact_2, address, pincode, remark,
            fathers_name, fathers_occupation, fathers_contact, mothers_name, mothers_occupation, mothers_contact,
            sibling_name, sibling_relation, sibling_board, sibling_medium, sibling_standard, sibling_school,
            sibling_tution_name, last_result, final_fees, password, sibling
        } = req.body;

        const updateFields = [];
        const studentValues = [];
        const adminValues = [];

        const fields = [
            'name', 'gender', 'school', 'id_shift', 'id_reference_type', 'reference_name', 'birth_date', 'contact_1', 'contact_2',
            'address', 'pincode', 'remark', 'fathers_name', 'fathers_occupation', 'fathers_contact',
            'mothers_name', 'mothers_occupation', 'mothers_contact', 'sibling_name', 'sibling_relation',
            'sibling_board', 'sibling_medium', 'sibling_standard', 'sibling_school', 'sibling_tution_name',
            'last_result', 'final_fees', 'password',
        ];

        fields.forEach(field => {
            if (req.body[field]) {
                updateFields.push(`\`${field}\`=?`);
                studentValues.push(req.body[field]);
            }
        });

        const photo = req.file ? req.file.filename : null;
        if (req.file) {
            updateFields.push('photo=?');
            studentValues.push(photo);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ success: 1, data: null, error: null, msg: "No data provided for update" });
        }

        const studentSql = `UPDATE student SET ${updateFields.join(', ')} WHERE id=?`;
        studentValues.push(id);

        const getPhotoSql = 'SELECT photo FROM student WHERE id = ?';


        if (
            updateFields.includes('`name`=?') ||
            updateFields.includes('`password`=?')
        ) {
            const adminUpdates = [
                { field: 'name', value: name },
                { field: 'password', value: password },
            ];

            const adminUpdatesFiltered = adminUpdates.filter(update => updateFields.includes(`\`${update.field}\`=?`));
            const adminSqlUpdates = adminUpdatesFiltered.map(update => `${update.field}=?`);
            const adminSql = `UPDATE admin SET ${adminSqlUpdates.join(', ')} WHERE id_student=?`;
            const adminValues = adminUpdatesFiltered.map(update => update.value);
            adminValues.push(id);

            db.query(adminSql, adminValues, (adminErr, adminResult) => {
                if (adminErr) {
                    console.error('Error updating admin', adminErr);
                    return res.status(500).json({ success: 1, data: null, error: adminErr, msg: "Admin data update failed" });
                }
            });
        }



        if (photo) {
            db.query(getPhotoSql, [id], (getPhotoErr, getPhotoResult) => {
                if (getPhotoErr) {
                    console.error('Error getting current photo filename:', getPhotoErr);
                    return res.status(500).json({ success: 1, data: null, error: getPhotoErr, msg: "Error getting current photo filename" });
                }

                db.query(studentSql, studentValues, (studentErr, studentResult) => {
                    if (studentErr) {
                        console.error('Error updating student', studentErr);
                        return res.status(500).json({ success: 1, data: null, error: studentErr, msg: "Student data update failed" });
                    }

                    const oldPhotoFilename = getPhotoResult[0].photo;
                    if (oldPhotoFilename && fs.existsSync(`./uploads/${oldPhotoFilename}`)) {
                        fs.unlinkSync(`./uploads/${oldPhotoFilename}`);
                    }

                    if (sibling) {
                        const deleteSiblingSql = 'DELETE FROM sibling WHERE id_student = ?';

                        db.query(deleteSiblingSql, [id], (deleteErr, deleteResult) => {
                            if (deleteErr) {
                                console.error('Error deleting existing sibling', deleteErr);
                                return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data edit Failed (sibling)" });
                            }
                        });

                        //      Sibling
                        const id_student = req.params.id
                        let { sibling } = req.body;
                        console.log(sibling);
                        if (typeof sibling === 'string') {
                            sibling = JSON.parse(sibling);
                        }

                        if (Array.isArray(sibling) && sibling.length > 0) {
                            const siblingValues = sibling.flatMap(siblingObj => [
                                id_student,
                                siblingObj.sibling_name,
                                siblingObj.sibling_relation,
                                siblingObj.sibling_board,
                                siblingObj.sibling_medium,
                                siblingObj.sibling_standard,
                                siblingObj.sibling_school,
                                siblingObj.sibling_tution_name
                            ]);

                            const placeholders = sibling.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
                            const siblingSql = `INSERT INTO sibling (id_student, sibling_name, sibling_relation, sibling_board, sibling_medium, sibling_standard, sibling_school, sibling_tution_name) VALUES ${placeholders}`;

                            db.query(siblingSql, siblingValues, (siblingErr) => {
                                if (siblingErr) {
                                    console.error('Error creating sibling', siblingErr);
                                    return res.status(500).json({ success: 1, data: null, error: siblingErr, msg: 'Sibling data insertion failed' });
                                }

                                return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
                            });
                        } else {
                            return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
                        }
                    } else {
                        const deleteSiblingSql = 'DELETE FROM sibling WHERE id_student = ?';

                        db.query(deleteSiblingSql, [id], (deleteErr, deleteResult) => {
                            if (deleteErr) {
                                console.error('Error deleting existing sibling', deleteErr);
                                return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data edit Failed (sibling)" });
                            }
                            return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
                        });
                    }
                    // return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
                });
            });
        } else {
            db.query(studentSql, studentValues, (studentErr, studentResult) => {
                if (studentErr) {
                    console.error('Error updating student', studentErr);
                    return res.status(500).json({ success: 1, data: null, error: studentErr, msg: "Student data update failed" });
                }

                if (sibling) {
                    const deleteSiblingSql = 'DELETE FROM sibling WHERE id_student = ?';

                    db.query(deleteSiblingSql, [id], (deleteErr, deleteResult) => {
                        if (deleteErr) {
                            console.error('Error deleting existing sibling', deleteErr);
                            return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data edit Failed (sibling)" });
                        }
                    });

                    //      Sibling
                    const id_student = req.params.id
                    let { sibling } = req.body;
                    console.log(sibling);
                    if (typeof sibling === 'string') {
                        sibling = JSON.parse(sibling);
                    }

                    if (Array.isArray(sibling) && sibling.length > 0) {
                        const siblingValues = sibling.flatMap(siblingObj => [
                            id_student,
                            siblingObj.sibling_name,
                            siblingObj.sibling_relation,
                            siblingObj.sibling_board,
                            siblingObj.sibling_medium,
                            siblingObj.sibling_standard,
                            siblingObj.sibling_school,
                            siblingObj.sibling_tution_name
                        ]);

                        const placeholders = sibling.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
                        const siblingSql = `INSERT INTO sibling (id_student, sibling_name, sibling_relation, sibling_board, sibling_medium, sibling_standard, sibling_school, sibling_tution_name) VALUES ${placeholders}`;

                        db.query(siblingSql, siblingValues, (siblingErr) => {
                            if (siblingErr) {
                                console.error('Error creating sibling', siblingErr);
                                return res.status(500).json({ success: 1, data: null, error: siblingErr, msg: 'Sibling data insertion failed' });
                            }

                            return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
                        });
                    } else {
                        return res.status(200).json({ success: 0, data: { student: studentResult }, error: null, msg: "Data updated successfully" });
                    }
                } else {
                    const deleteSiblingSql = 'DELETE FROM sibling WHERE id_student = ?';

                    db.query(deleteSiblingSql, [id], (deleteErr, deleteResult) => {
                        if (deleteErr) {
                            console.error('Error deleting existing sibling', deleteErr);
                            return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data edit Failed (sibling)" });
                        }
                        return res.status(200).json({ success: 0, data: studentResult, error: null, msg: "Data Edited Successfully" });
                    });
                }
            });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditStudent = (req, res) => {
    try {
        const sql = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                bt.name AS batch_name, 
                co.name AS course_name, 
                rft.name AS reference_type_name,
                s.state AS state_name,
                c.city AS city_name,
                a.area AS area_name,
                GROUP_CONCAT(DISTINCT CONCAT(si.id_student, ':', si.sibling_name, ':', si.sibling_relation, ':', si.sibling_board, ':', si.sibling_medium, ':', si.sibling_standard, ':', si.sibling_school, ':', si.sibling_tution_name) SEPARATOR ';') AS sibling
            FROM 
                student AS n 
                LEFT JOIN branch AS b ON n.id_branch = b.id 
                LEFT JOIN board AS bo ON n.id_board = bo.id 
                LEFT JOIN medium AS me ON n.id_medium = me.id 
                LEFT JOIN shift AS sh ON n.id_shift = sh.id 
                LEFT JOIN standard AS st ON n.id_standard = st.id 
                LEFT JOIN batch AS bt ON n.id_batch = bt.id 
                LEFT JOIN course AS co ON n.id_course = co.id 
                LEFT JOIN reference_type AS rft ON n.id_reference_type = rft.id 
                LEFT JOIN state AS s ON n.id_state = s.id
                LEFT JOIN city AS c ON n.id_city = c.id
                LEFT JOIN area AS a ON n.id_area = a.id
                LEFT JOIN sibling si ON n.id = si.id_student
            WHERE 
                n.id = ?
            GROUP BY
                n.id`;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying student by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            const formattedResult = result.map(row => ({
                ...row,
                sibling: row.sibling ? row.sibling.split(';').map(item => {
                    const [id_student, sibling_name, sibling_relation, sibling_board, sibling_medium, sibling_standard, sibling_school, sibling_tution_name] = item.split(':');
                    return { id_student: parseInt(id_student), sibling_name, sibling_relation, sibling_board, sibling_medium, sibling_standard, sibling_school, sibling_tution_name };
                }) : []
            }));
            return res.status(200).json({ success: 0, data: formattedResult, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getStudentbyBrBoMdStBt = (req, res) => {
    try {
        const subjectid = `SELECT id FROM course WHERE FIND_IN_SET(?, id_subject)`
        const course = `SELECT S.*, B.name AS branch_name, BO.board AS board_name, M.medium AS medium_name, ST.standard AS standard_name, BA.name AS batch_name, C.name AS course_name, SH.shift AS shift_name, RT.name AS reference_type_name, STT.state AS state_name, CT.city AS city_name, AR.area AS area_name FROM student AS S LEFT JOIN branch AS B ON S.id_branch = B.id LEFT JOIN board AS BO ON S.id_board = BO.id LEFT JOIN medium AS M ON S.id_medium = M.id LEFT JOIN standard AS ST ON S.id_standard = ST.id LEFT JOIN batch AS BA ON S.id_batch = BA.id LEFT JOIN course AS C ON S.id_course = C.id LEFT JOIN shift AS SH ON S.id_shift = SH.id LEFT JOIN reference_type AS RT ON S.id_reference_type = RT.id LEFT JOIN state AS STT ON S.id_state = STT.id LEFT JOIN city AS CT ON S.id_city = CT.id LEFT JOIN area AS AR ON S.id_area = AR.id WHERE S.id_branch = ? AND S.id_board = ? AND S.id_medium = ? AND S.id_standard = ? AND S.id_batch = ? AND S.id_course IN (?) AND S.del_stu <> 1 ORDER BY id DESC`;
        const batch = 'SELECT S.* , B.name AS branch_name, BO.board AS board_name, M.medium AS medium_name, ST.standard AS standard_name,BA.name AS batch_name,C.name AS course_name,SH.shift AS shift_name,RT.name AS reference_type_name,STT.state AS state_name,CT.city AS city_name,AR.area AS area_name FROM student AS S LEFT JOIN branch AS B ON S.id_branch = B.id LEFT JOIN board AS BO ON S.id_board = BO.id LEFT JOIN medium AS M ON S.id_medium = M.id LEFT JOIN standard AS ST ON S.id_standard = ST.id LEFT JOIN batch AS BA ON S.id_batch = BA.id LEFT JOIN course AS C ON S.id_course = C.id LEFT JOIN shift AS SH ON S.id_shift = SH.id LEFT JOIN reference_type AS RT ON S.id_reference_type = RT.id LEFT JOIN state AS STT ON S.id_state = STT.id LEFT JOIN city AS CT ON S.id_city = CT.id LEFT JOIN area AS AR ON S.id_area = AR.id WHERE S.id_branch = ? AND S.id_board = ? AND S.id_medium = ? AND S.id_standard = ? AND S.id_batch = ? AND S.del_stu <> 1 ORDER BY id DESC';
        const standard = 'SELECT S.* , B.name AS branch_name, BO.board AS board_name, M.medium AS medium_name, ST.standard AS standard_name,BA.name AS batch_name,C.name AS course_name,SH.shift AS shift_name,RT.name AS reference_type_name,STT.state AS state_name,CT.city AS city_name,AR.area AS area_name FROM student AS S LEFT JOIN branch AS B ON S.id_branch = B.id LEFT JOIN board AS BO ON S.id_board = BO.id LEFT JOIN medium AS M ON S.id_medium = M.id LEFT JOIN standard AS ST ON S.id_standard = ST.id LEFT JOIN batch AS BA ON S.id_batch = BA.id LEFT JOIN course AS C ON S.id_course = C.id LEFT JOIN shift AS SH ON S.id_shift = SH.id LEFT JOIN reference_type AS RT ON S.id_reference_type = RT.id LEFT JOIN state AS STT ON S.id_state = STT.id LEFT JOIN city AS CT ON S.id_city = CT.id LEFT JOIN area AS AR ON S.id_area = AR.id WHERE S.id_branch = ? AND S.id_board = ? AND S.id_medium = ? AND S.id_standard = ? AND S.del_stu <> 1 ORDER BY id DESC';
        const medium = 'SELECT S.* , B.name AS branch_name, BO.board AS board_name, M.medium AS medium_name, ST.standard AS standard_name,BA.name AS batch_name,C.name AS course_name,SH.shift AS shift_name,RT.name AS reference_type_name,STT.state AS state_name,CT.city AS city_name,AR.area AS area_name FROM student AS S LEFT JOIN branch AS B ON S.id_branch = B.id LEFT JOIN board AS BO ON S.id_board = BO.id LEFT JOIN medium AS M ON S.id_medium = M.id LEFT JOIN standard AS ST ON S.id_standard = ST.id LEFT JOIN batch AS BA ON S.id_batch = BA.id LEFT JOIN course AS C ON S.id_course = C.id LEFT JOIN shift AS SH ON S.id_shift = SH.id LEFT JOIN reference_type AS RT ON S.id_reference_type = RT.id LEFT JOIN state AS STT ON S.id_state = STT.id LEFT JOIN city AS CT ON S.id_city = CT.id LEFT JOIN area AS AR ON S.id_area = AR.id WHERE S.id_branch = ? AND S.id_board = ? AND S.id_medium = ? AND S.del_stu <> 1 ORDER BY id DESC';
        const board = 'SELECT S.* , B.name AS branch_name, BO.board AS board_name, M.medium AS medium_name, ST.standard AS standard_name,BA.name AS batch_name,C.name AS course_name,SH.shift AS shift_name,RT.name AS reference_type_name,STT.state AS state_name,CT.city AS city_name,AR.area AS area_name FROM student AS S LEFT JOIN branch AS B ON S.id_branch = B.id LEFT JOIN board AS BO ON S.id_board = BO.id LEFT JOIN medium AS M ON S.id_medium = M.id LEFT JOIN standard AS ST ON S.id_standard = ST.id LEFT JOIN batch AS BA ON S.id_batch = BA.id LEFT JOIN course AS C ON S.id_course = C.id LEFT JOIN shift AS SH ON S.id_shift = SH.id LEFT JOIN reference_type AS RT ON S.id_reference_type = RT.id LEFT JOIN state AS STT ON S.id_state = STT.id LEFT JOIN city AS CT ON S.id_city = CT.id LEFT JOIN area AS AR ON S.id_area = AR.id WHERE S.id_branch = ? AND S.id_board = ? AND S.del_stu <> 1 ORDER BY id DESC';
        const branch = 'SELECT S.* , B.name AS branch_name, BO.board AS board_name, M.medium AS medium_name, ST.standard AS standard_name,BA.name AS batch_name,C.name AS course_name,SH.shift AS shift_name,RT.name AS reference_type_name,STT.state AS state_name,CT.city AS city_name,AR.area AS area_name FROM student AS S LEFT JOIN branch AS B ON S.id_branch = B.id LEFT JOIN board AS BO ON S.id_board = BO.id LEFT JOIN medium AS M ON S.id_medium = M.id LEFT JOIN standard AS ST ON S.id_standard = ST.id LEFT JOIN batch AS BA ON S.id_batch = BA.id LEFT JOIN course AS C ON S.id_course = C.id LEFT JOIN shift AS SH ON S.id_shift = SH.id LEFT JOIN reference_type AS RT ON S.id_reference_type = RT.id LEFT JOIN state AS STT ON S.id_state = STT.id LEFT JOIN city AS CT ON S.id_city = CT.id LEFT JOIN area AS AR ON S.id_area = AR.id WHERE S.id_branch = ? AND S.del_stu <> 1 ORDER BY id DESC';
        const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch];
        const subjectIdQueryParam = req.query.id_subject;

        if (subjectIdQueryParam) {
            db.query(subjectid, subjectIdQueryParam, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    const courseIds = results.map(result => result.id);
                    db.query(course, [...queryParams, courseIds], (err, results) => {
                        if (err) {
                            console.error("Error executing SQL query:", err);
                            return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                        } else {
                            return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                        }
                    });
                }
            });
        } else if (queryParams[4] > 0) {
            db.query(batch, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[3] > 0) {
            db.query(standard, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[2] > 0) {
            db.query(medium, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[1] > 0) {
            db.query(board, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[0] > 0) {
            db.query(branch, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        }
    } catch (err) {
        console.error("Error in try-catch block:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
};
const deleteStudent = (req, res) => {
    try {
        const id = req.params.id;
        // Step 1: Retrieve student email
        db.query('SELECT email, photo FROM student WHERE id = ?', [id], (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error selecting user:', selectErr);
                return res.status(500).json({ success: 1, data: null, error: selectErr, msg: "Data delete Failed" });
            }
            const studentEmail = selectResult[0].email;

            // Step 2: Delete student from student table
            db.query('DELETE FROM student WHERE id = ?', [id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error('Error deleting user:', deleteErr);
                    return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data delete Failed" });
                }
                const photoFilename = selectResult[0].photo;
                if (photoFilename) {
                    const photoPath = `./uploads/${photoFilename}`;
                    fs.unlink(photoPath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting photo image:', unlinkErr);
                        }
                        // Step 3: Delete corresponding admin entries
                        deleteAdminEntries(studentEmail);
                    });
                } else {
                    // Step 3: Delete corresponding admin entries
                    deleteAdminEntries(studentEmail);
                }
                return res.status(200).json({ success: 0, data: deleteResult, error: null, msg: "Data delete Successfully" });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
// Function to delete corresponding admin entries
const deleteAdminEntries = (email) => {
    db.query('DELETE FROM admin WHERE email = ?', [email], (deleteAdminErr, deleteAdminResult) => {
        if (deleteAdminErr) {
            console.error('Error deleting admin entries:', deleteAdminErr);
        }
        console.log('Admin entries deleted successfully');
    });
};


//          Approval student 
const getApproval = (req, res) => {
    try {
        const sql = 'SELECT * FROM student WHERE del_stu = 2';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying country by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}
const getDeleted = (req, res) => {
    try {
        const sql = 'SELECT * FROM student WHERE del_stu = 1';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying country by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}

const deleteApproval = (req, res) => {
    try {
        const requestcln = 'UPDATE student SET del_stu = 2 WHERE id = ?'
        const request = 'UPDATE student SET del_stu = 0 WHERE id = ?'
        const requestdone = 'UPDATE student SET del_stu = 1 WHERE id = ?'
        const id = req.params.id;
        const apr = req.query.status;
        if (apr === '1') {
            db.query(requestdone, [id], (err, result) => {
                if (err) {
                    console.error('Error updating student:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: 1, data: null, error: err, msg: 'student not found.' });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
            });
        } else if (apr === '2') {
            db.query(request, [id], (err, result) => {
                if (err) {
                    console.error('Error updating student:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: 1, data: null, error: err, msg: 'student not found.' });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
            });
        } else {
            db.query(requestcln, [id], (err, result) => {
                if (err) {
                    console.error('Error updating student:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: 1, data: null, error: err, msg: 'student not found.' });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
            });
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}

//          About us


//                                  Inquiry
//               call data
const getInquiry = (req, res) => {
    try {
        // const sql = 'SELECT * FROM inquiry';
        const sql = `
        SELECT 
            n.*, 
            b.name AS branch_name, 
            bo.board AS board_name, 
            me.medium AS medium_name, 
            sh.shift AS shift_name, 
            st.standard AS standard_name, 
            co.name AS course_name,
            rft.name AS referencetype_name,
            stat.state AS state_name,
            ciy.city AS city_name,
            ar.area AS area_name
        FROM 
            inquiry n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN shift sh ON n.id_shift = sh.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN course co ON n.id_course = co.id 
            LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
            LEFT JOIN state stat ON n.id_state = stat.id 
            LEFT JOIN city ciy ON n.id_city = ciy.id 
            LEFT JOIN area ar ON n.id_area = ar.id 
        GROUP BY
            n.id
            ORDER BY id DESC
    `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in inquiry query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getInquirybyBrBoMdStBt = (req, res) => {
    try {
        const batch = `
        SELECT 
            n.*, 
            b.name AS branch_name, 
            bo.board AS board_name, 
            me.medium AS medium_name, 
            sh.shift AS shift_name, 
            st.standard AS standard_name, 
            co.name AS course_name,
            rft.name AS referencetype_name,
            stat.state AS state_name,
            ciy.city AS city_name,
            ar.area AS area_name
        FROM 
            inquiry n 
        LEFT JOIN branch b ON n.id_branch = b.id 
        LEFT JOIN board bo ON n.id_board = bo.id 
        LEFT JOIN medium me ON n.id_medium = me.id 
        LEFT JOIN shift sh ON n.id_shift = sh.id 
        LEFT JOIN standard st ON n.id_standard = st.id 
        LEFT JOIN course co ON n.id_course = co.id 
        LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
        LEFT JOIN state stat ON n.id_state = stat.id 
        LEFT JOIN city ciy ON n.id_city = ciy.id 
        LEFT JOIN area ar ON n.id_area = ar.id 
        WHERE 
            n.id_branch = ? 
            AND n.id_board = ? 
            AND n.id_medium = ? 
            AND n.id_standard = ? 
            AND n.id_batch = ?
        GROUP BY
            n.id
        ORDER BY id DESC
        `;
        const standard = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                co.name AS course_name,
                rft.name AS referencetype_name,
                stat.state AS state_name,
                ciy.city AS city_name,
                ar.area AS area_name
            FROM 
                inquiry n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN shift sh ON n.id_shift = sh.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN course co ON n.id_course = co.id 
            LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
            LEFT JOIN state stat ON n.id_state = stat.id 
            LEFT JOIN city ciy ON n.id_city = ciy.id 
            LEFT JOIN area ar ON n.id_area = ar.id 
            WHERE 
                n.id_branch = ? 
                AND n.id_board = ? 
                AND n.id_medium = ? 
                AND n.id_standard = ? 
            GROUP BY
                n.id
        `;
        const medium = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                co.name AS course_name,
                rft.name AS referencetype_name,
                stat.state AS state_name,
                ciy.city AS city_name,
                ar.area AS area_name
            FROM 
                inquiry n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN shift sh ON n.id_shift = sh.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN course co ON n.id_course = co.id 
            LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
            LEFT JOIN state stat ON n.id_state = stat.id 
            LEFT JOIN city ciy ON n.id_city = ciy.id 
            LEFT JOIN area ar ON n.id_area = ar.id 
            WHERE 
                n.id_branch = ? 
                AND n.id_board = ? 
                AND n.id_medium = ? 
            GROUP BY
                n.id
        `;
        const board = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                co.name AS course_name,
                rft.name AS referencetype_name,
                stat.state AS state_name,
                ciy.city AS city_name,
                ar.area AS area_name
            FROM 
                inquiry n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN shift sh ON n.id_shift = sh.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN course co ON n.id_course = co.id 
            LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
            LEFT JOIN state stat ON n.id_state = stat.id 
            LEFT JOIN city ciy ON n.id_city = ciy.id 
            LEFT JOIN area ar ON n.id_area = ar.id 
            WHERE 
                n.id_branch = ? 
                AND n.id_board = ? 
            GROUP BY
                n.id
        `;
        const branch = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                co.name AS course_name,
                rft.name AS referencetype_name,
                stat.state AS state_name,
                ciy.city AS city_name,
                ar.area AS area_name
            FROM 
                inquiry n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN shift sh ON n.id_shift = sh.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN course co ON n.id_course = co.id 
            LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
            LEFT JOIN state stat ON n.id_state = stat.id 
            LEFT JOIN city ciy ON n.id_city = ciy.id 
            LEFT JOIN area ar ON n.id_area = ar.id 
            WHERE 
                n.id_branch = ? 
            GROUP BY
                n.id

    `;
        const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch];

        if (queryParams[4] > 0) {
            db.query(batch, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[3] > 0) {
            db.query(standard, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[2] > 0) {
            db.query(medium, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[1] > 0) {
            db.query(board, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        } else if (queryParams[0] > 0) {
            db.query(branch, queryParams, (err, results) => {
                if (err) {
                    console.error("Error executing SQL query:", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Error when fetching data" });
                } else {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
                }
            });
        }
    } catch (err) {
        console.error("Error in try-catch block:", err);
        return res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
};
//              create inquiry
const createInquiry = (req, res) => {
    try {

        const requiredFields = ['name', 'inquiry_date', 'gender', 'id_branch', 'school', 'id_shift', 'id_board', 'id_medium', 'id_standard', 'id_course', 'contact_1', 'contact_2', 'address_line1', 'address_line2', 'pincode', 'id_state', 'id_city', 'id_area', 'id_reference_type', 'refence_name', 'email'];
        const namerequiredFields = ['Name', 'Inquiry Date', 'Gender', 'Branch', 'School', 'Shift', 'Board', 'Medium', 'Standard', 'Course', 'Contact 1', 'Contact 2', 'Address 1', 'Address 2', 'Pincode', 'State', 'City', 'Area', 'Reference Type', 'Refence Name', 'Email'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!req.body[field]) {
                const fieldName = namerequiredFields[i];
                return res.status(400).json({ success: 1, data: null, error: null, msg: `${fieldName} is required` });
            }
        }

        const inquiryEmail = req.body.email
        const checkIfExistsQuery = 'SELECT * FROM inquiry WHERE email = ?';

        db.query(checkIfExistsQuery, [inquiryEmail], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking inquiry email existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'email already exists' });
            }
            const defaultFollowupDate = new Date();
            defaultFollowupDate.setDate(defaultFollowupDate.getDate() + 2);

            const course = 'SELECT fees FROM course';
            const sql =
                'INSERT INTO inquiry (`name`,`inquiry_date`,`gender`,`id_branch`,`school`,`id_shift`,`id_board`,`id_medium`,`id_standard`,`id_course`,`contact_1`,`contact_2`,`address_line1`,`address_line2`,`pincode`,`id_state`,`id_city`,`id_area`,`id_reference_type`,`refence_name`,`remark`, `final_fees`,`followup_date`,`email`) VALUES (?)';

            if (req.body.final_fees > course) {
                return res.status(400).json({ success: 1, data: null, error: err, Message: 'Final fees cannot be more than the course fees.' });
            }

            const values = [
                req.body.name,
                req.body.inquiry_date,
                req.body.gender,
                req.body.id_branch,
                req.body.school,
                req.body.id_shift,
                req.body.id_board,
                req.body.id_medium,
                req.body.id_standard,
                req.body.id_course,
                req.body.contact_1,
                req.body.contact_2,
                req.body.address_line1,
                req.body.address_line2,
                req.body.pincode,
                req.body.id_state,
                req.body.id_city,
                req.body.id_area,
                req.body.id_reference_type,
                req.body.refence_name,
                req.body.remark,
                req.body.final_fees,
                defaultFollowupDate,
                req.body.email,
            ];

            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error creating inquiry', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
            });
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
//            edit inquiry
const editInquiry = (req, res) => {
    try {
        const sql = 'UPDATE inquiry SET `name`=?, `inquiry_date`=?, `gender`=?, `school`=?, `id_shift`=?, `id_standard`=?, `id_course`=?, `contact_1`=?, `contact_2`=?, `address_line1`=?, `address_line2`=?, `pincode`=?, `id_state`=?, `id_city`=?, `id_area`=?, `id_reference_type`=?, `refence_name`=?, `remark`=?, `final_fees`=?, `followup_date`=?, `email`=? WHERE  id=?'; // Corrected SQL query
        const id = req.params.id;
        const values = [
            req.body.name,
            req.body.inquiry_date,
            req.body.gender,
            req.body.school,
            req.body.id_shift,
            req.body.id_standard,
            req.body.id_course,
            req.body.contact_1,
            req.body.contact_2,
            req.body.address_line1,
            req.body.address_line2,
            req.body.pincode,
            req.body.id_state,
            req.body.id_city,
            req.body.id_area,
            req.body.id_reference_type,
            req.body.refence_name,
            req.body.remark,
            req.body.final_fees,
            req.body.followup_date,
            req.body.email,
            id,
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error updating inquiry', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditInquiry = (req, res) => {
    try {
        let sql = `
            SELECT 
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                sh.shift AS shift_name, 
                st.standard AS standard_name, 
                co.name AS course_name,
                rft.name AS referencetype_name,
                stat.state AS state_name,
                ciy.city AS city_name,
                ar.area AS area_name 
            FROM 
                inquiry n 
                LEFT JOIN branch b ON n.id_branch = b.id 
                LEFT JOIN board bo ON n.id_board = bo.id 
                LEFT JOIN medium me ON n.id_medium = me.id 
                LEFT JOIN shift sh ON n.id_shift = sh.id 
                LEFT JOIN standard st ON n.id_standard = st.id 
                LEFT JOIN course co ON n.id_course = co.id 
                LEFT JOIN reference_type rft ON n.id_reference_type = rft.id 
                LEFT JOIN state stat ON n.id_state = stat.id 
                LEFT JOIN city ciy ON n.id_city = ciy.id 
                LEFT JOIN area ar ON n.id_area = ar.id 
            WHERE 
                n.id = ?`;

        const id = req.params.id;
        const is_inquiry = req.query.is_inquiry;

        // If is_inquiry parameter is provided, include it in the SQL query
        if (is_inquiry !== undefined) {
            sql += ' AND is_inquiry = ?';
        }

        // Formulate parameters array based on whether is_inquiry is provided
        const params = is_inquiry !== undefined ? [id, is_inquiry] : [id];

        db.query(sql, params, (err, result) => {
            if (err) {
                console.error('Error querying inquiry by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
//         delete  inquiry
const deleteInquiry = (req, res) => {
    try {
        const sql = 'DELETE FROM inquiry WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting inquiry', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getInquiryByBranch = (req, res) => {
    try {
        const sql = `
            SELECT 
                I.*, 
                B.name AS branch_name, 
                BO.board AS board, 
                M.medium AS medium, 
                S.standard AS standard_name, 
                SH.shift AS shift,
                C.name AS course_name,
                ST.state AS state,
                CI.city AS city,
                A.area AS area,
                R.name AS reference_type_name
            FROM 
                inquiry AS I
            LEFT JOIN branch AS B ON I.id_branch = B.id
            LEFT JOIN board AS BO ON I.id_board = BO.id
            LEFT JOIN medium AS M ON I.id_medium = M.id
            LEFT JOIN standard AS S ON I.id_standard = S.id
            LEFT JOIN shift AS SH ON I.id_shift = SH.id
            LEFT JOIN course AS C ON I.id_course = C.id
            LEFT JOIN state AS ST ON I.id_state = ST.id
            LEFT JOIN city AS CI ON I.id_city = CI.id
            LEFT JOIN area AS A ON I.id_area = A.id
            LEFT JOIN reference_type AS R ON I.id_reference_type = R.id
            WHERE 
                I.id_branch = ?
                ORDER BY id DESC
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


//              notice
const getNotice = (req, res) => {
    try {
        const sql = `
        SELECT 
            n.*, 
            b.name AS branch_name, 
            bo.board, 
            me.medium,  
            st.standard AS standard_name, 
            bt.name AS batch_name, 
            GROUP_CONCAT(s.name) AS student_names
        FROM 
            notice n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN batch bt ON n.id_batch = bt.id 
            LEFT JOIN student s ON FIND_IN_SET(s.id, n.id_student)
        GROUP BY
            n.id
            ORDER BY id DESC
    `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in notice query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
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
const createNotice = (req, res) => {
    try {
        function my_implode_js(separator, string) {
            if (typeof string === 'string' && string.length > 0) {
                return string.split(separator).join(separator);
            } else {
                return "";
            }
        }
        const id_student = my_implode_js(",", req.body.id_student);
        const values = [
            req.body.name,
            req.body.id_branch,
            req.body.id_board,
            req.body.id_medium,
            req.body.id_standard,
            req.body.id_batch,
            id_student,
            req.body.description,
            req.file.filename,
        ];
        const branch = 'INSERT INTO notice (`name`,`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_batch`,`id_student`, `description`, `files`) VALUES (?)';
        db.query(branch, [values], (dbErr, result) => {
            if (dbErr) {
                console.error('Error creating notice', dbErr);
                return res.status(500).json({ success: 1, data: null, error: dbErr, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getNoticeById = (req, res) => {
    try {
        const sql = `
        SELECT 
            n.*, 
            b.name AS branch_name, 
            bo.board, 
            me.medium,  
            st.standard AS standard_name, 
            bt.name AS batch_name, 
            GROUP_CONCAT(s.name) AS student_names
        FROM 
            notice n
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN batch bt ON n.id_batch = bt.id 
            LEFT JOIN student s ON FIND_IN_SET(s.id, n.id_student)
        WHERE n.id = ?
        GROUP BY n.id
        `;
        const id = req.params.id;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying notice by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            if (result.length === 0) {
                return res.status(404).json({ success: 1, data: null, error: err, msg: 'Notice not found' });
            }

            // const noticeData = result[0];
            // noticeData.files = JSON.parse(noticeData.files || '[]'); // Parse the files array

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editNotice = (req, res) => {
    try {
        upload.array('files', 5)(req, res, (err) => {
            if (err) {
                console.error('Error uploading files:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Error uploading files' });
            }

            const uploadedFiles = req.files.map((file) => file.path);

            const sql =
                'UPDATE notice SET `name`=?, `id_branch`=?, `id_shift`=?, `id_board`=?, `id_medium`=?, `id_standard`=?, `id_student`=?, `files`=? WHERE id=?';
            const id = req.params.id;

            // Get the existing files from the database
            db.query('SELECT files FROM notice WHERE id=?', [id], (dbErr, result) => {
                if (dbErr) {
                    console.error('Error retrieving existing files', dbErr);
                    return res.status(500).json({ success: 1, data: null, error: dbErr, msg: "Data edit Failed" });
                }

                let existingFiles = [];
                if (result.length > 0) {
                    existingFiles = JSON.parse(result[0].files);
                }

                // Assuming req.body.deletedFiles is an array of file names to delete
                const deletedFiles = req.body.deletedFiles || [];

                // Delete files from the upload folder
                deletedFiles.forEach((deletedFile) => {
                    const filePath = path.join(__dirname, 'uploads', deletedFile);
                    fs.unlinkSync(filePath); // Synchronously delete the file
                });

                // Filter out deleted files
                const updatedFiles = existingFiles.filter((file) => !deletedFiles.includes(file));

                // Concatenate the existing files and uploaded files
                const finalFiles = updatedFiles.concat(uploadedFiles);

                db.query(
                    sql,
                    [
                        req.body.name,
                        req.body.id_branch,
                        req.body.id_shift,
                        req.body.id_board,
                        req.body.id_medium,
                        req.body.id_standard,
                        req.body.id_batch,
                        req.body.id_student,
                        JSON.stringify(finalFiles),
                        id,
                    ],
                    (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('Error updating notice', updateErr);
                            return res.status(500).json({ success: 1, data: null, error: updateErr, msg: "Data edit Failed" });
                        }
                        return res.status(200).json({ success: 0, data: updateResult, error: null, msg: "Data edit Successfully" });
                    }
                );
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteNotice = (req, res) => {
    try {
        const id = req.params.id;
        db.query('SELECT files FROM notice WHERE id = ?', [id], (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error selecting user:', selectErr);
                return res.status(500).json({ success: 1, data: null, error: selectErr, msg: "Data Get Failed" });
            }
            db.query('DELETE FROM notice WHERE id = ?', [id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error('Error deleting notice:', deleteErr);
                    return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data delete Failed" });
                }
                const profileFilename = selectResult[0].files;
                if (profileFilename) {
                    const profilePath = `uploads/${profileFilename}`;
                    fs.unlink(profilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting files:', unlinkErr);
                        }

                        return res.status(200).json({ success: 0, data: null, error: null, msg: 'notice deleted successfully' });
                    });
                } else {
                    return res.status(200).json({ success: 0, data: null, error: null, msg: 'notice deleted successfully' });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getNoticebyBrBoMdStBt = ((req, res) => {
    try {
        const sql = ` SELECT 
        n.*, 
        b.name AS branch_name, 
        bo.board, 
        me.medium,  
        st.standard AS standard_name, 
        bt.name AS batch_name, 
        GROUP_CONCAT(s.name) AS student_names
    FROM 
        notice n 
        LEFT JOIN branch b ON n.id_branch = b.id 
        LEFT JOIN board bo ON n.id_board = bo.id 
        LEFT JOIN medium me ON n.id_medium = me.id 
        LEFT JOIN standard st ON n.id_standard = st.id 
        LEFT JOIN batch bt ON n.id_batch = bt.id 
        LEFT JOIN student s ON FIND_IN_SET(s.id, n.id_student)
    WHERE 
        n.id_branch = ? AND n.id_board = ? AND n.id_medium = ? AND n.id_standard = ? AND n.id_batch = ?
    GROUP BY
        n.id
    ORDER BY id DESC`;
        db.query(sql, [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});
const getNoticebyStudent = ((req, res) => {
    try {
        const sql = ` 
        SELECT 
            n.*, 
            b.name AS branch_name, 
            bo.board, 
            me.medium,  
            st.standard AS standard_name, 
            bt.name AS batch_name, 
            GROUP_CONCAT(s.name) AS student_names
        FROM 
            notice n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN batch bt ON n.id_batch = bt.id 
            LEFT JOIN student s ON FIND_IN_SET(s.id, n.id_student)
        WHERE 
            FIND_IN_SET(?, n.id_student)
        ORDER BY id DESC`;
        const id = req.params.id;
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});



const getStanderdbyBranch = ((req, res) => {
    try {
        const sql = 'SELECT A.id, A.standard FROM standard A WHERE A.branch_id = ?';
        db.query(sql, [req.query.branch_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});


//                                  Attendance
const getAttendance = (req, res) => {
    try {
        const {
            id_branch,
            id_board,
            id_medium,
            id_standard,
            id_batch,
            id_subject
        } = req.query;

        // Constructing the base SQL query to fetch all data
        let sql = `
        SELECT a.*, 
            b.name AS branch_name, 
            bo.board AS board_name,
            me.medium AS medium_name,
            st.standard AS standard_name,
            sub.subject AS subject_name,
            bt.name AS batch_name,
            GROUP_CONCAT(DISTINCT ps.name ORDER BY FIND_IN_SET(ps.id, a.present)) AS present_names,
            GROUP_CONCAT(DISTINCT asb.name ORDER BY FIND_IN_SET(asb.id, a.absent)) AS absent_names,
            (CASE 
                WHEN a.present = '' THEN 0
                ELSE COUNT(DISTINCT ps.id)
            END) AS present_count,
            (CASE 
                WHEN a.absent = '' THEN 0
                ELSE COUNT(DISTINCT asb.id)
            END) AS absent_count
        FROM attendance a
            LEFT JOIN branch b ON a.id_branch = b.id 
            LEFT JOIN board bo ON a.id_board = bo.id 
            LEFT JOIN medium me ON a.id_medium = me.id 
            LEFT JOIN standard st ON a.id_standard = st.id 
            LEFT JOIN subject sub ON a.id_subject = sub.id 
            LEFT JOIN batch bt ON a.id_batch = bt.id 
            LEFT JOIN student ps ON FIND_IN_SET(ps.id, a.present)
            LEFT JOIN student asb ON FIND_IN_SET(asb.id, a.absent)
        `;

        // Check if any filter parameter is provided
        const hasFilters = id_branch || id_board || id_medium || id_standard || id_batch || id_subject;

        // If filters are provided, modify the SQL query to include WHERE clauses for each filter
        if (hasFilters) {
            sql += `
                WHERE 
                    (${id_branch ? `a.id_branch = ${id_branch}` : '1'}) AND
                    (${id_board ? `a.id_board = ${id_board}` : '1'}) AND
                    (${id_medium ? `a.id_medium = ${id_medium}` : '1'}) AND
                    (${id_standard ? `a.id_standard = ${id_standard}` : '1'}) AND
                    (${id_batch ? `a.id_batch = ${id_batch}` : '1'}) AND
                    (${id_subject ? `a.id_subject = ${id_subject}` : '1'})
            `;
        }

        // Grouping and executing the SQL query
        sql += 'GROUP BY a.id ORDER BY id DESC;';  // Grouping the result by attendance ID
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in attendance query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            result.forEach(item => {
                if (item.present_names === null) {
                    item.present_names = "";
                }
                if (item.absent_names === null) {
                    item.absent_names = "";
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getAttendanceByStudent = (req, res) => {
    try {
        const studentId = req.params.studentId;
        const idSubject = req.query.id_subject;

        const sql = `
        SELECT 
            id_subject,
            SB.subject AS subject_name,
            DATE_ADD(DATE(date), INTERVAL 1 DAY) AS attendance_date,
            SUM(CASE WHEN FIND_IN_SET(?, present) > 0 THEN 1 ELSE 0 END) AS present_count,
            SUM(CASE WHEN FIND_IN_SET(?, absent) > 0 THEN 1 ELSE 0 END) AS absent_count
        FROM 
            attendance A
            LEFT JOIN subject SB ON A.id_subject = SB.id
        WHERE 
            (FIND_IN_SET(?, present) > 0 OR FIND_IN_SET(?, absent) > 0)
            AND A.id_subject = ?
        GROUP BY 
            DATE_ADD(DATE(date), INTERVAL 1 DAY)
        `;
        db.query(sql, [studentId, studentId, studentId, studentId, idSubject], (err, result) => {
            if (err) {
                console.error('Error in attendance query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getWeeklyAttendance = (req, res) => {
    try {
        const studentId = req.params.studentId;

        const currentDate = new Date();

        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

        // SQL query to get yearly absent data with month, adjusted week, and monthly total absent for all subjects
        const sql = `
        SELECT
            id_subject,
            MONTH(date) as month,
            WEEK(date, 1) - WEEK(DATE_SUB(date, INTERVAL DAYOFMONTH(date) - 1 DAY), 1) + 1 as week,
            COUNT(*) as absentCount,
            SUM(CASE WHEN FIND_IN_SET(?, absent) THEN 1 ELSE 0 END) as monthlyTotalAbsent
        FROM
            attendance
        WHERE
            date BETWEEN ? AND ? AND (FIND_IN_SET(?, absent))
        GROUP BY
            id_subject, month, week
        ORDER BY
             month, week
        `;

        db.query(sql, [studentId, startOfYear, endOfYear, studentId], (err, result) => {
            if (err) {
                console.error('Error in attendance query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
// const createAttendance = (req, res) => {
//     try {
//         const sql =
//             "INSERT INTO attendance (`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_subject`,`id_batch`,`present`,`absent`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//         function my_implode_js(separator, array) {
//             if (Array.isArray(array) && array.length > 0) {
//                 return array.join(separator);
//             } else {
//                 return "";
//             }
//         }
//         const present = my_implode_js(",", req.body.present);
//         const absent = my_implode_js(",", req.body.absent);
//         const values = [
//             req.body.id_branch,
//             req.body.id_board,
//             req.body.id_medium,
//             req.body.id_standard,
//             req.body.id_subject,
//             req.body.id_batch,
//             present,
//             absent,
//         ];
//         db.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error("Error creating Attendance", err);
//                 return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
//             }
//             return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
//         });
//     } catch (error) {
//         console.error("Unexpected error:", error);
//         return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
//     }
// };
const createAttendance = (req, res) => {
    try {
        // Check if required fields are empty
        const requiredFields = ['date', 'id_branch', 'id_board', 'id_medium', 'id_standard', 'id_subject', 'id_batch'];
        const namerequiredFields = ['Date', 'Branch', 'Board', 'Medium', 'Standard', 'Subject', 'Batch'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!req.body[field]) {
                const fieldName = namerequiredFields[i];
                return res.status(400).json({ success: 1, data: null, error: null, msg: `${fieldName} is required` });
            }
        }

        const sql =
            "INSERT INTO attendance (`date`,`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_subject`,`id_batch`,`present`,`absent`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        function my_implode_js(separator, array) {
            if (Array.isArray(array) && array.length > 0) {
                return array.join(separator);
            } else {
                return "";
            }
        }
        const present = my_implode_js(",", req.body.present);
        const absent = my_implode_js(",", req.body.absent);
        const values = [
            req.body.date,
            req.body.id_branch,
            req.body.id_board,
            req.body.id_medium,
            req.body.id_standard,
            req.body.id_subject,
            req.body.id_batch,
            present,
            absent,
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error creating Attendance", err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            const { reasons } = req.body;

            //      reason
            if (reasons.length > 0) {
                const { reasons } = req.body;
                const id_attendance = result.insertId
                const reasonValues = reasons.flatMap(reasonObj => [id_attendance, reasonObj.id_student, reasonObj.reason]);
                const placeholders = reasons.map(() => '(?, ?, ?)').join(', ');
                const sqlReason = `INSERT INTO reason (id_attendance, id_student, reason) VALUES ${placeholders}`;
                db.query(sqlReason, reasonValues, (err, result) => {
                    if (err) {
                        console.error("Error creating Attendance", err);
                        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
                    }
                    return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
                });
            } else {
                return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

const editAttendance = (req, res) => {
    try {
        const sql = 'UPDATE attendance SET `present`=?, `absent`=? WHERE id=?';
        const id = req.params.id;
        const { present, absent, reason } = req.body;

        function implode(separator, array) {
            if (Array.isArray(array) && array.length > 0) {
                return array.join(separator);
            } else {
                return "";
            }
        }

        const presentString = implode(",", present);
        const absentString = implode(",", absent);

        db.query(sql, [presentString, absentString, id], (err, result) => {
            if (err) {
                console.error('Error updating attendance', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }

            if (reason) {
                const deleteReasonsSql = 'DELETE FROM reason WHERE id_attendance = ?';

                db.query(deleteReasonsSql, [id], (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        console.error('Error deleting existing reasons', deleteErr);
                        return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data edit Failed (Reasons)" });
                    }
                });

                //      reason
                const id_attendance = req.params.id
                const { reasons } = req.body;
                const reasonValues = reasons.flatMap(reasonObj => [id_attendance, reasonObj.id_student, reasonObj.reason]);
                const placeholders = reasons.map(() => '(?, ?, ?)').join(', ');
                const sqlReason = `INSERT INTO reason (id_attendance, id_student, reason) VALUES ${placeholders}`;
                db.query(sqlReason, reasonValues, (err, result) => {
                    if (err) {
                        console.error("Error creating Attendance", err);
                        return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
                    }
                    return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
                });
            } else {
                const deleteReasonsSql = 'DELETE FROM reason WHERE id_attendance = ?';

                db.query(deleteReasonsSql, [id], (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        console.error('Error deleting existing reasons', deleteErr);
                        return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data edit Failed (Reasons)" });
                    }
                    return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Edited Successfully" });
                });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};




const getEditAttendance = (req, res) => {
    try {
        //     const sql = `
        //     SELECT 
        //     a.*, 
        //     b.name AS branch_name,
        //     bo.board AS board_name,
        //     m.medium AS medium_name,
        //     s.standard AS standard_name,
        //     sub.subject AS subject_name,
        //     bat.name AS batch_name,
        //     (CASE WHEN a.present THEN GROUP_CONCAT(DISTINCT p.name) ELSE NULL END) AS present_names,
        //     (CASE WHEN a.absent THEN GROUP_CONCAT(DISTINCT a2.name) ELSE NULL END) AS absent_names
        // FROM 
        //     attendance a
        //     LEFT JOIN branch b ON a.id_branch = b.id
        //     LEFT JOIN board bo ON a.id_board = bo.id
        //     LEFT JOIN medium m ON a.id_medium = m.id
        //     LEFT JOIN standard s ON a.id_standard = s.id
        //     LEFT JOIN subject sub ON a.id_subject = sub.id
        //     LEFT JOIN batch bat ON a.id_batch = bat.id
        //     LEFT JOIN student p ON FIND_IN_SET(p.id, a.present)
        //     LEFT JOIN student a2 ON FIND_IN_SET(a2.id, a.absent)
        // WHERE 
        //     a.id = ?
        // GROUP BY
        //     a.id
        // ORDER BY a.id DESC
        // `;

        const sql = `
        SELECT 
            a.*, 
            b.name AS branch_name,
            bo.board AS board_name,
            m.medium AS medium_name,
            s.standard AS standard_name,
            sub.subject AS subject_name,
            bat.name AS batch_name,
            (CASE WHEN a.present THEN GROUP_CONCAT(DISTINCT p.name) ELSE NULL END) AS present_names,
            (CASE WHEN a.absent THEN GROUP_CONCAT(DISTINCT a2.name) ELSE NULL END) AS absent_names,
            GROUP_CONCAT(DISTINCT CONCAT(r.id_student, ':', r.reason) SEPARATOR ';') AS reason
        FROM 
            attendance a
            LEFT JOIN branch b ON a.id_branch = b.id
            LEFT JOIN board bo ON a.id_board = bo.id
            LEFT JOIN medium m ON a.id_medium = m.id
            LEFT JOIN standard s ON a.id_standard = s.id
            LEFT JOIN subject sub ON a.id_subject = sub.id
            LEFT JOIN batch bat ON a.id_batch = bat.id
            LEFT JOIN student p ON FIND_IN_SET(p.id, a.present)
            LEFT JOIN student a2 ON FIND_IN_SET(a2.id, a.absent)
            LEFT JOIN reason r ON a.id = r.id_attendance
        WHERE 
            a.id = ?
        GROUP BY
            a.id
        ORDER BY a.id DESC
        `;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying attendance by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            const formattedResult = result.map(row => ({
                ...row,
                reason: row.reason ? row.reason.split(';').map(item => {
                    const [id_student, reason] = item.split(':');
                    return { id_student: parseInt(id_student), reason };
                }) : []
            }));
            return res.status(200).json({ success: 0, data: formattedResult, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteAttendance = (req, res) => {
    try {
        const id = req.params.id;
        const reasonesql = 'DELETE FROM reason WHERE id_attendance = ?'
        db.query(reasonesql, [id], (errRes, resultRes) => {
            // if (err) {
            //     console.error('Error deleting attendance', err);
            //     return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            // }

            const sql = 'DELETE FROM attendance WHERE id = ?';
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting attendance', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
            });
        })

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//              fees
const getFees = (req, res) => {
    try {
        let sqll = `
        SELECT 
            st.id AS student_id,
            st.name AS student_name,
            st.id_branch,
            n.created_on AS date,
            b.name AS branch_name,
            COALESCE(SUM(n.amount), 0) AS total_amount_paid,
            (st.final_fees - COALESCE(SUM(n.amount), 0)) AS remaining_amount
        FROM 
            student st
            LEFT JOIN fees n ON st.id = n.id_student
            LEFT JOIN branch b ON st.id_branch = b.id  
        GROUP BY 
            st.id, st.name;
            `
        let sql = `
        SELECT 
            n.*, 
            b.name AS branch_name, 
            st.name AS student_name
        FROM 
            fees n 
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN student st ON n.id_student = st.id 
        `;

        const params = [];

        if (req.query.id_student) {
            sql += ` WHERE n.id_student = ?`;
            params.push(req.query.id_student);
        }

        sql += ` GROUP BY n.id ORDER BY id DESC`;

        db.query(sqll, params, (err, result) => {
            if (err) {
                console.error('Error in fees query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createFees = (req, res) => {
    try {
        const sql = 'INSERT INTO fees (`id_branch`,`amount`, `id_student`) VALUES (?)';
        const values = [
            req.body.id_branch,
            req.body.amount,
            req.body.id_student
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating branch', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getFeesByAmount = (req, res) => {
    try {
        const id_branch = req.params.id_branch;
        const sql = 'SELECT SUM(amount) AS totalFees FROM fees WHERE id_branch = ?';

        db.query(sql, [id_branch], (err, result) => {
            if (err) {
                console.error('Error querying fees by branch ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            const totalFees = result[0].totalFees || 0;

            return res.status(200).json({ success: 0, data: totalFees, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getFeesByAllAmount = (req, res) => {
    try {
        const sql = 'SELECT SUM(amount) AS totalFees FROM fees';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying fees by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            // Extract total fees from the result
            const totalFees = result[0].totalFees !== null ? result[0].totalFees : 0;

            return res.status(200).json({ success: 0, data: totalFees, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getFeesById = (req, res) => {
    try {
        const sql = `
            SELECT fees.*, branch.name AS branch_name, student.name AS student_name
            FROM fees
            LEFT JOIN branch ON fees.id_branch = branch.id
            LEFT JOIN student ON fees.id_student = student.id
            WHERE fees.id = ?
        `;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying fees  by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editFees = (req, res) => {
    try {
        const sql =
            "UPDATE fees SET `amount`=? WHERE  id=?";
        const id = req.params.id;
        db.query(
            sql,
            [
                req.body.amount,
                id
            ],
            (err, result) => {
                if (err) {
                    console.error("Error updating fees ", err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
            }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteFees = (req, res) => {
    try {
        const sql = 'DELETE FROM fees WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting fees ', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getFeesByBranch = (req, res) => {
    try {
        const sql = `
        SELECT 
          f.*, 
          B.name AS branch,
          S.name AS Student
        FROM 
          fees AS f 
        INNER JOIN branch AS B ON f.id_branch = B.id
        INNER JOIN student AS S ON f.id_student = S.id 
        WHERE 
          f.id_branch = ?
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
const getFeesByStudent = (req, res) => {
    try {
        const sql = `
        SELECT 
          f.*, 
          B.name AS branch,
          S.name AS Student
        FROM 
          fees AS f 
        INNER JOIN branch AS B ON f.id_branch = B.id
        INNER JOIN student AS S ON f.id_student = S.id 
        WHERE 
          f.id_student = ?
      `;

        db.query(sql, [req.query.id_student], (err, results) => {
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
const getFeesbyStudentTotal = (req, res) => {
    try {
        const id = req.params.id;
        const studentSql = `SELECT final_fees FROM student WHERE id = ?`;
        db.query(studentSql, [id], (studentErr, studentResult) => {
            if (studentErr) {
                console.error('Error fetching student data:', studentErr);
                return res.status(500).json({ success: 1, data: null, error: studentErr, msg: "Error fetching student data" });
            }
            if (studentResult.length === 0) {
                return res.status(404).json({ success: 1, data: null, error: "Student not found", msg: "Student not found" });
            }
            const feesSql = `SELECT amount FROM fees WHERE id_student = ?`;
            db.query(feesSql, [id], (feesErr, feesResult) => {
                if (feesErr) {
                    console.error('Error fetching fees data:', feesErr);
                    return res.status(500).json({ success: 1, data: null, error: feesErr, msg: "Error fetching fees data" });
                }
                const submitedFees = feesResult.map(row => row.amount).reduce((acc, amount) => acc + amount, 0);
                const totalFees = studentResult[0].final_fees;
                const final_fees = totalFees - submitedFees;
                return res.status(200).json({ success: 0, data: { totalFees, final_fees }, error: null, msg: "Data comparison successful" });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};



//  structure api
const getBoardbybranch = ((req, res) => {
    try {
        const sql = `SELECT A.*, b.name AS branch_name FROM board A INNER JOIN branch AS b ON b.id = A.id_branch WHERE A.id_branch = ?`;
        db.query(sql, [req.query.id_branch], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});

const getMediumbybranchBoard = ((req, res) => {
    try {
        const sql = `
            SELECT M.*, B.name AS branch, BO.board AS board
            FROM medium M
            INNER JOIN branch B ON M.id_branch = B.id
            INNER JOIN board BO ON M.id_board = BO.id
            WHERE M.id_branch = ? AND M.id_board = ?
        `;
        db.query(sql, [req.query.id_branch, req.query.id_board], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});
const getStandardbyBrBoMd = ((req, res) => {
    try {
        const sql = `
            SELECT S.*, B.name AS branch, BO.board AS board, M.medium AS medium
            FROM standard S
            INNER JOIN branch B ON S.branch_id = B.id
            INNER JOIN board BO ON S.id_board = BO.id
            INNER JOIN medium M ON S.id_medium = M.id
            WHERE S.branch_id = ? AND S.id_board = ? AND S.id_medium = ?
        `;
        db.query(sql, [req.query.branch_id, req.query.id_board, req.query.id_medium], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});
const getBatchbyBrBoMdSt = ((req, res) => {
    try {
        const sql = `
            SELECT B.*, 
                   BR.name AS branch, 
                   BO.board AS board, 
                   M.medium AS medium, 
                   S.standard AS standard
            FROM batch B
            INNER JOIN branch BR ON B.id_branch = BR.id
            INNER JOIN board BO ON B.id_board = BO.id
            INNER JOIN medium M ON B.id_medium = M.id
            INNER JOIN standard S ON B.id_standard = S.id
            WHERE B.id_branch = ? AND B.id_board = ? AND B.id_medium = ? AND B.id_standard = ?
        `;
        db.query(sql, [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});


//                                  Assign HomeWork
//               call data
const getAssignHomeWork = (req, res) => {
    try {
        const sql = `
            SELECT 
                ah.*, 
                b.name AS branch_name,
                bo.board AS board_name,
                me.medium AS medium_name,
                st.standard AS standard_name,
                sub.subject AS subject_name,
                bat.name AS batch_name,
                GROUP_CONCAT(s.name) AS student_names
            FROM 
                assign_homework ah
                LEFT JOIN branch b ON ah.id_branch = b.id
                LEFT JOIN board bo ON ah.id_board = bo.id
                LEFT JOIN medium me ON ah.id_medium = me.id
                LEFT JOIN standard st ON ah.id_standard = st.id
                LEFT JOIN subject sub ON ah.id_subject = sub.id
                LEFT JOIN batch bat ON ah.id_batch = bat.id
                LEFT JOIN student s ON FIND_IN_SET(s.id, ah.id_student)
            GROUP BY 
                ah.id
            ORDER BY id DESC
        `;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in assign_homework query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
// const createAssignHomeWork = (req, res) => {
//     try {
//         const assignHomeworkSql = 'INSERT INTO assign_homework (`id_branch`,`id_board`,`id_medium`,`id_standard`, `id_subject`, `id_batch`, `title`, `description`,`files`,`id_student`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//         const assignHomeworkValues = [
//             req.body.id_branch,
//             req.body.id_board,
//             req.body.id_medium,
//             req.body.id_standard,
//             req.body.id_subject,
//             req.body.id_batch,
//             req.body.title,
//             req.body.description,
//             req.file.filename,
//             req.body.id_student,
//         ];

//         db.query(assignHomeworkSql, assignHomeworkValues, (assignErr, assignResult) => {
//             if (assignErr) {
//                 console.error('Error creating assign_homework', assignErr);
//                 return res.status(500).json({ success: 1, data: null, error: assignErr, msg: "Data insert Failed" });
//             }

//             const assignHomeworkInsertId = assignResult.insertId;
//             const statusHomeworkSql = 'INSERT INTO status_homework (`id`, `done`, `id_subject`) VALUES (?, ?, ?)'

//             const done = req.body.id_student;

//             const statusHomeworkValues = [
//                 assignHomeworkInsertId,
//                 done,
//                 req.body.id_subject
//             ];

//             db.query(statusHomeworkSql, statusHomeworkValues, (statusErr, statusResult) => {
//                 if (statusErr) {
//                     console.error('Error creating status homework', statusErr);
//                     return res.status(500).json({ success: 1, data: null, error: statusErr, msg: "Data insert Failed" });
//                 }
//                 return res.status(200).json({ success: 0, data: { assignHomeworkInsertId, statusHomeworkInsertId: statusResult.insertId }, error: null, msg: "Data insert Successfully" });
//             });
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
//     }
// };
const createAssignHomeWork = (req, res) => {
    try {

        const requiredFields = ['id_branch', 'id_board', 'id_medium', 'id_standard', 'id_subject', 'id_batch', 'title', 'description']
        const namerequiredFields = ['Branch', 'Board', 'Medium', 'Standard', 'Subject', 'Batch', 'Title', 'Description']
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


        const idBatch = req.body.id_batch;

        // Query the batch table to get id_student values for the given id_batch
        const batchSql = 'SELECT id FROM student WHERE id_batch = ?';
        db.query(batchSql, [idBatch], (batchErr, batchResult) => {
            if (batchErr) {
                console.error('Error fetching data from batch table', batchErr);
                return res.status(500).json({ success: 1, data: null, error: batchErr, msg: "Data fetch failed" });
            }

            // Extract id_student values from the batchResult
            const idStudents = batchResult.map(row => row.id).join(',');;

            // Proceed with inserting data into assign_homework and status_homework tables
            const assignHomeworkSql = 'INSERT INTO assign_homework (`id_branch`,`id_board`,`id_medium`,`id_standard`, `id_subject`, `id_batch`, `title`, `description`,`files`,`id_student`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const assignHomeworkValues = [
                req.body.id_branch,
                req.body.id_board,
                req.body.id_medium,
                req.body.id_standard,
                req.body.id_subject,
                req.body.id_batch,
                req.body.title,
                req.body.description,
                req.file.filename,
                idStudents, // Use the fetched id_student values
            ];

            db.query(assignHomeworkSql, assignHomeworkValues, (assignErr, assignResult) => {
                if (assignErr) {
                    console.error('Error creating assign_homework', assignErr);
                    return res.status(500).json({ success: 1, data: null, error: assignErr, msg: "Data insert failed" });
                }

                const assignHomeworkInsertId = assignResult.insertId;

                // Continue with inserting data into status_homework table
                const statusHomeworkSql = 'INSERT INTO status_homework (`id`, `done`, `id_subject`) VALUES (?, ?, ?)';
                const done = idStudents;
                const statusHomeworkValues = [
                    assignHomeworkInsertId,
                    done,
                    req.body.id_subject
                ];

                db.query(statusHomeworkSql, statusHomeworkValues, (statusErr, statusResult) => {
                    if (statusErr) {
                        console.error('Error creating status homework', statusErr);
                        return res.status(500).json({ success: 1, data: null, error: statusErr, msg: "Data insert failed" });
                    }
                    return res.status(200).json({ success: 0, data: { assignHomeworkInsertId, statusHomeworkInsertId: statusResult.insertId }, error: null, msg: "Data insert successfully" });
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal server error" });
    }
};


const editAssignHomeWork = (req, res) => {
    try {
        const { id } = req.params;
        const { id_subject, title, description } = req.body;
        const updateFields = [];
        const assignhomeworkValues = [];

        const fields = ['id_subject', 'title', 'description']
        fields.forEach(field => {
            if (req.body[field]) {
                updateFields.push(`\`${field}\`=?`);
                assignhomeworkValues.push(req.body[field]);
            }
        })

        const files = req.file ? req.file.filename : null;
        if (req.file) {
            updateFields.push('files=?');
            assignhomeworkValues.push(files)
        }
        if (updateFields.length === 0) {
            return res.status(400).json({ success: 1, data: null, error: null, msg: "No data provided for update" });
        }

        const assignhomeworkSql = `UPDATE assign_homework SET ${updateFields.join(', ')} WHERE id=?`;
        assignhomeworkValues.push(id);

        const getPhotoSql = 'SELECT files FROM assign_homework WHERE id = ?';

        if (files) {
            db.query(getPhotoSql, [id], (getPhotoErr, getPhotoResult) => {
                if (getPhotoErr) {
                    console.error('Error getting current files filename:', getPhotoErr);
                    return res.status(500).json({ success: 1, data: null, error: getPhotoErr, msg: "Error getting current photo filename" });
                }
                db.query(assignhomeworkSql, assignhomeworkValues, (assignhomeworkErr, assignhomeworkResult) => {
                    if (assignhomeworkErr) {
                        console.error('Error updating assign homework', assignhomeworkErr);
                        return res.status(500).json({ success: 1, data: null, error: assignhomeworkErr, msg: "assign homework data update failed" });
                    }

                    const oldPhotoFilename = getPhotoResult[0].files;
                    if (oldPhotoFilename && fs.existsSync(`./uploads/${oldPhotoFilename}`)) {
                        fs.unlinkSync(`./uploads/${oldPhotoFilename}`);
                    }
                    return res.status(200).json({ success: 0, data: { assignhomework: assignhomeworkResult }, error: null, msg: "Data updated successfully" });
                });
            });
        } else {
            db.query(assignhomeworkSql, assignhomeworkValues, (assignhomeworkErr, assignhomeworkResult) => {
                if (assignhomeworkErr) {
                    console.error('Error updating assign homework', assignhomeworkErr);
                    return res.status(500).json({ success: 1, data: null, error: assignhomeworkErr, msg: "assign homework data update failed" });
                }
                return res.status(200).json({ success: 0, data: { assignhomework: assignhomeworkResult }, error: null, msg: "Data updated successfully" });
            });
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditAssignHomeWork = (req, res) => {
    try {
        const sql = `
            SELECT 
                ah.*, 
                b.name AS branch_name,
                bo.board AS board_name,
                me.medium AS medium_name,
                st.standard AS standard_name,
                sub.subject AS subject_name,
                bat.name AS batch_name,
                GROUP_CONCAT(s.name) AS student_names
            FROM 
                assign_homework ah
                LEFT JOIN branch b ON ah.id_branch = b.id
                LEFT JOIN board bo ON ah.id_board = bo.id
                LEFT JOIN medium me ON ah.id_medium = me.id
                LEFT JOIN standard st ON ah.id_standard = st.id
                LEFT JOIN subject sub ON ah.id_subject = sub.id
                LEFT JOIN batch bat ON ah.id_batch = bat.id
                LEFT JOIN student s ON FIND_IN_SET(s.id, ah.id_student)
            WHERE 
                ah.id = ?
            GROUP BY 
                ah.id
        `;
        const id = req.params.id;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying assign homework by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteAssignHomeWork = (req, res) => {
    try {
        const id = req.params.id;
        const deleteStatusHomeworkSQL = 'DELETE FROM status_homework WHERE id = ?';
        const deleteFilesSQL = 'SELECT files FROM assign_homework WHERE id = ?';
        const deleteAssignHomeworkSQL = 'DELETE FROM assign_homework WHERE id = ?';

        db.query(deleteStatusHomeworkSQL, [id], (err, resultStatus) => {
            if (err) {
                console.error('Error deleting status homework', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            db.query(deleteFilesSQL, [id], (err, resultStatusFile) => {
                if (err) {
                    console.error('Error deleting status homework', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
                }
                if (resultStatusFile.length > 0) {
                    const photoFilename = resultStatusFile[0].files;
                    if (photoFilename) {
                        const photoPath = `./uploads/${photoFilename}`;
                        fs.unlink(photoPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting photo image:', unlinkErr);
                            }

                            // Continue with the deletion of assign_homework record
                            db.query(deleteAssignHomeworkSQL, [id], (err, resultAssign) => {
                                if (err) {
                                    console.error('Error deleting assign homework', err);
                                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
                                }

                                // Send the final response
                                return res.status(200).json({
                                    success: 0,
                                    statusHomeworkResult: resultStatus,
                                    fileResult: resultStatusFile,
                                    assignHomeworkResult: resultAssign,
                                    error: null,
                                    Message: 'User deleted successfully'
                                });
                            });
                        });
                    }
                } else {
                    db.query(deleteAssignHomeworkSQL, [id], (err, resultAssign) => {
                        if (err) {
                            console.error('Error deleting assign homework', err);
                            return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
                        }

                        // Send the final response
                        return res.status(200).json({
                            success: 0,
                            statusHomeworkResult: resultStatus,
                            fileResult: resultStatusFile,
                            assignHomeworkResult: resultAssign,
                            error: null,
                            Message: 'User deleted successfully'
                        });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getAssignHomeWorkbyBrBoMdStBt = ((req, res) => {
    try {
        const sql = `
            SELECT 
                A.*, 
                B.name AS branch_name,
                Bo.board AS board_name,
                M.medium AS medium_name,
                St.standard AS standard_name,
                Ba.name AS batch_name,
                GROUP_CONCAT(S.student_name) AS student_names
            FROM 
                assign_homework A 
                INNER JOIN branch B ON A.id_branch = B.id
                INNER JOIN board Bo ON A.id_board = Bo.id
                INNER JOIN medium M ON A.id_medium = M.id
                INNER JOIN standard St ON A.id_standard = St.id
                INNER JOIN batch Ba ON A.id_batch = Ba.id
                LEFT JOIN (
                    SELECT id, name AS student_name
                    FROM student
                ) AS S ON FIND_IN_SET(S.id, A.id_student)
            WHERE 
                A.id_branch = ? 
                AND A.id_board = ? 
                AND A.id_medium = ? 
                AND A.id_standard = ? 
                AND A.id_batch = ?
            GROUP BY A.id
        `;

        db.query(sql, [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});


//              Status Homework
const getStatusHomework = (req, res) => {
    try {
        const sql = `
            SELECT 
            ah.*, 
            sh.*,
            s.subject AS subject_name,
            b.name AS branch_name,
            bo.board AS board_name,
            m.medium AS medium_name,
            st.standard AS standard_name,
            ba.name AS batch_name,
            GROUP_CONCAT(DISTINCT ast.name) AS student_names,
            GROUP_CONCAT(DISTINCT ds.name) AS done_names,
            COUNT(ds.id) AS done_count,
            GROUP_CONCAT(DISTINCT nds.name) AS not_done_names,
            COUNT(nds.id) AS not_done_count
        FROM 
            assign_homework AS ah
        INNER JOIN status_homework AS sh ON ah.id_subject = sh.id_subject AND ah.date = sh.date AND ah.id = sh.id
        INNER JOIN subject AS s ON ah.id_subject = s.id
        INNER JOIN branch AS b ON ah.id_branch = b.id
        INNER JOIN board AS bo ON ah.id_board = bo.id
        INNER JOIN medium AS m ON ah.id_medium = m.id
        INNER JOIN standard AS st ON ah.id_standard = st.id
        INNER JOIN batch AS ba ON ah.id_batch = ba.id
        LEFT JOIN 
            student ast ON FIND_IN_SET(ast.id, ah.id_student)
        LEFT JOIN 
            student ds ON FIND_IN_SET(ds.id, sh.done)
        LEFT JOIN 
            student nds ON FIND_IN_SET(nds.id, sh.not_done)
        GROUP BY ah.id ORDER BY ah.id DESC`;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in status homework query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            result.forEach(item => {
                if (item.not_done_names === null) {
                    item.not_done_names = "";
                }
                if (item.done_names === null) {
                    item.done_names = "";
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getStatusHomeworkStudent = (req, res) => {
    try {
        const { id_student } = req.params; // Extract the student ID from the request params
        let sql = `
        SELECT 
            ah.*, 
            sh.*,
            s.subject AS subject_name,
            b.name AS branch_name,
            bo.board AS board_name,
            m.medium AS medium_name,
            st.standard AS standard_name,
            ba.name AS batch_name,
            GROUP_CONCAT(DISTINCT ast.name) AS student_names,
            GROUP_CONCAT(DISTINCT ds.name) AS done_names,
            COUNT(ds.id) AS done_count,
            GROUP_CONCAT(DISTINCT nds.name) AS not_done_names,
            COUNT(nds.id) AS not_done_count
        FROM 
            assign_homework AS ah
        INNER JOIN status_homework AS sh ON ah.id_subject = sh.id_subject AND ah.date = sh.date AND ah.id = sh.id
        INNER JOIN subject AS s ON ah.id_subject = s.id
        INNER JOIN branch AS b ON ah.id_branch = b.id
        INNER JOIN board AS bo ON ah.id_board = bo.id
        INNER JOIN medium AS m ON ah.id_medium = m.id
        INNER JOIN standard AS st ON ah.id_standard = st.id
        INNER JOIN batch AS ba ON ah.id_batch = ba.id
        LEFT JOIN 
            student ast ON FIND_IN_SET(ast.id, ah.id_student)
        LEFT JOIN 
            student ds ON FIND_IN_SET(ds.id, sh.done)
        LEFT JOIN 
            student nds ON FIND_IN_SET(nds.id, sh.not_done)`;

        // Constructing the WHERE clause based on the conditions
        let whereClause = "";
        let queryParams = [];

        if (id_student) {
            whereClause += `(ds.id = ? OR nds.id = ?)`;
            queryParams.push(id_student, id_student);
        }

        if (req.query.id_subject) {
            if (whereClause !== "") {
                whereClause += ` AND ah.id_subject = ?`;
            } else {
                whereClause += `ah.id_subject = ?`;
            }
            queryParams.push(req.query.id_subject);
        }

        if (whereClause !== "") {
            sql += ` WHERE ${whereClause}`;
        }

        sql += `
            GROUP BY ah.id, s.subject ORDER BY ah.id DESC`; // Group by subject

        db.query(sql, queryParams, (err, result) => {
            if (err) {
                console.error('Error in status homework query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            result.forEach(item => {
                if (item.not_done_names === null) {
                    item.not_done_names = "";
                } else if (item.done_names === null) {
                    item.done_names = "";
                }
            });

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
//   create Status Homework
// const createStatusHomework = (req, res) => {
//     try {
//         const sql = 'INSERT INTO status_homework (`done`, `id_subject`) VALUES (?, ?)';

//         function my_implode_js(separator, array) {
//             if (Array.isArray(array) && array.length > 0) {
//                 return array.join(separator);
//             } else {
//                 return "";
//             }
//         }

//         const done = my_implode_js(",", req.body.done);
//         const id_subject = req.body.id_subject;

//         const values = [
//             done,
//             id_subject,
//         ];

//         db.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error('Error creating status homework', err);
//                 return res.status(500).json({success: 1,data: null,error: err,msg: "Data insert Failed"});
//             }
//             return res.status(200).json({success: 0,data: result,error: null,msg: "Data insert Successfully"});
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({success: 1,data: null,error: error, msg: "Internal Server Error"});
//     }
// };

const editStatusHomework = (req, res) => {
    try {
        const sql = 'UPDATE status_homework SET `done`=?, `not_done`=? WHERE  id=?'
        const id = req.params.id;
        function my_implode_js(separator, array) {
            if (Array.isArray(array) && array.length > 0) {
                return array.join(separator);
            } else {
                return "";
            }
        }
        const done = my_implode_js(",", req.body.done);
        const not_done = my_implode_js(",", req.body.not_done);
        db.query(sql, [done, not_done, id], (err, result) => {
            if (err) {
                console.error('Error updating status homework', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Update Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Update Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getStatusHomeworkById = (req, res) => {
    try {
        const sql = `
            SELECT 
                sh.*, 
                sub.subject AS subject_name,
                GROUP_CONCAT(ds.name) AS done_names,
                GROUP_CONCAT(nds.name) AS not_done_names 
            FROM 
                status_homework sh
            LEFT JOIN 
                subject sub ON sh.id_subject = sub.id
            LEFT JOIN 
                student ds ON FIND_IN_SET(ds.id, sh.done)
            LEFT JOIN 
                student nds ON FIND_IN_SET(nds.id, sh.not_done)
            WHERE 
                sh.id = ? 
            GROUP BY 
                sh.id`;

        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying status homework by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteStatusHomework = (req, res) => {
    try {
        const sql = 'DELETE FROM status_homework WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting status homework', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getHomeworkbybrbomdstsubbt = (req, res) => {
    try {
        const queryParams = [
            req.query.id_branch,
            req.query.id_board,
            req.query.id_medium,
            req.query.id_standard,
            req.query.id_subject,
            req.query.id_batch
        ];
        const sql = `
        SELECT 
            c.*, n.*, 
            b.name AS branch_name, 
            bo.board AS board_name, 
            me.medium AS medium_name, 
            st.standard AS standard_name,
            sub.subject AS subject_name,
            bt.name AS batch_name,
            GROUP_CONCAT(S.student_name) AS done_names,
            GROUP_CONCAT(SN.student_name) AS not_done_names
        FROM 
        status_homework n
        JOIN assign_homework c  ON c.id = n.id
        LEFT JOIN branch b ON c.id_branch = b.id 
        LEFT JOIN board bo ON c.id_board = bo.id 
        LEFT JOIN medium me ON c.id_medium = me.id 
        LEFT JOIN standard st ON c.id_standard = st.id 
        LEFT JOIN subject sub ON c.id_subject = sub.id
        LEFT JOIN batch bt ON c.id_batch = bt.id 
        LEFT JOIN (
            SELECT id, name AS student_name
            FROM student
        ) AS S ON FIND_IN_SET(S.id, n.done)
        LEFT JOIN (
            SELECT id, name AS student_name
            FROM student
        ) AS SN ON FIND_IN_SET(SN.id, n.not_done)
        WHERE 
            c.id_branch = ? 
            AND c.id_board = ? 
            AND c.id_medium = ? 
            AND c.id_standard = ? 
            AND c.id_subject = ? 
            AND c.id_batch = ?
        GROUP BY 
            n.id
    `;
        db.query(sql, queryParams, (err, result) => {
            if (err) {
                console.error('Error in getting homework:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Failed to get data" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data retrieved successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getHomeworkStatus = (req, res) => {
    try {
        const studentId = req.params.studentId;
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

        const sql = `
      SELECT
          id_subject,
          MONTH(date) as month,
          CASE 
              WHEN WEEK(date, 1) > 4 THEN 4
              ELSE WEEK(date, 1)
          END as week,
          COUNT(*) as notDoneCount,
          SUM(CASE WHEN FIND_IN_SET('${studentId}', not_done) THEN 1 ELSE 0 END) as monthlyTotalNotDone
      FROM
          status_homework
      WHERE
          date BETWEEN ? AND ? AND (FIND_IN_SET('${studentId}', not_done))
      GROUP BY
          id_subject, month, week
      ORDER BY
          month, week;
  `;

        db.query(sql, [startOfYear, endOfYear, studentId], (err, result) => {
            if (err) {
                console.error("Error in not_done homework status query:", err);
                return res
                    .status(500)
                    .json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            return res
                .status(200)
                .json({
                    success: 0,
                    data: result,
                    error: null,
                    msg: "Data Get Successfully",
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


//         Add Exam 
const getAddExam = (req, res) => {
    try {
        const sql = `
            SELECT 
                ae.*, 
                b.name AS branch_name,
                bo.board AS board_name,
                me.medium AS medium_name,
                st.standard AS standard_name,
                sub.subject AS subject_name,
                GROUP_CONCAT(STU.name) AS student_names,
                bat.name AS batch_name
            FROM 
                add_exam ae
                LEFT JOIN branch b ON ae.id_branch = b.id
                LEFT JOIN board bo ON ae.id_board = bo.id
                LEFT JOIN medium me ON ae.id_medium = me.id
                LEFT JOIN standard st ON ae.id_standard = st.id
                LEFT JOIN subject sub ON ae.id_subject = sub.id
                LEFT JOIN student STU ON FIND_IN_SET(STU.id, ae.id_student)
                LEFT JOIN batch bat ON ae.id_batch = bat.id
            GROUP BY 
                ae.id
            ORDER BY id DESC
        `;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in Add Exam query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createAddExam = (req, res) => {
    try {

        const requiredFields = ['date', 'id_branch', 'id_board', 'id_medium', 'id_standard', 'id_subject', 'id_batch', 'title', 'description', 'total_marks']
        const namerequiredFields = ['Date', 'Branch', 'Board', 'Medium', 'Standard', 'Subject', 'Batch', 'Title', 'Description', 'Total Marks']
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

        const idBatch = req.body.id_batch;
        const batchSql = 'SELECT id FROM student WHERE id_batch = ?';
        db.query(batchSql, [idBatch], (batchErr, batchResult) => {
            if (batchErr) {
                console.error('Error fetching data from batch table', batchErr);
                return res.status(500).json({ success: 1, data: null, error: batchErr, msg: "Data fetch failed" });
            }

            // Extract id_student values from the batchResult
            const idStudents = batchResult.map(row => row.id).join(',');;
            const examSql = 'INSERT INTO add_exam (`date`,`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_batch`, `id_subject`, `title`, `description`,`total_marks`, `files`,`id_student`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const examvalues = [
                req.body.date,
                req.body.id_branch,
                req.body.id_board,
                req.body.id_medium,
                req.body.id_standard,
                req.body.id_batch,
                req.body.id_subject,
                req.body.title,
                req.body.description,
                req.body.total_marks,
                req.file.filename,
                idStudents
            ];

            db.query(examSql, examvalues, (examErr, examResult) => {
                if (examErr) {
                    console.error('Error creating add_exam', examErr);
                    return res.status(500).json({ success: 0, data: null, error: examErr, msg: "Data insert Failed" });
                }

                const examInsertId = examResult.insertId;
                const examattendanceSql = 'INSERT INTO exam_attendance (`id`, `date`, `present`) VALUES (?, ?, ?)';

                const present = req.body.id_student;

                const examAttendanceValues = [
                    examInsertId,
                    req.body.date,
                    present
                ];

                db.query(examattendanceSql, examAttendanceValues, (attendanceErr, attendanceResult) => {
                    if (attendanceErr) {
                        console.error('Error creating exam attendance', attendanceErr);
                        return res.status(500).json({ success: 0, data: null, error: attendanceErr, msg: "Exam attendance insert Failed" });
                    }
                    return res.status(200).json({ success: 1, data: { examInsertId, examAttendanceInsertId: attendanceResult.insertId }, error: null, msg: "Data insert Successfully" });
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
// const editAddExamOld = (req, res) => {
//     try {
//         const sql = 'UPDATE add_exam SET `date`=?,`id_subject`=?, `title`=?, `description`=?,`total_marks`=? WHERE  id=?'
//         const id = req.params.id;
//         db.query(sql, [req.body.date,
//         req.body.id_subject,
//         req.body.title,
//         req.body.description,
//         req.body.total_marks, id], (err, result) => {
//             if (err) {
//                 console.error('Error updating Add Exam', err);
//                 return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
//             }
//             return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
//     }
// };
const editAddExam = (req, res) => {
    try {
        const { id } = req.params;
        const { date, id_subject, title, description, total_marks } = req.body;

        const updateFields = [];
        const examValues = [];

        const fields = ['date', 'id_subject', 'title', 'description', 'total_marks']

        fields.forEach(field => {
            if (req.body[field]) {
                updateFields.push(`\`${field}\`=?`);
                examValues.push(req.body[field])
            }
        })

        const files = req.file ? req.file.filename : null;
        if (req.file) {
            updateFields.push('files=?');
            examValues.push(files)
        }
        if (updateFields.length === 0) {
            return res.status(400).json({ success: 1, data: null, error: null, msg: "No data provided for update" });
        }

        const examSql = `UPDATE add_exam SET ${updateFields.join(', ')} WHERE id=?`;
        examValues.push(id);

        const getPhotoSql = 'SELECT files FROM add_exam WHERE id = ?';


        if (files) {
            db.query(getPhotoSql, [id], (getPhotoErr, getPhotoResult) => {
                if (getPhotoErr) {
                    console.error('Error getting current files filename:', getPhotoErr);
                    return res.status(500).json({ success: 1, data: null, error: getPhotoErr, msg: "Error getting current photo filename" });
                }
                db.query(examSql, examValues, (examErr, examResult) => {
                    if (examErr) {
                        console.error('Error updating Exam', examErr);
                        return res.status(500).json({ success: 1, data: null, error: examErr, msg: "Student data update failed" });
                    }

                    const oldPhotoFilename = getPhotoResult[0].files;
                    if (oldPhotoFilename && fs.existsSync(`./uploads/${oldPhotoFilename}`)) {
                        fs.unlinkSync(`./uploads/${oldPhotoFilename}`);
                    }
                    return res.status(200).json({ success: 0, data: { exam: examResult }, error: null, msg: "Data updated successfully" });
                });
            });
        } else {
            db.query(examSql, examValues, (examErr, examResult) => {
                if (examErr) {
                    console.error('Error updating exam', examErr);
                    return res.status(500).json({ success: 1, data: null, error: examErr, msg: "Student data update failed" });
                }
                return res.status(200).json({ success: 0, data: { exam: examResult }, error: null, msg: "Data updated successfully" });
            });
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditAddExam = (req, res) => {
    try {
        const sql = `
            SELECT 
                ae.*, 
                b.name AS branch_name,
                bo.board AS board_name,
                me.medium AS medium_name,
                st.standard AS standard_name,
                sub.subject AS subject_name,
                bat.name AS batch_name,
                GROUP_CONCAT(S.student_name) AS student_names
            FROM 
                add_exam ae
                LEFT JOIN branch b ON ae.id_branch = b.id
                LEFT JOIN board bo ON ae.id_board = bo.id
                LEFT JOIN medium me ON ae.id_medium = me.id
                LEFT JOIN standard st ON ae.id_standard = st.id
                LEFT JOIN subject sub ON ae.id_subject = sub.id
                LEFT JOIN batch bat ON ae.id_batch = bat.id
                LEFT JOIN (
                    SELECT id, name AS student_name
                    FROM student
                ) AS S ON FIND_IN_SET(S.id, ae.id_student)
            WHERE
                ae.id = ?
        `;

        const id = req.params.id;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying Add Exam by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteAddExam = (req, res) => {
    try {
        const id = req.params.id;
        const deleteExamAttendanceSQL = 'DELETE FROM exam_attendance WHERE id =?';
        const deleteFilesSQL = 'SELECT files FROM add_exam WHERE id = ?';
        const deleteAssignHomeworkSQL = 'DELETE FROM add_exam WHERE id =?';

        db.query(deleteExamAttendanceSQL, [id], (err, resultStatus) => {
            if (err) {
                console.error('Error deleting exam attendance', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            db.query(deleteFilesSQL, [id], (err, resultStatusFile) => {
                if (err) {
                    console.error('Error deleting exam attendance', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
                }
                if (resultStatusFile.length > 0) {
                    const photoFilename = resultStatusFile[0].files;
                    if (photoFilename) {
                        const photoPath = `./uploads/${photoFilename}`;
                        fs.unlink(photoPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting photo image:', unlinkErr);
                            }
                            // Continue with the deletion of add_exam record
                            db.query(deleteAssignHomeworkSQL, [id], (err, resultAssign) => {
                                if (err) {
                                    console.error('Error deleting exam', err);
                                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
                                }

                                // Send the final response
                                return res.status(200).json({
                                    success: 0,
                                    statusHomeworkResult: resultStatus,
                                    fileResult: resultStatusFile,
                                    assignHomeworkResult: resultAssign,
                                    error: null,
                                    Message: 'User deleted successfully'
                                });
                            });
                        });
                    }
                    //  else {
                    //     // Continue with the deletion of add_exam record if no files
                    //     db.query(deleteAssignHomeworkSQL, [id], (err, resultAssign) => {
                    //         if (err) {
                    //             console.error('Error deleting assign homework', err);
                    //             return res.status(500).json({ Message: 'Internal Server Error' });
                    //         }

                    //         // Send the final response
                    //         return res.status(200).json({
                    //             statusHomeworkResult: resultStatus,
                    //             fileResult: resultStatusFile,
                    //             assignHomeworkResult: resultAssign,
                    //             Message: 'User deleted successfully'
                    //         });
                    //     });
                    // }
                } else {
                    // Log a message and proceed with the deletion of add_exam record
                    console.error('No matching records found for deleteFilesSQL');

                    // Continue with the deletion of add_exam record
                    db.query(deleteAssignHomeworkSQL, [id], (err, resultAssign) => {
                        if (err) {
                            console.error('Error deleting exam', err);
                            return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
                        }

                        // Send the final response
                        return res.status(200).json({
                            success: 0,
                            statusHomeworkResult: resultStatus,
                            fileResult: resultStatusFile,
                            assignHomeworkResult: resultAssign,
                            error: null,
                            Message: 'User deleted successfully'
                        });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExambyBrBoMdStSub = ((req, res) => {
    try {
        const sql = `
        SELECT A.*, 
        B.name AS branch, 
        BO.board AS board, 
        M.medium AS medium, 
        S.standard AS standard, 
        SB.subject AS subject,
        GROUP_CONCAT(ST.name) AS student_names,
        BT.name AS batch FROM add_exam A  LEFT JOIN branch B ON A.id_branch = B.id
        LEFT JOIN board BO ON A.id_board = BO.id
        LEFT JOIN medium M ON A.id_medium = M.id
        LEFT JOIN standard S ON A.id_standard = S.id
        LEFT JOIN subject SB ON A.id_subject = SB.id
        LEFT JOIN student ST ON FIND_IN_SET(ST.id, A.id_student)
        LEFT JOIN batch BT ON A.id_batch = BT.id 
        WHERE 
            A.date = ? AND A.id_branch = ? AND A.id_board = ? AND A.id_medium = ? AND A.id_standard = ? AND A.id_subject = ? AND A.id_batch = ?`;
        db.query(sql, [req.query.date, req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_subject, req.query.id_batch], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});
const getExambyBranchbordmediumstsub = ((req, res) => {
    try {
        const sql = `
            SELECT 
                A.*, 
                B.name AS branch_name, 
                BO.board AS board_name, 
                M.medium AS medium_name, 
                S.standard AS standard_name, 
                SB.subject AS subject_name,
                GROUP_CONCAT(ST.name) AS student_names,
                BT.name AS batch_name
            FROM 
                add_exam A
            LEFT JOIN branch B ON A.id_branch = B.id
            LEFT JOIN board BO ON A.id_board = BO.id
            LEFT JOIN medium M ON A.id_medium = M.id
            LEFT JOIN standard S ON A.id_standard = S.id
            LEFT JOIN subject SB ON A.id_subject = SB.id
            LEFT JOIN student ST ON FIND_IN_SET(ST.id, A.id_student)
            LEFT JOIN batch BT ON A.id_batch = BT.id
            WHERE 
                A.id_branch = ? 
                AND A.id_board = ? 
                AND A.id_medium = ? 
                AND A.id_standard = ? 
                AND A.id_subject = ?
            GROUP BY 
                A.id
        `;
        db.query(sql, [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_subject], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
});

//exam Attendance
// const createExamAttendance = (req, res) => {
//     try {
//         function my_implode_js(separator, array) {
//             if (Array.isArray(array) && array.length > 0) {
//                 return array.join(separator);
//             } else {
//                 return "";
//             }
//         }
//         const present = my_implode_js(",", req.body.present);

//         const sql = 'INSERT INTO exam_attendance (`date`, `present`) VALUES (?, ?)';
//         db.query(sql, [req.body.date, present], (err, result) => {
//             if (err) {
//                 console.error('Error creating Exam Attendance', err);
//                 return res.status(500).json({success: 1,data: null,error: err,msg: "Data Insert Failed"});
//             }
//             return res.status(200).json({success: 0,data: result,error: null,msg: "Data Insert Successfully"}); // 201 for successful creation
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({success: 1,data: null,error: error, msg: "Internal Server Error"});
//     }
// };
const getAttendanceHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN present = '' THEN 0 ELSE (LENGTH(present) - LENGTH(REPLACE(present, ',', '')) + 1) END), 0) AS total_present_count,
                COALESCE(SUM(CASE WHEN absent = '' THEN 0 ELSE (LENGTH(absent) - LENGTH(REPLACE(absent, ',', '')) + 1) END), 0) AS total_absent_count,
                COUNT(DISTINCT id_batch) AS total_batch_count
            FROM attendance
            WHERE date BETWEEN ? AND ?;
        `;

        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in attendance query:", err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getAttendanceHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN present = '' THEN 0 ELSE (LENGTH(present) - LENGTH(REPLACE(present, ',', '')) + 1) END), 0) AS total_present_count,
                COALESCE(SUM(CASE WHEN absent = '' THEN 0 ELSE (LENGTH(absent) - LENGTH(REPLACE(absent, ',', '')) + 1) END), 0) AS total_absent_count,
                COUNT(DISTINCT id_batch) AS total_batch_count
            FROM attendance
            WHERE date BETWEEN ? AND ? AND id_branch = ?;
        `;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                console.error("Error in attendance query:", err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getExamAttendanceHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN present IS NOT NULL THEN (LENGTH(present) - LENGTH(REPLACE(present, ',', '')) + 1) ELSE 0 END), 0) AS total_present_count,
                COALESCE(SUM(CASE WHEN absent IS NOT NULL THEN (LENGTH(absent) - LENGTH(REPLACE(absent, ',', '')) + 1) ELSE 0 END), 0) AS total_absent_count
            FROM exam_attendance
            WHERE date BETWEEN ? AND ?;
        `;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in attendance query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getExamAttendanceHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
        SELECT 
            COALESCE(SUM(CASE WHEN present IS NOT NULL THEN (LENGTH(present) - LENGTH(REPLACE(present, ',', '')) + 1) ELSE 0 END), 0) AS total_present_count,
            COALESCE(SUM(CASE WHEN absent IS NOT NULL THEN (LENGTH(absent) - LENGTH(REPLACE(absent, ',', '')) + 1) ELSE 0 END), 0) AS total_absent_count,
            add_exam.id_branch
        FROM 
            exam_attendance
        INNER JOIN 
            add_exam ON exam_attendance.id = add_exam.id
        WHERE 
            exam_attendance.date BETWEEN ? AND ? AND add_exam.id_branch = ?;
        `;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getExamHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT title) AS total_exam FROM add_exam WHERE date BETWEEN ? AND ?`;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in exam query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getExamHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT title) AS total_exam FROM add_exam WHERE date BETWEEN ? AND ? AND id_branch = ?; `;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getHomeworkHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT title) AS total_homework FROM assign_homework WHERE date BETWEEN ? AND ?`;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in homework query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getHomeworkHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT title) AS total_homework FROM assign_homework WHERE date BETWEEN ? AND ? AND id_branch = ?;`;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getHomeworkStatusHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN done IS NOT NULL THEN (LENGTH(done) - LENGTH(REPLACE(done, ',', '')) + 1) ELSE 0 END), 0) AS total_done_count,
                COALESCE(SUM(CASE WHEN not_done IS NOT NULL THEN (LENGTH(not_done) - LENGTH(REPLACE(not_done, ',', '')) + 1) ELSE 0 END), 0) AS total_not_done_count
            FROM status_homework
            WHERE date BETWEEN ? AND ?;
        `;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in attendance query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getHomeworkStatusHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
        SELECT 
            COALESCE(SUM(CASE WHEN done IS NOT NULL THEN (LENGTH(done) - LENGTH(REPLACE(done, ',', '')) + 1) ELSE 0 END), 0) AS total_done_count,
            COALESCE(SUM(CASE WHEN not_done IS NOT NULL THEN (LENGTH(not_done) - LENGTH(REPLACE(not_done, ',', '')) + 1) ELSE 0 END), 0) AS total_not_done_count
        FROM 
            status_homework
        INNER JOIN 
            assign_homework ON status_homework.id = assign_homework.id
        WHERE 
            status_homework.date BETWEEN ? AND ? AND assign_homework.id_branch = ?;
        `;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getInquiryHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT name) AS total_inquiry FROM inquiry WHERE inquiry_date BETWEEN ? AND ?`;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in inquiry query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getInquiryHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT name) AS total_inquiry FROM inquiry WHERE inquiry_date BETWEEN ? AND ? AND id_branch = ?;`;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getStudentHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT id) AS total_student FROM student WHERE del_stu <> 1 AND admission_date BETWEEN ? AND ?`;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in student query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getStudentHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT id) AS total_student FROM student WHERE del_stu <> 1 AND admission_date BETWEEN ? AND ? AND id_branch = ?;`;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getStaffHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT id) AS total_admin FROM admin WHERE date BETWEEN ? AND ?`;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in admin query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 1, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getStaffHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COUNT(DISTINCT id) AS total_admin FROM admin WHERE date BETWEEN ? AND ? AND id_branch = ?;`;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getIncomeHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                SUM(amount) AS total_amount
            FROM income
            WHERE created_on BETWEEN ? AND ?;
        `;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in income query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            // Since SUM() function returns null if no rows match, we handle it here
            const totalAmount = result[0].total_amount || 0;
            return res.status(200).json({ success: 1, data: { total_amount: totalAmount }, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getIncomeHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `SELECT COALESCE(SUM(amount), 0) AS total_amount FROM income WHERE created_on BETWEEN ? AND ? AND id_branch = ?;`;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                console.error("Error in fetching income:", err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getFeesHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                SUM(amount) AS total_amount
            FROM fees
            WHERE created_on BETWEEN ? AND ?;
        `;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in fees query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            // Since SUM() function returns null if no rows match, we handle it here
            const totalAmount = result[0].total_amount || 0;
            return res.status(200).json({ success: 1, data: { total_amount: totalAmount }, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getFeesHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }
        const sql = `
        SELECT COALESCE(SUM(amount), 0) AS total_amount 
        FROM fees 
        WHERE created_on BETWEEN ? AND ? 
        AND id_branch = ?;
        `;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result[0], error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getExpenseHome = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
            SELECT 
                SUM(amount) AS total_amount
            FROM expense
            WHERE created_on BETWEEN ? AND ?;
        `;
        db.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                console.error("Error in expense query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            // Since SUM() function returns null if no rows match, we handle it here
            const totalAmount = result[0].total_amount || 0;
            return res.status(200).json({ success: 1, data: { total_amount: totalAmount }, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error.message, msg: "Internal Server Error" });
    }
};
const getExpenseHomeBranch = (req, res) => {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let branchId = req.params.id_branch;

        if (!startDate || !endDate) {
            const today = new Date();
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else {
            startDate = formatDate(startDate);
            endDate = formatDate(endDate);
        }

        const sql = `
        SELECT 
        SUM(amount) AS total_amount
    FROM expense
    WHERE created_on BETWEEN ? AND ? AND id_branch = ?;
        `;

        db.query(sql, [startDate, endDate, branchId], (err, result) => {
            if (err) {
                console.error("Error in expense query:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data Get Failed" });
            }
            // Since SUM() function returns null if no rows match, we handle it here
            const totalAmount = result[0].total_amount || 0;
            return res.status(200).json({ success: 1, data: { total_amount: totalAmount }, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error.message, msg: "Internal Server Error" });
    }
};

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};



const editExamAttendance = (req, res) => {
    try {
        const sql = 'UPDATE exam_attendance SET `present`=?, `absent`=?, `noexam`=?, `holiday`=? WHERE  id=?'
        const id = req.params.id;
        function my_implode_js(separator, array) {
            if (Array.isArray(array) && array.length > 0) {
                return array.join(separator);
            } else {
                return "";
            }
        }
        const present = my_implode_js(",", req.body.present);
        const absent = my_implode_js(",", req.body.absent);
        const noexam = my_implode_js(",", req.body.noexam);
        const holiday = my_implode_js(",", req.body.holiday);
        db.query(sql, [present, absent, noexam, holiday, id], (err, result) => {
            if (err) {
                console.error('Error updating Exam Attendance', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExamAttendance = (req, res) => {
    try {
        const sql = `
            SELECT 
                ea.*, 
                ae.*, 
                b.name AS branch_name,
                bo.board AS board_name,
                m.medium AS medium_name,
                st.standard AS standard_name,
                sub.subject AS subject_name,
                bat.name AS batch_name,
                GROUP_CONCAT(sp.name) AS present_names,
                GROUP_CONCAT(sa.name) AS absent_names,
                GROUP_CONCAT(se.name) AS noexam_names,
                GROUP_CONCAT(sh.name) AS holiday_names,
                CASE 
                WHEN ea.present = '' THEN 0
                ELSE (LENGTH(ea.present) - LENGTH(REPLACE(ea.present, ',', '')) + 1) 
            END AS present_count ,
            CASE 
                WHEN ea.absent = '' THEN 0
                ELSE (LENGTH(ea.absent) - LENGTH(REPLACE(ea.absent, ',', '')) + 1) 
            END AS absent_count,
            CASE 
                WHEN ea.noexam = '' THEN 0
                ELSE (LENGTH(ea.noexam) - LENGTH(REPLACE(ea.noexam, ',', '')) + 1) 
            END AS noexam_count,
            CASE 
                WHEN ea.holiday = '' THEN 0
                ELSE (LENGTH(ea.holiday) - LENGTH(REPLACE(ea.holiday, ',', '')) + 1) 
            END AS holiday_count 
            FROM 
                exam_attendance ea
                INNER JOIN add_exam ae ON ea.id = ae.id
                LEFT JOIN branch b ON ae.id_branch = b.id
                LEFT JOIN board bo ON ae.id_board = bo.id
                LEFT JOIN medium m ON ae.id_medium = m.id
                LEFT JOIN standard st ON ae.id_standard = st.id
                LEFT JOIN subject sub ON ae.id_subject = sub.id
                LEFT JOIN batch bat ON ae.id_batch = bat.id
                LEFT JOIN student sp ON FIND_IN_SET(sp.id, ea.present)
                LEFT JOIN student sa ON FIND_IN_SET(sa.id, ea.absent)
                LEFT JOIN student se ON FIND_IN_SET(se.id, ea.noexam)
                LEFT JOIN student sh ON FIND_IN_SET(sh.id, ea.holiday)
            GROUP BY 
                ea.id
            ORDER BY ea.id DESC`; // Adjusted SQL query

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in Exam Attendance query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditExamAttendance = (req, res) => {
    try {
        const sql = `
            SELECT 
                ea.*, 
                GROUP_CONCAT(DISTINCT p.name ORDER BY FIND_IN_SET(p.id, ea.present)) AS present_names,
                GROUP_CONCAT(DISTINCT a2.name ORDER BY FIND_IN_SET(a2.id, ea.absent)) AS absent_names,
                GROUP_CONCAT(DISTINCT ne.name ORDER BY FIND_IN_SET(ne.id, ea.noexam)) AS noexam_names,
                GROUP_CONCAT(DISTINCT h.name ORDER BY FIND_IN_SET(h.id, ea.holiday)) AS holiday_names
            FROM 
                exam_attendance ea
                LEFT JOIN student p ON FIND_IN_SET(p.id, ea.present)
                LEFT JOIN student a2 ON FIND_IN_SET(a2.id, ea.absent)
                LEFT JOIN student ne ON FIND_IN_SET(ne.id, ea.noexam)
                LEFT JOIN student h ON FIND_IN_SET(h.id, ea.holiday)
            WHERE 
                ea.id = ?
            GROUP BY
                ea.id
        `;
        const id = req.params.id;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying Add Exam by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            result.forEach(item => {
                if (item.absent === null) {
                    item.absent = "";
                }
                if (item.noexam === null) {
                    item.noexam = "";
                }
                if (item.present_names === null) {
                    item.present_names = "";
                }
                if (item.absent_names === null) {
                    item.absent_names = ""
                }
                if (item.noexam_names === null) {
                    item.noexam_names = ""
                }
                if (item.holiday_names === null) {
                    item.holiday_names = ""
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteExamAttendance = (req, res) => {
    try {
        const sql = 'DELETE FROM exam_attendance WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting ExamAttendance', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExamAttendancebybrbomestbt = (req, res) => {
    try {
        const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch];
        const sql = `
            SELECT ea.*, ae.*,
            b.name AS branch_name,
            bo.board AS board_name, 
            me.medium AS medium_name, 
            st.standard AS standard_name, 
            sub.subject AS subject_name, 
            bt.name AS batch_name,
            GROUP_CONCAT(S.student_name) AS present_student,
            GROUP_CONCAT(abs.student_name) AS absent_student,
            GROUP_CONCAT(nem.student_name) AS noexam_student,
            GROUP_CONCAT(hol.student_name) AS holiday_student,
            CASE 
                WHEN ea.present = '' THEN 0
                ELSE (LENGTH(ea.present) - LENGTH(REPLACE(ea.present, ',', '')) + 1) 
            END AS present_count ,
            CASE 
                WHEN ea.absent = '' THEN 0
                ELSE (LENGTH(ea.absent) - LENGTH(REPLACE(ea.absent, ',', '')) + 1) 
            END AS absent_count,
            CASE 
                WHEN ea.noexam = '' THEN 0
                ELSE (LENGTH(ea.noexam) - LENGTH(REPLACE(ea.noexam, ',', '')) + 1) 
            END AS noexam_count,
            CASE 
                WHEN ea.holiday = '' THEN 0
                ELSE (LENGTH(ea.holiday) - LENGTH(REPLACE(ea.holiday, ',', '')) + 1) 
            END AS holiday_count  
            FROM exam_attendance AS ea
            INNER JOIN add_exam AS ae ON ea.id = ae.id
            LEFT JOIN branch b ON ae.id_branch = b.id 
            LEFT JOIN board bo ON ae.id_board = bo.id 
            LEFT JOIN medium me ON ae.id_medium = me.id 
            LEFT JOIN standard st ON ae.id_standard = st.id 
            LEFT JOIN subject sub ON ae.id_subject = sub.id 
            LEFT JOIN batch bt ON ae.id_batch = bt.id 
            LEFT JOIN (SELECT id, name AS student_name FROM student) AS S ON FIND_IN_SET(S.id, ea.present)
            LEFT JOIN (SELECT id, name AS student_name FROM student) AS abs ON FIND_IN_SET(abs.id, ea.absent)
            LEFT JOIN (SELECT id, name AS student_name FROM student) AS nem ON FIND_IN_SET(nem.id, ea.noexam)
            LEFT JOIN (SELECT id, name AS student_name FROM student) AS hol ON FIND_IN_SET(hol.id, ea.holiday)
            WHERE 
                ae.id_branch = ? 
                AND ae.id_board = ? 
                AND ae.id_medium = ? 
                AND ae.id_standard = ? 
                AND ae.id_batch = ?
            GROUP BY 
                ea.id
        `;
        db.query(sql, queryParams, (err, result) => {
            if (err) {
                console.error('Error in Exam Attendance query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//Exam Marks
const createExamMarks = (req, res) => {
    try {
        const requiredFields = ['id_exam', 'id_student', 'marks', 'remark'];
        const namerequiredFields = ['Exam', 'Student', 'Marks', 'Remark'];
        for (const item of req.body) {
            for (let i = 0; i < requiredFields.length; i++) {
                const field = requiredFields[i];
                if (!item[field]) {
                    const fieldName = namerequiredFields[i];
                    return res.status(200).json({ success: 1, data: null, error: null, msg: `${fieldName} is required` });
                }
            }
        }
        const marksData = req.body.map(({ id_exam, id_student, marks, remark }) => [
            id_exam,
            id_student,
            marks,
            remark
        ]);

        const checkIfExistsQuery = 'SELECT * FROM exam_marks WHERE id_exam = ? AND id_student = ?';
        const promises = req.body.map(({ id_exam, id_student }) => {
            return new Promise((resolve, reject) => {
                db.query(checkIfExistsQuery, [id_exam, id_student], (checkErr, checkResult) => {
                    if (checkErr) {
                        reject(checkErr);
                    } else {
                        resolve(checkResult);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(results => {
                const alreadyExists = results.some(result => result.length > 0);
                if (alreadyExists) {
                    return res.status(400).json({ success: 1, data: null, error: null, msg: 'Exam marks already exist' });
                } else {
                    const sql = 'INSERT INTO exam_marks (`id_exam`, `id_student`, `marks`, `remark`) VALUES ?';
                    db.query(sql, [marksData], (err, result) => {
                        if (err) {
                            console.error('Error creating Exam marks', err);
                            return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
                        }
                        return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
                    });
                }
            })
            .catch(error => {
                console.error('Error checking exam marks existence:', error);
                return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
            });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

const updateExamMarks = (req, res) => {
    try {
        const sql = 'UPDATE exam_marks SET `marks` = ?, `remark`=? WHERE id=?';
        const id = req.params.id;
        db.query(sql, [req.body.marks, req.body.remark, id], (err, result) => {
            if (err) {
                console.error('Error updating Exam marks:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });

        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExamMarks = (req, res) => {
    try {
        const sql = `
            SELECT em.id AS exam_marks_id, em.id_exam, em.id_student AS student_id, stud.contact_1 AS contact, stud.name AS student, em.marks, em.date AS datee, em.remark, ae.*
            FROM exam_marks em
            LEFT JOIN student stud ON em.id_student = stud.id
            JOIN add_exam ae ON em.id_exam = ae.id ORDER BY em.id DESC;
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in Exam Marks query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExamMarksPortfoliyo = (req, res) => {
    try {
        const studentId = req.params.id_student;
        const query = `
        SELECT 'monthly' AS type, 
            MONTH(MAX(ae.date)) AS month, 
            'weekly' AS week, 
            CASE 
                WHEN WEEK(MAX(ae.date)) <= 4 THEN WEEK(MAX(ae.date)) 
                ELSE 4 
            END AS week_number, 
            ae.total_marks AS total_marks,
            ae.title AS exam,
            ae.description AS syllabus,
            em.marks AS result,
            em.remark AS remark,
            ae.id_subject AS subject,
            MAX(ae.date) AS date
        FROM exam_marks em
        INNER JOIN add_exam ae ON em.id_exam = ae.id
        WHERE em.id_student = ${studentId}
        AND MONTH(ae.date) IN (1,2,3,4,5,6,7,8,9,10,11,12)  
        GROUP BY MONTH(ae.date), WEEK(ae.date), ae.title, ae.description, em.marks, em.remark, ae.id_subject;
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error in Exam Marks query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            // Group the data by month
            const monthlyData = {};
            results.forEach(item => {
                const { month, week, week_number, total_marks, exam, syllabus, result, remark, subject, date } = item;
                const monthKey = `month_${month}`;
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = [];
                }
                monthlyData[monthKey].push({ week, week_number, total_marks, exam, syllabus, result, remark, subject, date });
            });

            // Convert the object keys to array format
            const data = Object.keys(monthlyData).map(key => ({ [key]: monthlyData[key] }));

            return res.status(200).json({ success: 0, data: data, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditExamMarks = (req, res) => {
    try {
        const { id, id_student } = req.params;
        const sql = `
        SELECT 
            ae.title,
            ae.description,
            ae.total_marks,
            em.*,
            b.name AS student_name,
            ex.title AS exam_name,
            br.name AS branch_name,
            bo.board AS board_name,
            me.medium AS medium_name,
            sta.standard AS standard_name,
            bt.name AS batch_name,
            sub.subject AS subject_name
        FROM 
            add_exam AS ae
        JOIN exam_marks AS em ON ae.id = em.id_exam
        LEFT JOIN student AS b ON em.id_student = b.id 
        LEFT JOIN add_exam AS ex ON ae.id = ex.id
        LEFT JOIN branch AS br ON ae.id_branch = br.id
        LEFT JOIN board AS bo ON ae.id_board = bo.id
        LEFT JOIN medium AS me ON ae.id_medium = me.id
        LEFT JOIN standard AS sta ON ae.id_standard = sta.id
        LEFT JOIN batch AS bt ON ae.id_batch = bt.id
        LEFT JOIN subject AS sub ON ae.id_subject = sub.id
        WHERE 
            ae.id = ? AND em.id_student = ?
        `

        db.query(sql, [id, id_student], (err, result) => {
            if (err) {
                console.error('Error querying Exam Marks and Exam by Student ID and Marks:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExamMarksbyExamId = (req, res) => {
    try {
        const { id, id_student, marks } = req.params;

        const sql = `
        SELECT E.* ,
            ST.name AS student_name,
            EX.title AS exam_title
        FROM 
            exam_marks E
            INNER JOIN student ST on E.id_student = ST.id
            INNER JOIN add_exam EX on E.id_exam = EX.id
        WHERE id_exam = ?
      `;

        db.query(sql, [id, id_student, marks], (err, result) => {
            if (err) {
                console.error('Error querying Exam Marks and Exam by Student ID and Marks:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteExamMarks = (req, res) => {
    try {
        const sql = 'DELETE FROM exam_marks WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting Exam Marks ', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getExamMarksReport = (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
              SELECT
                  em.id,
                  em.id_exam,
                  em.id_student,
                  em.marks,
                  ae.date,
                  em.remark,
                  ae.title,
                  ae.description,
                  ae.total_marks,
                  b.title AS exam_name,
                  stu.name AS student_name
              FROM
                  exam_marks em
                JOIN add_exam ae ON em.id_exam = ae.id
                LEFT JOIN add_exam b ON em.id_exam = b.id 
                LEFT JOIN student stu ON em.id_student = stu.id
              WHERE
                  em.id_student = ?
          `;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Error querying Exam Marks and Exam by Student ID:", err);
                return res
                    .status(500)
                    .json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }

            // console.log("Query result:", result);

            return res
                .status(200)
                .json({
                    success: 0,
                    data: result,
                    error: null,
                    msg: "Data Get Successfully",
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
const getExamMarksbybrbomest = (req, res) => {
    try {
        const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch];

        const sql = `
            SELECT 
                c.id AS exam_marks_id, c.id_exam, stud.name AS student,c.id_student AS student_id, c.marks, c.date AS datee, c.remark, n.*,
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                st.standard AS standard_name,
                bt.name AS batch_name,
                sub.subject AS subject_name,
                stud.name AS student_name
            FROM exam_marks c 
            JOIN add_exam n ON c.id_exam = n.id
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN batch bt ON n.id_batch = bt.id 
            LEFT JOIN subject sub ON n.id_subject = sub.id
            LEFT JOIN student stud ON c.id_student = stud.id
            WHERE 
                n.id_branch = ? 
                AND n.id_board = ? 
                AND n.id_medium = ? 
                AND n.id_standard = ?
                AND n.id_batch = ?
        `;
        db.query(sql, queryParams, (err, result) => {
            if (err) {
                console.error('Error in Exam Marks query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//                PTM
const getPTM = (req, res) => {
    try {
        const sql = `
            SELECT 
                n.*, 
                br.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                st.standard AS standard_name, 
                bt.name AS batch_name,
                GROUP_CONCAT(s.name) AS student_names, 
                ad.name AS teacher_name
            FROM 
                ptm n
                LEFT JOIN branch br ON n.id_branch = br.id
                LEFT JOIN board bo ON n.id_board = bo.id
                LEFT JOIN medium me ON n.id_medium = me.id
                LEFT JOIN standard st ON n.id_standard = st.id
                LEFT JOIN batch bt ON n.id_batch = bt.id
                LEFT JOIN student s ON FIND_IN_SET(s.id, n.id_student)
                LEFT JOIN admin ad ON n.id_teachar = ad.id
            GROUP BY
                n.id
            ORDER BY id DESC
        `;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in PTM query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            result.forEach(item => {
                if (item.board_name === null) {
                    item.board_name = "";
                }
                if (item.medium_name === null) {
                    item.medium_name = "";
                }
                if (item.standard_name === null) {
                    item.standard_name = "";
                }
                if (item.batch_name === null) {
                    item.batch_name = ""
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
// const getPTMbybrbomest = (req, res) => {
//     try {
//         const sql = `
//         SELECT 
//             A.*, 
//             B.name AS branch_name,
//             Bo.board AS board_name,
//             M.medium AS medium_name,
//             St.standard AS standard_name,
//             Ba.name AS batch_name,
//             GROUP_CONCAT(S.student_name) AS student_names
//         FROM 
//             ptm A 
//             INNER JOIN branch B ON A.id_branch = B.id
//             INNER JOIN board Bo ON A.id_board = Bo.id
//             INNER JOIN medium M ON A.id_medium = M.id
//             INNER JOIN standard St ON A.id_standard = St.id
//             INNER JOIN batch Ba ON A.id_batch = Ba.id
//             LEFT JOIN (
//                 SELECT id, name AS student_name
//                 FROM student
//             ) AS S ON FIND_IN_SET(S.id, A.id_student)
//         WHERE 
//             A.id_branch = ? 
//             AND A.id_board = ? 
//             AND A.id_medium = ? 
//             AND A.id_standard = ? 
//             AND A.id_batch = ?
//         GROUP BY A.id
//     `;
//         const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch];
//         db.query(sql, queryParams, (err, result) => {
//             if (err) {
//                 console.error('Error in notice query:', err);
//                 return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
//             }
//             return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
//     }
// };
const getPTMbybrbomest = (req, res) => {
    try {
        let sql = `
        SELECT 
            A.*, 
            B.name AS branch_name,
            Bo.board AS board_name,
            M.medium AS medium_name,
            St.standard AS standard_name,
            Ba.name AS batch_name,
            GROUP_CONCAT(S.student_name) AS student_names
        FROM 
            ptm A 
            INNER JOIN branch B ON A.id_branch = B.id
            INNER JOIN board Bo ON A.id_board = Bo.id
            INNER JOIN medium M ON A.id_medium = M.id
            INNER JOIN standard St ON A.id_standard = St.id
            INNER JOIN batch Ba ON A.id_batch = Ba.id
            LEFT JOIN (
                SELECT id, name AS student_name
                FROM student
            ) AS S ON FIND_IN_SET(S.id, A.id_student)
        WHERE 
            A.id_branch = ?`;

        const queryParams = [req.query.id_branch];

        if (req.query.id_board) {
            sql += ` AND A.id_board = ?`;
            queryParams.push(req.query.id_board);
        }

        if (req.query.id_medium) {
            sql += ` AND A.id_medium = ?`;
            queryParams.push(req.query.id_medium);
        }

        if (req.query.id_standard) {
            sql += ` AND A.id_standard = ?`;
            queryParams.push(req.query.id_standard);
        }

        if (req.query.id_batch) {
            sql += ` AND A.id_batch = ?`;
            queryParams.push(req.query.id_batch);
        }

        sql += ` GROUP BY A.id`;

        db.query(sql, queryParams, (err, result) => {
            if (err) {
                console.error('Error in notice query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

const getPTMReport = (req, res) => {
    try {
        const id_student = req.params.id_student;

        const sql = `
                SELECT
                    ptm.id,
                    conclusion.id AS conclusion_id,
                    ptm.date AS meeting_date,
                    ptm.time,
                    ptm.title AS meeting_title,
                    ptm.id_teachar,
                    ptm.purpose AS meeting_purpose,
                    conclusion.remark,
                    CASE
                        WHEN FIND_IN_SET(?, conclusion.done) THEN 'Yes'
                        WHEN FIND_IN_SET(?, conclusion.pending) THEN 'No'
                        ELSE 'N/A'
                    END AS presence_parent
                FROM
                    ptm
                JOIN
                    conclusion ON ptm.id = conclusion.id
                WHERE
                    CONCAT(',', ptm.id_student, ',') LIKE CONCAT('%,', ?, ',%');
            `;
        db.query(sql, [id_student, id_student, id_student], (err, result) => {
            if (err) {
                console.error("Error fetching PTM report:", err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Failed to fetch PTM report" });
            }

            return res.status(200).json({ success: 1, data: result, error: null, msg: "PTM report fetched successfully" });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createPTM = (req, res) => {
    try {
        const requiredFields = ['title', 'date', 'time', 'id_branch', 'id_student', 'purpose', 'id_teachar'];
        const namerequiredFields = ['Title', 'Date', 'Time', 'Branch', 'Student', 'Purpose', 'Teachar'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!req.body[field]) {
                const fieldName = namerequiredFields[i];
                return res.status(400).json({ success: 1, data: null, error: null, msg: `${fieldName} is required` });
            }
        }

        // Check if id_student is provided as an array
        if (!Array.isArray(req.body.id_student) || req.body.id_student.length === 0) {
            return res.status(400).json({ success: 0, data: null, error: null, msg: "Student is required" });
        }
        function my_implode_js(separator, array) {
            if (Array.isArray(array) && array.length > 0) {
                return array.join(separator);
            } else {
                return "";
            }
        }
        const id_student = my_implode_js(",", req.body.id_student);
        const values = [
            req.body.title,
            req.body.date,
            req.body.time,
            req.body.id_branch,
            req.body.id_board,
            req.body.id_medium,
            req.body.id_batch,
            req.body.id_standard,
            id_student,
            req.body.purpose,
            req.body.id_teachar,
        ];
        const ptmSql = 'INSERT INTO ptm (`title`,`date`,`time`,`id_branch`, `id_board`,`id_medium`,`id_batch`,`id_standard`,`id_student`, `purpose`, `id_teachar`) VALUES (?)';
        db.query(ptmSql, [values], (dbErr, result) => {
            if (dbErr) {
                console.error('Error creating PTM', dbErr);
                return res.status(500).json({ success: 0, data: null, error: dbErr, msg: "Data insert Failed" });
            }

            const ptmInsertId = result.insertId;
            const done = id_student
            const conclusionSql = 'INSERT INTO conclusion (`id`, `done`,`conclusion`,`date`) VALUES (?, ?,?,?)';

            const conclusionValues = [
                ptmInsertId,
                done,
                req.body.purpose,
                req.body.date
            ];

            db.query(conclusionSql, conclusionValues, (conclusionErr, conclusionResult) => {
                if (conclusionErr) {
                    console.error('Error creating conclusion', conclusionErr);
                    return res.status(500).json({ success: 0, data: null, error: conclusionErr, msg: "Conclusion insert Failed" });
                }
                return res.status(200).json({ success: 1, data: { ptmInsertId, conclusionInsertId: conclusionResult.insertId }, error: null, msg: "Data insert Successfully" });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editPTM = (req, res) => {
    try {
        const sql = 'UPDATE ptm SET `title`=?, `date`=?, `time`=?, `purpose`=?,`id_teachar`=? WHERE  id=?'
        const id = req.params.id;

        db.query(sql, [req.body.title, req.body.date, req.body.time, req.body.purpose, req.body.id_teachar, id], (err, result) => {
            if (err) {
                console.error('Error updating pmt', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditPTM = (req, res) => {
    try {
        const sql = `
            SELECT 
                p.*, 
                branch.name AS branch_name, 
                board.board AS board_name,
                batch.name AS batch_name,
                medium.medium AS medium_name, 
                standard.standard AS standard_name,
                GROUP_CONCAT(s.name) AS student_names, 
                admin.name AS teacher_name
            FROM 
                ptm p
                LEFT JOIN branch ON p.id_branch = branch.id
                LEFT JOIN board ON p.id_board = board.id
                LEFT JOIN batch ON p.id_batch = batch.id
                LEFT JOIN medium ON p.id_medium = medium.id
                LEFT JOIN standard ON p.id_standard = standard.id
                LEFT JOIN student s ON FIND_IN_SET(s.id, p.id_student)
                LEFT JOIN admin ON p.id_teachar = admin.id
            WHERE 
                p.id = ?
            GROUP BY
                p.id
                ORDER BY id DESC
        `;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying PTM by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            result.forEach(item => {
                if (item.board_name === null) {
                    item.board_name = "";
                }
                if (item.medium_name === null) {
                    item.medium_name = "";
                }
                if (item.standard_name === null) {
                    item.standard_name = "";
                }
                if (item.batch_name === null) {
                    item.batch_name = ""
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deletePTM = (req, res) => {
    try {
        const id = req.params.id;
        const deleteConclusion = 'DELETE FROM conclusion WHERE id =?';
        const deletePTM = 'DELETE FROM ptm WHERE id =?';

        db.query(deleteConclusion, [id], (err, resultStatus) => {
            if (err) {
                console.error('Error deleting exam conclusion', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            db.query(deletePTM, [id], (err, resultAssign) => {
                if (err) {
                    console.error('Error deleting ptm', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
                }
                // Send the final response
                return res.status(200).json({
                    success: 0,
                    Conclusionstatus: resultStatus,
                    PTMstatus: resultAssign,
                    error: null,
                    Message: 'data deleted successfully'
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//                Conclusion
const getConclusion = (req, res) => {
    try {
        const sql = `
        SELECT 
        c.*, 
        p.*, 
        b.name AS branch_name,
        (CASE WHEN c.done THEN GROUP_CONCAT(DISTINCT ps.name) ELSE NULL END) AS done_names,
        (CASE WHEN c.pending THEN GROUP_CONCAT(DISTINCT asb.name) ELSE NULL END) AS pending_names,
        (CASE WHEN c.done THEN COUNT(DISTINCT ps.id) ELSE 0 END) AS done_count,
        (CASE WHEN c.pending THEN COUNT(DISTINCT asb.id) ELSE 0 END) AS pending_count
    FROM 
        conclusion c
    JOIN 
        ptm p ON c.id = p.id
    LEFT JOIN student ps ON FIND_IN_SET(ps.id, c.done)
    LEFT JOIN student asb ON FIND_IN_SET(asb.id, c.pending)
    LEFT JOIN branch b ON p.id_branch = b.id
    GROUP BY 
        c.id
    ORDER BY c.id DESC
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in getting conclusion:', err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Failed to get data" });
            }
            result.forEach(item => {
                if (item.done_names === null) {
                    item.done_names = "";
                }
                if (item.pending_names === null) {
                    item.pending_names = "";
                }
            });
            return res.status(200).json({ success: 1, data: result, error: null, msg: "Data retrieved successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getConclusionbybomestbt = (req, res) => {
    try {
        const queryParams = [req.query.id_branch, req.query.id_board, req.query.id_medium, req.query.id_standard, req.query.id_batch];
        // const sql = `
        //     SELECT 
        //         c.*,
        //         n.*, 
        //         b.name AS branch_name, 
        //         bo.board AS board_name, 
        //         me.medium AS medium_name, 
        //         st.standard AS standard_name,
        //         bt.name AS batch_name,
        //         GROUP_CONCAT(S.student_name) AS done_student,
        //         GROUP_CONCAT(pen.student_name) AS pending_student
        //     FROM conclusion c 
        //     JOIN ptm n ON c.id = n.id
        //     LEFT JOIN branch b ON n.id_branch = b.id 
        //     LEFT JOIN board bo ON n.id_board = bo.id 
        //     LEFT JOIN medium me ON n.id_medium = me.id 
        //     LEFT JOIN standard st ON n.id_standard = st.id 
        //     LEFT JOIN batch bt ON n.id_batch = bt.id 
        //     LEFT JOIN (SELECT id, name AS student_name FROM student) AS S ON FIND_IN_SET(S.id, c.done)
        //     LEFT JOIN (SELECT id, name AS student_name FROM student) AS pen ON FIND_IN_SET(pen.id, c.pending)
        //     WHERE 
        //         n.id_branch = ? 
        //         AND n.id_board = ? 
        //         AND n.id_medium = ? 
        //         AND n.id_standard = ? 
        //         AND n.id_batch = ?
        //     GROUP BY
        //         n.id
        //     ORDER BY n.id DESC
        // `;
        const sql = `
            SELECT 
                c.*,
                n.*, 
                b.name AS branch_name, 
                bo.board AS board_name, 
                me.medium AS medium_name, 
                st.standard AS standard_name,
                bt.name AS batch_name,
                (CASE WHEN c.done THEN GROUP_CONCAT(DISTINCT d.name) ELSE NULL END) AS done_names,
                (CASE WHEN c.pending THEN GROUP_CONCAT(DISTINCT p.name) ELSE NULL END) AS pending_names
            FROM conclusion c 
            JOIN ptm n ON c.id = n.id
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN batch bt ON n.id_batch = bt.id 
            LEFT JOIN student d ON FIND_IN_SET(d.id, c.done)
            LEFT JOIN student p ON FIND_IN_SET(p.id, c.pending)
            WHERE 
                n.id_branch = ? 
                AND n.id_board = ? 
                AND n.id_medium = ? 
                AND n.id_standard = ? 
                AND n.id_batch = ?
            GROUP BY
                n.id
            ORDER BY n.id DESC
        `;

        db.query(sql, queryParams, (err, result) => {
            if (err) {
                console.error('Error in getting conclusion:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Failed to get data" });
            }
            result.forEach(item => {
                if (item.board_name === null) {
                    item.board_name = "";
                }
                if (item.medium_name === null) {
                    item.medium_name = "";
                }
                if (item.standard_name === null) {
                    item.standard_name = "";
                }
                if (item.batch_name === null) {
                    item.batch_name = "";
                }
                if (item.pending_student === null) {
                    item.pending_student = "";
                }
                if (item.done_student === null) {
                    item.done_student = "";
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data retrieved successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
// const createConclusion = (req, res) => {
//     try {
//         function my_implode_js(separator, array) {
//             if (Array.isArray(array) && array.length > 0) {
//                 return array.join(separator);
//             } else {
//                 return "";
//             }
//         }

//         const done = my_implode_js(",", req.body.done);
//         const values = [done, req.body.conclusion];

//         const sql = 'INSERT INTO conclusion (`done`, `conclusion`) VALUES (?)';
//         db.query(sql, [values], (err, result) => {
//             if (err) {
//                 console.error('Error creating conclusion', err);
//                 return res.status(500).json({success: 1,data: null,error: err,msg: "Data insert Failed"});
//             }
//             return res.status(200).json({success: 0,data: result,error: null,msg: "Data insert Successfully"});
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({success: 1,data: null,error: error, msg: "Internal Server Error"});
//     }
// };
const editConclusion = (req, res) => {
    try {
        const sql = 'UPDATE conclusion SET `conclusion`=?, `done`=?, `pending`=?, `remark`=? WHERE  id=?'
        const id = req.params.id;
        function my_implode_js(separator, array) {
            if (Array.isArray(array) && array.length > 0) {
                return array.join(separator);
            } else {
                return "";
            }
        }
        const done = my_implode_js(",", req.body.done);
        const pending = my_implode_js(",", req.body.pending);

        db.query(sql, [req.body.conclusion, done, pending, req.body.remark, id], (err, result) => {
            if (err) {
                console.error('Error updating conclusion', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditConclusion = (req, res) => {
    try {
        const sql = `
        SELECT 
            n.*, c.done, c.pending,
            b.name AS branch_name, 
            bo.board AS board_name, 
            me.medium AS medium_name, 
            st.standard AS standard_name,
            bt.name AS batch_name,
            GROUP_CONCAT(DISTINCT S.student_name) AS done_student,
            GROUP_CONCAT(DISTINCT pen.student_name) AS pending_student,
            ad.name AS teacher_name,
            c.remark
        FROM 
            conclusion c 
            JOIN ptm n ON c.id = n.id
            LEFT JOIN branch b ON n.id_branch = b.id 
            LEFT JOIN board bo ON n.id_board = bo.id 
            LEFT JOIN medium me ON n.id_medium = me.id 
            LEFT JOIN standard st ON n.id_standard = st.id 
            LEFT JOIN batch bt ON n.id_batch = bt.id 
            LEFT JOIN (SELECT id, name AS student_name FROM student) AS S ON FIND_IN_SET(S.id, c.done)
            LEFT JOIN (SELECT id, name AS student_name FROM student) AS pen ON FIND_IN_SET(pen.id, c.pending)
            LEFT JOIN admin ad ON n.id_teachar = ad.id
        WHERE 
            n.id = ?
        GROUP BY
            n.id
        `;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying ptm by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            result.forEach(item => {
                if (item.board_name === null) {
                    item.board_name = "";
                }
                if (item.medium_name === null) {
                    item.medium_name = "";
                }
                if (item.standard_name === null) {
                    item.standard_name = "";
                }
                if (item.batch_name === null) {
                    item.batch_name = "";
                }
                if (item.pending_student === null) {
                    item.pending_student = "";
                }
                if (item.done_student === null) {
                    item.done_student = "";
                }
            });
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//          Gujarati report
const addGujaratiReport = (req, res) => {
    try {
        const insertStateQuery = `INSERT INTO  gujarati_report (id_student, recognition_alphabets, barakshari, simple_words, vovels, half_lettered, stops_reads, mouth_sore, hand_writing,reading, id_branch, id_batch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;
        let resultsArray = [];

        req.body.forEach(student => {
            db.query(insertStateQuery, [student.id_student, student.recognition_alphabets, student.barakshari, student.simple_words, student.vovels, student.half_lettered, student.stops_reads, student.mouth_sore, student.hand_writing, student.reading, student.id_branch, student.id_batch], (err, results) => {
                if (err) {
                    console.error('Error creating State:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
                }
                resultsArray.push(results);
            });
        });
        return res.status(200).json({ success: 0, data: resultsArray, error: null, msg: 'Data Inserted Successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const getAllGujaratiReport = (req, res) => {
    try {
        const sql = 'SELECT * FROM gujarati_report';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching gujarati_report:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getGujaratiReportById = (req, res) => {
    try {
        const sql = `SELECT er.*, b.name AS branch_name, bt.name AS batch_name ,st.name AS student_name FROM gujarati_report er
        LEFT JOIN branch b ON er.id_branch = b.id
        LEFT JOIN batch bt ON er.id_batch = bt.id
        LEFT JOIN student st ON er.id_student = st.id
        WHERE er.id_batch = ?`;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying gujarati_report by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const updateGujaratiReport = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        let successCount = 0;
        let errorOccurred = false;

        data.forEach(student => {
            const sql = 'UPDATE gujarati_report SET `recognition_alphabets`=?, `barakshari`=?, `simple_words`=?, `vovels`=?, `half_lettered`=?, `stops_reads`=?, `mouth_sore`=?, `hand_writing`=? WHERE id_batch = ? AND id_student = ?';
            const values = [
                student.recognition_alphabets, student.barakshari, student.simple_words, student.vovels, student.half_lettered, student.stops_reads, student.mouth_sore, student.hand_writing,
                id,
                student.id_student
            ];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error updating gujarati_report:', err);
                    errorOccurred = true;
                } else {
                    successCount++;
                }

                if (successCount === data.length) {
                    if (errorOccurred) {
                        res.status(500).json({ success: 1, data: null, error: 'Data Update Failed', msg: "Data Update Failed" });
                    } else {
                        res.status(200).json({ success: 0, data: result, error: null, msg: 'Gujarati_report updated successfully.' });
                    }
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteGujaratiReport = (req, res) => {
    try {
        const sql = 'DELETE FROM gujarati_report WHERE id_batch =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting gujarati_report:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//             englis report
const addEnglishReport = (req, res) => {
    try {
        const insertStateQuery = 'INSERT INTO english_report (`id_student`, `alphabets`, `basic_words`, `three_letter_words`, `a_sound`, `i_sound`, `e_sound`, `reading_pattern`, `hand_writing`, `capital_letter_problem`, `basic_words_spelling`, `id_branch`, `id_batch`) VALUES ?';
        let valuesArray = [];

        req.body.forEach(student => {
            const values = [student.id_student, student.alphabets, student.basic_words, student.three_letter_words, student.a_sound, student.i_sound, student.e_sound, student.reading_pattern, student.hand_writing, student.capital_letter_problem, student.basic_words_spelling, student.id_branch, student.id_batch];
            valuesArray.push(values);
        });

        db.query(insertStateQuery, [valuesArray], (err, results) => {
            if (err) {
                console.error('Error creating State:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
            }
            return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Inserted Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getAllEnglishReport = (req, res) => {
    try {
        const sql = 'SELECT * FROM english_report';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching english_report:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEnglishReportById = (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT er.*, b.name AS branch_name, bt.name AS batch_name ,st.name AS student_name
                     FROM english_report er
                     LEFT JOIN branch b ON er.id_branch = b.id
                     LEFT JOIN batch bt ON er.id_batch = bt.id
                     LEFT JOIN student st ON er.id_student = st.id
                     WHERE er.id_batch = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying english_report by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const updateEnglishReport = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        let successCount = 0;
        data.forEach(student => {
            const sql = `UPDATE english_report 
                         SET 
                            alphabets = ?,
                            basic_words = ?,
                            three_letter_words = ?,
                            a_sound = ?,
                            i_sound = ?,
                            e_sound = ?,
                            reading_pattern = ?,
                            hand_writing = ?,
                            capital_letter_problem = ?,
                            basic_words_spelling = ? 
                         WHERE 
                            id_batch = ? 
                            AND id_student = ?`;

            const values = [
                student.alphabets,
                student.basic_words,
                student.three_letter_words,
                student.a_sound,
                student.i_sound,
                student.e_sound,
                student.reading_pattern,
                student.hand_writing,
                student.capital_letter_problem,
                student.basic_words_spelling,
                id,
                student.id_student
            ];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error updating english_report:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Update Failed" });
                }
                successCount++;
                if (successCount === data.length) {
                    res.status(200).json({ success: 0, data: result, error: null, msg: 'English_report updated successfully.' });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteEnglishReport = (req, res) => {
    try {
        const sql = 'DELETE FROM english_report WHERE id_batch =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting english_report:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//      Maths report
const addMathsReport = (req, res) => {
    try {
        const insertStateQuery = 'INSERT INTO maths (`id_student`,`total_marks`,`marks`, `plus_s`, `minus_s`, `multiplied_by_s`, `divided_by_s`, `plus_p`, `minus_p`, `multiplied_by_p`, `divided_by_p`,`percent`, `two_root`, `three_root`, `ab_plus`, `ab_square`, `axbxc_plus`, `ab_bc_plus`, `simplification`, `tables`, `id_branch`, `id_batch`) VALUES ?';
        let valuesArray = [];

        req.body.forEach(student => {
            valuesArray.push([
                student.id_student,
                student.total_marks,
                student.marks,
                student.plus_s,
                student.minus_s,
                student.multiplied_by_s,
                student.divided_by_s,
                student.plus_p,
                student.minus_p,
                student.multiplied_by_p,
                student.divided_by_p,
                student.percent,
                student.two_root,
                student.three_root,
                student.ab_plus,
                student.ab_square,
                student.axbxc_plus,
                student.ab_bc_plus,
                student.simplification,
                student.tables,
                student.id_branch,
                student.id_batch
            ]);
        });

        db.query(insertStateQuery, [valuesArray], (err, results) => {
            if (err) {
                console.error('Error inserting Maths report:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Insertion Failed' });
            }
            return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Inserted Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const getAllMathsReport = (req, res) => {
    try {
        const sql = 'SELECT * FROM maths';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching maths:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getMathsReportById = (req, res) => {
    try {
        const sql = `SELECT er.*, b.name AS branch_name, bt.name AS batch_name ,st.name AS student_name FROM maths er
        LEFT JOIN branch b ON er.id_branch = b.id
        LEFT JOIN batch bt ON er.id_batch = bt.id
        LEFT JOIN student st ON er.id_student = st.id
        WHERE er.id_batch = ?`;
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying maths by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getMathsReportByIdStudent = (req, res) => {
    try {
        const sql = 'SELECT * FROM maths WHERE id_student = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying maths by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const updateMathsReport = (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        let successCount = 0;
        let errorOccurred = false;

        data.forEach(student => {
            const sql = 'UPDATE maths SET `total_marks`=?, `plus_s`=?, `minus_s`=?, `multiplied_by_s`=?, `divided_by_s`=?, `plus_p`=?, `minus_p`=?, `multiplied_by_p`=?, `divided_by_p`=?, `two_root`=?, `three_root`=?, `ab_plus`=?, `ab_square`=?, `axbxc_plus`=?, `ab_bc_plus`=?, `simplification`=?, `tables`=?, `marks`=? WHERE id_batch = ? AND id_student = ?';
            const values = [
                student.total_marks, student.plus_s, student.minus_s, student.multiplied_by_s, student.divided_by_s, student.plus_p, student.minus_p, student.multiplied_by_p, student.divided_by_p, student.two_root, student.three_root, student.ab_plus, student.ab_square, student.axbxc_plus, student.ab_bc_plus, student.simplification, student.tables, student.marks,
                id,
                student.id_student
            ];
            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error updating gujarati_report:', err);
                    errorOccurred = true;
                } else {
                    successCount++;
                }

                if (successCount === data.length) {
                    if (errorOccurred) {
                        res.status(500).json({ success: 1, data: null, error: 'Data Update Failed', msg: "Data Update Failed" });
                    } else {
                        res.status(200).json({ success: 0, data: result, error: null, msg: 'Maths_report updated successfully.' });
                    }
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteMathsReport = (req, res) => {
    try {
        const sql = 'DELETE FROM maths WHERE id_batch =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting maths:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

//       Welcome Test
const addWelcomeTest = (req, res) => {
    try {
        const { data, id_branch, id_board, id_medium, id_standard, id_batch } = req.body;

        const sql = 'INSERT INTO welcome_test (`id_student`,`date`,`total_marks`,`marks`,`add_s`,`add_p`, `sub_s`, `sub_p`, `mult_s`, `mult_p`, `div_s`, `div_p`, `gujarati_read`, `english_read`,`id_branch`,`id_board`,`id_medium`,`id_standard`,`id_batch`) VALUES ?';

        let valuesArray = data.map(student => [
            student.id_student,
            student.date,
            student.total_marks,
            student.marks,
            student.add_s,
            student.add_p,
            student.sub_s,
            student.sub_p,
            student.mult_s,
            student.mult_p,
            student.div_s,
            student.div_p,
            student.gujarati_read,
            student.english_read,
            id_branch,
            id_board,
            id_medium,
            id_standard,
            id_batch
        ]);

        db.query(sql, [valuesArray], (err, result) => {
            if (err) {
                console.error('Error creating reference', err);
                return res.status(500).json({ success: 0, data: null, error: err, msg: "Data insert Failed" });
            }
            const studentIds = data.map(student => student.id_student);
            const updateSql = 'UPDATE student SET welcome_status = 1 WHERE id IN (?)';

            db.query(updateSql, [studentIds], (updateErr, updateResult) => {
                if (updateErr) {
                    return res.status(500).json({ success: 0, data: null, error: updateErr, msg: "Failed to update welcome_status" });
                }

                return res.status(200).json({ success: 1, data: result, error: null, msg: "Data insert and welcome_status update Successfully" });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getWelcomeTest = (req, res) => {
    try {
        const sql = 'SELECT * FROM welcome_test';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in welcome_test query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditWelcomeTest = (req, res) => {
    try {
        const id = req.params.id;
        const sql = `
        SELECT 
            w.*,
            b.name AS branch_name,
            st.standard AS standard_name,
            bt.name AS batch_name,
            bo.board AS board_name,
            me.medium AS medium_name,
            stud.name AS student_name
        FROM 
            welcome_test w
            LEFT JOIN branch b ON w.id_branch = b.id 
            LEFT JOIN standard st ON w.id_standard = st.id
            LEFT JOIN batch bt ON w.id_batch = bt.id
            LEFT JOIN board bo ON w.id_board = bo.id
            LEFT JOIN medium me ON w.id_medium = me.id
            LEFT JOIN student stud ON w.id_student = stud.id
        WHERE 
            w.id_batch = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying welcome_test by ID:', err);
                return res.status(500).json({ success: false, data: null, error: err, msg: "Data retrieval failed" });
            }
            return res.status(200).json({ success: true, data: result, error: null, msg: "Data retrieved successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: false, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editWelcomeTest = (req, res) => {
    try {
        const data = req.body;
        const id_batch = req.params.id;
        let successCount = 0;
        data.forEach(student => {
            const sql = `UPDATE welcome_test 
                         SET 
                             date = ?,
                             total_marks = ?,
                             marks = ?,
                             add_s = ?,
                             add_p = ?,
                             sub_s = ?,
                             sub_p = ?,
                             mult_s = ?,
                             mult_p = ?,
                             div_s = ?,
                             div_p = ?,
                             gujarati_read = ?,
                             english_read = ?
                         WHERE id_batch = ? AND id_student = ?`;

            const values = [
                student.date,
                student.total_marks,
                student.marks,
                student.add_s,
                student.add_p,
                student.sub_s,
                student.sub_p,
                student.mult_s,
                student.mult_p,
                student.div_s,
                student.div_p,
                student.gujarati_read,
                student.english_read,
                id_batch,
                student.id_student
            ];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Error updating student data:", err);
                    return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
                }
                successCount++;
                if (successCount === data.length) {
                    res.status(200).json({ success: 0, data: result, error: null, msg: "Data update Successfully" });
                }
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteWelcomeTest = (req, res) => {
    try {
        const id = req.params.id;
        const selectSql = 'SELECT id_student FROM welcome_test WHERE id = ?';
        const deleteSql = 'DELETE FROM welcome_test WHERE id = ?';

        db.query(selectSql, [id], (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error selecting id_student:', selectErr);
                return res.status(500).json({ success: 1, data: null, error: selectErr, msg: "Failed to select id_student" });
            }
            db.query(deleteSql, [id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error('Error deleting welcome_test:', deleteErr);
                    return res.status(500).json({ success: 1, data: null, error: deleteErr, msg: "Data Delete Failed" });
                }
                const id_students = selectResult.map(row => row.id_student);

                const updateSql = 'UPDATE student SET welcome_status = 0 WHERE id IN (?)';

                db.query(updateSql, [id_students], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating welcome_status:', updateErr);
                        return res.status(500).json({ success: 1, data: null, error: updateErr, msg: "Failed to update welcome_status" });
                    }
                    return res.status(200).json({ success: 0, data: deleteResult, error: null, msg: "Data Delete and Student Update Successfully" });
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


module.exports = {

    //  structure api
    getBoardbybranch,
    getMediumbybranchBoard,
    getStandardbyBrBoMd,
    getBatchbyBrBoMdSt,


    //   Batch
    getBatch,
    getBatchByBrSt,
    createBatch,
    getBatchById,
    editBatch,
    deleteBatch,

    //   Branch
    getBranch,
    createBranch,
    editBranch,
    getBranchById,
    deleteBranch,

    //   StatusHomework
    getStatusHomework,
    getStatusHomeworkStudent,
    // createStatusHomework,
    editStatusHomework,
    getStatusHomeworkById,
    deleteStatusHomework,
    getHomeworkbybrbomdstsubbt,
    getHomeworkStatus,

    //   Student
    getStudent,
    createStudent,
    editStudent,
    getEditStudent,
    getStudentbyBrBoMdStBt,
    deleteStudent,

    //   delete student
    getApproval,
    getDeleted,
    deleteApproval,

    //   Inquiry
    getInquiry,
    getInquirybyBrBoMdStBt,
    createInquiry,
    editInquiry,
    getEditInquiry,
    deleteInquiry,
    getInquiryByBranch,

    //   Notice
    getNotice,
    createNotice,
    editNotice,
    getNoticeById,
    deleteNotice,
    getNoticebyBrBoMdStBt,
    getNoticebyStudent,

    //      stander
    getStanderdbyBranch,

    //   Attendance
    getAttendance,
    getWeeklyAttendance,
    createAttendance,
    editAttendance,
    getEditAttendance,
    deleteAttendance,

    //   Fees
    getFees,
    createFees,
    getFeesByAmount,
    getFeesByAllAmount,
    editFees,
    getFeesById,
    deleteFees,
    getFeesByBranch,
    getFeesByStudent,
    getFeesbyStudentTotal,

    //   Assign HomeWork
    getAssignHomeWork,
    createAssignHomeWork,
    editAssignHomeWork,
    getEditAssignHomeWork,
    deleteAssignHomeWork,
    getAssignHomeWorkbyBrBoMdStBt,

    //add exam
    getAddExam,
    createAddExam,
    editAddExam,
    getEditAddExam,
    deleteAddExam,
    getExambyBrBoMdStSub,
    getExambyBranchbordmediumstsub,

    //exam attendance
    // createExamAttendance,
    editExamAttendance,
    getExamAttendance,
    getEditExamAttendance,
    deleteExamAttendance,
    getExamAttendancebybrbomestbt,

    //dashbaord
    getAttendanceHome,
    getAttendanceByStudent,
    getAttendanceHomeBranch,
    getExamAttendanceHome,
    getExamAttendanceHomeBranch,
    getExamHome,
    getExamHomeBranch,
    getHomeworkHome,
    getHomeworkHomeBranch,
    getHomeworkStatusHome,
    getHomeworkStatusHomeBranch,
    getInquiryHome,
    getInquiryHomeBranch,
    getStudentHome,
    getStudentHomeBranch,
    getStaffHome,
    getStaffHomeBranch,
    getIncomeHome,
    getIncomeHomeBranch,
    getFeesHome,
    getFeesHomeBranch,
    getExpenseHome,
    getExpenseHomeBranch,

    //exam marks
    createExamMarks,
    updateExamMarks,
    getExamMarks,
    getExamMarksPortfoliyo,
    getEditExamMarks,
    getExamMarksbyExamId,
    deleteExamMarks,
    getExamMarksReport,
    getExamMarksbybrbomest,

    //  PTM
    getPTM,
    getPTMbybrbomest,
    getPTMReport,
    createPTM,
    getEditPTM,
    editPTM,
    deletePTM,

    // Conclusion
    getConclusion,
    getConclusionbybomestbt,
    // createConclusion,
    editConclusion,
    getEditConclusion,

    //gujarati reports
    addGujaratiReport,
    getAllGujaratiReport,
    getGujaratiReportById,
    updateGujaratiReport,
    deleteGujaratiReport,

    //english reports
    addEnglishReport,
    getAllEnglishReport,
    getEnglishReportById,
    updateEnglishReport,
    deleteEnglishReport,

    //maths reports
    addMathsReport,
    getAllMathsReport,
    getMathsReportByIdStudent,
    getMathsReportById,
    updateMathsReport,
    deleteMathsReport,
    addWelcomeTest,
    getWelcomeTest,
    getEditWelcomeTest,
    editWelcomeTest,
    deleteWelcomeTest,
}