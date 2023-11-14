import { Button } from "@mui/material";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const Employeeproject: React.FC = () => {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  async function EmployeeDetails() {

    const totalprtoject = await Get(`app/EmployeeDailyTask/GetEachEmployeeDailyTaskById?employeeId=${sessionUser.employeeId}`)
    return { totalprtoject };
  }
  const { data }: any = useQuery(
    "EmployeeProjectTaskdetails",
    EmployeeDetails
  );

  return (
    <>
      <div className="container d-flex justify-content-evenly">
        <div className="shadow w-100 bg-light m-1 p-4" style={{ overflow: 'auto', maxHeight: 350 }}>
          <h1 className="display-6 mx-5 " style={{ position: 'fixed' }}>EMPLOYEE DAILY TASK</h1>
          <div className="row">
            <div className="col-md-4">
              <div id="chart-spark1">
              </div>
            </div>
            <div className="col-md-4">
              <div id="chart-spark2">
              </div>
            </div>
            <div className="col-md-4">
              <div id="chart-spark3">
              </div>
            </div>
          </div>

          <div className="row">
            <table className="table table-success table-striped">
              <thead style={{ color: "blue", textAlign: "center" }}>
                <th>Project Name</th>
                <th>Project type</th>
                <th>Status</th>
                <th>Percentage</th>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {data?.totalprtoject?.data.employeeProjects.map((e: any) => (<>
                  <tr>
                    <td style={{ width: "280px" }}>{e.name}</td>
                    <td style={{ width: "280px" }}>{e.type ? (e.type) : ("No mention")}</td>
                    <td style={{ width: "280px" }}>
                      <div id="chart-1">
                        <Button variant="contained" color="warning">{e.status ? (e.status) : ("In-progress")}</Button>
                      </div>
                    </td>
                    <td>

                      <Box sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <CircularProgress size="lg" determinate value={e.percentage}>
                          {e.percentage}
                        </CircularProgress>
                      </Box>
                    </td>
                  </tr>
                </>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>

  )
}
export default Employeeproject;