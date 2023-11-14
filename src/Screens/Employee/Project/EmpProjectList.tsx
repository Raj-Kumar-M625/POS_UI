import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { ConvertDate } from "../../../Utilities/Utils";
// import { Filter } from "../../../Models/Task/TaskFilter";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Select from "react-select";
import DownloadIcon from "@mui/icons-material/Download";
import { DownloadEmpProjectist } from "../../../Services/ProjectService";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Typography, Grid, Tooltip } from "@mui/material";
import { Get } from "../../../Services/Axios";
import { Link } from "react-router-dom";
import "../../../StyleSheets/ProjectList.css";
import { ViewProject } from "../../Admin/Projects/ViewProject";
import { EditProject } from "./EditProject";
import DataTable from "react-data-table-component";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditIcon from "@mui/icons-material/Edit";
import MonitorIcon from "@mui/icons-material/Monitor";

export const EmpProjectList = () => {
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);
  const [filterRows, setfilterRows] = useState<any>([]);
  const projectNameRef = useRef<any>(null);
  const statusRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const estEndDateRef = useRef<HTMLInputElement>(null);
  const projectTypeRef = useRef<any>();
  const [filter, setfilter] = useState<any>({});
  const [projectdata, setProjectdata] = useState<any>();
  var ProjectSet = new Set<any>();
  var [Projects, setProjects] = useState<string[]>([]);
  const [projectView, setProjectView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "12rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              className="mx-1"
              title="view"
              onClick={() => {
                setProjectView({ view: true });
                setProjectdata(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            <Tooltip
              className="mx-1"
              title="Edit"
              onClick={() => {
                setProjectView({ edit: true });
                setProjectdata(row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>
            <Link
              to="/Employee/UserStory"
              state={{ projectId: row.id, projectName: row.name }}
              style={{ textDecoration: "none" }}
            >
              <Tooltip color="info" title="User Story" className="mx-1">
                <AutoStoriesIcon className="fs-4 text-primary" />
              </Tooltip>
            </Link>
            <Link
              to="/Employee/UserInterface"
              state={{ projectId: row.id }}
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="User Interface" className="mx-1">
                <MonitorIcon className="fs-4 text-secondary" />
              </Tooltip>
            </Link>
          </>
        );
      },
    },
    {
      field: "name",
      name: "Project name",
      width: "13rem",
      editable: false,
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.name}</p>,
    },
    {
      field: "type",
      name: "Project Type",
      width: "13rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.type}</p>,
    },
    {
      field: "description",
      name: "Description",
      width: "18rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row.description}>
          <p className="tableStyle">{row.description}</p>
        </Tooltip>
      ),
    },
    {
      field: "status",
      name: "Status",
      width: "10rem",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.status}</p>,
    },
    {
      field: "percentage",
      name: "Percentage",
      type: "number",
      width: "10rem",
      align: "right",
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      editable: false,
      right: true,
      selector: (row: any) => <p className="tableStyle">{row.percentage}</p>,
    },
    {
      field: "startDate",
      name: "Start Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = ConvertDate(row.startDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "endDate",
      name: "End Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = ConvertDate(row.endDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  useEffect(() => {
    let projectList = Get("app/Project/GetEmployeeProjectlist");
    projectList.then((response: any) => {
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
  }, [reload]);

  rows?.forEach((row: any) => {
    ProjectSet.add(row?.projectname);
  });

  function ApplyFilter() {
    let temp: any = [];

    if (filter.actStartDate != null && filter.estStartDate != null) {
      return;
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
    } else {
      temp = rows;
    }

    if (filter.estStartDate != null) {
      if (filter.estEndDate == null) {
        estEndDateRef.current?.focus();
        return;
      }
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].startDate.slice(0, 10) >= filter.estStartDate &&
          rows[i].endDate.slice(0, 10) <= filter.estEndDate
        ) {
          temp.push(rows[i]);
        }
      }
      setfilterRows(temp);
    } else {
      // temp = rows;
    }

    if (filter.projectName != null) {
      temp = temp.filter((e: any) => {
        return (
          e.name.toLowerCase().search(filter.projectName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.projectType != null) {
      temp = temp.filter((e: any) => {
        return e.type.toLowerCase() === filter.projectType?.toLowerCase();
      });
      setfilterRows(temp);
    }
    if (filter.status != null) {
      temp = temp.filter((e: any) => {
        return e.status.toLowerCase() === filter.status?.toLowerCase();
      });
      setfilterRows(temp);
    }

    if (filter.percentage != null) {
      temp = temp.filter((e: any) => {
        return e.percentage === Number(filter.percentage);
      });
      setfilterRows(temp);
    }
  }

  function reset() {
    setfilter({});
    if (projectNameRef.current) projectNameRef.current.clearValue();
    if (statusRef.current) statusRef.current.clearValue();
    if (percentageRef.current) percentageRef.current.value = "";
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    if (projectTypeRef.current) projectTypeRef.current.clearValue();

    setfilterRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Project Name</label>
              <Select
                id="project-name"
                isClearable={true}
                ref={projectNameRef}
                className="col mt-1 custom-select"
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      projectName: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={Projects?.map((e: any) => ({
                  label: e,
                  value: e,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000, // Adjust z-index if needed
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Project Type</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="projectType"
                ref={projectTypeRef}
                className="select-dropdowns mt-1 col"
                onChange={(code: any) => {
                  if (code) {
                    setfilter((prevState: any) => {
                      return { ...prevState, projectType: code.label };
                    });
                  }
                }}
                options={[
                  {
                    label: "Web-APP",
                    value: "Web-APP",
                  },
                  {
                    label: "Mob-App",
                    value: "Mob-App",
                  },
                  {
                    label: "Mob-App & Web-APP",
                    value: "Mob-App & Web-APP",
                  },
                ]}
                placeholder="Project Type"
                isSearchable={true}
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
                className="select-dropdowns mt-1 col"
                onInputChange={(inputValue: string) => {
                  const alphabeticValue = inputValue.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  ); // Remove non-alphabetic characters
                  return alphabeticValue;
                }}
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
                    label: "Completed",
                    value: "Completed",
                  },
                  {
                    label: "In Progress",
                    value: "In Progress",
                  },
                ]}
                placeholder="Status"
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Percentage</label>
              <input
                id="percentage"
                placeholder="Percentage"
                className="m-1 form-control col"
                ref={percentageRef}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue) || inputValue === "") {
                    setfilter((prevState: any) => ({
                      ...prevState,
                      percentage: isNaN(numericValue) ? null : numericValue,
                    }));
                  }
                }}
                value={filter.percentage !== null ? filter.percentage : ""}
                onKeyDown={(e) => {
                  if (
                    // Allow numeric keys, backspace, delete, and arrow keys
                    !/[\d.eE-]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">Start Date</label>
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
                id="start-date"
                placeholder="Start Date"
                ref={actStartDateRef}
                className="m-1 col form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">End Date</label>
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
                id="end-date"
                placeholder="End Date"
                ref={actEndDateRef}
                className="m-1 col form-control"
              />
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-auto">
                <Button
                  variant="contained"
                  endIcon={<SearchIcon />}
                  className="mx-3 mt-3 "
                  onClick={() => ApplyFilter()}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  endIcon={<RefreshIcon />}
                  className="mx-3 mt-3 "
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <Grid>
          <Button
            variant="contained"
            className="mb-2 float-md-end download"
            onClick={() => {
              DownloadEmpProjectist(filterRows);
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
      <ViewProject
        openDialog={projectView}
        setOpenDialog={setProjectView}
        Data={projectdata}
      />
      <EditProject
        openDialog={projectView}
        setOpenDialog={setProjectView}
        setReload={setReload}
        Data={projectdata}
      />
    </>
  );
};
