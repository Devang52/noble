const db = require("../db/connection").db
const fs = require('fs');

//          Country
const country = (req, res) => {
    try {
        const countryName = req.body.country;

        const checkIfExistsQuery = 'SELECT * FROM country WHERE country = ?';
        db.query(checkIfExistsQuery, [countryName], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking country existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'Country already exists' });
            }
            const insertQuery = 'INSERT INTO country (`country`) VALUES (?)';
            db.query(insertQuery, [countryName], (err, result) => {
                if (err) {
                    console.error('Error creating country:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data insert Failed' });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data insert Successfully' });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const getAllCountries = (req, res) => {
    try {
        const sql = 'SELECT * FROM country ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching countries:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const getCountryById = (req, res) => {
    try {
        const sql = 'SELECT * FROM country WHERE id = ?';
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
};
const updateCountry = (req, res) => {
    try {
        const sql = 'UPDATE country SET country = ? WHERE id = ?'
        const id = req.params.id;
        db.query(sql, [req.body.country, id], (err, result) => {
            if (err) {
                console.error('Error updating country:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: 1, data: null, error: err, msg: 'Country not found.' });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const deleteCountry = (req, res) => {
    try {
        const sql = 'DELETE FROM country WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting country:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });
    }
};

//           state
const addState = (req, res) => {
    try {
        const stateName = req.body.state
        const checkIfExistsQuery = `SELECT * from state WHERE state = ?`;

        db.query(checkIfExistsQuery, [stateName], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking state existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'State already exists' });
            }
            const insertStateQuery = `INSERT INTO state (state, c_id) VALUES (?,?)`;
            db.query(insertStateQuery, [req.body.state, req.body.c_id], (err, results) => {
                if (err) {
                    console.error('Error creating State:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
                }
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Inserted Successfully' });
            })
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}
const getAllState = (req, res) => {
    try {
        const sql = 'SELECT * FROM state';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching state:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const getStatesByCountry = ((req, res) => {
    try {
        const sql = `
            SELECT 
                S.*, 
                C.country AS country_name 
            FROM 
                state S 
            INNER JOIN 
                country C ON S.c_id = C.id 
            WHERE 
                S.c_id = ?`;

        db.query(sql, [req.query.c_id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            } else {
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Get By Id Successfully' });
            }
        });
    } catch (err) {
        return res.status(500).json({ success: 1, data: null, error: err, msg: 'Internal Server Error' });
    }
});
const getStateById = (req, res) => {
    try {
        const sql = 'SELECT * FROM state WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying state by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get By Id Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const updateState = (req, res) => {
    try {
        const sql = 'UPDATE state SET state = ?, c_id = ? WHERE id = ?';
        const id = req.params.id;

        db.query(sql, [req.body.state, req.body.c_id, id], (err, result) => {
            if (err) {
                console.error('Error updating state:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: 1, data: null, error: err, msg: 'State not found.' });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteState = (req, res) => {
    try {
        const sql = 'DELETE FROM state WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting state:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });

            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });

        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });



    }
}

//   city
const addCity = (req, res) => {
    try {
        const cityName = req.body.city
        const checkIfExistsQuery = `SELECT * from city WHERE city = ?`;

        db.query(checkIfExistsQuery, [cityName], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error ckecking city existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' })
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'State already exists' });
            }
            const insertStateQuery = `INSERT INTO city (city,s_id, c_id) VALUES (?,?,?)`;
            db.query(insertStateQuery, [req.body.city, req.body.s_id, req.body.c_id], (err, results) => {
                if (err) {
                    console.error('Error creating city:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
                }
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Inserted Successfully' });
            })
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}
const getAllCity = (req, res) => {
    try {
        const sql = 'SELECT * FROM city ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching City:', err);
                return res.status(500).json({ success: 1, data: null, error: null, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
//GET API for Sub-Category (According to the selected Category)
const getCitiesByCountryAndState = ((req, res) => {
    try {
        const sql = `
            SELECT 
                C.*, 
                S.state AS state_name,
                CO.country AS country_name 
            FROM 
                city C 
            INNER JOIN 
                state S ON C.s_id = S.id 
            INNER JOIN 
                country CO ON S.c_id = CO.id 
            WHERE 
                C.s_id = ?`;

        db.query(sql, [req.query.s_id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            } else {
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Get By Id Successfully' });
            }
        });
    } catch (err) {
        return res.status(500).json({ success: 1, data: null, error: err, msg: 'Internal Server Error' });
    }
});
const getCityById = (req, res) => {
    try {
        const sql = 'SELECT * FROM city WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying City by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get By Id Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const updateCity = (req, res) => {
    try {
        const sql = 'UPDATE city SET city = ?,s_id=?, c_id = ? WHERE id = ?';
        const id = req.params.id;

        db.query(sql, [req.body.city, req.body.s_id, req.body.c_id, id], (err, result) => {
            if (err) {
                console.error('Error updating city:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteCity = (req, res) => {
    try {
        const sql = 'DELETE FROM city WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting city:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });


    }
}

//area
const addArea = (req, res) => {
    try {
        const areaName = req.body.area
        const checkIfExistsQuery = ` SELECT * from area WHERE area = ? `

        db.query(checkIfExistsQuery, [areaName], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error ckecking city existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' })
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'State already exists' });
            }
            const insertStateQuery = `INSERT INTO area (area,city_id,s_id, c_id) VALUES (?,?,?,?)`;
            db.query(insertStateQuery, [req.body.area, req.body.city_id, req.body.s_id, req.body.c_id], (err, results) => {
                if (err) {
                    console.error('Error creating area:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
                }
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Inserted Successfully' });
            })
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}
const getAllArea = (req, res) => {
    try {
        const sql = 'SELECT * FROM area ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching area:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const getAreaByCountryAndStateandcity = ((req, res) => {
    try {
        const sql = `
            SELECT 
                A.*, 
                CI.city AS city_name,
                S.state AS state_name,
                CO.country AS country_name
            FROM 
                area A 
            INNER JOIN 
                city CI ON A.city_id = CI.id 
            INNER JOIN 
                state S ON CI.s_id = S.id 
            INNER JOIN 
                country CO ON S.c_id = CO.id 
            WHERE 
                A.city_id = ?`;

        db.query(sql, [req.query.city_id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            } else {
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Get By Id Successfully' });
            }
        });
    } catch (err) {
        return res.status(500).json({ success: 1, data: null, error: err, msg: 'Internal Server Error' });
    }
});
const getAreaById = (req, res) => {
    try {
        const sql = 'SELECT * FROM area WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying area by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get By Id Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const updateArea = (req, res) => {
    try {
        const sql = 'UPDATE area SET area = ?, city_id=?, s_id=?, c_id = ? WHERE id = ?';
        const id = req.params.id;

        db.query(sql, [req.body.area, req.body.city_id, req.body.s_id, req.body.c_id, id], (err, result) => {
            if (err) {
                console.error('Error updating area:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteArea = (req, res) => {
    try {
        const sql = 'DELETE FROM area WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting area:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });



    }
}


//                                  staff - type
const getStaffType = (req, res) => {
    try {
        const sql = 'SELECT * FROM staff_type ';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in staff_type query:', err);
                return res.status(500).json({ success: 1, data: null, error: null, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
//              create staf_ftype
const createStaffType = (req, res) => {
    try {
        const sql = 'INSERT INTO staff_type (`staff_type`) VALUES (?)';
        const values = [
            req.body.staff_type
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating staff_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Inserted Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
//            edit staff_type
const editStaffType = (req, res) => {
    try {
        const sql = 'UPDATE staff_type SET `staff_type`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.staff_type, id], (err, result) => {
            if (err) {
                console.error('Error updating staff type:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const getEditStaffType = (req, res) => {
    try {
        const sql = 'SELECT * FROM staff_type WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying staff_type by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: null, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
//         delete  staff-type
const deleteStaffType = (req, res) => {
    try {
        const sql = 'DELETE FROM staff_type WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting staff_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });



    }
};

//                                  medium
const getMedium = (req, res) => {
    try {
        const sql = `
        SELECT 
            m.*,
            br.name AS branch_name,
            bo.board AS board_name
        FROM    
            medium AS m
            INNER JOIN branch AS br ON m.id_branch = br.id
            INNER JOIN board AS bo ON m.id_board = bo.id
        ORDER BY m.id DESC`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in medium query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const createMedium = (req, res) => {
    try {
        const sql = 'INSERT INTO medium (`medium`, `id_branch`, `id_board`) VALUES (?)';
        const values = [
            req.body.medium,
            req.body.id_branch,
            req.body.id_board
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating medium', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Inserted Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const editMedium = (req, res) => {
    try {
        const sql = 'UPDATE medium SET `medium`=?, `id_branch`=?, `id_board`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.medium, req.body.id_branch, req.body.id_board, id], (err, result) => {
            if (err) {
                console.error('Error updating medium', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const getEditMedium = (req, res) => {
    try {
        const sql = 'SELECT * FROM medium WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying medium by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteMedium = (req, res) => {
    try {
        const sql = 'DELETE FROM medium WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting medium', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });
    }
};

//                                  Shift
const getShift = (req, res) => {
    try {
        const sql = 'SELECT * FROM shift ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in shift query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const createShift = (req, res) => {
    try {
        const values = [
            req.body.shift
        ];
        const checkIfExistsQuery = `SELECT * from shift WHERE shift = ?`

        db.query(checkIfExistsQuery, [values], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error ckecking city existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' })
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'State already exists' });
            }
            const sql = 'INSERT INTO shift (`shift`) VALUES (?)';
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error creating shift', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
                }
                return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Inserted Successfully' });
            });
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const editShift = (req, res) => {
    try {
        const sql = 'UPDATE shift SET `shift`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.shift, id], (err, result) => {
            if (err) {
                console.error('Error updating shift', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const getEditShift = (req, res) => {
    try {
        const sql = 'SELECT * FROM shift WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying shift by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: null, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteShift = (req, res) => {
    try {
        const sql = 'DELETE FROM shift WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting shift', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });



    }
};


//                                  Board
const getBoard = (req, res) => {
    try {
        const sql = 'SELECT b.*, br.name AS branch_name FROM board AS b INNER JOIN branch AS br ON b.id_branch = br.id ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in board query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const createBoard = (req, res) => {
    try {
        const sql = 'INSERT INTO board (`board`,`id_branch`) VALUES (?)';
        const values = [
            req.body.board,
            req.body.id_branch
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating board', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Inserted Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const editBoard = (req, res) => {
    try {
        const sql = 'UPDATE board SET `board`=?, `id_branch`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.board, req.body.id_branch, id], (err, result) => {
            if (err) {
                console.error('Error updating board', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const getEditBoard = (req, res) => {
    try {
        const sql = 'SELECT * FROM board WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying board by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
};
const deleteBoard = (req, res) => {
    try {
        const sql = 'DELETE FROM board WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting board', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });
    }
};

//            category
const addCategory = (req, res) => {
    try {
        const sql = 'INSERT INTO category (`category_name`) VALUES (?)';
        db.query(sql, [req.body.category_name], (err, result) => {
            if (err) {
                console.error('Error creating category:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Inserted Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const getAllCategory = (req, res) => {
    try {
        const sql = 'SELECT * FROM category ORDER BY id DESC';
        db.query(sql, [req.query.id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: 1, data: null, error: null, msg: 'Data Get Failed' });
            } else {
                if (result.length > 0) {
                    res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
                } else {
                    res.status(200).json({ success: 0, data: null, error: null, msg: "Data not found!" });
                }
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
// const getCategory = (req, res) => {
//     try {
//         const selQuery = "select cat_id,category_name from CATEGORIES ";
//         mysql.query(selQuery, [req.query.cat_id], (err, results) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).json({ err: "Error When Fetching Data" });
//             } else {
//                 if (results.length > 0) {
//                     res.status(200).json(results);
//                 } else {
//                     res.status(200).json({ "msg": "Data not found!" });
//                 }
//             }
//         });
//     } catch (err) {
//         res.status(500).json({ err: "Error When Fetching Data" });
//     }
// };
const getCategoryById = (req, res) => {
    try {
        const sql = 'SELECT * FROM category WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying category by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get By Id Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const updateCategory = (req, res) => {
    try {
        const sql = 'UPDATE category SET category_name = ? WHERE id = ?'
        const id = req.params.id;
        db.query(sql, [req.body.category_name, id], (err, result) => {
            if (err) {
                console.error('Error updating category:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ Message: 'category not found.' });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteCategory = (req, res) => {
    try {
        const sql = 'DELETE FROM category WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting category:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });
    }
};
//sub category
//   const addSubCategory = (req, res) => {
//     try {
//         const sql = `INSERT INTO sub_category (subcategory_name, cat_id) VALUES (?,?)`;
//         db.query(sql, [req.body.subcategory_name, req.body.cat_id], (err, results) => {
//             if (err) {
//                 console.error('Error creating Sub Category:', err);
//                 return res.status(500).json({ Message: 'Internal Server Error', error: err.message });
//             }
//             return res.status(200).json(results);
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return res.status(500).json({ Message: 'Internal Server Error', error: error.message });
//     }
// };
const addSubCategory = (req, res) => {
    try {
        const { subcategory_name, cat_id } = req.body;

        // Check if the specified cat_id exists in the category table
        const checkCategoryQuery = 'SELECT * FROM category WHERE id = ?';
        db.query(checkCategoryQuery, [cat_id], (checkErr, checkResults) => {
            if (checkErr || checkResults.length === 0) {
                console.error('Invalid cat_id:', checkErr);
                return res.status(400).json({ success: 1, data: null, error: err, msg: "Invalid cat_id" })

            }

            // If the category exists, proceed to insert the sub-category
            const insertSubCategoryQuery = 'INSERT INTO sub_category (subcategory_name, cat_id) VALUES (?, ?)';
            db.query(insertSubCategoryQuery, [subcategory_name, cat_id], (err, results) => {
                if (err) {
                    console.error('Error creating Sub Category:', err);
                    return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Inserted Failed' });
                }
                return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Inserted Successfully' });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}
const getAllSubCategory = (req, res) => {
    try {
        const sql = 'SELECT * FROM sub_category';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching Sub Category:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
//GET API for Sub-Category (According to the selected Category)
const getSubCategory = ((req, res) => {
    try {
        const selQuery = "SELECT S.id,S.subcategory_name FROM sub_category S WHERE S.cat_id = ?";
        mysql.query(selQuery, [req.query.cat_id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get Failed' });
            } else {
                if (results.length > 0) {
                    return res.status(200).json({ success: 0, data: results, error: null, msg: 'Data Get Successfully' });
                } else {

                    return res.status(200).json({ success: 0, data: null, error: null, msg: 'Data not found!' });
                }
            }
        })
    } catch (err) {
        return res.status(500).json({ success: 1, data: null, error: err, msg: 'Internal Server Error', });
    }
})
const getSubCategoryById = (req, res) => {
    try {
        const sql = 'SELECT * FROM sub_category WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying Sub Category by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Get By Id Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get By Id Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });

    }
};
const updateSubCategory = (req, res) => {
    try {
        const sql = 'UPDATE sub_category SET subcategory_name = ?, cat_id = ? WHERE id = ?';
        const id = req.params.id;

        db.query(sql, [req.body.subcategory_name, req.body.cat_id, id], (err, result) => {
            if (err) {
                console.error('Error updating Sub Category:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Update Failed' });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Update Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });


    }
};
const deleteSubCategory = (req, res) => {
    try {
        const sql = 'DELETE FROM sub_category WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting Sub Category:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: 'Data Delete Failed ' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Delete Successfully' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error', });

    }
}




//                                  ReferenceType
//               call data
const getReferenceType = (req, res) => {
    try {
        const sql = 'SELECT * FROM reference_type ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in reference query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createReferenceType = (req, res) => {
    try {
        const checkIfExistsQuery = `SELECT * from reference_type WHERE name = ?`
        const values = [req.body.name];

        db.query(checkIfExistsQuery, [values], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking reference type existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'refrence type name already exists' });
            }
            const sql = 'INSERT INTO reference_type (`name`) VALUES (?)';
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error creating reference type', err);
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
const editReferenceType = (req, res) => {
    try {
        const sql = 'UPDATE reference_type SET `name`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.name, id], (err, result) => {
            if (err) {
                console.error('Error updating reference type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditReferenceType = (req, res) => {
    try {
        const sql = 'SELECT * FROM reference_type WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying reference type by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteReferenceType = (req, res) => {
    try {
        const sql = 'DELETE FROM reference_type WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting reference_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

//                                  Reasons
const getReasons = (req, res) => {
    try {
        const sql = 'SELECT * FROM reasons';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in reasons query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createReasons = (req, res) => {
    try {
        const sql = 'INSERT INTO reasons (`reasons`) VALUES (?)';
        const values = [
            req.body.reasons
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating reasons', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editReasons = (req, res) => {
    try {
        const sql = 'UPDATE reasons SET `reasons`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.reasons, id], (err, result) => {
            if (err) {
                console.error('Error updating reasons', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditReasons = (req, res) => {
    try {
        const sql = 'SELECT * FROM reasons WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying reasons by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteReasons = (req, res) => {
    try {
        const sql = 'DELETE FROM reasons WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting reasons', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//                                  Income Type
const getIncomeType = (req, res) => {
    try {
        const sql = 'SELECT * FROM income_type ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in income_type query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createIncomeType = (req, res) => {
    try {
        const checkIfExistsQuery = `SELECT * from income_type WHERE income_type = ?`
        const values = [
            req.body.income_type
        ];

        db.query(checkIfExistsQuery, [values], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking income type existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'income type name already exists' });
            }
            const sql = 'INSERT INTO income_type (`income_type`) VALUES (?)';
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error creating income_type', err);
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
const editIncomeType = (req, res) => {
    try {
        const sql = 'UPDATE income_type SET `income_type`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.income_type, id], (err, result) => {
            if (err) {
                console.error('Error updating income_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditIncomeType = (req, res) => {
    try {
        const sql = 'SELECT * FROM income_type WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying income_type by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteIncomeType = (req, res) => {
    try {
        const sql = 'DELETE FROM income_type WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting income_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//                                  Expanse Type
const getExpanseType = (req, res) => {
    try {
        const sql = 'SELECT * FROM expanse_type ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in expanse_type query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createExpanseType = (req, res) => {
    try {
        const values = [
            req.body.expanse_type
        ];
        const checkIfExistsQuery = `SELECT * from expanse_type WHERE expanse_type = ?`;

        db.query(checkIfExistsQuery, [values], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking expanse type existence:', checkErr);
                return res.status(500).json({ success: 1, data: null, error: checkErr, msg: 'Internal Server Error' });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ success: 1, data: null, error: null, msg: 'expanse type name already exists' });
            }
            const sql = 'INSERT INTO expanse_type (`expanse_type`) VALUES (?)';
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error('Error creating expanse_type', err);
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
const editExpanseType = (req, res) => {
    try {
        const sql = 'UPDATE expanse_type SET `expanse_type`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.expanse_type, id], (err, result) => {
            if (err) {
                console.error('Error updating expanse_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditExpanseType = (req, res) => {
    try {
        const sql = 'SELECT * FROM expanse_type WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying expanse_type by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteExpanseType = (req, res) => {
    try {
        const sql = 'DELETE FROM expanse_type WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting expanse_type', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//          Standers
const getStanderd = (req, res) => {
    try {
        // const sql = 'SELECT * FROM standard ORDER BY id DESC';
        const sql = `
        SELECT 
            s.*,
            br.name AS branch_name,
            bo.board AS board_name,
            me.medium AS medium_name
        FROM    
            standard AS s
            INNER JOIN branch AS br ON s.branch_id = br.id
            INNER JOIN board AS bo ON s.id_board = bo.id
            INNER JOIN medium AS me ON s.id_medium = me.id
        ORDER BY s.id DESC`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in standard query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const createStanderd = (req, res) => {
    try {
        const sql = 'INSERT INTO standard (`standard`,`branch_id`,`id_board`,`id_medium`) VALUES (?)';
        const values = [
            req.body.standard,
            req.body.branch_id,
            req.body.id_board,
            req.body.id_medium
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating standard', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" }); // 201 for successful creation
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const editStanderd = (req, res) => {
    try {
        const sql = 'UPDATE standard SET `standard`=?, `branch_id`=?, `id_board`=?, `id_medium`=? WHERE  id=?'
        const id = req.params.id;
        db.query(sql, [req.body.standard, req.body.branch_id, req.body.id_board, req.body.id_medium, id], (err, result) => {
            if (err) {
                console.error('Error updating standard', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getEditStanderd = (req, res) => {
    try {
        const sql = 'SELECT * FROM standard WHERE id = ?';
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
const getStanderdByBranch = (req, res) => {
    try {
        const branchIds = req.query.branch_id.split(',').map(Number);
        const sql = 'SELECT S.id, S.standard FROM standard S WHERE S.branch_id IN (?)';
        db.query(sql, [branchIds], (err, results) => {
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
const deleteStanderd = (req, res) => {
    try {
        const sql = 'DELETE FROM standard WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting standard', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//          subject
const createSubject = (req, res) => {
    try {
        const sql = 'INSERT INTO subject (`subject`,`id_branch`,`id_board`,`id_medium`,`id_stand`) VALUES (?)';
        const values = [
            req.body.subject,
            req.body.id_branch,
            req.body.id_board,
            req.body.id_medium,
            req.body.id_stand
        ];
        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error creating subject', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getSubject = (req, res) => {
    try {
        const sql = `
        SELECT
            sb.*,
            br.name AS branch_name,
            bo.board AS board_name,
            me.medium AS medium_name,
            st.standard AS standard_name
        FROM
            subject AS sb
            INNER JOIN branch AS br ON sb.id_branch = br.id
            INNER JOIN board AS bo ON sb.id_board = bo.id
            INNER JOIN medium AS me ON sb.id_medium = me.id
            INNER JOIN standard AS st ON sb.id_stand = st.id
        ORDER BY id DESC
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in subject query:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getSubjectById = (req, res) => {
    try {
        const sql = 'SELECT * FROM subject WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying subject by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getSubjectByStanderd = (req, res) => {
    try {
        const sql = `
            SELECT 
              S.*, 
              B.name AS branch_name,
              BO.board AS board_name,
              M.medium AS medium_name,
              ST.standard AS standard_name
            FROM 
              subject S
            LEFT JOIN branch B ON S.id_branch = B.id
            LEFT JOIN board BO ON S.id_board = BO.id
            LEFT JOIN medium M ON S.id_medium = M.id
            LEFT JOIN standard ST ON S.id_stand = ST.id
            WHERE 
              S.id_branch = ? AND 
              S.id_board = ? AND 
              S.id_medium = ? AND 
              S.id_stand = ?
          `;
        const { id_branch, id_board, id_medium, id_stand } = req.query;

        db.query(sql, [id_branch, id_board, id_medium, id_stand], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            } else {
                res.status(200).json({ success: 0, data: results, error: null, msg: "Data Get Successfully" });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: 1, data: null, error: err, msg: "Internal Server Error" });
    }
};
const editSubject = (req, res) => {
    try {
        const sql = 'UPDATE subject SET `subject`=?,`id_branch`=?,`id_board`=?,`id_medium`=?,`id_stand`=? WHERE  id=?'
        const id = req.params.id;
        const values = [
            req.body.subject,
            req.body.id_branch,
            req.body.id_board,
            req.body.id_medium,
            req.body.id_stand,
            id
        ];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error updating subject', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteSubject = (req, res) => {
    try {
        const sql = 'DELETE FROM subject WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting subject', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//          Class
const addClass = (req, res) => {
    try {
        const sql = 'INSERT INTO classroom (`name`) VALUES (?)';
        db.query(sql, [req.body.name], (err, result) => {
            if (err) {
                console.error('Error creating classroom:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data insert Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data insert Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getAllClass = (req, res) => {
    try {
        const sql = 'SELECT * FROM classroom ORDER BY id DESC';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching classroom:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const getClassById = (req, res) => {
    try {
        const sql = 'SELECT * FROM classroom WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying classroom by ID:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const updateClass = (req, res) => {
    try {
        const sql = 'UPDATE classroom SET name = ? WHERE id = ?'
        const id = req.params.id;
        db.query(sql, [req.body.name, id], (err, result) => {
            if (err) {
                console.error('Error updating classroom:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteClass = (req, res) => {
    try {
        const sql = 'DELETE FROM classroom WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting classroom:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};


//          Contact_us
const getContactUs = (req, res) => {
    try {
        const sql = `SELECT * FROM contact_us`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error in Contact query:', err);
                return res.status(500).json({ success: 1, data: null, error: null, msg: 'Data Get Failed' });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: 'Data Get Successfully' });
        })
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: 'Internal Server Error' });
    }
}
const addContactUs = (req, res) => {
    try {
        const number = req.body.number;
        const email = req.body.email;
        const address = req.body.address;

        const checkIfContactQuery = `SELECT * FROM contact_us WHERE number = ? OR email = ? OR address = ?`;
        db.query(checkIfContactQuery, [number, email, address], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking contact existence:', checkErr);
                return res.status(500).json({ success: 0, data: null, error: checkErr, msg: 'Internal Server Error' });
            }

            if (checkResult.length > 0) {
                const existingContacts = {};
                checkResult.forEach(contact => {
                    if (contact.number === number) {
                        existingContacts.number = true;
                    }
                    if (contact.email === email) {
                        existingContacts.email = true;
                    }
                    if (contact.address === address) {
                        existingContacts.address = true;
                    }
                });
                return res.status(400).json({ success: 0, data: null, error: null, msg: ` This Data is already exists`, existingContacts });
            } else {
                // Insert the new contact if it doesn't already exist
                const sql = 'INSERT INTO contact_us (`number`, `email`, `address`) VALUES (?, ?, ?)';
                db.query(sql, [number, email, address], (err, result) => {
                    if (err) {
                        console.error('Error creating contact:', err);
                        return res.status(500).json({ success: 0, data: null, error: err, msg: "Data insert Failed" });
                    }
                    return res.status(200).json({ success: 1, data: result, error: null, msg: "Data insert Successfully" });
                });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 0, data: null, error: error, msg: "Internal Server Error" });
    }
};

const getContactById = (req, res) => {
    try {
        const sql = 'SELECT * FROM contact_us WHERE id = ?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error querying contact us', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data Get Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data Get Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const updateContact = (req, res) => {
    try {
        const sql = 'UPDATE contact_us SET `number`=?,`email`=?, `address`=? WHERE id = ?'
        const id = req.params.id;
        db.query(sql, [req.body.number, req.body.email, req.body.address, id], (err, result) => {
            if (err) {
                console.error('Error updating contact', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data edit Failed" });
            }

            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data edit Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};
const deleteContactUs = (req, res) => {
    try {
        const sql = 'DELETE FROM contact_us WHERE id =?';
        const id = req.params.id;
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting contact us:', err);
                return res.status(500).json({ success: 1, data: null, error: err, msg: "Data delete Failed" });
            }
            return res.status(200).json({ success: 0, data: result, error: null, msg: "Data delete Successfully" });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: 1, data: null, error: error, msg: "Internal Server Error" });
    }
};

module.exports = {
    //country
    country,
    getAllCountries,
    updateCountry,
    deleteCountry,
    getCountryById,

    //state
    addState,
    getAllState,
    getStatesByCountry,
    getStateById,
    updateState,
    deleteState,

    //city
    addCity,
    getAllCity,
    getCitiesByCountryAndState,
    getCityById,
    updateCity,
    deleteCity,

    //area
    addArea,
    getAllArea,
    getAreaByCountryAndStateandcity,
    getAreaById,
    updateArea,
    deleteArea,

    //  staff
    getStaffType,
    createStaffType,
    editStaffType,
    getEditStaffType,
    deleteStaffType,

    // medium
    getMedium,
    createMedium,
    editMedium,
    getEditMedium,
    deleteMedium,

    // Shift
    getShift,
    createShift,
    editShift,
    getEditShift,
    deleteShift,

    // Board
    getBoard,
    createBoard,
    editBoard,
    getEditBoard,
    deleteBoard,

    //category
    addCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,

    //sub category
    addSubCategory,
    getAllSubCategory,
    // get category by sub category
    getSubCategory,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,

    // ReferenceType
    getReferenceType,
    createReferenceType,
    editReferenceType,
    getEditReferenceType,
    deleteReferenceType,

    // Reasons
    getReasons,
    createReasons,
    editReasons,
    getEditReasons,
    deleteReasons,

    // IncomeType
    getIncomeType,
    createIncomeType,
    editIncomeType,
    getEditIncomeType,
    deleteIncomeType,

    // IncomeType
    getExpanseType,
    createExpanseType,
    editExpanseType,
    getEditExpanseType,
    deleteExpanseType,

    //  Standerd
    getStanderd,
    createStanderd,
    editStanderd,
    getEditStanderd,
    deleteStanderd,
    getStanderdByBranch,

    //  Subject
    getSubject,
    createSubject,
    editSubject,
    getSubjectById,
    getSubjectByStanderd,
    deleteSubject,

    //class
    addClass,
    getAllClass,
    getClassById,
    updateClass,
    deleteClass,

    // contact us
    getContactUs,
    addContactUs,
    getContactById,
    updateContact,
    deleteContactUs,
};