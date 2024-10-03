const express = require("express");
const multer = require("multer");
const router = express.Router();
const {

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
} = require("../controller/adminController")
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

const uploadMaterial = multer({
  storage: imgconfig,
});
router.post("/createadmin", createAdmin)
router.get("/admin", getAdmin)
router.get("/getadmin/:id", getAdminById)
router.put("/admin/update/:id", editAdmin)
router.delete("/admin/delete/:id", deleteAdmin)
router.get("/teacher", getTeacher)

router.post("/course", addCourse)
router.get("/getcourse", getCourse)
router.get("/getcourse/:id", getCourseById)
router.put("/course/update/:id", editCourse)
router.delete("/course/delete/:id", deleteCourse)
router.get('/getCoursebyids', getCoursebyids)

router.post("/material", uploadMaterial.single("files"), createMaterial)
router.get("/getmaterial", getMaterial)
router.get("/getmaterial/:id", getMaterialById)
router.put("/material/update/:id", uploadMaterial.single("files"), editMaterial)
router.delete("/material/delete/:id", deleteMaterial)
router.get("/getMetiraltByBrBoMdStSub", getMetiraltByBrBoMdStSub)

router.post("/income", createIncome)
router.get("/getincome", getIncome)
router.get("/getincome/:id", getIncomeById)
router.put("/income/update/:id", editIncome)
router.delete("/income/delete/:id", deleteIncome)
router.get("/getIncomeByBranch", getIncomeByBranch)

router.post("/expense", createExpanse)
router.get("/getexpanse", getExpanse)
router.get("/getexpanse/:id", getExpanseById)
router.put("/expanse/update/:id", editExpanse)
router.delete("/expanse/delete/:id", deleteExpanse)
router.get("/getExpenseByBranch", getExpenseByBranch)

router.post("/login", login)
router.get("/logout", logoutRoute);

router.post("/createTimetable", timetables)
router.get("/getTimetableMonday", getTimetableMnday)
router.get("/getTimetableTuesday", getTimetableTuesday)
router.get("/getTimetableWednesday", getTimetableWednesday)
router.get("/getTimetableThursday", getTimetableThursday)
router.get("/getTimetableFriday", getTimetableFriday)
router.get("/getTimetableSaturday", getTimetableSaturday)
router.get("/getTimetableSunday", getTimetableSunday)
router.delete("/deletemonday/:id", deleteMonday)
router.delete("/deletetuesday/:id", deleteTuesday)
router.delete("/deletewednesday/:id", deleteWednesday)
router.delete("/deletethursday/:id", deleteThursday)
router.delete("/deletefriday/:id", deleteFriday)
router.delete("/deletesaturday/:id", deleteSaturday)
router.delete("/deletesunday/:id", deleteSunday)
module.exports = router;