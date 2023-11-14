import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TaskIcon from "@mui/icons-material/Task";
import Divider from "@mui/material/Divider";
import {
  Breadcrumbs,
  FormControl,
  List,
  ListItem,
  ListSubheader,
  Typography,
} from "@mui/material";
import "../../../StyleSheets/EmployeeOverview.css";
import BackDrop from "../../../CommonComponents/BackDrop";
import { useQuery } from "react-query";
import { Get } from "../../../Services/Axios";
import { useRef, useState } from "react";
import {
  ConvertDate,
  ConvertToISO,
  WeekEndingDate,
} from "../../../Utilities/Utils";
import { Link } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export const DailyTask = () => {
  const weekEndingDate = WeekEndingDate();
  const [taskList, setTaskList] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().slice(0, 10)
  );
  const [taskStatusList, setTaskStatusList] = useState<any>([]);
  const [taskDateList, setTaskDateList] = useState([]);
  const [assignedHours, setAssignedHours] = useState<Map<any, any>>();
  const [project, setProject] = useState({ name: "", Id: -1 });
  const [taskStatus, setTaskStatus] = useState({
    projectId: 0,
    Completed: 0,
    Pending: 0,
  });

  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const statusRef = useRef<any>();
  const dateRef = useRef<any>("dd-yy-mmmm");

  const { isLoading, data } = useQuery("EmployeeOverView", async () => {
    var completed = 0;
    var pending = 0;

    const employeeTask: any = await Get(
      `app/Employee/GetEmployeeTasks?employeeId=${sessionUser?.employeeId}`
    );
    var empDailyTask: any = employeeTask?.data?.employeeDailyTask || [];

    var temp = employeeTask?.data?.employeeDailyTask?.filter(
      (x: any) =>
        x.projectId == employeeTask?.data?.employeeProjects[0].id &&
        x.startDate.slice(0, 10) == ConvertToISO(new Date())
    );

    GetProjectHours(empDailyTask, weekEndingDate, ConvertToISO(new Date()));

    temp?.forEach((x: any) => {
      if (x.percentage < 100) pending++;
      if (x.percentage === 100) completed++;
    });

    setTaskStatus({
      projectId: employeeTask?.data?.employeeProjects[0]?.id,
      Completed: completed,
      Pending: pending,
    });

    setProject({
      name: employeeTask?.data?.employeeProjects[0]?.name || "",
      Id: employeeTask?.data?.employeeProjects[0]?.id,
    });
    setTaskList(temp || []);
    setTaskStatusList(temp || []);
    return employeeTask?.data;
  });

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
    setAssignedHours(map);
  }

  const handleProjectClick = (project: any) => {
    debugger;
    if (statusRef) {
      statusRef.current.value = "";
    }
    setProject({ name: project.name, Id: project.id });
    var completed = 0;
    var pending = 0;
    var temp = data?.employeeDailyTask?.filter(
      (x: any) =>
        x.projectId == project.id && x.startDate.slice(0, 10) == selectedDate
    );

    setTaskList(temp);
    setTaskStatusList(temp);

    temp.forEach((x: any) => {
      if (x.percentage < 100) pending++;
      if (x.percentage === 100) completed++;
    });

    setTaskStatus({
      projectId: project.id,
      Completed: completed,
      Pending: pending,
    });
  };

  const handleStatusChange = (e: any) => {
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
      GetProjectHours(data?.employeeDailyTask, "");
      setSelectedDate(null);
      setTaskList(taskStatusList);
      return;
    }

    setSelectedDate(e);
    var completed = 0;
    var pending = 0;
    var temp = data?.employeeDailyTask.filter(
      (task: any) =>
        task.projectId === project.Id && task.startDate.slice(0, 10) == e
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
    GetProjectHours(data?.employeeDailyTask, weekEndingDate, e);
  };

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Employee Daily Task</Typography>
      </Breadcrumbs>

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
              data?.employeeProjects?.map((e: any) => (
                <div key={e.name}>
                  <ListItemButton onClick={() => handleProjectClick(e)}>
                    <ListItemText
                      primary={`${e.name} ${
                        assignedHours?.get(e.id)
                          ? "(" +
                            parseFloat(
                              assignedHours?.get(e.id).actTime
                            ).toFixed(1) +
                            " / " +
                            parseFloat(
                              assignedHours?.get(e.id).estTime
                            ).toFixed(1) +
                            ")"
                          : "(0 / 0)"
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
                    )}
                    ) Completed: {taskStatus.Completed} Pending:
                    {taskStatus.Pending}
                  </span>
                </div>
                <FormControl className="col-md-7  d-flex flex-row">
                  <select
                    className="form-select mx-1"
                    placeholder="status"
                    ref={statusRef}
                    onChange={(e: any) => {
                      handleStatusChange(e.target.value);
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
                  <input
                    type="date"
                    defaultValue={ConvertToISO(new Date())}
                    ref={dateRef}
                    onChange={(e: any) => {
                      handleDateChange(e.target.value);
                    }}
                    className="form-control mx-1"
                  />
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
                                to="/Employee/DailyTaskOverview"
                                style={{ color: "inherit" }}
                                state={{
                                  employeeTaskId: item.id,
                                  taskname: item.name,
                                }}
                              >
                                <h5 className="card-title d-flex justify-content-between">
                                  <div>
                                    <span className="fw-bolder">
                                      Task Name:{" "}
                                    </span>
                                    {item.name} ({" "}
                                    {parseFloat(item.actTime).toFixed(1)} /{" "}
                                    {parseFloat(item.estTime).toFixed(1)})
                                  </div>
                                </h5>
                                <p className="card-text fs-6">
                                  <span className="fw-bolder">
                                    Description:
                                  </span>
                                  <span className="mx-1">
                                    {item.description}
                                  </span>
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
                                        Start Date:
                                      </span>
                                      {ConvertDate(item.startDate)} &nbsp;&nbsp;
                                    </h6>
                                    <h6 className="mb-3 mx-2 border p-2">
                                      <span className="fw-bolder">
                                        End Date:
                                      </span>
                                      {ConvertDate(item.endDate)}
                                    </h6>
                                  </div>
                                </p>
                              </Link>
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
      <BackDrop open={isLoading} />
    </>
  );
};
