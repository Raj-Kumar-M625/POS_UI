import { ConvertDate } from "../Utilities/Utils";
import { DayPlan } from "../Models/Employee/DayPlan";
import { Task } from "../Models/Task/Task";
import { Post } from "./Axios";
import * as XLSX from 'xlsx';

export function DownloadTaskList(data: any) {

  const downloadData: Task[] = [];
  data.forEach((e: any) => {
    let task: Task = {
      name: e.name || "-",
      projectName: e.projectName || "-",
      description: e.description || "-",
      usName: e.usName || "-",
      uiName: e.uiName || "-",
      teamName: e.teamName || "-",
      employeeName: e.employeeName || "-",
      category: e.category || "-",
      subCategory: e.subCategory || "-",
      status: e.status || "-",
      percentage: e.percentage || "0",
      estimateTime: e.estimateTime || "0",
      actualTime: e.actualTime|| "0",
      estimateStartDate: ConvertDate(e.estimateStartDate) || "-",
      estimateEndDate: ConvertDate(e.estimateEndDate) || "-",
      actualStartDate: ConvertDate(e.actualStartDate) || "-",
      actualEndDate: ConvertDate(e.actualEndDate) || "-",
      weekEndDate: ConvertDate(e.weekEndDate) || "-",
    };
    downloadData.push(task);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  
  const columnWidths = [
    { wpx: 150 },  
    { wpx: 150 },  
    { wpx: 250 },  
    { wpx: 150 },  
    { wpx: 150 },  
    { wpx: 200 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },  
    { wpx: 100 },
    { wpx: 70 }, 
    { wpx: 70 },
    { wpx: 70 },  
    { wpx: 150 },  
    { wpx: 150 },  
    { wpx: 150 },  
    { wpx: 150 }, 
    { wpx: 150 },       
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TaskList");

  XLSX.writeFile(wb, "TaskList.xlsx");
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
  return await Post("app/EmployeeTask/AssignEmployeeTask", dayPlan);
}
