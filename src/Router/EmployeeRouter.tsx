import { Route, Routes } from "react-router-dom";
import { Authorize } from "../CommonComponents/Authorize";
import { HistoryList } from "../Screens/Admin/History/HistoryList";
import { EmpTaskList } from "../Screens/Employee/Task/EmpTaskList";
import { EmpProjectList } from "../Screens/Employee/Project/EmpProjectList";
import { EmpUserStoryList } from "../Screens/Employee/Project/UserStory/EmpUserStoryList";
import { EmpUserInterfacelist } from "../Screens/Employee/Project/UserInterface/EmpUserInterfacelist";
import { EmpTaskProgressList } from "../Screens/Employee/Task/EmpTaskProgressList";
import SelectEmployeeUserInterface from "../Screens/Employee/Task/UserInterfaceListScreen";
import SelectEmployeeUserStory from "../Screens/Employee/Task/UserStoryListScreen";
import CreateTask from "../Screens/Employee/Task/CreateTaskScreen";
import { EmpTeamList } from "../Screens/Employee/Team/EmpTeamList";
import { EmployeeDashboard } from "../Screens/Employee/EmployeeDashboard";
import { WhatsappTaskList } from "../Screens/Employee/Task/WhatsappTaskList";
import { EmpTaskHistory } from "../Screens/Employee/Task/EmpTaskHistory";
import { DailyTask } from "../Screens/Employee/Task/DailyTask";
import { EmployeeTime } from "../Screens/Employee/EmployeeTime";
import { DailyTaskOverview } from "../Screens/Employee/Task/DailyTaskOverview";
import { AssignUI } from "../Screens/Employee/Project/UserStory/AssignUI";
import { LeaveModule } from "../Screens/Employee/LeaveReport/LeaveModule";
import SelectUserStoryList from "../Screens/Employee/Task/SelectUserStroyList.tsx";
import SelectUserInterfaceList from "../Screens/Employee/Task/SelectUserInterfaceList.tsx.tsx";

export const EmployeeRouter = () => {
  return (
    <>
      <Routes>
        <Route
          path="/Employee"
          element={
            <Authorize role="Employee">
              <EmployeeDashboard />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/HistoryList"
          element={
            <Authorize role="Employee">
              <HistoryList />
            </Authorize>
          }
        ></Route>

        <Route
          path="/Employee/Task"
          element={
            <Authorize role="Employee">
              <EmpTaskList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/Project"
          element={
            <Authorize role="Employee">
              <EmpProjectList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/UserStory"
          element={
            <Authorize role="Employee">
              <EmpUserStoryList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/UserInterface"
          element={
            <Authorize role="Employee">
              <EmpUserInterfacelist />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/TaskProgress"
          element={
            <Authorize role="Employee">
              <EmpTaskProgressList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/SelectUserStory"
          element={
            <Authorize role="Employee">
              <SelectEmployeeUserStory />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/SelectUserStoryList"
          element={
            <Authorize role="Employee">
              <SelectUserStoryList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/SelectUserInterfaceList"
          element={
            <Authorize role="Employee">
              <SelectUserInterfaceList />
            </Authorize>
          }
        ></Route>

        <Route
          path="/Employee/SelectUserInterface"
          element={
            <Authorize role="Employee">
              <SelectEmployeeUserInterface />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/CreateTask"
          element={
            <Authorize role="Employee">
              <CreateTask />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/TaskHistory"
          element={
            <Authorize role="Employee">
              <EmpTaskHistory />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/WhatsappTaskList"
          element={
            <Authorize role="Employee">
              <WhatsappTaskList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/Team"
          element={
            <Authorize role="Employee">
              <EmpTeamList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/EmployeeTime"
          element={
            <Authorize role="Employee">
              <EmployeeTime />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/DailyTask"
          element={
            <Authorize role="Employee">
              <DailyTask />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/Team"
          element={
            <Authorize role="Employee">
              <EmpTaskList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/DailyTaskOverview"
          element={
            <Authorize role="Employee">
              <DailyTaskOverview />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/AssignUI"
          element={
            <Authorize role="Employee">
              <AssignUI />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Employee/Leave"
          element={
            <Authorize role="Employee">
              <LeaveModule />
            </Authorize>
          }
        ></Route>
      </Routes>
    </>
  );
};
