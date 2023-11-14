import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

const months = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

export const EmployeeLeaveReport = () => {
  const location = useLocation();
  const [dateFilter, setDateFilter] = useState<any>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [rows, setRows] = useState<any>([]);

  async function fetchData() {
    try {
      const teamId = location.state?.TeamId || "";
      const response: any = await Get(
        `app/Team/GetTeamleavedetails?TeamId=2${teamId}&month=${dateFilter.month}&year=${dateFilter.year}`
      );

      if (response?.data) {
        const uniqueRows = response.data.filter(
          (row: any, index: number, self: any[]) =>
            self.findIndex((r) => r.employeeName === row.employeeName) === index
        );
        setRows(uniqueRows);
      } else {
        console.error("Error fetching team leave details:", response?.error);
      }
    } catch (error) {
      console.error("Error fetching team leave details:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const daysInMonth = new Date(dateFilter.year, dateFilter.month, 0).getDate();

  const dateLabels = Array.from({ length: daysInMonth }, (_, i) => {
    const currentDate = new Date(dateFilter.year, dateFilter.month - 1, i + 1);
    return currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  });

  function calculateHours(inTime: string, outTime: string) {
    const inTimeParts = inTime.split(":");
    const outTimeParts = outTime.split(":");

    const inHours = parseInt(inTimeParts[0], 10);
    const inMinutes = parseInt(inTimeParts[1], 10);

    const outHours = parseInt(outTimeParts[0], 10);
    const outMinutes = parseInt(outTimeParts[1], 10);

    const totalMinutes = (outHours - inHours) * 60 + (outMinutes - inMinutes);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes}`;
  }

  function ApplyFilter() {}
  function reset() {}

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="slateblue">
          <GroupsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Team
        </Typography>
        <Typography color="slateblue">
          <GroupsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          EmployeeLeaveReport
        </Typography>
      </Breadcrumbs>

      <h2 className="m-4">Employee Leave Report</h2>
      <div className="well mx-auto mt-4">
        <div className="container">
          <div className="row">
            <div className="d-flex mx-2">
              <select
                className="form-select m-2 col-md-5"
                style={{ width: "230px" }}
                defaultValue={dateFilter.year}
                onChange={(e: any) => {
                  setDateFilter({ ...dateFilter, year: e.target.value });
                }}
              >
                <option selected disabled>
                  Select Year
                </option>
                <option value={2023}>2023</option>
              </select>
              <select
                className="form-select m-2 col-md-5"
                style={{ width: "230px" }}
                defaultValue={dateFilter.month}
                onChange={async (e: any) => {
                  await setDateFilter({ ...dateFilter, month: e.target.value });
                }}
              >
                <option selected disabled>
                  Select Month
                </option>
                {months.map((month) => (
                  <option
                    key={month.id}
                    value={month.id}
                    disabled={month.id > new Date().getMonth() + 1}
                  >
                    {month.name}
                  </option>
                ))}
              </select>
              <div className="col-md-7">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <Button
                      variant="contained"
                      endIcon={<SearchIcon />}
                      className="mx-2 mt-4"
                      onClick={() => ApplyFilter()}
                    >
                      Search
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<RefreshIcon />}
                      className="mx-2 mt-4"
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="well mx-auto mt-4">
        <div className="container mt-4" style={{ marginLeft: "15px" }}>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="table table-bordered ">
              <thead>
                <tr>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "slateblue",
                    }}
                  >
                    Employee Name
                  </th>
                  {dateLabels.map((label, index) => (
                    <th
                      key={index}
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "slateblue",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any) => (
                  <tr key={row.employeeId}>
                    <td>{row.employeeName}</td>
                    {dateLabels.map((_label, index) => (
                      <td key={index}>
                        {row.inTime && row.outTime ? (
                          `${calculateHours(row.inTime, row.outTime)} hours`
                        ) : (
                          <span style={{ color: "red" }}>ABS</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
