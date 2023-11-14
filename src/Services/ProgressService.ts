import { ConvertDate } from "../Utilities/Utils";
import { Progress } from "../Models/Task/Progress";
import * as XLSX from 'xlsx';

export function DownloadProgressList(data: any) {
  const downloadData: Progress[] = [];
  data.forEach((e: any) => {
    let progress: Progress = {
      EmployeeName: e.employeeName || "-",
      ProjectName: e.projectName || "-",
      TaskName: e.name || "-",
      TaskDescription:e.description || "-",
      StartDate: ConvertDate(e.startDate) || "-",
      EndDate: ConvertDate(e.endDate) || "-",
      EstimatedTime:e.estTime || "0",
      ActualTime:e.actTime || "0",
      Percentage:e.percentage || "0",
      Status: e.status || "-",
      Priority: e.priority || "-",
      WeekEndingDate: ConvertDate(e.weekEndingDate) || "-",
    };
    downloadData.push(progress);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  
  const columnWidths = [
    { wpx: 150 },  
    { wpx: 100 },  
    { wpx: 150 },  
    { wpx: 250 },  
    { wpx: 100 },  
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 70 },
    { wpx: 70 },
    { wpx: 100 }, 
    { wpx: 70 },
    { wpx: 150 },
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ProgressList");


  XLSX.writeFile(wb, "ProgressList.xlsx");
}
