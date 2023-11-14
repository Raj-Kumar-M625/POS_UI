import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
// import { EmployeeAttendance } from "./EmployeeAttendance";
import EmployeeTask from "./EmployeeTask";
import Employeeproject from "./Employeeproject";
import EmployeeDailyTask from "./EmployeeDailyTask";
// import { useEffect } from "react";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
// import BadgeIcon from "@mui/icons-material/Badge";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const EmployeeDashboard = () => {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  async function EmployeeDetails() {
    const totalattendance = await Get(
      `app/Employee/GetAttendanceByEmployeeId?userId=${sessionUser.employeeId}`
    );

    const totalprtoject = await Get(
      `app/EmployeeDailyTask/GetEachEmployeeDailyTaskById?employeeId=${sessionUser.employeeId}`
    );
    return { totalattendance, totalprtoject };
  }
  const { data }: any = useQuery("Employeetotaldetails", EmployeeDetails);

  return (
    <>
    <div style={{background:"rgba(0,0,0,0.1)"}}>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
      <Link color="inherit" to="/Employee">
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit"/>
          Home
        </Link>
        <Typography color="slateblue">
          <DashboardIcon sx={{ mr: 0.2}} fontSize="inherit"/>
          Employee Dashboard</Typography>
      </Breadcrumbs>
      <div className="container d-flex justify-content-evenly">
        <Typography sx={{fontWeight:"bold", fontSize:'35px'}}>{sessionUser.userName}</Typography>
      </div>
      <div className="container d-flex justify-content-evenly">

          <div className="shadow w-100 bg-light m-2" style={{ height: 250 }}>
            <h1 className="display-6 mx-5">EMPLOYEE </h1>
            <div className="main">
              <div className="card m-2 bg-primary text-light text-center">
                {data?.totalprtoject?.data?.employeeProjects?.length || "0"}
                <span className="m-0 fs-5 fw-bold text-center">
                  TOTAL PROJECTS
                </span>
              </div>
              <div className="card m-2 bg-success text-light text-center">
                {data?.totalprtoject?.data?.totalTask || "0"}
                <span className="m-0 fs-4 fw-bold text-center">
                  TOTAL TASKS
                </span>
              </div>
              <div className="card m-2 bg-warning text-light text-center">
                {<>{data?.totalprtoject?.data?.totalCompleted || "0"}</>}

                <span className="m-0 fs-5 fw-bold text-center">
                  COMPLETED TASK
                </span>
              </div>
              <div className="card m-2 bg-secondary text-light text-center">
                <>{data?.totalprtoject?.data?.totalInProgress || "0"}</>

                <span className="m-0 fs-4 fw-bold text-center">
                  IN-PROGRESS
                </span>
              </div>
              <div className="card m-2 bg-danger text-light text-center">
                {data?.totalprtoject?.data?.totalReadyForUAT || "0"}
                <span className="m-0 fs-4 fw-bold text-center">
                  READY-FOR-UAT
                </span>
              </div>
            </div>
          </div>
        </div>

        <EmployeeTask />
        <EmployeeDailyTask />
        <Employeeproject />
      </div>
    </>
  );
};
