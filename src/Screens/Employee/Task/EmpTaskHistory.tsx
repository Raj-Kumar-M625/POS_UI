import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography, Grid, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Get } from "../../../Services/Axios";
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
import { SelectCategory } from "./SelectCategory";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DataTable from "react-data-table-component";
import { AssignTask } from "./AssignTask";
const UNASSIGNED = "unassigned";
const json: any = sessionStorage.getItem("user") || null;
const sessionUser = JSON.parse(json);

export const EmpTaskHistory = () => {
  const [rows, setRows] = useState<any>([]);
  const [categories, setcategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRows, setfilterRows] = useState<any>([]);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [selecteRow, setSelectRow] = useState([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const projectNameRef = useRef<HTMLInputElement>(null);
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
  const [filter, setfilter] = useState<TaskFilter>({});
  const teamNameRef = useRef<any>(null);
  const empNameRef = useRef<HTMLInputElement>(null);
  var categorySet = new Set<any>();
  var category: string[] = [];
  const [taskListView, setTaskListView] = useState<any>({
    view: false,
    edit: false,
    add: false,
    assign: false,
  });

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
              // settaskdata(row);
            }}
          >
            <VisibilityIcon className="fs-4 text-info" />
          </Tooltip>

          <Tooltip
            className="mx-2"
            title="Edit"
            onClick={() => {
              setTaskListView({ edit: true });
              // settaskdata(row);
            }}
          >
            <EditIcon className="fs-4 text-warning" />
          </Tooltip>

          <Tooltip
            className="mx-2"
            onClick={() => {
              if (row.status?.toLowerCase() === UNASSIGNED) {
                setSelectRow(row);
                setTaskListView({ assign: true });
              }
            }}
            title={row.status}
          >
            <AssignmentTurnedInIcon
              className={`fs-4 ${
                row.status?.toLowerCase() !== UNASSIGNED
                  ? "text-muted"
                  : "text-primary"
              } `}
            />
          </Tooltip>
        </>
      ),
    },
    {
      name: "Task Name",
      width: "15rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
      name: "Description",
      width: "20rem",
      selector: (row: any) => (
        <Tooltip title={row.description} style={{ textDecoration: "none" }}>
          <p
            className={`tableStyle ${
              ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
      name: "Employee Name",
      width: "15rem",
      selector: (row: any) => (
        <p
          className={`tableStyle ${
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
            ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
              ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
              ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
              ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
              ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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
              ConvertToISO(row.weekEndDate) <= ConvertToISO(new Date()) &&
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

  useEffect(() => {
    let taskList = Get(
      `app/Task/GetEmployeeTaskList?employeeId=${sessionUser.employeeId}`
    );
    let categoriesList = Get("app/Project/GetCategoriesList");

    taskList.then((response: any) => {
      var completedTasks = response?.data?.filter(
        (x: any) => x.percentage == 100
      );
      setRows(completedTasks || []);
      setfilterRows(completedTasks || []);
      setLoading(false);
    });

    categoriesList.then((response: any) => {
      setcategories(response?.data || []);
    });

    let dates = new Set<string>();
    let teamNames = new Set<string>();

    rows?.forEach((row: any) => {
      dates.add(row.weekEndingDate);
      teamNames.add(row?.employeeTask?.employee?.team?.name);
    });
    setTeamNames([...teamNames]);
  }, [loading]);

  categories?.forEach((element: any) => {
    categorySet.add(element.categories);
  });

  category = [...categorySet];

  const handleCategoryChange = (event: any) => {
    let temp: any = [];
    setfilter((prevState: any) => {
      return { ...prevState, category: event?.label };
    });
    categories?.forEach((element: any) => {
      if (element.categories === event?.label) {
        temp.push(element.subCategory);
      }
    });

    setSubCategories(temp);
  };
  function ApplyFilter() {
    let temp: any = [];
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
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].actualStartDate.slice(0, 10) >= filter.actStartDate &&
          rows[i].actualEndDate.slice(0, 10) <= filter.actEndDate
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
          rows[i].estimateStartDate.slice(0, 10) >= filter.estStartDate &&
          rows[i].estimateEndDate.slice(0, 10) <= filter.estEndDate
        ) {
          temp.push(rows[i]);
        }
      }
      setfilterRows(temp);
    } else {
      // temp = rows;
    }

    if (filter.weekEndingDate != null) {
      temp = temp.filter((row: any) => {
        return row.weekEndingDate.slice(0, 10) === filter.weekEndingDate;
      });
      setfilterRows(temp);
    }

    if (filter.teamName != null) {
      temp = temp.filter((e: any) => {
        return (
          e.employeeTask.employee?.team?.name
            .toLowerCase()
            .search(filter.teamName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.employeeName != null) {
      temp = temp.filter((e: any) => {
        return (
          e.employeeTask.employee?.employee?.user?.name
            .toLowerCase()
            .search(filter.employeeName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.category != null) {
      temp = temp.filter((e: any) => {
        return (
          e.category.categories.toLowerCase() === filter.category?.toLowerCase()
        );
      });
      setfilterRows(temp);
    }

    if (filter.subCategory != null) {
      temp = temp.filter((e: any) => {
        return (
          e.category.subCategory.toLowerCase() ===
          filter.subCategory?.toLowerCase()
        );
      });
      setfilterRows(temp);
    }

    if (filter.name != null) {
      temp = temp.filter((e: any) => {
        return e.name.toLowerCase().search(filter.name?.toLowerCase()) >= 0;
      });
      setfilterRows(temp);
    }

    if (filter.projectName != null) {
      temp = temp.filter((e: any) => {
        return (
          e.project.name
            .toLowerCase()
            .search(filter.projectName?.toLowerCase()) >= 0
        );
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

    if (filter.actualTime != null) {
      temp = temp.filter((e: any) => {
        return e.actTime === Number(filter.actualTime);
      });
      setfilterRows(temp);
    }

    if (filter.estimatedTime != null) {
      temp = temp.filter((e: any) => {
        return e.estTime === Number(filter.estimatedTime);
      });
      setfilterRows(temp);
    }
  }
  function reset() {
    setfilter({});
    if (nameRef.current) nameRef.current.value = "";
    if (projectNameRef.current) projectNameRef.current.value = "";
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
    if (teamNameRef.current) teamNameRef.current.clearValue();
    if (empNameRef.current) empNameRef.current.value = "";
    setfilterRows(rows);
  }
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Employee">
          Home
        </Link>
        <Typography color="text.primary">Task History</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Task Name</label>
              <input
                id="name"
                ref={nameRef}
                placeholder="Task Name"
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                  setfilter((prevState: any) => ({
                    ...prevState,
                    name: alphabeticValue === "" ? undefined : alphabeticValue,
                  }));
                }}
                value={filter.name || ""}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Team Name</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="status"
                ref={teamNameRef}
                className="mt-1"
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
                      TeamName:
                        selectedOption.label.trim() === ""
                          ? null
                          : selectedOption.label,
                    }));
                  }
                }}
                options={teamNames.map((name: string) => {
                  return {
                    value: name,
                    label: name,
                  };
                })}
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Employee Name</label>
              <input
                id="emp-name"
                ref={empNameRef}
                placeholder=""
                className="m-1 form-control col"
                disabled // Adding the disabled attribute
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      EmployeeName:
                        e.target.value === "" ? null : e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Project Name</label>
              <input
                id="project-name"
                ref={projectNameRef}
                placeholder="Project Name"
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                  setfilter((prevState: any) => ({
                    ...prevState,
                    projectName:
                      alphabeticValue === "" ? undefined : alphabeticValue,
                  }));
                }}
                value={filter.projectName || ""}
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
                    label: "In Progress",
                    value: "In Progress",
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
              <label>Percentage</label>
              <input
                id="percentage"
                className="m-1 form-control col"
                placeholder="Percentage"
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
              <label>Actual Time</label>
              <input
                id="actual-time"
                className="m-1 form-control col"
                ref={actTimeRef}
                placeholder="Actual Time"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue) || inputValue === "") {
                    setfilter((prevState: any) => ({
                      ...prevState,
                      actualTime: isNaN(numericValue) ? null : numericValue,
                    }));
                  }
                }}
                value={filter.actualTime !== null ? filter.actualTime : ""}
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
              <label>Estimated Time</label>
              <input
                id="estimated-time"
                className="m-1 col form-control"
                ref={estTimeRef}
                placeholder="Estimated Time"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue) || inputValue === "") {
                    setfilter((prevState: any) => ({
                      ...prevState,
                      estimatedTime: isNaN(numericValue) ? null : numericValue,
                    }));
                  }
                }}
                value={
                  filter.estimatedTime !== null ? filter.estimatedTime : ""
                }
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
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
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
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
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
                      subCategory:
                        selectedOption.label.trim() === ""
                          ? null
                          : selectedOption.label,
                    }));
                  }
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">Estimated Start Date</label>
              <input
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
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
                  setfilter((prevState: any) => {
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
                      setfilter((prevState: any) => {
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
                      setfilter((prevState: any) => {
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
              DownloadTaskList(filterRows);
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
        <AssignTask
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
          selectedRow={selecteRow}
          setfilterRows={setfilterRows}
        />
        <SelectCategory
          openDialog={taskListView}
          setOpenDialog={setTaskListView}
        />
      </div>
    </>
  );
};
