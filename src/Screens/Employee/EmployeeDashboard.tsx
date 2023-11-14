import { Grid, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import EmployeeTask from "../Employee/EmployeeDashboard/EmployeeTask";
import Employeeproject from "../Employee/EmployeeDashboard/Employeeproject";
import EmployeeDailyTask from "../Employee/EmployeeDashboard/EmployeeDailyTask";
import { Get } from "../../../src/Services/Axios";
import { useQuery } from "react-query";

export const EmployeeDashboard = () => {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  async function EmployeeDetails() {
    const totalattendance = await Get(
      `app/Employee/GetAttendanceByUserId?userId=${sessionUser?.employeeId}`
    );

    const totalprtoject = await Get(
      `app/EmployeeDailyTask/GetEachEmployeeDailyTaskById?employeeId=${sessionUser?.employeeId}`
    );
    return { totalattendance, totalprtoject };
  }
  const { data }: any = useQuery("Employeetotaldetails", EmployeeDetails);

  return (
    <>
      <div style={{ background: "rgba(0,0,0,0.1)" }}>
        <Breadcrumbs className=" mx-3" separator=">">
          <Typography sx={{ fontWeight: "bold", mt: 2 }}>Home</Typography>
        </Breadcrumbs>
        <Grid container>
          <div className="container d-flex justify-content-evenly">
            <Typography sx={{ fontWeight: "bold", fontSize: "35px" }}>
              {sessionUser?.userName}
            </Typography>
          </div>
          <div className="container d-flex justify-content-evenly">
            <div className="shadow w-100 bg-light m-2" style={{ height: 250 }}>
              <Grid container sx={{ mt: 4 }}>
                <Grid xs={2.4}>
                  <div className="card m-2 bg-primary text-light text-center">
                    {data?.totalprtoject?.data?.employeeProjects?.length || "0"}
                    <span className="m-0 fs-4 fw-bold text-center">
                      TOTAL PROJECTS
                    </span>
                  </div>
                </Grid>
                <Grid xs={2.4}>
                  <div className="card m-2 bg-success text-light text-center">
                    {data?.totalprtoject?.data?.totalTask || "0"}
                    <span className="m-0 fs-4 fw-bold text-center">
                      TOTAL TASKS
                    </span>
                  </div>
                </Grid>
                <Grid xs={2.4}>
                  <div className="card m-2 bg-warning text-light text-center">
                    {<>{data?.totalprtoject?.data?.totalCompleted || "0"}</>}
                    <span className="m-0 fs-4 fw-bold text-center">
                      COMPLETED TASK
                    </span>
                  </div>
                </Grid>
                <Grid xs={2.4}>
                  <div className="card m-2 bg-secondary text-light text-center">
                    <>{data?.totalprtoject?.data?.totalInProgress || "0"}</>

                    <span className="m-0 fs-4 fw-bold text-center">
                      IN-PROGRESS
                    </span>
                  </div>
                </Grid>
                <Grid xs={2.4}>
                  <div className="card m-2 bg-danger text-light text-center">
                    {data?.totalprtoject?.data?.totalReadyForUAT || "0"}
                    <span className="m-0 fs-4 fw-bold text-center">
                      READY-FOR-UAT
                    </span>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          <Grid container>
            <EmployeeTask />
          </Grid>
          <Grid container>
            <EmployeeDailyTask />
          </Grid>
          <Grid container>
            <Employeeproject />
          </Grid>
        </Grid>
      </div>
    </>
  );
};
