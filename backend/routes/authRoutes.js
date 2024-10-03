const express = require("express");
const multer = require("multer");
const router = express.Router();
const db = require("../db/connection").db;
const {

    //  structure api
    getBoardbybranch,
    getMediumbybranchBoard,
    getStandardbyBrBoMd,
    getBatchbyBrBoMdSt,

    // batch
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

    //   Student
    getStudent,
    createStudent,
    editStudent,
    getStudentbyBrBoMdStBt,
    getEditStudent,
    deleteStudent,

    //    delete student
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

    getStanderdbyBranch,

    // attendance
    getAttendance,
    getAttendanceByStudent,
    getAttendanceHome,
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

    //   StatusHomework
    getStatusHomework,
    // createStatusHomework,
    editStatusHomework,
    getStatusHomeworkById,
    deleteStatusHomework,
    getHomeworkbybrbomdstsubbt,
    getHomeworkStatus,

    //exam marks
    createExamMarks,
    updateExamMarks,
    getExamMarks,
    getExamMarksbybrbomest,
    getExamMarksPortfoliyo,
    getEditExamMarks,
    getExamMarksbyExamId,
    deleteExamMarks,
    getExamMarksReport,

    //   PTM
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
    getMathsReportById,
    getMathsReportByIdStudent,
    updateMathsReport,
    deleteMathsReport,
    addWelcomeTest,
    getWelcomeTest,
    getEditWelcomeTest,
    editWelcomeTest,
    deleteWelcomeTest,
    getStatusHomeworkStudent,

} = require("../controller/authController");

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`);
    },
});
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new Error("Only image is allowed"));
    }
};
const upload = multer({
    storage: imgconfig,
    fileFilter: isImage,
});

const uploadnotice = multer({
    storage: imgconfig,
});

//  structure api
router.get('/boardbybr', getBoardbybranch)
router.get('/mediumbybrbo', getMediumbybranchBoard)
router.get('/standardbybrbomd', getStandardbyBrBoMd)
router.get('/batchbybrbomdst', getBatchbyBrBoMdSt)

//    batch
router.get('/batch', getBatch)
router.get("/getbatchbybrst", getBatchByBrSt)
router.post('/createbatch', createBatch)
router.get("/batch/:id", getBatchById)
router.put("/batch/update/:id", editBatch)
router.delete("/batch/delete/:id", deleteBatch)


//      Branch
router.get('/branch', getBranch)
router.post('/createbranch', createBranch)
router.get("/branch/:id", getBranchById)
router.put("/branch/update/:id", editBranch)
router.delete("/branch/delete/:id", deleteBranch)

//      Homework Status
router.get('/statusHomework', getStatusHomework)
router.get('/statusHomework/:id_student', getStatusHomeworkStudent);
router.get("/statusHomeworkbyid/:id", getStatusHomeworkById)
router.get('/homeworkstatus/:studentId', getHomeworkStatus);
router.put("/statusHomework/update/:id", editStatusHomework)
router.delete("/statusHomework/delete/:id", deleteStatusHomework)
router.get("/getHomeworkbybrbomdstsubbt", getHomeworkbybrbomdstsubbt)

//      Student
router.get('/student', getStudent)
router.post('/createstudent', upload.single("photo"), createStudent)
router.get("/student/:id", getEditStudent)
router.get("/getStudentbyBrBoMdStBt", getStudentbyBrBoMdStBt)
// router.put("/student/update/:id", editStudent)
router.put('/editstudent/:id', upload.single("photo"), editStudent);
router.delete("/student/delete/:id", deleteStudent)

//        delete student
router.get('/getApproval', getApproval)
router.get('/getDeleted', getDeleted)
router.put('/deleteApproval/:id', deleteApproval)

//      Inquiry
router.get('/inquiry', getInquiry)
router.get('/getinquirybybrbomestbt', getInquirybyBrBoMdStBt)
router.post('/createinquiry', createInquiry)
router.get("/inquiry/:id", getEditInquiry)
router.put("/inquiry/update/:id", editInquiry)
router.delete("/inquiry/delete/:id", deleteInquiry)
router.get("/getInquiryByBranch", getInquiryByBranch)

//      Notice
router.get('/notice', getNotice)
router.post('/createnotice', uploadnotice.single("files"), createNotice)
router.get("/notice/:id", getNoticeById)
router.put("/notice/update/:id", editNotice)
router.delete("/notice/delete/:id", deleteNotice)
router.get("/getNoticebyBrBoMdStBt", getNoticebyBrBoMdStBt)
router.get("/getNoticebyStudent/:id", getNoticebyStudent)

router.get('/getStanderdbyBranch', getStanderdbyBranch)

//      Attendance
router.get('/attendance', getAttendance)
router.get('/getAttendanceByStudent/:studentId', getAttendanceByStudent)
router.get('/attendancehome', getAttendanceHome)
router.get('/attendancehome/:id_branch', getAttendanceHomeBranch)
router.get('/examattendancehome', getExamAttendanceHome)
router.get('/examattendancehome/:id_branch', getExamAttendanceHomeBranch)
router.get('/examhome', getExamHome)
router.get('/examhome/:id_branch', getExamHomeBranch)
router.get('/homeworkhome', getHomeworkHome)
router.get('/homeworkhome/:id_branch', getHomeworkHomeBranch)
router.get('/homeworkstatushome', getHomeworkStatusHome)
router.get('/homeworkstatushome/:id_branch', getHomeworkStatusHomeBranch)
router.get('/homeinquiry', getInquiryHome)
router.get('/homeinquiry/:id_branch', getInquiryHomeBranch)
router.get('/homestudent', getStudentHome)
router.get('/homestudent/:id_branch', getStudentHomeBranch)
router.get('/homeadmin', getStaffHome)
router.get('/homeadmin/:id_branch', getStaffHomeBranch)
router.get('/homeincome', getIncomeHome)
router.get('/homeincome/:id_branch', getIncomeHomeBranch)
router.get('/homefees', getFeesHome)
router.get('/homefees/:id_branch', getFeesHomeBranch)
router.get('/homeexpense', getExpenseHome)
router.get('/homeexpense/:id_branch', getExpenseHomeBranch)
router.get('/getWeeklyAttendance/:studentId', getWeeklyAttendance)
router.post('/createattendance', createAttendance)
router.get("/getedit/attendance/:id", getEditAttendance)
router.put("/attendance/update/:id", editAttendance)
router.delete("/attendance/delete/:id", deleteAttendance)

//      Assign HomeWork
router.get('/assignHomeWork', getAssignHomeWork)
router.post('/createAssignHomeWork', uploadnotice.single("files"), createAssignHomeWork)
router.get("/getedit/assignHomeWork/:id", getEditAssignHomeWork)
router.put("/assignHomeWork/update/:id", uploadnotice.single("files"), editAssignHomeWork)
router.delete("/assignHomeWork/delete/:id", deleteAssignHomeWork)
router.get("/getAssignHomeWorkbyBrBoMdStBt", getAssignHomeWorkbyBrBoMdStBt)

//      Add Exam
router.get('/addexam', getAddExam)
router.post('/createaddexam', uploadnotice.single("files"), createAddExam)
router.get("/getedit/addexam/:id", getEditAddExam)
router.put("/addexam/update/:id", uploadnotice.single("files"), editAddExam)
router.delete("/addexam/delete/:id", deleteAddExam)
router.get("/getExambyBrBoMdStSub", getExambyBrBoMdStSub)
router.get("/getExambyBranchbordmediumstsub", getExambyBranchbordmediumstsub)

//      ExamAttendance
router.get('/examattendance', getExamAttendance)
// router.post('/createexamattendance', createExamAttendance)
router.get("/getedit/examattendance/:id", getEditExamAttendance)
router.put("/examattendance/update/:id", editExamAttendance)
router.delete("/examattendance/delete/:id", deleteExamAttendance)
router.get('/getExamAttendancebybrbomestbt', getExamAttendancebybrbomestbt)

//      ExamMarks
router.get('/exammarks', getExamMarks)//subject vise
router.get('/getExamMarksbybrbomest', getExamMarksbybrbomest)
router.post('/createexammarks', createExamMarks)
router.get("/getedit/exammarks/:id/:id_student", getEditExamMarks);
router.get("/getExamMarksbyExamId/:id", getExamMarksbyExamId)
router.get("/getexammarksportfoliyo/:id_student", getExamMarksPortfoliyo)
router.get('/exammarksreport/:id', getExamMarksReport);
router.put("/exammarks/update/:id", updateExamMarks)
router.delete("/exammarks/delete/:id", deleteExamMarks)
//      Fees
router.post("/create/fees", createFees)
router.get("/fees", getFees)
router.get("/totalfees/:id_branch", getFeesByAmount)
router.get("/totalfees", getFeesByAllAmount)
router.get("/getfees/:id", getFeesById)
router.put("/fees/update/:id", editFees)
router.delete("/fees/delete/:id", deleteFees)
router.get("/getFeesByBranch", getFeesByBranch)
router.get("/getFeesByStudent", getFeesByStudent)
router.get("/getFeesbyStudentTotal/:id", getFeesbyStudentTotal)
//     PTM
router.get("/getptm", getPTM)
router.get("/getPTMbybrbomest", getPTMbybrbomest)
router.get("/ptmreport/:id_student", getPTMReport)
router.post("/createptm", createPTM)
router.get("/getbyidptm/:id", getEditPTM)
router.put("/editptm/:id", editPTM)
router.delete("/deleteptm/:id", deletePTM)

//    Conclusion
router.get("/getconclusion", getConclusion)
router.get("/getConclusionbybomestbt", getConclusionbybomestbt)
// router.post("/createconclusion", createConclusion)
router.put("/editconclusion/:id", editConclusion)
router.get("/getbyidconclusion/:id", getEditConclusion)

//gujarti report
router.get("/getgujaratireport", getAllGujaratiReport)
router.post("/creategujaratireport", addGujaratiReport)
router.get("/getbyidgujaratireport/:id", getGujaratiReportById)
router.put("/editgujaratireport/:id", updateGujaratiReport)
router.delete("/deletegujaratireport/:id", deleteGujaratiReport)

//english report
router.get("/getenglishreport", getAllEnglishReport)
router.post("/createenglishreport", addEnglishReport)
router.get("/getbyidenglishreport/:id", getEnglishReportById)
router.put("/editenglishreport/:id", updateEnglishReport)
router.delete("/deleteenglishreport/:id", deleteEnglishReport)

//maths report
router.get("/getmathsreport", getAllMathsReport)
router.post("/createmathsreport", addMathsReport)
router.get("/getbyidmathsreport/:id", getMathsReportById)
router.get("/getbyidmathsreportstudent/:id", getMathsReportByIdStudent)
router.put("/editmathsreport/:id", updateMathsReport)
router.delete("/deletemathsreport/:id", deleteMathsReport)

// welcome test
router.post("/addWelcomeTest", addWelcomeTest)
router.get("/getWelcomeTest", getWelcomeTest)
router.get("/getEditWelcomeTest/:id", getEditWelcomeTest);
router.put("/editWelcomeTest/:id", editWelcomeTest)
router.delete("/deleteWelcomeTest/:id", deleteWelcomeTest)
module.exports = router;