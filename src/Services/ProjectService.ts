import { ConvertDate } from "../Utilities/Utils";
import { Project } from "../Models/Project/Project";
import { UserInterface } from "../Models/Project/UserInterface";
import { UserStory } from "../Models/Project/UserStory";
import { ProjectObjective } from "../Models/Project/ProjectObjective";
import * as XLSX from 'xlsx';

export function DownloadProjectist(data: any): void {
  const downloadData: Project[] = [];
  data.forEach((e: any) => {
    let task: Project = {
      Id: e.id || null,
      ProjectName: e.name || "-",
      ProjectType: e.type || "-",
      Description: e.description || "-",
      Status: e.status || "-",
      TotalTaskCount:e.totalTaskCount || "0",
      UserStoryCount:e.userStoryCount || "0",
      UserInterfaceCount:e.useInterfaceCount || "0",
      InProgressTaskCount:e.inProgressCount || "0",
      NotStartedTaskCount:e.notStartedTaskCounts || "0",
      Percentage: e.percentage || "0",
      StartDate: ConvertDate(e.startDate) || "-",
      EndDate: ConvertDate(e.endDate) || "-",
    };
    downloadData.push(task);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  
  const columnWidths = [
    { wpx: 50 },  
    { wpx: 150 },  
    { wpx: 100 },  
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 70 },
    { wpx: 100 },
    { wpx: 100 },  
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Projectist");


  XLSX.writeFile(wb, "Projectist.xlsx");
}

export function DownloadEmpProjectist(data: any): void {
  const downloadData: Project[] = [];
  data.forEach((e: any) => {
    let task: Project = {
      Id: e.id || null,
      ProjectName: e.name || "-",
      ProjectType: e.type || "-",
      Description: e.description || "-",
      Status: e.status || "-",
      Percentage: e.percentage || "0",
      StartDate: ConvertDate(e.startDate) || "-",
      EndDate: ConvertDate(e.endDate) || "-",
    };
    downloadData.push(task);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  
  const columnWidths = [
    { wpx: 50 },  
    { wpx: 150 },  
    { wpx: 100 },  
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 70 },
    { wpx: 100 },
    { wpx: 100 },  
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "EmployeeProjectist");


  XLSX.writeFile(wb, "EmployeeProjectist.xlsx");
}


export function DownloadUserStoryList(data: any): void {
  debugger
  const downloadData: UserStory[] = [];
  data.forEach((e: any) => {
    let userStory: UserStory = {
      ProjectId:e.projectId || "-",
      Name: e.name || "-",
      Description: e.description || "-",
      Status: e.status || "-",
      Percentage: e.percentage || "0",
      StartDate: ConvertDate(e.startDate) || "-",
      EndDate: ConvertDate(e.endDate) || "-",
    };
    downloadData.push(userStory);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  
  const columnWidths = [
    { wpx: 50 },
    { wpx: 100 },  
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },  
    { wpx: 100 },  
    { wpx: 100 },  
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "UserStoryList");


  XLSX.writeFile(wb, "UserStoryList.xlsx");
}

export function DownloadUserInterfaceList(data: any): void {
  const downloadData: UserInterface[] = [];
  data.forEach((e: any) => {
    let UserInterface: UserInterface = {
      ProjectId:e.projectId || "-",
      Name: e.name || "-",
      Description: e.description || "-",
      Status: e.status || "-",
      Percentage: e.percentage || "0",
      Complexity: e.complexity || "-",
      UICategory: e.uiCategory || "-",
      StartDate: ConvertDate(e.startDate) || "-",
      EndDate: ConvertDate(e.endDate) || "-",
    };
    downloadData.push(UserInterface);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 50 }, 
    { wpx: 150 },  
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },  
    { wpx: 150 },  
    { wpx: 100 }, 
    { wpx: 100 },   
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "UserInterfaceListx");


  XLSX.writeFile(wb, "UserInterfaceListx.xlsx");
}

export function DownloadEmpUserInterfaceList(data: any): void {
  const downloadData: UserInterface[] = [];
  data.forEach((e: any) => {
    let UserInterface: UserInterface = {
      ProjectId:e.projectId || "-",
      Name: e.name || "-",
      Description: e.description || "-",
      Status: e.status || "-",
      Percentage: e.percentage || "0",
      Complexity: e.complexity || "-",
      StartDate: ConvertDate(e.startDate) || "-",
      EndDate: ConvertDate(e.endDate) || "-",
    };
    downloadData.push(UserInterface);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 50 }, 
    { wpx: 150 },  
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },  
    { wpx: 150 },  
    { wpx: 100 }, 
    { wpx: 100 },   
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "EmployeeUserInterfaceListx");


  XLSX.writeFile(wb, "EmployeeUserInterfaceListx.xlsx");
}

export function DownloadProjectObjectiveList(data: any): void {

  const downloadData: ProjectObjective[] = [];
  data.projectObjectives.forEach((e: any) => {
    let UserInterface: ProjectObjective = {
      ProjectId:e.projectId || "-",
      Description: e.description || "-",
      status: e.status || "-",
      Percentage: e.percentage || "0",
    };
    downloadData.push(UserInterface);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 50 }, 
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },  
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ProjectObjectiveListx");


  XLSX.writeFile(wb, "ProjectObjectiveListx.xlsx");
}
