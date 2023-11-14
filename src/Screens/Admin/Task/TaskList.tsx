import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import DataTable from "react-data-table-component";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography, Grid, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Get, Post } from "../../../Services/Axios";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { TaskFilter } from "../../../Models/Task/TaskFilter";
import Select from "react-select";
import { Link, useLocation } from "react-router-dom";
import { DownloadTaskList } from "../../../Services/TaskService";
import "../../../StyleSheets/TaskList.css";
import { ConvertDate, ConvertToISO } from "../../../Utilities/Utils";
import Swal from "sweetalert2";
import { AssignTask } from "./AssignTask";
import { EditTask } from "./EditTask";
import { ViewTask } from "./ViewTask";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Assign from "../../../assets/Assign.png";
import Completed from "../../../assets/Completed.png";
import { useContextProvider } from "../../../CommonComponents/Context";
import { CUSTOMER } from "../../../Constants/Roles";
import { FILTER } from "../../../Constants/Task/Task";
import { Team } from "../../../Models/Team/Team";
import { Employee } from "../../../Models/Employee/Employee";
import { CommonMaster } from "../../../Models/Common/CommonMaster";
import { PRIORITYTYPE } from "../../../Constants/CommonMaster/CommonMaster";
import { COMPLETED, PENDING } from "../../../Constants/Common";
const UNASSIGNED = "unassigned";

export const TaskList = () => {
  const [rows, setRows] = useState<any>([]);
  const [selecteRow, setSelectRow] = useState([]);
  const [categories, setcategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Array<Employee>>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const projectNameRef = useRef<any>(null);
  const statusRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<any>();
  const subCategoryRef = useRef<any>();
  const priorityRef = useRef<any>();
  const actTimeRef = useRef<HTMLInputElement>(null);
  const estTimeRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const weekEndDateRef = useRef<HTMLInputElement>(null);
  const estStartDateRef = useRef<HTMLInputElement>(null);
  const estEndDateRef = useRef<HTMLInputElement>(null);
  const [filter, setfilter] = useState<TaskFilter>(FILTER);
  const teamNameRef = useRef<any>(null);
  const empNameRef = useRef<any>(null);
  const [taskdata, settaskdata] = useState<any>();
  const location = useLocation();

  const [taskListView, setTaskListView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });
  var categorySet = new Set<any>();
  var ProjectSet = new Set<any>();
  var category: string[] = [];
  var [Projects, setProjects] = useState<string[]>([]);

  const { role, commonMaster } = useContextProvider();

  const columns: any = [
    {
      name: "Action",
      width: "12rem",
      selector: (row: any) => (
        <>
          <Tooltip
            className="mx-2"
            title="View"
            onClick={() => {
              setTaskListView({ view: true });
              settaskdata(row);
            }}
          >
            <VisibilityIcon className="fs-4 text-info" />
          </Tooltip>

          {role != CUSTOMER && (
            <>
              <Tooltip
                className="mx-2"
                title="Edit"
                onClick={() => {
                  setTaskListView({ edit: true });
                  settaskdata(row);
                }}
              >
                <EditIcon className="fs-4 text-warning" />
              </Tooltip>
              <Tooltip
                className="mx-2"
                onClick={() => {
                  if (row.status?.toLowerCase() === UNASSIGNED) {
                    setSelectRow(row);
                    setOpen(true);
                  }
                }}
                title={`${
                  row.status?.toLowerCase() === UNASSIGNED
                    ? "Assign Task"
                    : row.status
                }`}
              >
                <img
                  src={
                    row.status?.toLowerCase() !== UNASSIGNED
                      ? Completed
                      : Assign
                  }
                  width={25}
                  height={25}
                />
              </Tooltip>
            </>
          )}
        </>
      ),
    },
    {
      name: "Task Name",
      width: "15rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row?.name}
        </p>
      ),
    },
    {
      name: "Project Name",
      width: "15rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row?.projectName}
        </p>
      ),
    },
    {
      name: "Priority",
      width: "10rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.priority || "-"}
        </p>
      ),
    },
    {
      name: "Description",
      width: "20rem",
      selector: (row: any) => (
        <Tooltip title={row.description} style={{ textDecoration: "none" }}>
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {row?.description}
          </p>
        </Tooltip>
      ),
    },
    {
      name: "US Name",
      width: "15rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.usName || "-"}
        </p>
      ),
    },
    {
      name: "UI Name",
      width: 200,
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.uiName || "-"}
        </p>
      ),
    },
    {
      name: "Team Name",
      width: "10rem",
      selector: (row: any) =>
        !location.state?.projectReportRoute ? (
          <Link
            to={`/${role}/TeamTaskQuadrant`}
            style={{ textDecoration: "none" }}
            state={{ data: row }}
            className={`tableStyle`}
          >
            {row.teamName}
          </Link>
        ) : (
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {row.teamName || "-"}
          </p>
        ),
    },
    {
      name: "Employee Name",
      width: "15rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.employeeName || "-"}
        </p>
      ),
    },
    {
      name: "Category",
      width: "10rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.category || "-"}
        </p>
      ),
    },
    {
      name: "Sub Category",
      width: "10rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.subCategory || "-"}
        </p>
      ),
    },
    {
      name: "Status",
      width: "10rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.status || "-"}
        </p>
      ),
    },

    {
      name: "Percentage (%)",
      right: true,
      width: "9rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.percentage || "-"}
        </p>
      ),
    },
    {
      name: "Estimated Time (hrs)",
      right: true,
      width: "12rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.estimateTime || "-"}
        </p>
      ),
    },
    {
      name: "Actual Time (hrs)",
      width: "12rem",
      right: true,
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
            row?.percentage != 100
              ? "text-danger"
              : ""
          }`}
        >
          {row.actualTime || "-"}
        </p>
      ),
    },
    {
      name: "Estimated Start Date",
      type: "Date",
      width: "12rem",
      selector: (row: any) => {
        const result = ConvertDate(row.estimateStartDate);
        return (
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {result}
          </p>
        );
      },
    },
    {
      name: "Estimated End Date",
      width: "12rem",
      selector: (row: any) => {
        const result = ConvertDate(row.estimateEndDate);
        return (
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {result}
          </p>
        );
      },
    },
    {
      name: "Actual Start Date",
      width: "10rem",
      selector: (row: any) => {
        const result = ConvertDate(row.actualStartDate);
        return (
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {result}
          </p>
        );
      },
    },
    {
      name: "Actual End Date",
      width: "10rem",
      selector: (row: any) => {
        const result = ConvertDate(row.actualEndDate);
        return (
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {result}
          </p>
        );
      },
    },
    {
      name: "Week Ending Date",
      type: "Date",
      width: "10rem",
      selector: (row: any) => {
        const result = ConvertDate(row.weekEndDate);
        return (
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) < ConvertToISO(new Date()) &&
              row?.percentage != 100
                ? "text-danger"
                : ""
            }`}
          >
            {result}
          </p>
        );
      },
    },
  ];

  async function GetData() {
    let employeeList: any = await Get("app/Employee/GetEmployeeList");
    setEmployees(employeeList.data || []);
  }

  useEffect(() => {
    if (location.state?.projectReportRoute) {
      filter.projectName = location.state.projectName;
    }

    let taskList = Post("app/Task/GetTaskList?month=10&year=2023", filter);
    let categoriesList = Get("app/Project/GetCategoriesList");
    let projectList = Get("app/Project/GetProjectList");
    let teamList = Get("app/Team/GetTeamList");
    GetData();

    let teamNames = new Set<string>();
    teamList.then((response: any) => {
      response.data?.forEach((team: Team) => {
        teamNames.add(team.name);
      });
      setTeamNames([...teamNames]);
    });

    taskList.then((response: any) => {
      if (location.state?.projectReportRoute) {
        if (location.state?.status === COMPLETED) {
          setRows(
            response?.data?.filter((x: any) => x.percentage === 100) || []
          );
        } else if (location.state?.status === PENDING) {
          setRows(
            response?.data?.filter(
              (x: any) => parseInt(`${x.percentage}`) < 100
            ) || []
          );
        } else {
          setRows(response?.data || []);
        }
      } else {
        setRows(response?.data || []);
      }
      setLoading(false);
    });

    categoriesList.then((response: any) => {
      setcategories(response?.data || []);
    });

    var temp: string[] = [];
    projectList.then((response: any) => {
      response.data?.forEach((e: any) => {
        temp.push(e.name);
      });
    });
    setProjects(temp);

    rows?.forEach((row: any) => {
      ProjectSet.add(row?.projectName);
    });
  }, [loading]);

  categories?.forEach((element: any) => {
    categorySet.add(element.categories);
  });

  rows?.forEach((row: any) => {
    ProjectSet.add(row?.projectName);
  });

  category = [...categorySet];
  category.sort((a, b) => {
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
  });

  const handleCategoryChange = (event: any) => {
    if (subCategoryRef.current) subCategoryRef.current.clearValue();
    let temp: any = [];
    setfilter((prevState) => {
      return {
        ...prevState,
        category: event?.label == "" ? null : event?.label,
      };
    });
    categories?.forEach((element: any) => {
      if (element.categories === event?.label) {
        temp.push(element.subCategory);
      }
    });
    temp.sort((a: any, b: any) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });
    setSubCategories(temp);
  };

  function ApplyFilter() {
    if (filter.actStartDate != null && filter.estStartDate != null) {
      Swal.fire({
        text: "Please Select Either Actual Dates or Estimated Dates!",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (filter.actStartDate != null) {
      if (filter.actEndDate == null) {
        actEndDateRef.current?.focus();
        return;
      }
    }

    if (filter.estStartDate != null) {
      if (filter.estEndDate == null) {
        estEndDateRef.current?.focus();
        return;
      }
    }
    setLoading((prev) => !prev);
  }

  function reset() {
    setfilter(FILTER);
    if (nameRef.current) nameRef.current.value = "";
    if (projectNameRef.current) projectNameRef.current.clearValue();
    if (statusRef.current) statusRef.current.clearValue();
    if (categoryRef.current) categoryRef.current.clearValue();
    if (subCategoryRef.current) subCategoryRef.current.clearValue();
    if (percentageRef.current) percentageRef.current.value = "";
    if (actTimeRef.current) actTimeRef.current.value = "";
    if (estTimeRef.current) estTimeRef.current.value = "";
    if (actStartDateRef.current) actStartDateRef.current.value = null!;
    if (actEndDateRef.current) actEndDateRef.current.value = null!;
    if (weekEndDateRef.current) weekEndDateRef.current.value = null!;
    if (estStartDateRef.current) estStartDateRef.current.value = "";
    if (estEndDateRef.current) estEndDateRef.current.value = "";
    if (teamNameRef.current) teamNameRef.current.clearValue();
    if (empNameRef.current) empNameRef.current.clearValue();
    if (priorityRef.current) priorityRef.current.clearValue();
    setLoading((prev) => !prev);
  }

  return (
    <>
      {!location.state?.projectReportRoute && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>Task</Typography>
        </Breadcrumbs>
      )}

      {location.state?.projectReportRoute && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to="/Admin">
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link color="inherit" to="/Admin/Project">
            <Typography sx={{ fontWeight: "bold" }}>Projects</Typography>
          </Link>
          <Link
            color="inherit"
            to="/Admin/ProjectQuadrant"
            state={{ ...location.state }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Project Quadrant
            </Typography>
          </Link>
          <Link
            color="inherit"
            to="/Admin/ProjectQuadrant/ProjectReport"
            state={{ ...location.state }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Project Report</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>Task</Typography>
        </Breadcrumbs>
      )}

      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Team Name</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="status"
                ref={teamNameRef}
                className="mt-1"
                onChange={(code: any) => {
                  if (code) {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        teamName: code.label == "" ? null : code.label,
                      };
                    });
                  } else {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        teamName: code,
                      };
                    });
                  }
                }}
                options={teamNames.map((name: string) => {
                  return {
                    value: name,
                    label: name,
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
                ref={empNameRef}
                className="mt-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      employeeName:
                        selectedOption?.value == ""
                          ? null
                          : selectedOption?.value,
                    };
                  });
                }}
                options={employees.map((employee: Employee) => ({
                  value: employee.name,
                  label: employee?.name?.replace(/[^A-Za-z^ -]/g, ""),
                }))}
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
              <label>Project Name</label>
              <Select
                id="project-name"
                isClearable={true}
                ref={projectNameRef}
                className="col mt-1 custom-select"
                onChange={(selectedOption: any) => {
                  setfilter((prevState: TaskFilter) => {
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
                    zIndex: 1000,
                  }),
                }}
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
                className="mt-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState) => ({
                    ...prevState,
                    status: selectedOption ? selectedOption.value : null,
                  }));
                }}
                options={[
                  {
                    label: "Unassigned",
                    value: "Unassigned",
                  },
                  {
                    label: "Assigned",
                    value: "Assigned",
                  },
                  {
                    label: "In Progress",
                    value: "In-Progress",
                  },
                  {
                    label: "Completed",
                    value: "Completed",
                  },
                  {
                    label: "On Hold",
                    value: "On Hold",
                  },
                ]}
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Priority</label>
              <Select
                id="priority"
                isClearable={true}
                ref={priorityRef}
                className="col mt-1 custom-select"
                onChange={(selectedOption: any) => {
                  setfilter((prevState: TaskFilter) => {
                    return {
                      ...prevState,
                      priority: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={commonMaster
                  .filter((x) => x.codeType === PRIORITYTYPE)
                  .map((priority: CommonMaster) => ({
                    label: priority.codeValue,
                    value: priority.codeValue,
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
              <label>Percentage</label>
              <input
                id="percentage"
                className="m-1 form-control col"
                placeholder="Percentage"
                ref={percentageRef}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  setfilter((prevState) => ({
                    ...prevState,
                    percentage: parseInt(e.target.value),
                  }));
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Actual Time</label>

              <input
                id="actual-time"
                className="m-1 form-control col"
                ref={actTimeRef}
                placeholder="Actual Time"
                type="text"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  setfilter((prevState) => ({
                    ...prevState,
                    actualTime: parseInt(e.target.value),
                  }));
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Estimated Time</label>
              <input
                id="estimated-time"
                className="m-1 col form-control"
                ref={estTimeRef}
                placeholder="Estimated Time"
                type="number"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  setfilter((prevState) => ({
                    ...prevState,
                    estimatedTime: parseInt(e.target.value),
                  }));
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Category</label>
              <Select
                id="category-simple-select"
                isClearable={true}
                ref={categoryRef}
                className="col mt-1"
                onChange={handleCategoryChange}
                options={category.map((opt: any) => ({
                  label: opt,
                  value: opt,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 99999,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Sub Category</label>
              <Select
                id="sub-category-simple-select"
                isClearable={true}
                className="mt-1"
                ref={subCategoryRef}
                options={subCategories.map((opt: any) => ({
                  label: opt,
                  value: opt,
                }))}
                isSearchable={true}
                onChange={(selectedOption: any) => {
                  setfilter((prevState) => ({
                    ...prevState,
                    subCategory: selectedOption ? selectedOption.value : null,
                  }));
                }}
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
              <label className="mx-1">Estimated Start Date</label>
              <input
                onChange={(e: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      estStartDate:
                        e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                ref={estStartDateRef}
                type="date"
                id="estimated-start-date"
                placeholder="Estimated Start Date"
                className="m-1  form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">Estimated End Date</label>
              <input
                onChange={(e: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      estEndDate: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                ref={estEndDateRef}
                type="date"
                id="estimated-end-date"
                placeholder="Estimated End Date"
                className="m-1 col form-control"
              />
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-2">
                <div className="form-group">
                  <label className="mx-1">Actual Start Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState) => {
                        return {
                          ...prevState,
                          actStartDate:
                            e.target.value == "" ? null : e.target.value,
                        };
                      });
                    }}
                    type="date"
                    id="actual-start-date"
                    placeholder="Actual Start Date"
                    ref={actStartDateRef}
                    className="m-1 col form-control"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label className="mx-1">Actual End Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState) => {
                        return {
                          ...prevState,
                          actEndDate:
                            e.target.value == "" ? null : e.target.value,
                        };
                      });
                    }}
                    type="date"
                    id="actual-end-date"
                    placeholder="Actual End Date"
                    ref={actEndDateRef}
                    className="m-1 col form-control"
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <label className="mx-1">Week Ending Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState) => {
                        return {
                          ...prevState,
                          weekEndingDate:
                            e.target.value == "" ? null : e.target.value,
                        };
                      });
                    }}
                    type="date"
                    id="actual-end-date"
                    placeholder="Actual End Date"
                    ref={weekEndDateRef}
                    className="m-1 col form-control"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <Button
                      variant="contained"
                      endIcon={<SearchIcon />}
                      className="mx-3 mt-4"
                      onClick={() => ApplyFilter()}
                    >
                      Search
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<RefreshIcon />}
                      className="mx-3 mt-4"
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
              if (rows.length == 0) {
                Swal.fire({
                  text: "No data to download!",
                  icon: "warning",
                  confirmButtonColor: "#3085d6",
                });
                return;
              }
              DownloadTaskList(rows);
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
                data={rows || []}
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
      <AssignTask
        openDialog={open}
        setOpenDialog={setOpen}
        selectedRow={selecteRow}
        setLoading={setLoading}
      />
      <EditTask
        openDialog={taskListView}
        setOpenDialog={setTaskListView}
        Data={taskdata}
        setLoading={setLoading}
      />
      <ViewTask
        openDialog={taskListView}
        setOpenDialog={setTaskListView}
        Data={taskdata}
      />
    </>
  );
};
