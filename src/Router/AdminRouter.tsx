import { Route, Routes } from "react-router-dom";
import { Authorize } from "../CommonComponents/Authorize";
import { AdminDashboard } from "../Screens/Dashboards/AdminDashboard";
import { TaskList } from "../Screens/Admin/Task/TaskList";
import EmployeeList from "../Screens/Admin/Employee/EmployeeList";
import { TaskProgressList } from "../Screens/Admin/Task/TaskProgressList";
import { SkillList } from "../Screens/Admin/Skill/SkillList";
import { ProjectList } from "../Screens/Admin/Projects/ProjectList";
import { ProjectQuadrant } from "../Screens/Admin/Projects/ProjectQuadrant";
import { TeamList } from "../Screens/Admin/Team/TeamList";
import { ProjectObjectiveList } from "../Screens/Admin/Projects/ProjectObjective/ProjectObjectiveList";
import { AssignTeamMember } from "../Screens/Admin/Team/AssignTeamMember";
import { TaskQuadrant } from "../Screens/Admin/Task/TaskQuadrant";
import { TeamQuadrant } from "../Screens/Admin/Team/TeamQuadrant";
import { UserStoryList } from "../Screens/Admin/Projects/UserStory/UserStoryList";
import { AssignUI } from "../Screens/Admin/Projects/UserStory/AssignUI";
import { AssignEmployee } from "../Screens/Admin/Projects/AssignEmployee";
import { UserInterfacelist } from "../Screens/Admin/Projects/UserInterface/UserInterfacelist";
import { AssignProject } from "../Screens/Admin/Team/AssignProject";
import AssignSkill from "../Screens/Admin/Skill/AssignSkill";
import { Attendance } from "../Screens/Admin/Attendance/Attendance";
import { EmployeeAttendence } from "../Screens/Admin/Attendance/EmployeeAttendence";
import { GoogleMaps } from "../CommonComponents/GoogleMaps";
import { Comment } from "../Screens/Admin/Comment/Comment";
import { TeamObjectiveList } from "../Screens/Admin/Team/TeamObjective/TeamObjectiveList";
import { TeamWeeklyObjectiveList } from "../Screens/Admin/Team/TeamWeeklyObjective/TeamWeeklyObjectiveList";
import EmployeeOverView from "../Screens/Admin/Employee/EmployeeOverView";
import { TaskOverview } from "../Screens/Admin/Employee/TaskOverview";
import { EmployeeDashboard } from "../Screens/Dashboards/EmployeeDhasboard/EmployeeDashboard";
import { ProjectRoadmapList } from "../Screens/Admin/Projects/ProjectRoadmap/ProjectRoadmapList";
import { TeamDashBoard } from "../Screens/Dashboards/TeamDashboard/TeamDashboard";
import ProjectReportList from "../Screens/Admin/Projects/ProjectReport/ProjectReportList";
import { ProjectDashboard } from "../Screens/Dashboards/ProjectDashboard/ProjectDashboard";
import { ReleaseNotes } from "../Screens/Admin/ReleaseNotes/ReleaseNotes";
// import { Checklist } from "../Screens/Admin/Checklist/Checklist";
// import { ProjectTasks } from "../Screens/Admin/Checklist/ProjectTasks";
import { EmployeeLeaveReport } from "../Screens/Admin/Team/EmployeeLeaveReport";
import { LeaveModule } from "../Screens/Admin/LeaveReport/LeaveModule";
import { LeaveHistoryList } from "../Screens/Admin/LeaveReport/LeaveHistoryList";
import { MonthlyObjective } from "../Screens/Admin/Team/TeamWeeklyObjective/MonthlyObjective";
import { Scrum } from "../Screens/Admin/Employee/Scrum";
import { AssignCustomer } from "../Screens/Admin/Projects/AssignCustomer";
import { useContextProvider } from "../CommonComponents/Context";
import { Commonmaster } from "../Screens/Admin/CommonMaster/CommonMaster";
import { PMOscrum } from "../Screens/Admin/PMOScrum/PMOscrum";

export const AdminRouter = () => {
  const { role } = useContextProvider();
  return (
    <>
      <Routes>
        <Route
          path={`/${role}`}
          element={
            <Authorize role={role}>
              <AdminDashboard />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/Task`}
          element={
            <Authorize role={role}>
              <TaskList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/Employee`}
          element={
            <Authorize role={role}>
              <EmployeeList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/EmployeeDashboard`}
          element={
            <Authorize role={role}>
              <EmployeeDashboard />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/TaskProgress`}
          element={
            <Authorize role={role}>
              <TaskProgressList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/Skill"
          element={
            <Authorize role="Admin">
              <SkillList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/Project`}
          element={
            <Authorize role={role}>
              <ProjectList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/AssignSkill"
          element={
            <Authorize role="Admin">
              <AssignSkill />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/ProjectQuadrant`}
          element={
            <Authorize role={role}>
              <ProjectQuadrant />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/Team`}
          element={
            <Authorize role={role}>
              <TeamList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/ProjectQuadrant/ProjectObjectiveList`}
          element={
            <Authorize role={role}>
              <ProjectObjectiveList />
            </Authorize>
          }
        ></Route>

        <Route
          path="/Admin/Team"
          element={
            <Authorize role="Admin">
              <TeamList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/AssignTeamMember"
          element={
            <Authorize role="Admin">
              <AssignTeamMember />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/TeamTaskQuadrant`}
          element={
            <Authorize role={role}>
              <TaskQuadrant />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/TeamQuadrant`}
          element={
            <Authorize role={role}>
              <TeamQuadrant />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/UserStory`}
          element={
            <Authorize role={role}>
              <UserStoryList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/AssignUI"
          element={
            <Authorize role="Admin">
              <AssignUI />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/AssignEmployee"
          element={
            <Authorize role="Admin">
              <AssignEmployee />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/UserInterface`}
          element={
            <Authorize role={role}>
              <UserInterfacelist />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/AssignProject"
          element={
            <Authorize role="Admin">
              <AssignProject />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/Attendance`}
          element={
            <Authorize role={role}>
              <Attendance />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/EmployeeAttendence`}
          element={
            <Authorize role={role}>
              <EmployeeAttendence />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/Comment"
          element={
            <Authorize role="Admin">
              <Comment />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/map"
          element={
            <Authorize role="Admin">
              <GoogleMaps />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/Comment"
          element={
            <Authorize role="Admin">
              <Comment />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/TeamObjective`}
          element={
            <Authorize role={role}>
              <TeamObjectiveList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/EmployeeOverView`}
          element={
            <Authorize role={role}>
              <EmployeeOverView />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/TaskOverview"
          element={
            <Authorize role="Admin">
              <TaskOverview />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/TeamWeeklyObjective"
          element={
            <Authorize role="Admin">
              <TeamWeeklyObjectiveList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/ProjectQuadrant/ProjectRoadmapList"
          element={
            <Authorize role="Admin">
              <ProjectRoadmapList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/ProjectDashboard"
          element={
            <Authorize role="Admin">
              <ProjectDashboard />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/ProjectQuadrant/ProjectRoadmapList"
          element={
            <Authorize role="Admin">
              <ProjectRoadmapList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/TeamDashBoard`}
          element={
            <Authorize role={role}>
              <TeamDashBoard />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/ProjectQuadrant/ProjectReport"
          element={
            <Authorize role="Admin">
              <ProjectReportList />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/ProjectQuadrant/ProjectRoadmapList`}
          element={
            <Authorize role={role}>
              <ProjectRoadmapList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/TeamDashBoard"
          element={
            <Authorize role="Admin">
              <TeamDashBoard />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/ReleaseNotes"
          element={
            <Authorize role="Admin">
              <ReleaseNotes />
            </Authorize>
          }
        ></Route>
        {/* <Route
          path="/Admin/CheckList"
          element={
            <Authorize role="Admin">
              <Checklist />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/ProjectTasks"
          element={
            <Authorize role="Admin">
              <ProjectTasks />
            </Authorize>
          }
        ></Route> */}
        <Route
          path={`/${role}/EmployeeleaveReport`}
          element={
            <Authorize role={role}>
              <EmployeeLeaveReport />
            </Authorize>
          }
        ></Route>
        <Route
          path={`/${role}/MonthlyObjective`}
          element={
            <Authorize role={role}>
              <MonthlyObjective />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/Scrum"
          element={
            <Authorize role="Admin">
              <Scrum />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/Leave"
          element={
            <Authorize role="Admin">
              <LeaveModule />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/LeaveHistorylist"
          element={
            <Authorize role="Admin">
              <LeaveHistoryList />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/PMOScrum"
          element={
            <Authorize role="Admin">
              <PMOscrum />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/AssignCustomer"
          element={
            <Authorize role="Admin">
              <AssignCustomer />
            </Authorize>
          }
        ></Route>
        <Route
          path="/Admin/CommonMaster"
          element={
            <Authorize role="Admin">
              <Commonmaster />
            </Authorize>
          }
        ></Route>
      </Routes>
    </>
  );
};
