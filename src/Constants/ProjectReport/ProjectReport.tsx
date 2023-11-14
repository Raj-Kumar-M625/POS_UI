import { ProjectReportVM, ReportFilter } from "../../Models/Project/Project";
import { TaskListDto } from "../../Models/Task/Task";
import { ConvertDate } from "../../Utilities/Utils";

export const PRIORITY_TASKS: any = [
  {
    field: "id",
    name: "SL.NO",
    width: "5rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: any, index: number) => (
      <p className={`tableStyle ${row.name}`}>{index + 1}</p>
    ),
  },
  {
    field: "name",
    name: "Task Name",
    width: "15rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.name}</p>,
  },
  {
    field: "taskDescription",
    name: "Description",
    width: "18rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.description}</p>
    ),
  },
  {
    field: "uSName",
    name: "User Story",
    width: "13rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.usName}</p>,
  },
  {
    field: "uIName",
    name: "User Interface",
    width: "13rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.uiName}</p>,
  },
  {
    field: "teamName",
    name: "Team Name",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.teamName}</p>
    ),
  },
  {
    field: "employeeName",
    name: "Employee Name",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">
        {row.employeeName.replace(/[^A-Za-z ]/g, "")}
      </p>
    ),
  },
  {
    field: "category",
    name: "Category",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.category}</p>
    ),
  },
  {
    field: "subCategory",
    name: "Sub Category",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.subCategory}</p>
    ),
  },
  {
    field: "status",
    name: "Status",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.status}</p>,
  },
  {
    field: "percentage",
    name: "Percentage",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.percentage}</p>
    ),
  },
  {
    field: "actualStartDate",
    name: "Actual Start Date",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{ConvertDate(row.actualStartDate)}</p>
    ),
  },
  {
    field: "actualEndDate",
    name: "Actual End Date",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{ConvertDate(row.actualEndDate)}</p>
    ),
  },
];

export const TASK_LIST: any = [
  {
    field: "SL.NO",
    name: "SL.NO",
    width: "5rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto, index: number) => (
      <p className={`tableStyle ${row.name}`}>{index + 1}</p>
    ),
  },
  {
    field: "name",
    name: "Task Name",
    width: "15rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.name}</p>,
  },
  {
    field: "description",
    name: "Description",
    width: "18rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.description}</p>
    ),
  },
  {
    field: "usName",
    name: "User Story",
    width: "12rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.usName}</p>,
  },
  {
    field: "uiName",
    name: "User Interface",
    width: "12rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.uiName}</p>,
  },
  {
    field: "teamName",
    name: "Team Name",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.teamName}</p>
    ),
  },
  {
    field: "employeeName",
    name: "Employee Name",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">
        {row.employeeName.replace(/[^A-Za-z ]/g, "")}
      </p>
    ),
  },
  {
    field: "category",
    name: "Category",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.category}</p>
    ),
  },
  {
    field: "subCategory",
    name: "Sub Category",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.subCategory}</p>
    ),
  },
  {
    field: "status",
    name: "Status",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => <p className="tableStyle">{row.status}</p>,
  },
  {
    field: "percentage",
    name: "Percentage",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.percentage}</p>
    ),
  },
  {
    field: "estimateTime",
    name: "Estimate Time",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.estimateTime}</p>
    ),
  },
  {
    field: "actualTime",
    name: "Actual Time",
    width: "10rem",
    editable: false,
    headerClassName: "bg-primary text-light",
    headerAlign: "left",
    align: "left",
    selector: (row: TaskListDto) => (
      <p className="tableStyle">{row.actualTime}</p>
    ),
  },
];

export const PROJECTREPORT: ProjectReportVM = {
  highPriorityTasks: [],
  todaysTasks: [],
  userStory: [],
  userInterface: [],
  task: [],
  totalResource: 0,
  totalResourceHours: 0,
  completedPercentage: 0,
  pendingPercentage: 0,
};

export const FILTER: ReportFilter = {
  startDate: null,
  endDate: null,
  userStory: null,
  userInterface: null,
  category: null,
  subCategory: null,
};
