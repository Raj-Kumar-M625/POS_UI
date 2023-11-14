import React from "react";
import ReactApexChart from "react-apexcharts";
import { Grid, Typography } from "@mui/material";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";

export function GetFridaysOfMonth(): Date[] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const fridays: Date[] = [];
  const dateIterator = new Date(currentDate.getFullYear(), currentMonth, 1);

  while (dateIterator.getMonth() === currentMonth) {
    if (dateIterator.getDay() === 5) {
      // 0: Sunday, 1: Monday, ..., 5: Friday, 6: Saturday
      fridays.push(new Date(dateIterator)); // Create a new Date object to avoid reference issues
    }
    dateIterator.setDate(dateIterator.getDate() + 1);
  }
  return fridays;
}

function getCurrentMonth(): string {
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonth = months[currentMonthIndex];

  return currentMonth;
}

// Usage
const currentMonth = getCurrentMonth();

// interface ChartData {
//   series: number[];
//   options: {
//     chart: {
//       height: number;
//       type: string;
//     };
//     plotOptions: {
//       radialBar: {
//         offsetY: number;
//         startAngle: number;
//         endAngle: number;
//         hollow: {
//           margin: number;
//           size: string;
//           background: string;
//           image?: any;
//         };
//         dataLabels: {
//           name: {
//             show: boolean;
//           };
//           value: {
//             show: boolean;
//           };
//         };
//       };
//     };
//     colors: string[];
//     labels: string[];
//     legend: {
//       show: boolean;
//       floating: boolean;
//       fontSize: string;
//       position: string;
//       offsetX: number;
//       offsetY: number;
//       labels: {
//         useSeriesColors: boolean;
//       };
//       markers: {
//         size: number;
//       };
//       formatter: (seriesName: string, opts: any) => string;
//       itemMargin: {
//         vertical: number;
//       };
//     };
//     responsive: {
//       breakpoint: number;
//       options: {
//         legend: {
//           show: boolean;
//         };
//       };
//     }[];
//   };
// }

const EmployeeTask: React.FC = () => {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  async function Employeetaskdetails() {
    const totalproject: any = await Get(
      `app/EmployeeDailyTask/GetEachEmployeeDailyTaskById?employeeId=${sessionUser.employeeId}`
    );

    return { totalproject };
  }
  const { data }: any = useQuery("EmployeeTaskdetails", Employeetaskdetails);

  const options: any = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: ["#00E396"],
    dataLabels: {
      formatter: function (val: string, opt: any) {
        const goals =
          opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

        if (goals && goals.length) {
          return `${val} / ${goals[0].value}`;
        }
        return val;
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Actual Time", "Estimated Time"],
      markers: {
        fillColors: ["#00E396", "#775DD0"],
      },
    },
  };

  const EstimatedTime = data?.totalproject?.data.toatalEstTime;

  const actualTime = data?.totalproject?.data.toatalActTime;
  const pendingTasks = data?.totalproject?.data.totalInProgress || 0;
  const completedTasks = data?.totalproject?.data.totalCompleted || 0;
  const totalTasks = data?.totalproject?.data.totalTask;

  function convertToPercentage(value: number, maxValue: number): any {
    if (maxValue == 0) {
      return null;
    }
    return (value / maxValue) * 100;
  }

  const estimatedTime = EstimatedTime;

  const value = estimatedTime;
  const maxValue = estimatedTime;

  const TotalEstimated = convertToPercentage(value, maxValue) ?? 0;
  const TotalTask = convertToPercentage(totalTasks, totalTasks) ?? 0;

  const TotalAct = actualTime;

  function convertToPercentageTotalAct(
    totalValue: number,
    otherValue: number
  ): any {
    if (otherValue === 0) {
      return null;
    }
    return (totalValue / otherValue) * 100;
  }

  const Actualpercentage = (
    convertToPercentageTotalAct(TotalEstimated, TotalAct) ?? 0
  ).toFixed(1);
  const TaskCompleted = (
    convertToPercentageTotalAct(completedTasks, totalTasks) ?? 0
  ).toFixed(1);
  const TaskInProgress = (
    convertToPercentageTotalAct(pendingTasks, totalTasks) ?? 0
  ).toFixed(1);

  const series = [
    {
      name: "Actual Time",
      data: data?.totalproject?.data.weeklyLists.map((e: any) => ({
        x: `${e.weekEndDate.slice(0, 10)}`,

        y: `${e.actTime}`,
        goals: [
          {
            name: "Estimated Time",
            value: `${e.estTime}`,
            strokeWidth: 8,
            strokeHeight: 28,
            strokeColor: "#775DD0",
          },
        ],
      })),
    },
  ];

  const chartData: any = {
    series: [
      TaskInProgress,
      TaskCompleted,
      TotalTask,
      Actualpercentage,
      TotalEstimated,
    ],
    options: {
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 1,
            size: "30%",
            background: "transparent",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ["#00D3C8", "#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: [
        "In-progress",
        "Completed",
        "Total Task",
        "Total actTime",
        "Total Estime",
      ],
      legend: {
        show: true,
        floating: true,
        fontSize: "14px",
        position: "left",
        offsetX: -25,
        offsetY: 1,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName: any, opts: any) {
          return (
            seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%"
          );
        },
        itemMargin: {
          vertical: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  };

//   debugger;
  return (
    <div className="container d-flex justify-content-evenly">
      <Grid sx={{ display: "inline-flex", width: "100%" }}>
        <div className="shadow w-75 bg-light m-2" style={{ height: 450 }}>
          <h1 className="display-7 mx-5 ">
            WEEKLY TASK ON {`${currentMonth.toUpperCase()}`}
          </h1>
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          </div>
        </div>
        <div className="shadow w-25 bg-light m-2" style={{ height: 450 }}>
          <div id="chart">
            <Typography sx={{ fontWeight: "bold", fontSize: "25px" }}>
              OVERALL TASK
            </Typography>
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="radialBar"
              height={390}
            />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default EmployeeTask;
