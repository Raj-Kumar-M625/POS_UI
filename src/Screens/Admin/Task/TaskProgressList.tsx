import { useState, useEffect, useRef } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography, Grid, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Select from "react-select";
import DownloadIcon from "@mui/icons-material/Download";
import { TaskFilter } from "../../../Models/Task/TaskFilter";
import { DownloadProgressList } from "../../../Services/ProgressService";
import "../../../StyleSheets/TaskProgressList.css";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { useContextProvider } from "../../../CommonComponents/Context";
import { FILTER } from "../../../Constants/Task/Task";

export const TaskProgressList = () => {
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRows, setfilterRows] = useState<any>([]);
  const [filter, setfilter] = useState<TaskFilter>(FILTER);
  const employeenameRef = useRef<any>(null);
  const projectNameRef = useRef<any>(null);
  const taskNameRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<any>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const weekEndingDateRef = useRef<HTMLInputElement>(null);
  const { role } = useContextProvider();
  var employeeSet = new Set<any>();
  var employees: string[] = [];
  var ProjectSet = new Set<any>();
  var Projects: string[] = [];
  var [Projects, setProjects] = useState<string[]>([]);

  const columns: any = [
    {
      field: "Employee Name",
      name: "Employee Name",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.employeeName}</p>,
    },
    {
      field: "Project Name",
      name: "Project Name",
      width: 140,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.projectName}</p>,
    },
    {
      field: "Task Name",
      name: "Task Name",
      width: "18rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <p className="tableStyle">
          <abbr title={row.name} style={{ textDecoration: "none" }}>
            {row.name}
          </abbr>
        </p>
      ),
    },
    {
      field: "Task Description",
      name: "Task Description",
      width: "20rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row.description} style={{ textDecoration: "none" }}>
          <p className="tableStyle">{row.description}</p>
        </Tooltip>
      ),
    },
    {
      field: "startDate",
      name: "Start Date",
      type: "Date",
      width: 156,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = new Date(row.startDate)
          .toLocaleDateString("en-bz")
          .replaceAll("/", "-");
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "endDate",
      name: "End Date",
      type: "Date",
      width: 146,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = new Date(row.endDate)
          .toLocaleDateString("en-bz")
          .replaceAll("/", "-");
        return <p className="tableStyle">{result}</p>;
      },
    },

    {
      field: "estTime",
      name: "Estimated Time (hrs)",
      type: "number",
      width: "11rem",
      right: true,
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.estTime}</p>,
    },
    {
      field: "actTime",
      name: "Actual Time (hrs)",
      type: "number",
      width: "10rem",
      right: true,
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.actTime}</p>,
    },
    {
      field: "percentage",
      name: "Percentage (%)",
      type: "number",
      width: "10rem",
      right: true,
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.percentage}</p>,
    },
    {
      name: "Status",
      width: "9rem",
      selector: (row: any) => <p className="tableStyle">{row.status}</p>,
    },
    {
      name: "Priority",
      width: "8rem",
      selector: (row: any) => <p className="tableStyle">{row.priority}</p>,
    },
    {
      field: "WeekEndingDate",
      name: "Week Ending Date",
      type: "Date",
      width: "10rem",
      selector: (row: any) => {
        const result = new Date(row.weekEndingDate)
          .toLocaleDateString("en-bz")
          .replaceAll("/", "-");
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  useEffect(() => {
    let EmployeeList = Get("app/EmployeeDailyTask/GetTimePlanList");
    let projectList = Get("app/Project/GetProjectList");
    EmployeeList.then((response: any) => {
      setRows(response?.data || []);
      setfilterRows(response?.data || []);
      setLoading(false);
    });

    var temp: string[] = [];
    projectList.then((response: any) => {
      response.data.forEach((e: any) => {
        temp.push(e.name);
      });
    });
    setProjects(temp);
  }, []);
  rows?.forEach((row: any) => {
    ProjectSet.add(row?.projectName);
  });

  rows?.forEach((row: any) => {
    employeeSet.add(row?.employeeName);
  });

  rows?.forEach((row: any) => {
    employeeSet.add(row?.employeeName);
  });
  rows?.forEach((row: any) => {
    ProjectSet.add(row?.projectName);
  });

  employees = [...employeeSet];

  function ApplyFilter() {
    let temp: any = [];
    if (filter.weekEndingDate != null) {
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].weekEndingDate?.slice(0, 10) == filter.weekEndingDate) {
          temp.push(rows[i]);
        }
      }
      setfilterRows(temp);
    } else {
      temp = rows;
    }

    if (filter.actStartDate != null) {
      if (filter.actEndDate == null) {
        actEndDateRef.current?.focus();
        return;
      }
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].startDate.slice(0, 10) >= filter.actStartDate &&
          rows[i].endDate.slice(0, 10) <= filter.actEndDate
        ) {
          temp.push(rows[i]);
        }
      }
      setfilterRows(temp);
    }

    if (filter.employeeName != null) {
      temp = temp.filter((e: any) => {
        return (
          e.employeeName
            .toLowerCase()
            .search(filter.employeeName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.projectName != null) {
      temp = temp.filter((e: any) => {
        return (
          e.projectName
            .toLowerCase()
            .search(filter.projectName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.taskName != null) {
      temp = temp.filter((e: any) => {
        return e.name.toLowerCase().search(filter.taskName?.toLowerCase()) >= 0;
      });
      setfilterRows(temp);
    }

    if (filter.status != null) {
      temp = temp.filter((e: any) => {
        return (
          e.status.trim().toLowerCase() === filter.status?.trim().toLowerCase()
        );
      });
      setfilterRows(temp);
    }

    if (filter.priority != null) {
      temp = temp.filter((e: any) => {
        return e.priority.toLowerCase() === filter.priority?.toLowerCase();
      });
      setfilterRows(temp);
    }
  }

  function reset() {
    setfilter({});
    if (employeenameRef.current) employeenameRef.current.clearValue();
    if (projectNameRef.current) projectNameRef.current.clearValue();
    if (taskNameRef.current) taskNameRef.current.value = "";
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    if (weekEndingDateRef.current) weekEndingDateRef.current.value = "";
    if (statusRef.current) statusRef.current.clearvalue();
    setfilterRows(rows);
  }
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator="> ">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Progress</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Employee Name</label>
              <Select
                id="employee-name"
                isClearable={true}
                ref={employeenameRef}
                className="m-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      employeename: selectedOption
                        ? selectedOption.value
                        : null,
                    };
                  });
                }}
                options={employees.map((name) => ({
                  label: name,
                  value: name,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Project Name</label>
              <Select
                id="project-name"
                isClearable={true}
                ref={projectNameRef}
                className="col mt-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      projectName: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={[...Projects].map((e: any) => ({
                  label: e,
                  value: e,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Task Name</label>
              <input
                id="task-name"
                ref={taskNameRef}
                placeholder="Task Name"
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                  setfilter((prevState: any) => ({
                    ...prevState,
                    taskName: alphabeticValue === "" ? null : alphabeticValue,
                  }));
                }}
                value={filter.taskName || ""}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Status</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="status"
                ref={statusRef}
                className="mt-1 col"
                onChange={(selectedOption: any) => {
                  if (selectedOption) {
                    setfilter((prevState: any) => ({
                      ...prevState,
                      status:
                        selectedOption.label.trim() === ""
                          ? null
                          : selectedOption.label,
                    }));
                  }
                }}
                options={[
                  {
                    label: "Pending",
                    value: "Pending",
                  },
                  {
                    label: "Completed",
                    value: "Completed",
                  },
                  {
                    label: "In Progress",
                    value: "In-Progress",
                  },
                  {
                    label: "Ready For UAT",
                    value: "Ready-For-UAT",
                  },
                ]}
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
              <label className="">Actual Start Date</label>
              <input
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      actStartDate:
                        e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                type="date"
                id="actual-start-date"
                ref={actStartDateRef}
                className="m-1 form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">Actual End Date</label>
              <input
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      actEndDate: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                type="date"
                id="actual-end-date"
                ref={actEndDateRef}
                className="m-1 col form-control"
              />
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-2">
                <div className="form-group">
                  <label className="mx-1">Week Ending Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          weekEndingDate:
                            e.target.value == "" ? null : e.target.value,
                        };
                      });
                    }}
                    type="date"
                    id="week-end-date"
                    placeholder="Week Ending Date"
                    ref={weekEndingDateRef}
                    className="m-1 col form-control"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>Priority</label>
                  <Select
                    aria-label="Floating label select example"
                    isClearable={true}
                    name="priority"
                    ref={statusRef}
                    className="mt-1"
                    onChange={(selectedOption: any) => {
                      if (selectedOption) {
                        setfilter((prevState: any) => ({
                          ...prevState,
                          priority:
                            selectedOption.label.trim() === ""
                              ? null
                              : selectedOption.label,
                        }));
                      }
                    }}
                    options={[
                      {
                        label: "High",
                        value: "High",
                      },
                      {
                        label: "Low",
                        value: "Low",
                      },
                      {
                        label: "Medium",
                        value: "Medium",
                      },
                    ]}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 1000,
                      }),
                    }}
                    isSearchable={true}
                    formatOptionLabel={(option: any) => option.label}
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <Button
                      variant="contained"
                      endIcon={<SearchIcon />}
                      className="mx-2 mt-4"
                      onClick={() => {
                        ApplyFilter();
                      }}
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
      <div className="d-flex flex-column justify-content-center align-items-center mb-5">
        <Grid>
          <Button
            variant="contained"
            className="mb-2 float-md-end"
            onClick={() => {
              if (filterRows.length == 0) {
                Swal.fire({
                  text: "No data to download!",
                  icon: "warning",
                  confirmButtonColor: "#3085d6",
                });
                return;
              }
              DownloadProgressList(filterRows);
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
                progressPending={loading}
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
        </Grid>
      </div>
    </>
  );
};
