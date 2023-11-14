import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography, Grid, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Get, Post } from "../../../Services/Axios";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { TaskFilter } from "../../../Models/Task/TaskFilter";
import Select from "react-select";
import { Link } from "react-router-dom";
import { DownloadTaskList } from "../../../Services/TaskService";
import "../../../StyleSheets/TaskList.css";
import { ConvertDate, ConvertToISO } from "../../../Utilities/Utils";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import { SelectCategory } from "./SelectCategory";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DataTable from "react-data-table-component";
import { AssignTask } from "./AssignTask";
import { ViewTask } from "./ViewTask";
import { EditTask } from "./EditTask";
import TodayIcon from "@mui/icons-material/Today";
import { AddDailyTask } from "./AddDailyTask";
import Assign from "../../../assets/Assign.png";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import { FILTER } from "../../../Constants/Task/Task";
import { Team } from "../../../Models/Team/Team";
import { Project } from "../../../Models/Project/Project";
import SelectProject from "./SelectProject";
import { CreateTask } from "./AddTask/CreateTask";

const UNASSIGNED = "unassigned";

export const EmpTaskList = () => {
  const [rows, setRows] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const [categories, setcategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [projectName, setProjectName] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [selecteRow, setSelectRow] = useState([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const projectNameRef = useRef<any>();
  const statusRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<any>();
  const subCategoryRef = useRef<any>();
  const actTimeRef = useRef<HTMLInputElement>(null);
  const estTimeRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const estStartDateRef = useRef<HTMLInputElement>(null);
  const estEndDateRef = useRef<HTMLInputElement>(null);
  const [filter, setfilter] = useState<TaskFilter>(FILTER);
  const taskNameRef = useRef<any>(null);
  const teamNameRef = useRef<any>(null);
  const empNameRef = useRef<HTMLInputElement>(null);

  var categorySet = new Set<any>();
  var category: string[] = [];
  var ProjectSet = new Set<any>();
  var [Projects, setProjects] = useState<string[]>([]);

  const [taskListView, setTaskListView] = useState<any>({
    view: false,
    edit: false,
    add: false,
    assign: false,
    daily: false,
    selectProject: false,
  });

  // const handleClickOpen = () => {
  //   setTaskListView({ selectProject: true });
  // };

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
              setSelectRow(row);
            }}
          >
            <VisibilityIcon className="fs-4 text-info" />
          </Tooltip>

          <Tooltip
            className="mx-2"
            title="Edit"
            onClick={() => {
              setTaskListView({ edit: true });
              setSelectRow(row);
            }}
          >
            <EditIcon className="fs-4 text-warning" />
          </Tooltip>
          {row.status?.toLowerCase() !== UNASSIGNED ? (
            <>
              {row?.percentage !== 100 ? (
                <Tooltip
                  className="mx-2"
                  onClick={() => {
                    setSelectRow(row);
                    setTaskListView({ daily: true });
                  }}
                  title={"Add Daily task"}
                >
                  <TodayIcon />
                </Tooltip>
              ) : (
                <Tooltip className="mx-2" title={"Completed"}>
                  <OfflinePinIcon style={{ color: "#04d93d" }} />
                </Tooltip>
              )}
            </>
          ) : (
            <Tooltip
              className="mx-2"
              onClick={() => {
                if (row.status?.toLowerCase() === UNASSIGNED) {
                  setSelectRow(row);
                  setTaskListView({ assign: true });
                }
              }}
              title={
                row.status?.toLowerCase() === UNASSIGNED
                  ? "Assign Task"
                  : row.status
              }
            >
              <img
                src={Assign}
                style={{ objectFit: "contain" }}
                width={25}
                height={25}
              />
            </Tooltip>
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
      selector: (row: any) => (
        <Link
          to="/Admin/TeamTaskQuadrant"
          style={{ textDecoration: "none" }}
          state={{ data: row }}
          className={`tableStyle`}
        >
          {row.teamName}
        </Link>
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
    let teamList: any = await Get("app/Employee/GetEmployeeTeamList");
    let projectList: any = await Get("app/Project/GetEmployeeProjectlist");

    let teamNames: Array<string> = [];
    let projects: Array<string> = [];

    teamList?.data.forEach((team: Team) => {
      teamNames.push(team.name);
    });

    projectList?.data.forEach((project: Project) => {
      projects.push(project.name);
    });

    setTeamNames([...teamNames]);
    setProjects(projects);
  }

  useEffect(() => {
    setLoading(true);
    let taskList = Post(
      `app/Task/GetEmployeeTaskList?employeeId=${sessionUser?.employeeId}`,
      filter
    );
    let categoriesList = Get("app/Project/GetCategoriesList");

    GetData();

    taskList.then((response: any) => {
      setRows(response?.data || []);
      setLoading(false);
    });

    categoriesList.then((response: any) => {
      setcategories(response?.data || []);
    });

    rows?.forEach((row: any) => {
      ProjectSet.add(row?.projectName);
    });

    let dates = new Set<string>();

    rows?.forEach((row: any) => {
      dates.add(row.weekEndingDate);
    });
  }, [reload]);

  categories?.forEach((element: any) => {
    categorySet.add(element.categories);
  });

  category = [...categorySet];
  category.sort((a: any, b: any) => {
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
  });

  const handleCategoryChange = (event: any) => {
    let temp: any = [];
    setfilter((prevState: TaskFilter) => {
      return { ...prevState, category: event?.label };
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
  const handleProjectNameChange = (event: any) => {
    let temp: any = [];
    setfilter((prevState: TaskFilter) => {
      return { ...prevState, projectName: event?.label };
    });
    projectName?.forEach((element: any) => {
      if (element.projectName === event?.label) {
        temp.push(element.ProjectName);
      }
    });
    setProjectName(temp);
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
    setReload((prev) => !prev);

    // let temp: any = [];
    // if (filter.actStartDate != null && filter.estStartDate != null) {
    //   Swal.fire({
    //     text: "Please Select Either Actual Dates or Estimated Dates!",
    //     icon: "warning",
    //     confirmButtonColor: "#3085d6",
    //   });
    //   return;
    // }

    // if (filter.actStartDate != null) {
    //   if (filter.actEndDate == null) {
    //     actEndDateRef.current?.focus();
    //     return;
    //   }
    //   temp = [];
    //   for (let i = 0; i < rows.length; i++) {
    //     if (
    //       rows[i].actualStartDate.slice(0, 10) >= filter.actStartDate &&
    //       rows[i].actualEndDate.slice(0, 10) <= filter.actEndDate
    //     ) {
    //       temp.push(rows[i]);
    //     }
    //   }
    //   setfilterRows(temp);
    // } else {
    //   temp = rows;
    // }

    // if (filter.estStartDate != null) {
    //   if (filter.estEndDate == null) {
    //     estEndDateRef.current?.focus();
    //     return;
    //   }
    //   temp = [];
    //   for (let i = 0; i < rows.length; i++) {
    //     if (
    //       rows[i].estimateStartDate.slice(0, 10) >= filter.estStartDate &&
    //       rows[i].estimateEndDate.slice(0, 10) <= filter.estEndDate
    //     ) {
    //       temp.push(rows[i]);
    //     }
    //   }
    //   setfilterRows(temp);
    // } else {
    //   // temp = rows;
    // }

    // if (filter.weekEndingDate != null) {
    //   temp = temp.filter((row: any) => {
    //     return row.weekEndingDate.slice(0, 10) === filter.weekEndingDate;
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.TeamName != null) {
    //   temp = temp.filter((e: any) => {
    //     return (
    //       e.teamName.toLowerCase().search(filter.TeamName?.toLowerCase()) >= 0
    //     );
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.category != null) {
    //   temp = temp.filter((e: any) => {
    //     return e.category.toLowerCase() === filter.category?.toLowerCase();
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.subCategory != null) {
    //   temp = temp.filter((e: any) => {
    //     return (
    //       e.subCategory.toLowerCase() === filter.subCategory?.toLowerCase()
    //     );
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.name != null) {
    //   temp = temp.filter((e: any) => {
    //     return e.name?.toLowerCase() === filter.name?.toLowerCase();
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.projectName != null) {
    //   temp = temp.filter((e: any) => {
    //     return (
    //       e.projectName
    //         .toLowerCase()
    //         .search(filter.projectName?.toLowerCase()) >= 0
    //     );
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.status != null) {
    //   temp = temp.filter((e: any) => {
    //     return e.status.toLowerCase() === filter.status?.toLowerCase();
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.percentage != null) {
    //   temp = temp.filter((e: any) => {
    //     return e.percentage === Number(filter.percentage);
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.actualTime != null) {
    //   temp = temp.filter((e: any) => {
    //     return e.actualTime === Number(filter.actualTime);
    //   });
    //   setfilterRows(temp);
    // }

    // if (filter.estimatedTime != null) {
    //   temp = temp.filter((e: any) => {
    //     return e.estimateTime === Number(filter.estimatedTime);
    //   });
    //   setfilterRows(temp);
    // }
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
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    if (estStartDateRef.current) estStartDateRef.current.value = "";
    if (estEndDateRef.current) estEndDateRef.current.value = "";
    if (taskNameRef.current) taskNameRef.current.clearValue();
    if (teamNameRef.current) teamNameRef.current.clearValue();
    if (empNameRef.current) empNameRef.current.value = "";
    setReload((prev) => !prev);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Task</Typography>
      </Breadcrumbs>
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
                onChange={(selectedOption: any) => {
                  setfilter((prevState: TaskFilter) => ({
                    ...prevState,
                    teamName: selectedOption ? selectedOption.label : null,
                  }));
                }}
                options={teamNames.map((name: string) => ({
                  value: name,
                  label: name,
                }))}
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
                  handleProjectNameChange(selectedOption);
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
                  if (selectedOption) {
                    setfilter((prevState: TaskFilter) => ({
                      ...prevState,
                      status: selectedOption ? selectedOption.label : null,
                    }));
                  }
                }}
                options={[
                  {
                    label: "Un Assigned",
                    value: "Un Assigned",
                  },
                  {
                    label: "Assigned",
                    value: "Assigned",
                  },
                  {
                    label: "Completed",
                    value: "Completed",
                  },
                  {
                    label: "Ready-For-UAT",
                    value: "Ready-For-UAT",
                  },
                  {
                    label: "In Progress",
                    value: "In Progress",
                  },
                  {
                    label: "On Hold",
                    value: "On Hold",
                  },
                ]}
                isSearchable={true}
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
                  setfilter((prevState: TaskFilter) => ({
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
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  setfilter((prevState: TaskFilter) => ({
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
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  setfilter((prevState: TaskFilter) => ({
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
                ref={categoryRef}
                className="col mt-1"
                onChange={(selectedOption: any) => {
                  handleCategoryChange(selectedOption);
                }}
                options={category.map((opt: any) => ({
                  label: opt,
                  value: opt,
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
              <label>Sub Category</label>
              <Select
                id="sub-category-simple-select"
                className="mt-1"
                ref={subCategoryRef}
                options={subCategories.map((opt: any) => ({
                  label: opt,
                  value: opt,
                }))}
                onChange={(selectedOption: any) => {
                  setfilter((prevState: TaskFilter) => ({
                    ...prevState,
                    subCategory: selectedOption ? selectedOption.value : null,
                  }));
                }}
                isSearchable={true}
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
                  setfilter((prevState: TaskFilter) => {
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
                  setfilter((prevState: TaskFilter) => {
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
                      setfilter((prevState: TaskFilter) => {
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
                      setfilter((prevState: TaskFilter) => {
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
                      setfilter((prevState: TaskFilter) => {
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
                    ref={actEndDateRef}
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
            className="mb-2 float-md-start"
            onClick={() => setOpen(true)}
          >
            Add Task
            <AddIcon className="mx-1" />
          </Button>
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
                data={rows}
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
        <AssignTask
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
          selectedRow={selecteRow}
          setReload={setReload}
        />
        <ViewTask
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
          Data={selecteRow}
        />
        <EditTask
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
          setReload={setReload}
          Data={selecteRow}
        />
        <SelectProject
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
        />
        <SelectCategory
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
        />
        <AddDailyTask
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
          Data={selecteRow}
        />
        <CreateTask open={open} setOpen={setOpen} setReload={setReload} />
      </div>
    </>
  );
};
