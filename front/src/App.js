import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./componant/Navbar";
import Home from "./componant/Home";
import StaffType from "./componant/Master/StaffType";
import CreateStaffType from "./componant/Master/CreateStaffType";
import EditStaffType from "./componant/Master/EditStaffType";
import Medium from "./componant/Medium";
import CreateMedium from "./componant/CreateMedium";
import EditMedium from "./componant/EditMedium";
import Shift from "./componant/Master/Shift";
import CreateShift from "./componant/Master/CreateShift";
import EditShift from "./componant/Master/EditShift";
import Board from "./componant/Board";
import CreateBoard from "./componant/CreateBoard";
import EditBoard from "./componant/EditBoard";
import IncomeType from "./componant/Master/IncomeType";
import CreateIncomeType from "./componant/Master/CreateIncomeType";
import EditIncomeType from "./componant/Master/EditIncomeType";
import ExpanseType from "./componant/Master/ExpanseType";
import CreateExpanseType from "./componant/Master/CreateExpanseType";
import EditExpanseType from "./componant/Master/EditExpanseType";
import Standard from "./componant/Standard";
import CreateStandard from "./componant/CreateStandard";
import EditStandard from "./componant/EditStandar";
import Subject from "./componant/Subject";
import CreateSubject from "./componant/CreateSubject";
import EditSubject from "./componant/EditSubject";
import Country from "./componant/Master/Country";
import CountryAdd from "./componant/Master/CountryAdd";
import CountryEdit from "./componant/Master/CountryEdit";
import State from "./componant/Master/State";
import Category from "./componant/Master/Category";
import CategoryAdd from "./componant/Master/CategoryAdd";
import CategoryEdit from "./componant/Master/CategoryEdit";
import SubCategory from "./componant/Master/SubCategory";
import SubCategoryAdd from "./componant/Master/SubCategoryAdd";
import SubCategoryEdit from "./componant/Master/SubCategoryEdit";
import StateAdd from "./componant/Master/StateAdd";
import StateEdit from "./componant/Master/StateEdit";
import City from "./componant/Master/City";
import CityAdd from "./componant/Master/CityAdd";
import CityEdit from "./componant/Master/CityEdit";
import Area from "./componant/Master/Area";
import AreaAdd from "./componant/Master/AreaAdd";
import Areaedit from "./componant/Master/Areaedit";
import Batch from "./componant/Batch";
import CreateBatch from "./componant/CreateBatch";
import EditBatch from "./componant/EditBatch";
import Student from "./componant/Student";
import CreateStudent from "./componant/CreateStudent";
import EditStudent from "./componant/EditStudent";
import Inquiry from "./componant/Inquiry";
import CreateInquiry from "./componant/CreateInquiry";
import EditInquiry from "./componant/EditInquiry";
import StudentDetails from "./componant/StudentDetails";
import Branch from "./componant/Branch";
import BranchAdd from "./componant/BranchAdd";
import BranchEdit from "./componant/BranchEdit";
import AddMaterial from "./componant/AddMaterial";
import AddNotice from "./componant/AddNotice";
import AddIncome from "./componant/AddIncome";
import AddFees from "./componant/AddFees";
import AddUser from "./componant/AddUser";
import Course from "./componant/Course";
import AddCourse from "./componant/AddCourse";
import EditCourse from "./componant/EditCourse";
import Attendance from "./componant/Attendance";
import CreateAttendance from "./componant/CreateAttendance";
import EditAttendance from "./componant/EditAttendance";
import AddAssignHomeWork from "./componant/AddAssignHomeWork";
import AddExam from "./componant/AddExam";
import ReferenceType from "./componant/Master/ReferenceType";
import CreateReferenceType from "./componant/Master/CreateReferenceType";
import EditReferenceType from "./componant/Master/EditReferenceType";
import Income from "./componant/Income";
import EditIncome from "./componant/EditIncome";
import Expanse from "./componant/Expanse";
import EditExpanse from "./componant/EditExpanse";
import CreateExpense from "./componant/CreateExpense";
import Material from "./componant/Material";
import EditMaterial from "./componant/EditMaterial";
import AssignHomeWork from "./componant/AssignHomework";
import EditAssignHomework from "./componant/EditAssignHomework";
import Exam from "./componant/Exam";
import EditExam from "./componant/EditExam";
import Fees from "./componant/Fees";
import Login from "./componant/Login";
import User from "./componant/User";
import EditFees from "./componant/EditFees";
import EditUser from "./componant/EditUser";
import { useLocation } from 'react-router-dom'
import Examattendance from './componant/Examattendance';
import HomeworkStatus from './componant/HomeworkStatus';

import ExamAttendanceDetail from './componant/ExamAttendanceDetail';
import EditExamAttendance from './componant/EditExamAttendance';
import AddHomeworkStatus from './componant/AddHomeworkStatus';
import AddExamMarks from './componant/AddExamMarks';
import ViewMarks from './componant/ViewMarks';
// import AbsentReport from './componant/Master/Portfolio.js/AbsentReport';
import EditExamMarks from './componant/EditExamMarks';
import AbsentReport from './componant/Portfolio.js/AbsentReport';
import ViewAbsentReport from './componant/Portfolio.js/ViewAbsentReport';
import Notice from './componant/Notice';
import Timetable from './componant/TimeTable';
import CreateClassRoom from './componant/Master/CreateClassRoom';
import EditClassroom from './componant/Master/EditClassroom';
import ClassRoom from './componant/Master/ClassRoom';
import AddPTM from './componant/AddPTM';
import PTM from './componant/PTM';
import AttendanceReport from './componant/Reports/AttendanceReport';
import HomeworkStatusReport from './componant/Reports/HomeworkStatusReport';
import ExamStatusReport from './componant/Reports/ExamStatusReport';
import EditPTM from './componant/EditPTM';
import ExamMarksReport from './componant/Reports/ExamMarksReport';
import InquiryReport from './componant/Reports/InquiryReport';
import FeesReports from './componant/Reports/FeesReports';
import IncomeExpenseReport from './componant/Reports/IncomeExpenseReport';
import StaffReport from './componant/Reports/StaffReport';
import StudentReport from './componant/Reports/StudentReport';
import Conclusion from './componant/Conclusion';
import EditConclusion from './componant/EditConclusion';
import GujaratiReport from './componant/Reports/GujaratiReport';
import GetTimetable from './componant/GetTimetable';
import EnglishReport from './componant/Reports/EnglishReport';
import MathsReport from './componant/Reports/MathsReport';
import CreateEnghlishReport from './componant/Reports/CreateEnghlishReport';
import CreateGujaratiReport from './componant/Reports/CreateGujaratiReport';
import EditGujaratiReport from './componant/Reports/EditGujaratiReport';
import CreateMathsReport from './componant/Reports/CreateMathsReport';
import WelcomeTest from './componant/Reports/WelcomeTest';
import GetWelcomeTest from './componant/Reports/GetWelcomeTest';
import EditWelcomeTest from './componant/Reports/EditWelcomeTest';
import EditEnglishReport from './componant/Reports/EditEnglishReport';
import EditMathsReport from './componant/Reports/EditMathsReport';
import InquiryView from './componant/InquiryView';
import Approval from './componant/Approval';
import ContactUs from './componant/Master/ContactUs';
import AddContact from './componant/Master/AddContact';
import EditContact from './componant/Master/EditContact';
import FeesStudent from './componant/FeesStudent';
import Increypt from './componant/Portfolio.js/Increypt';

const PrivateRoute = ({ element }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    return <Navigate to="/login" />;
  }
  return element;
};
function App() {

  let userData = JSON.parse(localStorage.getItem("userData"));
  const location = useLocation();
  return (
    <>
      {userData && location.pathname !== '/login' ? (
        <Navbar />
      ) : null}

      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/stafftype" element={<PrivateRoute element={<StaffType />} />} />
        <Route path="/createstafftype" element={<PrivateRoute element={<CreateStaffType />} />} />
        <Route path="/editstafftype/:id" element={<PrivateRoute element={<EditStaffType />} />} />
        <Route path="/medium" element={<PrivateRoute element={<Medium />} />} />
        <Route path="/createmedium" element={<PrivateRoute element={<CreateMedium />} />} />
        <Route path="/editmedium/:id" element={<PrivateRoute element={<EditMedium />} />} />
        <Route path="/shift" element={<PrivateRoute element={<Shift />} />} />
        <Route path="/createshift" element={<PrivateRoute element={<CreateShift />} />} />
        <Route path="/editshift/:id" element={<PrivateRoute element={<EditShift />} />} />
        <Route path="/board" element={<PrivateRoute element={<Board />} />} />
        <Route path="/createboard" element={<PrivateRoute element={<CreateBoard />} />} />
        <Route path="/editboard/:id" element={<PrivateRoute element={<EditBoard />} />} />
        <Route path="/batch" element={<PrivateRoute element={<Batch />} />} />
        <Route path="/createbatch" element={<PrivateRoute element={<CreateBatch />} />} />
        <Route path="/editbatch/:id" element={<PrivateRoute element={<EditBatch />} />} />
        <Route path="/student" element={<PrivateRoute element={<Student />} />} />
        <Route path="/createstudent" element={<PrivateRoute element={<CreateStudent />} />} />
        <Route path="/editstudent/:id" element={<PrivateRoute element={<EditStudent />} />} />
        <Route path="/inquiry" element={<PrivateRoute element={<Inquiry />} />} />
        <Route path="/createinquiry" element={<PrivateRoute element={<CreateInquiry />} />} />
        <Route path="/editinquiry/:id" element={<PrivateRoute element={<EditInquiry />} />} />
        <Route path="/attendance" element={<PrivateRoute element={<Attendance />} />} />
        <Route path="/createattendance" element={<PrivateRoute element={<CreateAttendance />} />} />
        <Route path="/editattendance/:id" element={<PrivateRoute element={<EditAttendance />} />} />
        <Route path="/referencetype" element={<PrivateRoute element={<ReferenceType />} />} />
        <Route path="/createreferencetype" element={<PrivateRoute element={<CreateReferenceType />} />} />
        <Route path="/editreferencetype/:id" element={<PrivateRoute element={<EditReferenceType />} />} />
        <Route path="/expanse" element={<PrivateRoute element={<Expanse />} />} />
        <Route path="/createexpense" element={<PrivateRoute element={<CreateExpense />} />} />
        <Route path="/editexpanse/:id" element={<PrivateRoute element={<EditExpanse />} />} />
        <Route path='/homeworkstatus' element={<PrivateRoute element={<HomeworkStatus />} />} />
        <Route path='/createhomeworkstatus/:id' element={<PrivateRoute element={<AddHomeworkStatus />} />} />
        <Route path='/absentreport' element={<PrivateRoute element={<AbsentReport />} />} />
        {/* <Route path='/viewabsentreport/:ids' element={<ViewAbsentReport />} /> */}
        <Route path='/viewabsentreport/:id' element={<ViewAbsentReport />} />
        {/* <Route path='/viewabsentreport/:ids' element={<Increypt />} /> */}
        <Route path='/notice' element={<PrivateRoute element={<Notice />} />} />
        <Route path='/timetable' element={<PrivateRoute element={<Timetable />} />} />
        <Route path='/inquiryview/:id' element={<PrivateRoute element={<InquiryView />} />} />
        <Route path='/contactus' element={<PrivateRoute element={<ContactUs />} />} />
        <Route path='/addcontact' element={<PrivateRoute element={<AddContact />} />} />
        <Route path='/editcontact/:id' element={<PrivateRoute element={<EditContact />} />} />



        <Route path="/class" element={<PrivateRoute element={<ClassRoom />} />} />
        <Route path="/createclassroom" element={<PrivateRoute element={<CreateClassRoom />} />} />
        <Route path="/editclassroom/:id" element={<PrivateRoute element={<EditClassroom />} />} />
        <Route path="/incometype" element={<PrivateRoute element={<IncomeType />} />} />
        <Route path="/createincometype" element={<PrivateRoute element={<CreateIncomeType />} />} />
        <Route path="/editincometype/:id" element={<PrivateRoute element={<EditIncomeType />} />} />
        <Route path="/expansetype" element={<PrivateRoute element={<ExpanseType />} />} />
        <Route path="/createexpansetype" element={<PrivateRoute element={<CreateExpanseType />} />} />
        <Route path="/editexpansetype/:id" element={<PrivateRoute element={<EditExpanseType />} />} />
        <Route path="/standard" element={<PrivateRoute element={<Standard />} />} />
        <Route path="/createstandard" element={<PrivateRoute element={<CreateStandard />} />} />
        <Route path="/editstandard/:id" element={<PrivateRoute element={<EditStandard />} />} />
        <Route path="/subject" element={<PrivateRoute element={<Subject />} />} />
        <Route path="/createsubject" element={<PrivateRoute element={<CreateSubject />} />} />
        <Route path="/editsubject/:id" element={<PrivateRoute element={<EditSubject />} />} />

        <Route path="/country" element={<PrivateRoute element={<Country />} />} />
        <Route path="/addcountry" element={<PrivateRoute element={<CountryAdd />} />} />
        <Route path="/editcountry/:id" element={<PrivateRoute element={<CountryEdit />} />} />
        <Route path="/state" element={<PrivateRoute element={<State />} />} />
        <Route path="/addstate" element={<PrivateRoute element={<StateAdd />} />} />
        <Route path="/editstate/:id" element={<PrivateRoute element={<StateEdit />} />} />
        <Route path="/city" element={<PrivateRoute element={<City />} />} />
        <Route path="/addcity" element={<PrivateRoute element={<CityAdd />} />} />
        <Route path="/editcity/:id" element={<PrivateRoute element={<CityEdit />} />} />
        <Route path="/area" element={<PrivateRoute element={<Area />} />} />
        <Route path="/addarea" element={<PrivateRoute element={<AreaAdd />} />} />
        <Route path="/editarea/:id" element={<PrivateRoute element={<Areaedit />} />} />
        <Route path="/category" element={<PrivateRoute element={<Category />} />} />
        <Route path="/addcategory" element={<PrivateRoute element={<CategoryAdd />} />} />
        <Route path="/editcategory/:id" element={<PrivateRoute element={<CategoryEdit />} />} />
        <Route path="/subcategory" element={<PrivateRoute element={<SubCategory />} />} />
        <Route path="/addsubcategory" element={<PrivateRoute element={<SubCategoryAdd />} />} />
        <Route path="/editsubcategory/:id" element={<PrivateRoute element={<SubCategoryEdit />} />} />
        <Route path="/studentdetails/:id" element={<PrivateRoute element={<StudentDetails />} />} />

        <Route path="/branch" element={<PrivateRoute element={<Branch />} />} />
        <Route path="/course" element={<PrivateRoute element={<Course />} />} />
        <Route path="/addbranch" element={<PrivateRoute element={<BranchAdd />} />} />
        <Route path="/editbranch/:id" element={<PrivateRoute element={<BranchEdit />} />} />
        <Route path="/addmaterial" element={<PrivateRoute element={<AddMaterial />} />} />
        <Route path="/material" element={<PrivateRoute element={<Material />} />} />
        <Route path="/editmaterial/:id" element={<PrivateRoute element={<EditMaterial />} />} />
        <Route path="/addnotice" element={<PrivateRoute element={<AddNotice />} />} />
        <Route path="/addincome" element={<PrivateRoute element={<AddIncome />} />} />
        <Route path="/addfees" element={<PrivateRoute element={<AddFees />} />} />
        <Route path="/adduser" element={<PrivateRoute element={<AddUser />} />} />
        <Route path="/addassignhomework" element={<PrivateRoute element={<AddAssignHomeWork />} />} />
        <Route path="/addexam" element={<PrivateRoute element={<AddExam />} />} />
        <Route path="/exam" element={<PrivateRoute element={<Exam />} />} />
        <Route path="/editexam/:id" element={<PrivateRoute element={<EditExam />} />} />
        <Route path="/course" element={<PrivateRoute element={<Course />} />} />
        <Route path="/addcourse" element={<PrivateRoute element={<AddCourse />} />} />
        <Route path="/editcourse/:id" element={<PrivateRoute element={<EditCourse />} />} />
        <Route path="/income" element={<PrivateRoute element={<Income />} />} />
        <Route path="/editincome/:id" element={<PrivateRoute element={<EditIncome />} />} />
        <Route path="/assignhomework" element={<PrivateRoute element={<AssignHomeWork />} />} />
        <Route path="/editassignhomework/:id" element={<PrivateRoute element={<EditAssignHomework />} />} />
        <Route path="/fees" element={<PrivateRoute element={<Fees />} />} />
        <Route path='/studentfees/:id' element={<PrivateRoute element={<FeesStudent />} />} />
        <Route path="/user" element={<PrivateRoute element={<User />} />} />
        <Route path="/editfees/:id" element={<PrivateRoute element={<EditFees />} />} />
        <Route path="/edituser/:id" element={<PrivateRoute element={<EditUser />} />} />
        <Route path="/addexamattendance" element={<PrivateRoute element={<Examattendance />} />} />
        <Route path="/examattendance" element={<PrivateRoute element={<ExamAttendanceDetail />} />} />
        <Route path="/editexamattendance/:id" element={<PrivateRoute element={<EditExamAttendance />} />} />
        <Route path="/addexammarks" element={<PrivateRoute element={<AddExamMarks />} />} />
        <Route path="/viewexammarks" element={<PrivateRoute element={<ViewMarks />} />} />
        <Route path="/addptm" element={<PrivateRoute element={<AddPTM />} />} />
        <Route path="/ptm" element={<PrivateRoute element={<PTM />} />} />
        <Route path='/editptm/:id' element={<PrivateRoute element={<EditPTM />} />} />
        <Route path='/conclusion' element={<PrivateRoute element={<Conclusion />} />} />
        <Route path='/editconclusion/:id' element={<PrivateRoute element={<EditConclusion />} />} />
        {/* <Route path="/editexammarks" element={<PrivateRoute element={<EditExamMarks/>}/>}/> */}
        <Route path="/editexammarks/:id/:id_student" element={<PrivateRoute element={<EditExamMarks />} />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path='/absentreport' element={<AbsentReport/>}/> */}

        {/* reports */}
        <Route path="/attendancereport" element={<PrivateRoute element={<AttendanceReport />} />} />
        <Route path="/homeworkstatusreport" element={<PrivateRoute element={<HomeworkStatusReport />} />} />
        <Route path="/examstatusreport" element={<PrivateRoute element={<ExamStatusReport />} />} />
        <Route path="/exammarksreport" element={<PrivateRoute element={<ExamMarksReport />} />} />
        <Route path="/inquiryreport" element={<PrivateRoute element={<InquiryReport />} />} />
        <Route path="/feesreport" element={<PrivateRoute element={<FeesReports />} />} />
        <Route path="/incomeexpensereport" element={<PrivateRoute element={<IncomeExpenseReport />} />} />
        <Route path="/studentreport" element={<PrivateRoute element={<StudentReport />} />} />
        <Route path="/staffreport" element={<PrivateRoute element={<StaffReport />} />} />
        <Route path="/gujaratireport" element={<PrivateRoute element={<GujaratiReport />} />} />
        <Route path="/mathsreport" element={<PrivateRoute element={<MathsReport />} />} />
        <Route path='/englishreport' element={<PrivateRoute element={<EnglishReport />} />} />
        <Route path='/createenghlishreport' element={<PrivateRoute element={<CreateEnghlishReport />} />} />
        <Route path='/editenghlishreport/:id' element={<PrivateRoute element={<EditEnglishReport />} />} />
        <Route path='/gettimetable' element={<PrivateRoute element={<GetTimetable />} />} />
        <Route path='/creategujaratireport' element={<PrivateRoute element={<CreateGujaratiReport />} />} />
        <Route path='/editgujaratireport/:id' element={<PrivateRoute element={<EditGujaratiReport />} />} />
        <Route path='/createmathsreport' element={<PrivateRoute element={<CreateMathsReport />} />} />
        <Route path='/editmathsreport/:id' element={<PrivateRoute element={<EditMathsReport />} />} />
        <Route path='/welcometest' element={<PrivateRoute element={<WelcomeTest />} />} />
        <Route path='/getwelcometest' element={<PrivateRoute element={<GetWelcomeTest />} />} />
        <Route path='/editwelcometest/:id' element={<PrivateRoute element={<EditWelcomeTest />} />} />
        <Route path='/approval' element={<PrivateRoute element={<Approval />} />} />
      </Routes>
    </>
  );
}

export default App;
