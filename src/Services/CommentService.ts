import { ConvertTime } from "../Utilities/Utils";
import { Comment } from "../Models/Comments/Comment";
import { Attendence } from "../Models/Employee/Attendance";
import * as XLSX from 'xlsx';

export function DownloadCommentList(data: any): void {
  const downloadData: Comment[] = [];
  data.forEach((e: any) => {
    let comment: Comment = {
      EmployeeTaskId: e.employeeTaskId || "-",
      Employee: e.employee || "-",
      Project: e.project || "-",
      Comment: e.comment || "-",
    };
    downloadData.push(comment);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 50 }, 
    { wpx: 100 },
    { wpx: 100 },   
    { wpx: 100 },     
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "CommentListtx");


  XLSX.writeFile(wb, "CommentList.xlsx");
}

export function DownloadAttendanceList(data: any): void {
  const downloadData: Attendence[] = [];
  data.forEach((e: any) => {
    let attendance: Attendence = {
      DayId: e.dayId || "",
      EmployeeName: e.employeeName || "",
      TeamName:e.teamName || "",
      Department: e.department || "",
      Date: e.date.slice(0, 10) || "",
      InTime: ConvertTime(e.inTime, "AM") || "",
      OutTime: ConvertTime(e.outTime, "PM") || "",
    };
    downloadData.push(attendance);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 50 }, 
    { wpx: 100 },
    { wpx: 100 },   
    { wpx: 100 },  
    { wpx: 70 },
    { wpx: 70 },    
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "AttendanceListtx");


  XLSX.writeFile(wb, "AttendanceListtx.xlsx");
}
