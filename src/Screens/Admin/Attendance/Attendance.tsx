import DataTable from "react-data-table-component";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  ListItemButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import "../../../StyleSheets/Attendence.css";
import { useQuery } from "react-query";
import { Get } from "../../../Services/Axios";
import { useState, useRef } from "react";
import { ConvertDate, ConvertTime, TimeSpan } from "../../../Utilities/Utils";
import BackDrop from "../../../CommonComponents/BackDrop";
import { Attendence } from "../../../Models/Employee/Attendance";
import DownloadIcon from "@mui/icons-material/Download";
import { DownloadAttendanceList } from "../../../Services/CommentService";
import Select from "react-select";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useContextProvider } from "../../../CommonComponents/Context";

type AttendanceCard = {
  Total?: number;
  OnTime?: number;
  Late?: number;
  Present?: number;
  Absent?: number;
  Average?: string;
};

export const Attendance = () => {
  const [rows, setRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterRows, setfilterRows] = useState<any>([]);
  const [filter, setfilter] = useState<Attendence>({});
  const employeeNameRef = useRef<any>(null);
  const departmentRef = useRef<any>(null);
  const [teamNames, setTeamNames] = useState<any>([]);
  const teamNameRef = useRef<any>(null);
  const dateRef = useRef<any>(null);
  const statusRef = useRef<any>(null);
  var department = [];
  const [Card, setCard] = useState<AttendanceCard>({
    Total: 0,
    OnTime: 0,
    Late: 0,
    Present: 0,
    Absent: 0,
    Average: "00:00",
  });
  const { role } = useContextProvider();

  const { isLoading, refetch } = useQuery("Attendance", async () => {
    const empAttendance: any = await Get(
      `app/Employee/GetEmployeeAttendance?selectedDate=${selectedDate.toDateString()}`
    );

    const teamList: any = await Get("app/Team/GetTeamList");
    setTeamNames(teamList.data ?? []);
    setRows(empAttendance?.data?.attendances || []);
    setfilterRows(empAttendance?.data?.attendances || []);
    var late = empAttendance?.data?.attendances.filter(
      (row: any) =>
        new Date(row?.inTime) >
        new Date(`${row?.inTime?.slice(0, 10)}T10:05:01`)
    );
    var onTime = empAttendance?.data?.attendances.filter(
      (row: any) =>
        new Date(row?.inTime) <=
        new Date(`${row?.inTime?.slice(0, 10)}T10:05:01`)
    );
    setCard({
      Total: empAttendance.data.employeeCount,
      OnTime: onTime.length,
      Late: late.length,
      Present: empAttendance.data.present,
      Absent: empAttendance.data.absent,
      Average: "00:00",
    });

    return empAttendance.data;
  });

  var dept = new Set<string>();
  rows.forEach((row: any) => {
    dept.add(row.department);
  });

  department = [...dept];
  department.sort((a: any, b: any) => {
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
  });

  function calculateAverageTime(employeeTime: any): void {
    const dateObjects = employeeTime.map(
      (time: any) => new Date(`${time.inTime ?? "1970-01-01T00:00:00"}`)
    );
    const totalTime = dateObjects.reduce(
      (total: any, time: any) => total + time.getTime(),
      0
    );
    const averageTimeMilliseconds = totalTime / employeeTime.length;
    const averageTime = new Date(averageTimeMilliseconds);
    const averageTimeString = averageTime.toTimeString().slice(0, 5);
    setCard((prev: any) => {
      prev.Average = averageTimeString;
      return prev;
    });
  }

  const columns: any[] = [
    {
      field: "Action",
      name: "Action",
      width: "8rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => (
        <Link to={`/${role}/EmployeeAttendence`} state={{ userId: row.id }}>
          <Tooltip title="view">
            <VisibilityIcon />
          </Tooltip>
        </Link>
      ),
    },
    {
      field: "dayId",
      name: "Day Id",
      width: "8rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => (
        <p className="tableStyle text-right">{row.dayId || "-"}</p>
      ),
    },
    {
      field: "employeeName",
      name: "Employee Name",
      width: 211,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => (
        <p className="tableStyle text-right">{row.employeeName || "-"}</p>
      ),
    },
    {
      field: "teamName",
      name: "TeamName",
      width: 211,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => <p className="tableStyle">{row.teamName}</p>,
    },
    {
      field: "department",
      name: "Department",
      width: 211,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => (
        <p className="tableStyle text-right">{row.department || "-"}</p>
      ),
    },
    {
      field: "date",
      name: "Date",
      width: 211,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        const result = ConvertDate(row.date);
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "inTime",
      name: "In Time",
      width: 211,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        const result = ConvertTime(row.inTime, "AM");
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "outTime",
      name: "Out Time",
      width: 211,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        const result = ConvertTime(row.outTime, "PM");
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  async function ApplyFilter() {
    let temp: any = [];
    temp = rows;
    if (filter.Date) {
      temp = rows;
      await refetch();
    }

    if (filter.Status) {
      switch (filter.Status) {
        case "Present":
          temp = rows.filter((row: any) => row.inTime != null);
          break;
        case "Absent":
          temp = rows.filter(
            (row: any) => row.inTime == null && row.outTime == null
          );
          break;
        case "Late":
          temp = rows.filter(
            (row: any) =>
              new Date(row?.inTime) >
              new Date(`${row?.inTime?.slice(0, 10)}T10:05:01`)
          );
          break;
        case "OnTime":
          temp = rows.filter(
            (row: any) =>
              new Date(row?.inTime) <=
              new Date(`${row?.inTime?.slice(0, 10)}T10:05:01`)
          );
          setCard({ ...Card, OnTime: temp.length });
          break;
      }
      setfilterRows(temp);
    }

    if (filter.EmployeeName) {
      temp = rows.filter((row: any) => {
        return (
          row.employeeName
            ?.toLowerCase()
            .search(filter?.EmployeeName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.Department) {
      temp = rows.filter((row: any) => {
        return (
          row.department
            ?.toLowerCase()
            .search(filter?.Department?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.TeamId != null) {
      temp = temp.filter((e: any) => {
        return e.teamId === filter.TeamId;
      });

      var present: number = temp.filter((x: any) => x.inTime !== null).length;
      var absent: number = temp.filter((x: any) => x.inTime === null).length;
      var { onTime, late } = TimeSpan(temp);

      setCard({
        ...Card,
        Total: temp.length,
        Present: present,
        Absent: absent,
        OnTime: onTime,
        Late: late,
      });

      setfilterRows(temp);
    }
    calculateAverageTime(temp);
  }

  async function reset() {
    setfilter({});
    if (employeeNameRef.current) employeeNameRef.current.clearValue();
    if (teamNameRef.current) teamNameRef.current.clearValue();
    if (departmentRef.current) departmentRef.current.clearValue();
    if (dateRef.current) dateRef.current.value = "";
    if (statusRef.current) statusRef.current.clearValue();
    await setSelectedDate(new Date());
    await refetch();
  }
  console.log(role);
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Attendence</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Team Name</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                ref={teamNameRef}
                isDisabled={filter.EmployeeName == null ? false : true}
                className="mt-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      TeamId: selectedOption?.value,
                    };
                  });
                }}
                options={teamNames?.map((team: any) => {
                  return {
                    value: team.id,
                    label: team.name,
                  };
                })}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Employee Name</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                ref={employeeNameRef}
                isDisabled={filter.TeamId == null ? false : true}
                className="mt-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      EmployeeName: selectedOption?.value,
                    };
                  });
                }}
                options={rows?.map((row: any) => {
                  return {
                    value: row.employeeName,
                    label: row.employeeName,
                  };
                })}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Department</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                ref={departmentRef}
                className="mt-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      Department: selectedOption?.value,
                    };
                  });
                }}
                options={department?.map((dept: any) => {
                  return {
                    value: dept,
                    label: dept,
                  };
                })}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
                isSearchable={true}
              />
              {/* <input
                id="name3"
                ref={departmentRef}
                placeholder="Department"
                className="m-1 form-control col"
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      Department: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
              /> */}
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Date</label>
              <input
                id="name4"
                ref={dateRef}
                type="date"
                className="m-1 form-control col"
                onChange={(e: any) => {
                  setSelectedDate(new Date(e.target.value));
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      Date:
                        e.target.value == "" ? null : new Date(e.target.value),
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Status</label>
              <Select
                id="name4"
                ref={statusRef}
                className="m-1"
                options={[
                  {
                    label: "Present",
                    value: "Present",
                  },
                  {
                    label: "On Time",
                    value: "OnTime",
                  },
                  {
                    label: "Late",
                    value: "Late",
                  },
                  {
                    label: "Absent",
                    value: "Absent",
                  },
                ]}
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      Status: e?.value == null ? null : e.value,
                    };
                  });
                }}
              />
            </div>
          </div>

          <div className="col-md-12">
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
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container">
        <div className="main"> */}
      <Grid container>
        <Grid xs={2}>
          <ListItemButton
            className="card m-2 bg-primary text-light text-center"
            onClick={() => refetch()}
          >
            {Card?.Total || "0"}
            <span className="m-0 fs-4 fw-bold text-center text-light">
              Total
            </span>
          </ListItemButton>
        </Grid>
        <Grid xs={2}>
          <ListItemButton
            className="card m-2 bg-success text-light text-center"
            onClick={async () => {
              await setfilter({
                ...filter,
                Status: "OnTime",
              });
              ApplyFilter();
            }}
          >
            {Card?.OnTime}
            <span className="m-0 fs-4 fw-bold text-center text-light">
              On Time
            </span>
          </ListItemButton>
        </Grid>
        <Grid xs={2}>
          <ListItemButton
            className="card m-2 bg-danger text-light text-center"
            onClick={async () => {
              await setfilter({
                ...filter,
                Status: "Late",
              });
              ApplyFilter();
            }}
          >
            {Card?.Late}
            <span className="m-0 fs-4 fw-bold text-center text-light">
              Late
            </span>
          </ListItemButton>
        </Grid>
        <Grid xs={2}>
          <ListItemButton
            className="card m-2 bg-warning text-light text-center"
            onClick={async () => {
              await setfilter({
                ...filter,
                Status: "Present",
              });
              ApplyFilter();
            }}
          >
            {Card?.Present || ("0" && filterRows?.inTime?.length) || "0"}
            <span className="m-0 fs-4 fw-bold text-center text-light">
              Present
            </span>
          </ListItemButton>
        </Grid>
        <Grid xs={2}>
          <ListItemButton
            className="card m-2 bg-secondary text-light text-center"
            onClick={async () => {
              await setfilter({
                ...filter,
                Status: "Absent",
              });
              ApplyFilter();
            }}
          >
            {Card?.Absent || "0"}
            <span className="m-0 fs-4 fw-bold text-center text-light">
              Absent
            </span>
          </ListItemButton>
        </Grid>
        <Grid xs={2}>
          <ListItemButton className="card m-2 bg-info text-light text-center">
            {Card?.Average}
            <span className="m-0 fs-4 fw-bold text-center text-light">
              Average In Time
            </span>
          </ListItemButton>
        </Grid>
      </Grid>
      {/* </div>
      </div> */}
      <div className="d-flex flex-column justify-content-center m-5 align-items-end">
        <Button
          variant="contained"
          className="mb-2 float-end"
          onClick={() => {
            DownloadAttendanceList(filterRows);
          }}
        >
          Download
          <DownloadIcon className="mx-1" />
        </Button>
        <Grid item xs={12} sm={11}>
          <Box style={{ width: "94vw" }}>
            <DataTable
              columns={columns}
              fixedHeader
              responsive
              persistTableHead
              progressPending={isLoading}
              data={filterRows || []}
              customStyles={{
                table: {
                  style: {
                    height: "80vh",
                    border: "1px solid rgba(0,0,0,0.1)",
                  },
                },

                headRow: {
                  style: {
                    background: "#1e97e8",
                    fontSize: "16px",
                    color: "white",
                    fontFamily: "inherit",
                  },
                },
              }}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[50, 100, 200]}
              pointerOnHover={true}
            />
          </Box>
        </Grid>
      </div>
      <BackDrop open={isLoading} />
    </>
  );
};
