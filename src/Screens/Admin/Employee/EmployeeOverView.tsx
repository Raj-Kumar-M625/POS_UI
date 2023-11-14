import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TaskIcon from "@mui/icons-material/Task";
import Divider from "@mui/material/Divider";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumbs,
  Typography,
  Grid,
  FormControl,
  Tooltip,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import "../../../StyleSheets/EmployeeOverview.css";
import BackDrop from "../../../CommonComponents/BackDrop";
import Button from "@mui/material/Button";
import { Get } from "../../../Services/Axios";
import { useEffect, useRef, useState } from "react";
import { MoveTask } from "../Task/MoveTask";
import { useContextProvider } from "../../../CommonComponents/Context";
import {
  ConvertDate,
  ConvertToISO,
  ReduceFiveDays,
  WeekEndingDate,
  WeekEndingDateUTC,
} from "../../../Utilities/Utils";
import { ReassignTask } from "../Task/ReassignTask";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";

type Project = {
  Id: number;
  Name: string;
  estTime: number;
  actTime: number;
};

function getEstTime(total: any, num: any): number {
  return total + num.estTime;
}

function getActTime(total: any, num: any): number {
  return total + num.actTime;
}

export default function EmployeeOverView() {
  const weekEndingDate = WeekEndingDateUTC();
  const location = useLocation();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [taskList, setTaskList] = useState<any>([]);
  const [selectedWeekEnd, setselectedWeekEnd] = useState<string>(
    location.state.weekendingDate ?? ConvertToISO(weekEndingDate)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>();
  const [taskStatusList, setTaskStatusList] = useState<any>([]);
  const [taskDateList, setTaskDateList] = useState([]);
  const [taskId, setTaskId] = useState<any>();
  const [employeeId, setEmployeeId] = useState<any>();
  const [project, setProject] = useState({ name: "", Id: -1 });
  const [Projects, setProjects] = useState<Project[]>([]);

  const [taskStatus, setTaskStatus] = useState({
    projectId: 0,
    Completed: 0,
    Pending: 0,
  });
  const [taskListView, setTaskListView] = useState<any>({
    view: false,
    edit: false,
    add: false,
    reassign: false,
  });
  const { role } = useContextProvider();
  const statusRef = useRef<any>();
  const dateRef = useRef<any>("dd-yy-mmmm");
  const weekEndRef = useRef<any>();
  const [minDate, setMinDate] = useState<string>(
    ReduceFiveDays(selectedWeekEnd)
  );
  const [maxDate, setMaxDate] = useState<string>(selectedWeekEnd);

  async function fetchData() {
    setLoading(true);
    var completed = 0;
    var pending = 0;
    const employeeTask: any = await Get(
      `app/Employee/GetEmployeeTasks?employeeId=${location.state.employeeId}`
    );
    var empDailyTask: any = employeeTask?.data?.employeeDailyTask || [];
    var temp = empDailyTask;
    var weekEnd = location.state.weekendingDate ?? ConvertToISO(weekEndingDate);
    var temp = employeeTask?.data?.employeeDailyTask?.filter((x: any) => {
      return x.weekEndingDate.slice(0, 10) === weekEnd;
    });

    GetProjectHours(empDailyTask, weekEndingDate);

    temp?.forEach((x: any) => {
      if (x.percentage < 100) pending++;
      if (x.percentage === 100) completed++;
    });

    fun(employeeTask?.data, weekEnd);

    setTaskStatus({
      projectId: employeeTask?.data?.employeeProjects[0]?.id,
      Completed: completed,
      Pending: pending,
    });

    setProject({
      name: "All Projects",
      Id: 0,
    });
    setTaskList(temp || []);
    setTaskStatusList(temp || []);
    setData(employeeTask?.data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [refetch]);

  function GetProjectHours(
    empDailyTasks: any,
    weekEnd: any,
    date?: string | null
  ) {
    const map = new Map();
    var empDailyTask =
      date != null
        ? empDailyTasks.filter((x: any) => x.startDate.slice(0, 10) == date)
        : empDailyTasks.filter(
            (x: any) => x.weekEndingDate.slice(0, 10) == ConvertToISO(weekEnd)
          );
    for (let i = 0; i < empDailyTask.length; i++) {
      if (map.has(empDailyTask[i].projectId)) {
        map.set(empDailyTask[i].projectId, {
          estTime:
            map.get(empDailyTask[i].projectId).estTime +
            empDailyTask[i].estTime,
          actTime:
            map.get(empDailyTask[i].projectId).actTime +
            empDailyTask[i].actTime,
          projectId: empDailyTask[i].projectId,
        });
      } else {
        map.set(empDailyTask[i].projectId, {
          estTime: empDailyTask[i].estTime,
          actTime: empDailyTask[i].actTime,
          projectId: empDailyTask[i].projectId,
        });
      }
    }
  }

  function fun(employeeTask: any, weekEnd: any, date?: string | null) {
    debugger;
    var projects = employeeTask?.employeeProjects;
    var list: Project[] = [];
    for (let i = 0; i < projects.length; i++) {
      var tasks: any =
        date != null
          ? employeeTask?.employeeDailyTask.filter(
              (x: any) =>
                x.projectId == projects[i].id &&
                x.startDate.slice(0, 10) === date
            )
          : employeeTask?.employeeDailyTask.filter(
              (x: any) =>
                x.projectId == projects[i].id &&
                x.weekEndingDate.slice(0, 10) === weekEnd
            );
      var temp: Project = {
        Name: projects[i]?.name,
        Id: projects[i]?.id,
        estTime: tasks.reduce(getEstTime, 0),
        actTime: tasks.reduce(getActTime, 0),
      };
      list.push(temp);
    }
    list.sort((a, b) => b.estTime - a.estTime);
    setProjects(list);
  }

  const handleProjectClick = (project: Project) => {
    if (statusRef) {
      statusRef.current.value = "";
    }
    setProject({ name: project.Name, Id: project.Id });
    var completed = 0;
    var pending = 0;
    debugger;
    var temp =
      selectedDate != null
        ? data?.employeeDailyTask?.filter(
            (x: any) =>
              x.projectId == project.Id &&
              x.startDate.slice(0, 10) == selectedDate
          )
        : data?.employeeDailyTask?.filter(
            (x: any) =>
              x.projectId == project.Id &&
              x.weekEndingDate.slice(0, 10) == selectedWeekEnd
          );

    setTaskList(temp);
    setTaskStatusList(temp);

    temp.forEach((x: any) => {
      if (x.percentage < 100) pending++;
      if (x.percentage === 100) completed++;
    });

    setTaskStatus({
      projectId: project.Id,
      Completed: completed,
      Pending: pending,
    });
  };

  const handleWeekEndDateChange = (e: any) => {
    setMinDate(ReduceFiveDays(e));
    setMaxDate(e);

    if (statusRef) {
      statusRef.current.value = "";
      dateRef.current.value = "";
    }
    setSelectedDate(null);
    setselectedWeekEnd(e);
    var completed = 0;
    var pending = 0;
    var temp = data?.employeeDailyTask?.filter(
      (x: any) => x.weekEndingDate.slice(0, 10) === e
    );
    temp.forEach((x: any) => {
      if (x.percentage < 100) pending++;
      if (x.percentage === 100) completed++;
    });

    setProject({
      name: "All Projects",
      Id: 0,
    });
    setTaskStatus({
      projectId: data?.employeeProjects[0].id,
      Completed: completed,
      Pending: pending,
    });
    fun(data, e, null);
    GetProjectHours(data?.employeeDailyTask, e);
    setTaskList(temp);
    setTaskStatusList(temp);
  };

  const handleStatusChnage = (e: any) => {
    var taskFilter =
      dateRef?.current.value.length > 0 ? taskDateList : taskStatusList;
    if (e === "All") {
      setTaskList(taskFilter);
      return;
    }
    var temp = taskFilter.filter((task: any) => task.status == e);
    setTaskList(temp);
  };

  const handleDateChange = (e: any) => {
    if (statusRef) {
      statusRef.current.value = "";
    }

    if (e == "") {
      fun(data, "");
      GetProjectHours(data?.employeeDailyTask, "");
      setSelectedDate(null);
      setTaskList(taskStatusList);
      return;
    }

    setSelectedDate(e);
    var completed = 0;
    var pending = 0;
    var temp = data?.employeeDailyTask.filter(
      (task: any) => task.startDate.slice(0, 10) === e
    );

    temp.forEach((x: any) => {
      if (x.percentage < 100) pending++;
      if (x.percentage === 100) completed++;
    });

    setTaskStatus({
      projectId: temp[0]?.projectId,
      Completed: completed,
      Pending: pending,
    });

    setTaskList(temp);
    setTaskDateList(temp);
    fun(data, ConvertToISO(weekEndingDate), e);
    GetProjectHours(data?.employeeDailyTask, weekEndingDate, e);
  };

  return (
    <>
      {location.state.route == "employee" && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link color="inherit" to={`/${role}/Employee`}>
            <Typography sx={{ fontWeight: "bold" }}>Employee</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>
            Employee Task OverView
          </Typography>
        </Breadcrumbs>
      )}

      {location.state.route == "teamTaskQuadrant" && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link color="inherit" to={`/${role}/Task`}>
            <Typography sx={{ fontWeight: "bold" }}>Tasks</Typography>
          </Link>
          <Link
            color="inherit"
            to={`/${role}/TeamTaskQuadrant`}
            state={{ data: { ...location.state } }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Team Loading & availability
            </Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>
            Employee Task OverView
          </Typography>
        </Breadcrumbs>
      )}

      {location.state.route == "teamQuadrant" && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link color="inherit" to={`/${role}/Team`}>
            <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
              Teams
            </Typography>
          </Link>
          <Link
            color="inherit"
            to={`/${role}/TeamQuadrant`}
            state={{ ...location.state }}
          >
            <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
              Team Quadrant
            </Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>
            Employee Task OverView
          </Typography>
        </Breadcrumbs>
      )}

      <Grid sx={{ textAlign: "center" }}>
        <Typography className="fs-3">
          Employee Name:{" "}
          <span className="fw-bolder">{location.state.employeeName}</span>
        </Typography>
      </Grid>
      <div className="d-flex w-100">
        <div
          className="mt-4 border border-1 overflow-scroll w-25  emp-over-cont mx-4"
          style={{ backgroundColor: "#ebf5f3" }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 382,
              maxHeight: 570,
              backgroundColor: "#ebf5f3",
              fontFamily: "Product Sans",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className="fs-5"
                sx={{ backgroundColor: "#85edc0", padding: 1 }}
              >
                <TaskIcon />
                Projects
              </ListSubheader>
            }
          >
            {data?.employeeProjects?.length == 0 ? (
              <>
                <h5 className="text-center m-2" key="124QW">
                  No Projects
                </h5>
              </>
            ) : (
              Projects.map((e: any, index: number) => (
                <div key={index}>
                  <ListItemButton onClick={() => handleProjectClick(e)}>
                    <ListItemText
                      primary={`${e.Name} ${
                        "(" +
                        parseFloat(e.actTime).toFixed(1) +
                        " / " +
                        parseFloat(e.estTime).toFixed(1) +
                        ")"
                      }`}
                    />
                  </ListItemButton>
                  <Divider />
                </div>
              ))
            )}
          </List>
        </div>
        <div
          className="mt-4 border border-1 emp-over-cont mx-4 w-75"
          style={{ backgroundColor: "#ebf5f3" }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 1100,
              backgroundColor: "#ebf5f3",
              position: "relative",
              overflow: "auto",
              maxHeight: 570,
              ontFamily: "Product Sans",
              "& ul": { padding: 0 },
            }}
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className="fw-bold d-flex align-items-center justify-content-between"
                sx={{ backgroundColor: "#85edc0", padding: 1 }}
              >
                <div className="fs-6  d-flex align-items-center flex-column">
                  <span>
                    <TaskAltIcon /> Tasks ({" "}
                    {project.name?.length > 15 ? (
                      <abbr
                        title={project.name}
                        className=" text-decoration-none"
                      >
                        {project.name.slice(0, 15) + "..."}
                      </abbr>
                    ) : (
                      project.name || "No Projects"
                    )}{" "}
                    ) Completed: {taskStatus.Completed} Pending:
                    {taskStatus.Pending}
                  </span>
                </div>
                <FormControl className="col-md-7  d-flex flex-row">
                  <div className="mx-1">
                    Status
                    <select
                      className="form-select"
                      id="status"
                      placeholder="status"
                      ref={statusRef}
                      onChange={(e: any) => {
                        handleStatusChnage(e.target.value);
                      }}
                    >
                      <option value="" selected disabled>
                        Select Status
                      </option>
                      <option value="All">All</option>
                      <option value="Completed">Completed</option>
                      <option value="In-Progress">In Progress</option>
                      <option value="Ready-For-UAT">Ready For UAT</option>
                      <option value="Move">Move</option>
                      <option value="ReAssign">ReAssign</option>
                    </select>
                  </div>
                  <div className="mx-1">
                    Date
                    <input
                      type="date"
                      id="today-date"
                      ref={dateRef}
                      onFocus={() => {
                        dateRef.current.min = minDate;
                        dateRef.current.max = maxDate;
                      }}
                      onBlur={() => {
                        dateRef.current.min = "";
                        dateRef.current.max = "";
                      }}
                      onChange={(e: any) => {
                        handleDateChange(e.target.value);
                      }}
                      className="form-control"
                    />
                  </div>
                  <div className="mx-1">
                    Week Ending Date
                    <input
                      type="date"
                      className="form-select"
                      defaultValue={
                        location.state.weekendingDate ??
                        ConvertToISO(weekEndingDate)
                      }
                      ref={weekEndRef}
                      onChange={(e: any) => {
                        var date = new Date(e.target.value);
                        var day = date.getUTCDay();

                        if (day !== 5) {
                          Swal.fire({
                            icon: "error",
                            title: "Please Select Only Friday!",
                            showConfirmButton: true,
                          });
                          e.target.value = ConvertToISO(WeekEndingDate());
                          return false;
                        }
                        handleWeekEndDateChange(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <Tooltip title="Reset">
                      <Button
                        variant="contained"
                        className="mt-5"
                        onClick={() => {
                          if (weekEndRef.current)
                            weekEndRef.current.value =
                              ConvertToISO(weekEndingDate);
                          setselectedWeekEnd(ConvertToISO(weekEndingDate));
                          if (dateRef.current) dateRef.current.value = "";
                          if (statusRef.current) statusRef.current.value = "";
                          setRefetch(!refetch);
                        }}
                      >
                        <RefreshIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </FormControl>
              </ListSubheader>
            }
          >
            {[1].map((sectionId) => (
              <li key={`section-${sectionId}`}>
                <ul>
                  {taskList.length == 0 ? (
                    <>
                      <h4 className="text-center m-2">No Tasks</h4>
                    </>
                  ) : (
                    taskList?.map((item: any) => (
                      <div key={`item-${sectionId}-${item.id}`}>
                        <div className="card m-2">
                          <ListItem>
                            <div
                              className="card-body"
                              // style={{ border: "1px solid black" }}
                            >
                              <Link
                                to="/Admin/TaskOverview"
                                style={{ color: "inherit" }}
                                state={{
                                  ...location.state,
                                  employeeTaskId: item.id,
                                  taskname: item.name,
                                }}
                              >
                                <h5 className="card-title d-flex justify-content-between">
                                  <div>
                                    <span className="fw-bolder">Project: </span>
                                    {item.projectName} <br />
                                    <span className="fw-bolder">
                                      Task Name:{" "}
                                    </span>
                                    {item.name} ({" "}
                                    {parseFloat(item.actTime).toFixed(1)} /{" "}
                                    {parseFloat(item.estTime).toFixed(1)})
                                  </div>
                                  <div className="fs-6">
                                    <span className="fw-bolder">
                                      Created By:{" "}
                                    </span>
                                    {item.createdBy}
                                  </div>
                                </h5>
                                <p className="card-text fs-6">
                                  <span className="fw-bolder">
                                    Description:
                                  </span>
                                  <span className="mx-1">
                                    {item.description}
                                  </span>
                                  <br />
                                  <span className="fw-bolder">Category:</span>
                                  <span className="mx-1">{item.category}</span>
                                  <br />
                                  <span className="fw-bolder">
                                    Sub Category:
                                  </span>
                                  <span className="mx-1">
                                    {item.subCategory}
                                  </span>
                                  <br />
                                  <span className="fw-bolder">User Story:</span>
                                  <span className="mx-1">
                                    {item.userStory ?? "Not Applicable"}
                                  </span>
                                  <br />
                                </p>
                                <p className="card-text d-flex justify-content-between">
                                  <small className="text-muted fs-6">
                                    Status:{" "}
                                    <span
                                      className={
                                        item.percentage < 100
                                          ? `text-warning`
                                          : "text-success"
                                      }
                                    >
                                      {item.status} ({item.percentage}%)
                                    </span>
                                  </small>
                                  <div className="d-flex">
                                    <h6 className="mb-2 mx-2 border p-2">
                                      <span className="fw-bolder">
                                        Start Date:{" "}
                                      </span>
                                      {ConvertDate(item.startDate)} &nbsp;&nbsp;
                                    </h6>
                                    <h6 className="mb-3 mx-2 border p-2">
                                      <span className="fw-bolder">
                                        End Date:{" "}
                                      </span>
                                      {ConvertDate(item.endDate)}
                                    </h6>
                                  </div>
                                </p>
                              </Link>
                              <div>
                                {(item.status == "In-Progress" ||
                                  item.status == "Assigned") && (
                                  <div>
                                    <Button
                                      color="warning"
                                      variant="contained"
                                      className=" mx-2 btn-sm"
                                      component="div"
                                      sx={{ float: "right" }}
                                      onClick={() => {
                                        setTaskListView({ edit: true });
                                        setTaskId(item);
                                        setEmployeeId(
                                          `${location.state.employeeId}`
                                        );
                                      }}
                                    >
                                      Move
                                    </Button>
                                    <Button
                                      color="info"
                                      variant="contained"
                                      component="div"
                                      onClick={() => {
                                        setTaskListView({ reassign: true });
                                        setTaskId(item);
                                      }}
                                      sx={{ float: "right" }}
                                    >
                                      Re-Assign
                                    </Button>
                                  </div>
                                )}{" "}
                              </div>
                            </div>
                          </ListItem>
                        </div>
                      </div>
                    ))
                  )}
                </ul>
              </li>
            ))}
          </List>
        </div>
      </div>
      <MoveTask
        openDialog={taskListView}
        setOpenDialog={setTaskListView}
        Data={taskId}
        EmployeeId={employeeId}
        Project={data}
        refetch={setRefetch}
      />
      <ReassignTask
        openDialog={taskListView}
        setOpenDialog={setTaskListView}
        Data={taskId}
        TeamId={data?.teamId}
        refetch={setRefetch}
      />
      <BackDrop open={loading} />
    </>
  );
}
