import {
  // Route,
  Routes,
} from "react-router-dom";
// import { Authorize } from "../CommonComponents/Authorize";
// import { CUSTOMER } from "../Constants/Roles";
// import { AdminDashboard } from "../Screens/Dashboards/AdminDashboard";
// import { TaskProgressList } from "../Screens/Admin/Task/TaskProgressList";
// import { ProjectList } from "../Screens/Admin/Projects/ProjectList";
// import { TeamList } from "../Screens/Admin/Team/TeamList";
// import { TeamDashBoard } from "../Screens/Dashboards/TeamDashboard/TeamDashboard";
// import EmployeeList from "../Screens/Admin/Employee/EmployeeList";
// import { TaskList } from "../Screens/Admin/Task/TaskList";
// import { TaskQuadrant } from "../Screens/Admin/Task/TaskQuadrant";
// import EmployeeOverView from "../Screens/Admin/Employee/EmployeeOverView";
// import { EmployeeAttendence } from "../Screens/Admin/Attendance/EmployeeAttendence";
// import { Attendance } from "../Screens/Admin/Attendance/Attendance";
// import { ProjectQuadrant } from "../Screens/Admin/Projects/ProjectQuadrant";
// import { UserStoryList } from "../Screens/Admin/Projects/UserStory/UserStoryList";
// import { UserInterfacelist } from "../Screens/Admin/Projects/UserInterface/UserInterfacelist";
// import { EmployeeLeaveReport } from "../Screens/Admin/Team/EmployeeLeaveReport";

export const CustomerRouter = () => {
  return (
    <>
      <Routes>
        {/* <Route
          path="/Customer"
          element={
            <Authorize role={CUSTOMER}>
              <AdminDashboard />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/Task"
          element={
            <Authorize role={CUSTOMER}>
              <TaskList />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/Employee"
          element={
            <Authorize role={CUSTOMER}>
              <EmployeeList />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/EmployeeOverView"
          element={
            <Authorize role={CUSTOMER}>
              <EmployeeOverView />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/Attendance"
          element={
            <Authorize role={CUSTOMER}>
              <Attendance />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/EmployeeAttendence"
          element={
            <Authorize role={CUSTOMER}>
              <EmployeeAttendence />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/TaskProgress"
          element={
            <Authorize role={CUSTOMER}>
              <TaskProgressList />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/Project"
          element={
            <Authorize role={CUSTOMER}>
              <ProjectList />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/Team"
          element={
            <Authorize role={CUSTOMER}>
              <TeamList />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/TeamDashBoard"
          element={
            <Authorize role={CUSTOMER}>
              <TeamDashBoard />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/TeamDashBoard"
          element={
            <Authorize role={CUSTOMER}>
              <TeamDashBoard />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/TeamTaskQuadrant"
          element={
            <Authorize role={CUSTOMER}>
              <TaskQuadrant />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/TeamTaskQuadrant"
          element={
            <Authorize role={CUSTOMER}>
              <TaskQuadrant />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/ProjectQuadrant"
          element={
            <Authorize role={CUSTOMER}>
              <ProjectQuadrant />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/UserStory"
          element={
            <Authorize role={CUSTOMER}>
              <UserStoryList />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/UserInterface"
          element={
            <Authorize role={CUSTOMER}>
              <UserInterfacelist />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Customer/EmployeeleaveReport"
          element={
            <Authorize role={CUSTOMER}>
              <EmployeeLeaveReport />
            </Authorize>
          }
        ></Route> */}
        {/* <Route
          path="/Admin/TeamQuadrant"
          element={
            <Authorize role="Admin">
              <TeamQuadrant />
            </Authorize>
          }
        ></Route> */}
      </Routes>
    </>
  );
};
