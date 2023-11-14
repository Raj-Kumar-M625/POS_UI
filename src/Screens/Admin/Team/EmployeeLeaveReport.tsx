import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import BackDrop from "../../../CommonComponents/BackDrop";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { DownloadLeaveReport } from "../../../Services/TeamService";
import { Calendar } from "./Calendar";
import { useContextProvider } from "../../../CommonComponents/Context";
import { ADMIN } from "../../../Constants/Roles";

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
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { role } = useContextProvider();
  const [dateFilter, setDateFilter] = useState<any>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [TeamView, setTeamView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });
  const [rows, setRows] = useState<any>([]);
  const [Days, setDays] = useState<any>([]);

  async function fetchData() {
    setLoading(true);
    try {
      const response: any = await Get(
        `app/Team/GetTeamleavedetails?TeamId=${location.state?.data?.id}&month=${dateFilter.month}&year=${dateFilter.year}`
      );
      if (response?.data) {
        setRows(response?.data?.teamLeaveDetails || []);
        setDays(response?.data?.days || []);
      } else {
        console.error("Error fetching team leave details:", response?.error);
      }
    } catch (error) {
      console.error("Error fetching team leave details:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [refetch]);

  function GetHours(inTime: string, outTime: string) {
    if (!outTime) return `${0}hr ${0}min`;
    const startDate = new Date(inTime);
    const endDate = new Date(outTime);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours}hr ${minutes}min`;
  }

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

  const days: number[] = [];
  for (let i = 1; i <= dateLabels.length; i++) {
    days.push(i);
  }

  const handleClickOpen = () => {
    setTeamView({ edit: true });
  };

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="slateblue" to={`/${role}/Team`}>
          <Typography sx={{ fontWeight: "bold" }}>Team</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>
          Employee Leave Report
        </Typography>
      </Breadcrumbs>
      <Typography align="center" className="fs-3">
        Team Name:{" "}
        <span className="fw-bolder">{location.state?.data?.name}</span>
      </Typography>
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
                  setDateFilter({ ...dateFilter, month: e.target.value });
                  setRefetch(!refetch);
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
                    >
                      Search
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<RefreshIcon />}
                      className="mx-2 mt-4"
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
      <div className="col-md-11">
        <div className="row justify-content-end">
          <div className="col-auto">
            <Button
              variant="contained"
              className="float-md-end mx-2"
              onClick={() => {
                DownloadLeaveReport(rows, dateLabels, Days);
              }}
            >
              Download
              <DownloadIcon className="mx-1" />
            </Button>
            {role === ADMIN && (
              <Button
                variant="contained"
                className=" float-md-end mx-2"
                onClick={handleClickOpen}
              >
                Add Holidays
                <AddIcon className="mx-1" />
              </Button>
            )}
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
                      width: "50%",
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
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "slateblue",
                      width: "30rem",
                    }}
                  >
                    Count of Absents
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows &&
                  rows?.map((row: any) => {
                    return (
                      <tr key={row.employeeId}>
                        <td>{row.employeeName}</td>
                        {days?.map((day, index) => {
                          var date = row.employeeTimes.find(
                            (x: any) => new Date(x.inTime).getDate() == day
                          );
                          return (
                            <td style={{ width: "5rem" }} key={index}>
                              {date?.inTime ? (
                                GetHours(date?.inTime, date?.outTime)
                              ) : Days[index]?.holidayApplicable ? (
                                Days[index]?.holidayName
                              ) : (
                                <span style={{ color: "red" }}>ABS</span>
                              )}
                            </td>
                          );
                        })}
                        <td>
                          {days[days.length - 1] -
                            row.employeeTimes.length -
                            Days?.filter(
                              (x: any) => x.holidayApplicable == true
                            ).length}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BackDrop open={loading} />
      <Calendar
        openDialog={TeamView}
        setReload={setRefetch}
        setOpenDialog={setTeamView}
        setRows={setRows}
      />
    </>
  );
};
