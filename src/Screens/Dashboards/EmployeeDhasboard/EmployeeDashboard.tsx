import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useLocation } from "react-router-dom";
// import { EmployeeAttendance } from "./EmployeeAttendance";
import EmployeeTask from "./EmployeeTask";
import Employeeproject from "./Employeeproject";
import EmployeeDailyTask from "./EmployeeDailyTask";
// import { useEffect } from "react";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useContextProvider } from "../../../CommonComponents/Context";

export const EmployeeDashboard = () => {
  const location = useLocation();
  const { role } = useContextProvider();

  async function EmployeeDetails() {
    const totalattendance = await Get(
      `app/Employee/GetAttendanceByEmployeeId?userId=${location.state.userId}`
    );

    const totalprtoject = await Get(
      `app/EmployeeDailyTask/GetEachEmployeeDailyTaskById?employeeId=${location.state.employeeId}`
    );
    return { totalattendance, totalprtoject };
  }
  const { data }: any = useQuery("Employeetotaldetails", EmployeeDetails);

  return (
    <>
      <div style={{ background: "rgba(0,0,0,0.1)" }}>
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link color="inherit" to={`/${role}/Employee`}>
            <Typography sx={{ fontWeight: "bold" }}>Employee</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>
            Employee Dashboard
          </Typography>
        </Breadcrumbs>
        <div className="container d-flex justify-content-evenly">
          <Typography sx={{ fontWeight: "bold", fontSize: "35px" }}>
            {location.state?.Employeename}
          </Typography>
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
