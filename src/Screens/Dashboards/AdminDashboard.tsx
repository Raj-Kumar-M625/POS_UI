import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState, useEffect } from "react";
import { Get } from "../../Services/Axios";
import { ToolTip } from "../../CommonComponents/ToolTip";
import "../../StyleSheets/AdminDashboard.css";
import { ConvertTime } from "../../Utilities/Utils";

export const AdminDashboard = () => {
  const [Data, setData] = useState<any>({});
  const [teamProject, setTeamProject] = useState<any>([]);
  const [team, setTeam] = useState<any>({});
  const [teamEmployee, setTeamEmployee] = useState<any>([]);
  const [employeeTime, setEmployeeTime] = useState<any>([]);
  const [teamWeeklyActiveProject, setteamWeeklyActiveProject] = useState<any>(
    []
  );
  const [unAssignedHours, setUnAssignedHours] = useState<any>();
  let counter = 0;
  let projectCounter = 0;
  let EmployeeCounter = 0;

  useEffect(() => {
    const dashboardData = Get("app/Common/GetDashboardData");
    dashboardData.then((response: any) => {
      setData(response.data);
      const teamList = response?.data?.teamList;
      const totalUnAssignedHours = teamList.reduce(
        (sum: number, team: { unAssignedHours: number }) =>
          sum + (team.unAssignedHours < 0 ? 0 : team.unAssignedHours),
        0
      );
      setUnAssignedHours(totalUnAssignedHours);
      let tempProject = response?.data?.teamProjects?.filter(
        (item: any) => item?.teamId == response?.data?.teamList[0].teamId
      );
      let tempEmployee = response?.data?.teamEmployees?.filter(
        (item: any) => item?.teamId == response?.data?.teamList[0].teamId
      );

      let tempTeamActiveProject = response?.data?.teamWeeklyProjectItem?.filter(
        (item: any) => item?.teamId == response?.data?.teamList[0].teamId
      );

      let employeeTime = response?.data?.employeeTime?.filter(
        (item: any) => item?.teamId == response?.data?.teamList[0].teamId
      );

      setTeam({
        Id: response?.data?.teamList[0].teamId,
        name: response?.data?.teamList[0].name,
      });
      setteamWeeklyActiveProject(tempTeamActiveProject);
      setEmployeeTime(employeeTime);
      setTeamProject(tempProject);
      setTeamEmployee(tempEmployee);
    });
  }, []);

  const handleteamClick = (team: any) => {
    var teamProject = Data.teamProjects?.filter(
      (item: any) => item?.teamId == team.teamId
    );
    var teamEmployee = Data.teamEmployees?.filter(
      (item: any) => item?.teamId == team.teamId
    );
    var employeeTime = Data.employeeTime?.filter(
      (item: any) => item?.teamId == team.teamId
    );

    var tempTeamActiveProject = Data.teamWeeklyProjectItem?.filter(
      (item: any) => item?.teamId == team.teamId
    );
    setteamWeeklyActiveProject(tempTeamActiveProject);
    setTeam({ Id: team.teamId, name: team.name });
    setTeamEmployee(teamEmployee);
    setTeamProject(teamProject);
    setEmployeeTime(employeeTime);
  };

  return (
    <>
      <div style={{ background: "#dff0ed", height: "100vh" }}>
        <Breadcrumbs className=" mx-3" separator=">">
          <Typography className="mt-3" sx={{ fontWeight: "bold" }}>
            Home
          </Typography>
        </Breadcrumbs>
        <div className="container  d-flex justify-content-evenly">
          <div
            className="shadow bg-light overflow-scroll"
            style={{ height: 350, width: "22vw" }}
          >
            <h5 className="text-center m-1 text-primary">
              Attendance ({teamEmployee?.length})
            </h5>
            <h6 className="text-center">Team Name : {team?.name}</h6>
            <div className=" m-3">
              {employeeTime?.length > 0 ? (
                <table className="table table-bordered m-2">
                  <tr>
                    <th className="text-left">Employee Name</th>
                    <th className="text-center">In Time</th>
                    <th className="text-center">Out Time </th>
                  </tr>
                  {employeeTime?.map((e: any) => {
                    return (
                      <tr key={e.employeeId}>
                        <td className="text-left">{e.employeeName}</td>
                        <td className={`text-center`}>
                          {ConvertTime(e.inTime, "AM")}
                        </td>
                        <td className="text-center">
                          {ConvertTime(e.outTime, "PM")}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              ) : (
                <h4 className="text-center m-3">
                  <ErrorOutlineIcon className="fs-2" /> No Employees
                </h4>
              )}
            </div>
          </div>
          <div
            className="shadow mx-2 bg-light d-flex flex-column align-items-center"
            style={{ height: "50vh", width: "36vw" }}
          >
            <h5
              className="text-center m-1 position-sticky"
              style={{ color: "#eb4007" }}
            >
              Un Assigned Hours ({unAssignedHours})
            </h5>
            <div
              className="container w-75 overflow-scroll m-3"
              style={{ height: "50vh" }}
            >
              <table className="table table-bordered m-2">
                <tr>
                  <th className="text-left">Sl. No</th>
                  <th className="text-left">Team Name</th>
                  <th className="text-center">Assigned Hours</th>
                  <th className="text-center">Un Assigned Hours</th>
                </tr>
                {Data?.teamList?.map((e: any) => {
                  counter++;
                  return (
                    <tr key={e.name}>
                      <td className="text-left">{counter}.</td>
                      <td
                        className="text-left"
                        style={{
                          color: `${team.Id == e.teamId ? "#1031e8" : ""}`,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          handleteamClick(e);
                        }}
                      >
                        {e.name}
                      </td>
                      <td
                        className={`text-center ${
                          e.assignedHours < 40 ? "text-bold" : "text-success"
                        }`}
                      >
                        {e.assignedHours}hrs
                      </td>
                      <td className="text-center">
                        {e.unAssignedHours > 0 ? e.unAssignedHours : 0}hrs
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
          <div
            className="shadow mx-2 overflow-scroll d-flex flex-column align-items-center bg-light"
            style={{ height: 350, width: "30vw" }}
          >
            <h5 className="text-center m-1" style={{ color: "#07eb1a" }}>
              Active Projects For Week
            </h5>
            <div>
              {teamWeeklyActiveProject?.length > 0 ? (
                (() => {
                  const projectData: Record<string, number> = {};
                  teamWeeklyActiveProject.forEach((e: any) => {
                    if (!projectData[e.projectName]) {
                      projectData[e.projectName] = 0;
                    }
                    projectData[e.projectName] += e.assignedHours;
                  });

                  const projectArray = Object.keys(projectData).map(
                    (projectName) => ({
                      projectName,
                      assignedHours: projectData[projectName],
                    })
                  );
                  projectArray.sort(
                    (a: any, b: any) => b.assignedHours - a.assignedHours
                  );
                  return (
                    <div className="container w-75">
                      <table className="table table-bordered mt-2">
                        <tr>
                          <th className="text-left">Sl. No</th>
                          <th className="text-left">Project Name</th>
                          <th className="text-center">Assigned Hours</th>
                        </tr>
                        {projectArray.map((e, index) => (
                          <tr key={e.projectName}>
                            <td className="text-left">{index + 1}.</td>
                            <td className="text-left">{e.projectName}</td>
                            <td className="text-center">
                              {e.assignedHours} hrs
                            </td>
                          </tr>
                        ))}
                      </table>
                    </div>
                  );
                })()
              ) : (
                <h4 className="text-center m-5">
                  <ErrorOutlineIcon className="fs-2" /> No Projects
                </h4>
              )}
            </div>

            {/* <Link to="/Admin/ProjectDashboard">
              <Button variant="contained" className="mt-3">
                <DashboardIcon className="mx-1" /> View Dashboard
              </Button>
            </Link> */}
          </div>
        </div>
        <div className="container  d-flex justify-content-evenly mt-2">
          <div
            className="shadow w-50 m bg-light overflow-scroll scroll1 position-relative"
            style={{ height: 300 }}
          >
            <h5 className="text-center m-1" style={{ color: "#17e8de" }}>
              Team Projects ({teamProject?.length})
            </h5>
            <h6 className="text-center">Team Name : {team?.name}</h6>
            {teamProject?.length > 0 ? (
              <div className="container w-75">
                <table className="table table-bordered mt-2">
                  <tr>
                    <th className="text-left">Sl. No</th>
                    <th className="text-left">Project Name</th>
                    <th className="text-left">Status</th>
                    <th className="text-center">Percentage</th>
                  </tr>
                  {teamProject?.map((e: any) => {
                    projectCounter++;
                    return (
                      <tr key={projectCounter}>
                        <td className="text-left">{projectCounter}.</td>
                        {e.projectName.length > 15 ? (
                          <ToolTip title={e.projectName}>
                            <td>{e.projectName.slice(0, 15) + "..."}</td>
                          </ToolTip>
                        ) : (
                          <td>{e.projectName}</td>
                        )}
                        <td
                          className={`text-left ${
                            e.percentage < 100 ? "text-warning" : "test-success"
                          }`}
                        >
                          {e.status}
                        </td>
                        <td className="text-center">{e.percentage}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            ) : (
              <h4 className="text-center m-5">
                <ErrorOutlineIcon className="fs-2" /> No Projects
              </h4>
            )}
          </div>
          &nbsp;&nbsp;
          <div
            className="shadow w-50 bg-light overflow-scroll scroll1 position-relative"
            style={{ height: 300 }}
          >
            <h5 className="text-center m-1" style={{ color: "#17e8de" }}>
              Team Employees ({teamEmployee?.length})
            </h5>
            <h6 className="text-center">Team Name : {team?.name}</h6>
            {teamEmployee?.length > 0 ? (
              <div className="container w-75">
                <table className="table table-bordered mt-2">
                  <tr>
                    <th className="text-left">Sl. No</th>
                    <th className="text-left">Employee Name</th>
                    <th className="text-left">Assigned Hours</th>
                    <th className="text-center">Un Assigned Hours</th>
                  </tr>
                  {teamEmployee?.map((e: any) => {
                    EmployeeCounter++;
                    return (
                      <tr key={EmployeeCounter}>
                        <td className="text-left">{EmployeeCounter}.</td>
                        <td className="text-left">{e.employeeName}</td>
                        <td className="text-center">{e.assignedHours}</td>
                        <td className="text-center">
                          {e.unassignedHours < 0 ? 0 : e.unassignedHours}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            ) : (
              <h4 className="text-center m-5">
                <ErrorOutlineIcon className="fs-2" /> No Employees
              </h4>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
