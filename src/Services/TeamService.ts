import { ConvertTime } from "../Utilities/Utils";
import * as XLSX from 'xlsx';
import { Day } from "../Models/Team/Day";

export function DownloadLeaveReport(data: any, dateLabels: any, Days: Day[]) {
  const downloadData: any = [];

  data.forEach((e: any) => {
    let team: any = {
      EmployeeName: e.employeeName || "",
    };
    var present = 0;
    dateLabels.map((label: any, index: number) => {
      var date = e.employeeTimes.find(
        (x: any) => new Date(x.inTime).getDate() == index + 1
      );
      if (date) present++;
      team[`${label}`] = date
        ? `${ConvertTime(date?.inTime, "AM")} - ${
            date?.outTime ? ConvertTime(date?.outTime, "PM") : ""
          }`
        : Days[index].holidayApplicable
        ? Days[index].holidayName
        : "ABS";
    });

    team["Count Of Absent"] =
      Days.length -
      Days.filter((x: any) => x.holidayApplicable == true).length -
      present;

    downloadData.push(team);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  const columnWidths = [
    { wpx: 100}, 
    { wpx: 100 },  
    { wpx: 100 },  
    { wpx: 100 },    
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "LeaveReportListx");


  XLSX.writeFile(wb, "LeaveReportList.xlsx");
}
