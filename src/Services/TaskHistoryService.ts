import { ConvertDate } from "../Utilities/Utils";
import { DayPlan } from "../Models/Employee/DayPlan";
import { Task } from "../Models/Task/Task";
import { Post } from "./Axios";
import * as XLSX from 'xlsx';

export function DownloadTaskList(data: any) {
  const downloadData: Task[] = [];
  data.forEach((e: any) => {
    let task: Task = {
      Name: e.name || "-",
      ProjectName: e.project?.name || "-",
      Description: e.description || "-",
      Category: e.category?.categories || "-",
      SubCategory: e.category?.subCategory || "",
      Status: e.status || "-",
      Percentage: e.percentage || "-",
      EstimatedTime: e.estTime || "-",
      ActualTime: e.estTime || "-",
      EstimatedStartDate: ConvertDate(e.estimateStartDate) || "-",
      EstimatedEndDate: ConvertDate(e.estimateEndDate) || "-",
      ActualStartDate: ConvertDate(e.actualStartDate) || "-",
      ActualEndDate: ConvertDate(e.actualEndDate) || "-",
    };
    downloadData.push(task);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 100 }, 
    { wpx: 100 },  
    { wpx: 250 },  
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 }, 
    { wpx: 100 }, 
    { wpx: 100 }, 
    { wpx: 100 },   
    { wpx: 100 },
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TaskListListx");


  XLSX.writeFile(wb, "TaskListHistory.xlsx");
}

export async function TaskAssign(data: any, selectedRow: any) {
  let dayPlan: DayPlan = {
    EmployeeId: data.EmployeeId,
    TaskId: selectedRow.id,
    ProjectId: selectedRow.projectId,
    Name: selectedRow.name,
    Description: selectedRow.description,
    StartDate: data.StartDate,
    EndDate: data.EndDate,
    EstTime: data.EstTime,
    ActTime: 0,
    Priority: data.Priority,
    Status: "Assigned",
    Percentage: selectedRow.percentage,
    Comment: data.Comment,
    CreatedBy: "user",
    WeekEndingDate: selectedRow.weekEndDate,
    EstStartDate: selectedRow.estimateStartDate,
    EstEndDate: selectedRow.estimateEndDate,
  };
  debugger;
  await Post("app/EmployeeTask/AssignEmployeeTask", dayPlan);
}
