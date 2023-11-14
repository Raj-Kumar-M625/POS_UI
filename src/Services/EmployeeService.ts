import { Employee } from "../Models/Employee/Employee";
import * as XLSX from 'xlsx';

export function DownloadEmployeeList(data: any) {
  const downloadData: Employee[] = [];
  data.forEach((e: any) => {
    let employee: Employee = {
      userId: e.userId || "",
      name: e.user.name || "",
      email: e.user.email || "",
      phoneNumber: e.phoneNumber || "",
      category: e.category || "",
      department: e.department || "",
    };
    downloadData.push(employee);
  });
  const ws = XLSX.utils.json_to_sheet(downloadData);

  
  const columnWidths = [
    { wpx: 100 },  
    { wpx: 200 },  
    { wpx: 250 },  
    { wpx: 150 },  
    { wpx: 100 },  
    { wpx: 150 },  
  ];

  ws['!cols'] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "EmployeeList");


  XLSX.writeFile(wb, "EmployeeList.xlsx");
}
