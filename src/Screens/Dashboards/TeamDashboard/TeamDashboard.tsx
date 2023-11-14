import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import TeamDashBoardTable from "./TeamDashboardfile";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import BackDrop from "../../../CommonComponents/BackDrop";
import { useEffect } from "react";
import { useContextProvider } from "../../../CommonComponents/Context";

export const TeamDashBoard = () => {
  const location: any = useLocation();
  const { role } = useContextProvider();
  async function fetchData() {
    const Teamdashboard = await Get(
      `app/Common/GetTeamDashboardData?teamId=${location.state?.data?.teamId}`
    );

    const Team = await Get(
      `app/Employee/GetEmployeeMonthlyTask?teamId=${location.state?.data?.teamId}`
    );
    return { Teamdashboard, Team };
  }
  const { data, isFetching }: any = useQuery("TeamDetails", fetchData);

  const skills = data?.Teamdashboard?.data?.teamMember?.map((e: any) =>
    e.employeeSkills?.map((s: any) => s.skill)
  );

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

  const currentMonth = getCurrentMonth();

  const currentYear: number = new Date().getFullYear();

  function calculatePercentage(
    arrays: string[][]
  ): { language: string; percentage: string }[] {
    const languageCounts: { [language: string]: number } = {};

    arrays?.forEach((array: string[]) => {
      array.forEach((language: string) => {
        if (languageCounts[language]) {
          languageCounts[language]++;
        } else {
          languageCounts[language] = 1;
        }
      });
    });

    const totalLanguages = arrays?.reduce(
      (total: number, array: string[]) => total + array.length,
      0
    );

    const languagePercentages: { language: string; percentage: string }[] = [];
    for (const language in languageCounts) {
      const percentage = (languageCounts[language] / totalLanguages) * 100;
      languagePercentages.push({
        language: language,
        percentage: `${percentage.toFixed(2)}%`,
      });
    }

    return languagePercentages;
  }
  useEffect(() => {
    const Teamdashboard = Get(
      `app/Common/GetTeamDashboardData?teamId=${location.state?.data?.teamId}`
    );
    Teamdashboard.then((response: any) => {
      return response;
    });
  }, []);

  const languagePercentages = calculatePercentage(skills);

  const languages = languagePercentages.map((item) => item.language);
  const percentagesAsNumbers = languagePercentages.map((item) =>
    parseFloat(item.percentage.replace("%", ""))
  );

  const series: any = percentagesAsNumbers ? percentagesAsNumbers : 100;
  const options: any = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: languages,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const colors: any = [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#546E7A",
    "#26a69a",
    "#D10CE8",
  ];

  function adjustColors(colorsArray: any) {
    const adjustedColors = [];
    const numColorsNeeded = data?.Teamdashboard?.data?.totalTeamEmployees;

    for (let i = 0; i < numColorsNeeded; i++) {
      adjustedColors.push(colorsArray[i % colorsArray.length]);
    }

    return adjustedColors;
  }

  const TotalActulHours = [
    {
      data: data?.Teamdashboard?.data?.teamMember?.map((e: any) =>
        e.actualHour !== null ? e.actualHour : 0
      ),
    },
  ];

  const adjustedColors = adjustColors(colors);

  const Lineoptions: any = {
    chart: {
      height: 350,
      type: "bar",
    },
    colors: adjustedColors,
    plotOptions: {
      bar: {
        columnWidth: "50%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: data?.Teamdashboard?.data?.teamMember?.map(
        (e: any) => e.employeeName
      ),
      labels: {
        style: {
          colors: adjustedColors,
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: any) => `${val} TotalActualHours`,
      },
    },
  };

  var assignedHours = data?.Team.data?.map((e: any) => e.actualHour);
  var unAssignedHours = data?.Team.data?.map((e: any) => e.estHour);

  const Assignseries = [
    {
      name: "Actual Hours",
      data: assignedHours,
    },
    {
      name: "Estimated Hours",
      data: unAssignedHours,
    },
  ];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const Assignoptions: any = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data?.Team.data?.map((e: any) => monthNames[e.month - 1]),
    },
    yaxis: {
      title: {
        text: "hours",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + " Hours";
        },
      },
    },
  };

  return (
    <>
      <div style={{ background: "rgba(0,0,0,0.1)" }}>
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link to={`/${role}/Team`}>
            <Typography sx={{ fontWeight: "bold" }}>Team</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>Team Dashboard</Typography>
        </Breadcrumbs>
        <div className="container d-flex justify-content-evenly">
          <Typography sx={{ fontWeight: "bold", fontSize: "35px" }}>
            {location.state?.data.teamName}
          </Typography>
        </div>
        <div className="container d-flex justify-content-evenly">
          <div className="shadow w-100 bg-light m-2">
            <div className="main">
              <div className="card m-2 text-light text-center">
                <span className="m-0 fs-5 bg-primary fw-bold text-center">
                  {" "}
                  TEAM MEMBERS
                </span>
                <Typography sx={{ color: "blue", fontSize: "78px" }}>
                  {data?.Teamdashboard.data.totalTeamEmployees || "0"}
                </Typography>
              </div>
              <div className="card m-2 text-light text-center">
                <span className="m-0 fs-5 bg-success fw-bold text-center">
                  {" "}
                  TOTAL PROJECTS
                </span>
                <Typography sx={{ color: "green", fontSize: "78px" }}>
                  {data?.Teamdashboard.data.totalTeamProject || "0"}
                </Typography>
              </div>
              <div className="card m-2 text-light text-center">
                <span className="m-0 fs-5 bg-dark fw-bold text-center">
                  WEEKLY OBJECTIVE
                </span>
                <Typography sx={{ color: "#281833", fontSize: "78px" }}>
                  {data?.Teamdashboard.data.totalWeekObjective || "0"}
                </Typography>
              </div>
              <div className="card m-2 text-light text-center">
                <span className="m-0 fs-5 bg-secondary fw-bold text-center">
                  MONTHLY OBJECTIVE
                </span>
                <Typography sx={{ color: "grey", fontSize: "78px" }}>
                  {data?.Teamdashboard.data.totalMonthObjective || "0"}
                </Typography>
              </div>
              <div className="card m-2 text-light text-center">
                <span className="m-0 fs-5 bg-danger fw-bold text-center">
                  TOTAL OBJECTIVES
                </span>
                <Typography sx={{ color: "red", fontSize: "78px" }}>
                  {data?.Teamdashboard.data.totalteamObjectives || "0"}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="container d-flex justify-content-evenly">
          <div className="shadow w-40 bg-light m-2">
            <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
              EMPLOYEES TECH STACK{" "}
            </Typography>
            <div id="chart" style={{ marginTop: "42px" }}>
              <ReactApexChart
                options={options}
                series={series}
                type="pie"
                width={380}
              />
            </div>
          </div>
          <div className="shadow w-50 bg-light m-2">
            <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
              EMPLOYEES TOTAL ACTUAL HOURS IN{" "}
            </Typography>
            <Typography
              sx={{
                color: "blueviolet",
                fontSize: "25px",
                textAlign: "center",
              }}
            >
              [ {`${currentMonth.toUpperCase()}`} ]
            </Typography>
            <div id="chart">
              <ReactApexChart
                options={Lineoptions}
                series={TotalActulHours}
                type="bar"
                height={350}
              />
            </div>
          </div>
          <div className="shadow w-75 bg-light m-2">
            <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
              TEAM TOTAL TASK IN HOURS{" "}
              <span style={{ color: "red" }}>( {currentYear} )</span>
            </Typography>
            <div id="chart">
              <ReactApexChart
                options={Assignoptions}
                series={Assignseries}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
        <TeamDashBoardTable />
      </div>
      <BackDrop open={isFetching} />
    </>
  );
};
