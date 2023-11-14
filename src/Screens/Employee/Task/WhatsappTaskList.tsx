import { useEffect, useState } from "react";
import { Get } from "../../../Services/Axios";
import {
  ConvertDate,
  ConvertToISO,
  WeekEndingDate,
} from "../../../Utilities/Utils";
import {
  Breadcrumbs,
  Button,
  List,
  ListItem,
  ListSubheader,
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import { SelectCategory } from "./CompleteTaskPopup";

type Task = {
  Name: string;
  Description: string;
  EstTime: number;
  Percentage: number;
  ActTime: number;
};

export const WhatsappTaskList = () => {
  const [dailyTask, setDailyTask] = useState<any>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [taskListView, setTaskListView] = useState<any>({
    view: false,
    edit: false,
    add: false,
    assign: false,
    daily: false,
  });
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const weekEndDate: Date = WeekEndingDate();
  const map = new Map<string, Task[]>();

  async function fetchdata() {
    const response: any = await Get(
      `app/EmployeeTask/GetWhatsapptaskListByTaskId?employeeId=${
        sessionUser.employeeId
      }&WeekEndingDate=${weekEndDate.toDateString()}`
    );
    const temp = response?.data?.filter(
      (x: any) => x.workedOn.slice(0, 10) === ConvertToISO(new Date())
    );
    setDailyTask(temp || []);
    setRefetch(!refetch);
  }

  dailyTask?.forEach((task: any) => {
    var temp: Task = {
      Name: task.name,
      Description: task.taskDescription,
      Percentage: task.percentage,
      EstTime: task.estTime,
      ActTime: task.actTime,
    };
    if (map.has(task.projectName)) {
      var taskList: Task[] = map.get(task.projectName) as Task[];
      map.set(task.projectName, [...taskList, temp]);
    } else {
      map.set(task.projectName, [temp]);
    }
  });

  var msg = "*Task List*%0a";
  [...map.keys()].forEach((e: any) => {
    msg += `*Project Name: ${e}* %0a*Daily Task (${ConvertDate(
      new Date().toDateString()
    )})*%0a`;
    var taskList: Task[] = map.get(e) as Task[];
    let counter = 1;
    taskList?.forEach((e: Task) => {
      msg += `${counter}.${e.Name} - ${e.Description} - ${e.EstTime}hr
       %0a Percenatge - ${e.Percentage}% 
       %0a Actual Time - ${e.ActTime}hr%0a`;
      counter++;
    });
  });

  useEffect(() => {
    fetchdata();
  }, [refetch]);
  const handleClickOpen = (taskData: any) => {
    setTaskListView({
      add: true,
      selectedTaskData: taskData,
      percentage: taskData.percentage,
      taskName: taskData.name,
      ProjectName: taskData.projectName,
    });
  };

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>WhatsApp Task</Typography>
      </Breadcrumbs>
      <div
        className="mt-4 border border-1 emp-over-cont mx-4 w-75 mx-auto"
        style={{ backgroundColor: "#ebf5f3" }}
      >
        <List
          sx={{
            width: "100%",
            maxWidth: 1500,
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
              <div className="fs-6 d-flex align-items-center w-100 justify-content-between">
                <span>
                  <TaskAltIcon /> WhatsApp Task List
                </span>
                <span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${msg}`}
                    target="#"
                  >
                    <Button variant="contained" color="warning">
                      <WhatsAppIcon className="mx-1" />
                      Share
                    </Button>
                  </a>
                </span>
              </div>
            </ListSubheader>
          }
        >
          {[1].map((sectionId) => (
            <li key={`section-${sectionId}`}>
              <ul>
                {dailyTask?.length == 0 ? (
                  <>
                    <h4 className="text-center m-2">No Tasks</h4>
                  </>
                ) : (
                  dailyTask?.map((item: any) => (
                    <div key={`item-${sectionId}-${item.id}`}>
                      <div className="card m-2">
                        <ListItem>
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between">
                              <div>
                                <span className="fw-bolder">Task Name: </span>
                                {item.name} ({" "}
                                {parseFloat(item.actTime).toFixed(1)} /{" "}
                                {parseFloat(item.estTime).toFixed(1)})
                              </div>
                            </h5>
                            <p className="card-text fs-6">
                              <span className="fw-bolder">Description:</span>
                              <span className="mx-1">
                                {item.taskDescription}
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
                            </p>
                          </div>
                          <div className="d-flex justify-content-end">
                            <Button
                              color="info"
                              variant="contained"
                              component="div"
                              disabled={item.percentage === 100}
                              onClick={() => handleClickOpen(item)}
                              sx={{ float: "right" }}
                            >
                              Complete Task
                              <CheckCircleIcon style={{ marginLeft: 10 }} />
                            </Button>
                          </div>
                        </ListItem>
                        <SelectCategory
                          openDialog={taskListView}
                          setOpenDialog={setTaskListView}
                          selectedTaskData={taskListView}
                          setRefetch={setRefetch}
                        />
                      </div>
                    </div>
                  ))
                )}
              </ul>
            </li>
          ))}
        </List>
      </div>
    </>
  );
};
