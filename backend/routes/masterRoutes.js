const express = require("express");
const router = express.Router();
const {
    //country
    country,
    getAllCountries,
    getCountryById,
    updateCountry,
    deleteCountry,

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

    // staff
    getStaffType,
    createStaffType,
    editStaffType,
    getEditStaffType,
    deleteStaffType,

    //   Medium
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

    //  Standerd
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
    deleteContactUs

} = require("../controller/masterController")
//country
router.post("/country", country)
router.get("/getcountry", getAllCountries)
router.get("/getcountry/:id", getCountryById)
router.put("/country/update/:id", updateCountry);
router.delete("/country/delete/:id", deleteCountry);

//state
router.post("/state", addState)
router.get("/getstate", getAllState)
router.get("/getstatesbycountry", getStatesByCountry);
router.get("/getstate/:id", getStateById)
router.put("/state/update/:id", updateState);
router.delete("/state/delete/:id", deleteState);

//city
router.post("/city", addCity)
router.get("/getcity", getAllCity)
router.get("/getcitiesbycountryandstate", getCitiesByCountryAndState)
router.get("/getcity/:id", getCityById)
router.put("/city/update/:id", updateCity);
router.delete("/city/delete/:id", deleteCity);

//area
router.post("/area", addArea)
router.get("/getarea", getAllArea)
router.get("/getareabycountryandstateandcity", getAreaByCountryAndStateandcity)
router.get("/getarea/:id", getAreaById)
router.put("/area/update/:id", updateArea);
router.delete("/area/delete/:id", deleteArea);

//      staff
router.get('/staff-type', getStaffType)
router.post('/create-staff-type', createStaffType)
router.put('/edit-staff-type/:id', editStaffType)
router.get('/getedit-staff-type/:id', getEditStaffType)
router.delete('/delete-staff-type/:id', deleteStaffType)

//  Medium
router.get('/medium', getMedium)
router.post('/create-medium', createMedium)
router.put('/edit-medium/:id', editMedium)
router.get('/getedit-medium/:id', getEditMedium)
router.delete('/delete-medium/:id', deleteMedium)

//  Shift
router.get('/shift', getShift)
router.post('/create-shift', createShift)
router.put('/edit-shift/:id', editShift)
router.get('/getedit-shift/:id', getEditShift)
router.delete('/delete-shift/:id', deleteShift)

//  Board
router.get('/board', getBoard)
router.post('/create-board', createBoard)
router.put('/edit-board/:id', editBoard)
router.get('/getedit-board/:id', getEditBoard)
router.delete('/delete-board/:id', deleteBoard)

//category
router.post("/category", addCategory)
router.get("/getcategory", getAllCategory)
router.get("/getcategory/:id", getCategoryById)
router.put("/category/update/:id", updateCategory);
router.delete("/category/delete/:id", deleteCategory);

//sub category
router.post("/subcategory", addSubCategory)
router.get("/getallsubcategory", getAllSubCategory)
router.get("/getsubcat", getSubCategory)
router.get("/getsubcategory/:id", getSubCategoryById)
router.put("/subcategory/update/:id", updateSubCategory);
router.delete("/subcategory/delete/:id", deleteSubCategory);

//  Referencetype
router.get('/referencetype', getReferenceType)
router.post('/create-referencetype', createReferenceType)
router.put('/edit-referencetype/:id', editReferenceType)
router.get('/getedit-referencetype/:id', getEditReferenceType)
router.delete('/delete-referencetype/:id', deleteReferenceType)

//  Reasons
router.get('/reasons', getReasons)
router.post('/create-reasons', createReasons)
router.put('/edit-reasons/:id', editReasons)
router.get('/getedit-reasons/:id', getEditReasons)
router.delete('/delete-reasons/:id', deleteReasons)

//  Income Type
router.get('/income-type', getIncomeType)
router.post('/create-income-type', createIncomeType)
router.put('/edit-income-type/:id', editIncomeType)
router.get('/getedit-income-type/:id', getEditIncomeType)
router.delete('/delete-income-type/:id', deleteIncomeType)

//  Expanse Type
router.get('/expanse-type', getExpanseType)
router.post('/create-expanse-type', createExpanseType)
router.put('/edit-expanse-type/:id', editExpanseType)
router.get('/getedit-expanse-type/:id', getEditExpanseType)
router.delete('/delete-expanse-type/:id', deleteExpanseType)

//  Standerd
router.get('/standerd', getStanderd)
router.post('/create-standerd', createStanderd)
router.put('/edit-standerd/:id', editStanderd)
router.get('/getedit-standerd/:id', getEditStanderd)
router.delete('/delete-standerd/:id', deleteStanderd)
router.get('/standardbybranch', getStanderdByBranch)

router.post("/subject", createSubject)
router.get("/getsubject", getSubject)
router.get("/getsubject/:id", getSubjectById)
router.get("/getSubjectByStanderd", getSubjectByStanderd)
router.put("/subject/update/:id", editSubject);
router.delete("/subject/delete/:id", deleteSubject)

//classroom
router.post("/classroom", addClass)
router.get("/getclassroom", getAllClass)
router.get("/getclassroom/:id", getClassById)
router.put("/classroom/update/:id", updateClass);
router.delete("/classroom/delete/:id", deleteClass);

// contact us 
router.get("/getContactUs", getContactUs);
router.post("/addContactUs", addContactUs);
router.get("/getContactById/:id", getContactById);
router.put("/updateContact/:id", updateContact);
router.delete("/deleteContactUs/:id", deleteContactUs);

module.exports = router;