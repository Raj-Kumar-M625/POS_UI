import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

interface SeriesData {
  name: string;
  data: number[];
}

interface ApexChartProps {}

const EmployeeDailyTask: React.FC<ApexChartProps> = () => {
  const location= useLocation();

 async function Employeetaskdetails() {

  const totalproject = await  Get(`app/EmployeeDailyTask/GetMonthlyWiseEmployeeTasks?employeeId=${location.state.employeeId}`)
    return{totalproject};
 }
 const { data }: any = useQuery(
  "MonthlyEmployeeDetails",
  Employeetaskdetails
);

const currentYear: number = new Date().getFullYear();

  const ApexOptions:any = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: "13px",
              fontWeight: 900
            }
          }
        }
      }
    },
    stroke: {
      width: 1,
      colors: ["#fff"]
    },
    title: {
      text: "MONTHLY TASKS"
    },
    xaxis: {
      categories: ["JANAUARY", "FEBRAUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"],
      labels: {
        formatter: function (val: number) {
          return val + "-TASK";
        }
      }
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + "-TASK";
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40
    }
  };

  const series: SeriesData[] = [
    {
      name: "In-progess",
      data:  data?.totalproject?.data.monthlyLists.map((e: any) => e.totalInProgress) || []
    },
    {
      name: "Completed",
      data: data?.totalproject?.data.monthlyLists.map((e: any) => e.totalCompleted) || []
    },
    {
      name: "Ready for units",
      data: data?.totalproject?.data.monthlyLists.map((e: any) => e.totalReadyForUAT) || []
    }
    
    ];

  return (
    <div className="container d-flex justify-content-evenly">
         <div className="shadow w-100 bg-light m-2" style={{ height: 450 }}>
         <h1 className="display-6 mx-5 " aria-aria-label=''>EMPLOYEE DAILY TASK ON {currentYear}</h1>
    <div className="chart-wrap">
    <div id="chart">
      <ReactApexChart
        options={ApexOptions}
        series={series}
        type="bar"
        height={350}
      />
      </div>
    </div>
    </div>
    </div>
  );
};

export default EmployeeDailyTask;
