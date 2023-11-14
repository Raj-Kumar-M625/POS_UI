import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Get } from "../../../../Services/Axios";
import { ConvertDate } from "../../../../Utilities/Utils";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { AddTeamWeeklyObjective } from "./AddTeamWeeklyObjective";
import { EditTeamWeeklyObjective } from "./EditTeamWeeklyObjective";
import {
  ArcElement,
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AddMonthlyObjective } from "./AddMonthlyObjective";
import { EditTeamMonthlyObjective } from "./EditTeamMonthlyObjective";
ChartJS.register(
  ArcElement,
  Legend,
  Tooltip,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement
);

export const TeamWeeklyObjectiveList = () => {
  const location = useLocation();
  const [monthlyObjId, setMonthlyObjId] = useState(0);
  const [monthlyObjective, setMonthlyObjective] = useState<any>([]);
  const [viewObjectiveData, setObjectiveData] = useState<any>({});
  const [monthlyObjData, setMonthlyObjData] = useState<any>({});
  const [projectId, setProjectId] = useState<any>({});

  function getData(x: number, y: number) {
    const data = {
      labels: [`Completed ${x}`, `Pending ${y}`],
      datasets: [
        {
          label: "",
          data: [x, y],
          backgroundColor: ["#11f721", "#ed022a"],
        },
      ],
    };

    return data;
  }

  const [objectiveView, setObjectiveView] = useState<any>({
    view: false,
    edit: false,
    add: false,
    add2: false,
  });

  useEffect(() => {
    let objectiveList = Get(
      `app/Team/GetTeamMonthlyObjective?teamId=${location.state?.data?.id}`
    );
    objectiveList.then((response: any) => {
      setMonthlyObjective(response.data || []);
    });
  }, []);

  const handleClickOpen = (id: any) => {
    setMonthlyObjId(id);
    setObjectiveView({ add: true });
  };

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Team">
          <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
            Team
          </Typography>
        </Link>
        <Link
          to="/Admin/TeamQuadrant"
          state={{
            data: {
              id: location.state?.data?.id,
              name: location.state?.data?.name,
            },
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
            Team Quadrant
          </Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>
          Team Weekly Objective
        </Typography>
      </Breadcrumbs>
      <Typography align="center" className="fs-3">
        Team Name:{" "}
        <span className="fw-bolder">{location.state?.data?.name}</span>
      </Typography>
      <Button
        variant="contained"
        className="mx-2"
        onClick={() => setObjectiveView({ add2: true })}
      >
        <AddIcon />
        Add Monthly Objective
      </Button>
      {monthlyObjective.length > 0 ? (
        monthlyObjective.map((objective: any) => {
          let x: number = objective.teamWeeklyObjectives.filter(
            (x: any) => x.status == "Completed"
          ).length;
          let y: number = objective.teamWeeklyObjectives.length - x;
          return (
            <div
              className="card m-5 h-75 mx-auto"
              style={{ width: "90vw" }}
              key={objective.id}
            >
              <div className="bg-primary d-flex position-relative">
                <h4 className="title  text-light p-3">Monthly Objective</h4>
                <Button
                  variant="contained"
                  color="warning"
                  className="position-absolute mx-2 my-3"
                  onClick={() => {
                    setObjectiveView({ edit2: true });
                    setMonthlyObjData(objective);
                  }}
                >
                  Edit
                </Button>
              </div>
              <div className="d-flex flex-row ">
                <div
                  style={{ width: "280px", height: "300px" }}
                  className="mx-auto"
                >
                  <div
                    className="fs-6 card overflow-scroll scroll p-3 mx-1 mt-2"
                    style={{ width: "22rem", height: "10rem" }}
                  >
                    <h5>
                      <b>Name: </b>
                      {objective.name}
                    </h5>
                    <h5>
                      <b>Description: </b>
                      {objective.description}
                    </h5>
                    <h5>
                      <b>Project: </b>
                      {objective.projectName}
                    </h5>
                  </div>
                  <Doughnut data={getData(x, y)} />
                </div>
                <div
                  className="border-start p-4  card  mx-auto m-3"
                  style={{
                    height: "62vh",
                    background: "rgba(226, 250, 10,0.6)",
                    width: "60vw",
                  }}
                >
                  <h3 className="text-bolder position-sticky">
                    Weekly Objective{" "}
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        setProjectId(objective.projectId);
                        handleClickOpen(objective.id);
                      }}
                    >
                      <AddIcon className="fs-6" />
                      Add Weekly Objective
                    </Button>
                  </h3>
                  <div
                    className={`scroll ${
                      objective.teamWeeklyObjectives.length > 0
                        ? "overflow-scrol"
                        : ""
                    }`}
                  >
                    {objective.teamWeeklyObjectives.length > 0 ? (
                      objective.teamWeeklyObjectives.map((obj: any) => {
                        return (
                          <div className="m-1" key={obj.id}>
                            <div className="card d-flex flex-row border p-3 justify-content-between">
                              <div>
                                <p className="fs-6">
                                  <span className="fw-bolder">Name:</span>{" "}
                                  {obj.name}
                                </p>
                                <p className="fs-6">
                                  <span className="fw-bolder">
                                    Description:
                                  </span>{" "}
                                  {obj.description}
                                </p>
                                <p className="fs-6">
                                  {" "}
                                  <span className="fw-bolder">
                                    Week Ending Date:{" "}
                                  </span>
                                  {ConvertDate(obj.weekEndingDate)}
                                </p>
                                <p className="fs-6">
                                  {" "}
                                  <span className="fw-bolder">Status: </span>
                                  {obj.status}
                                </p>
                              </div>
                              <div className="">
                                <Button
                                  variant="contained"
                                  color="warning"
                                  className="m-1"
                                  onClick={() => {
                                    setObjectiveView({ edit: true });
                                    setObjectiveData(obj);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <h4 className="text-center m-5">
                        <ErrorOutlineIcon className="fs-1 mx-2" />
                        No Objectives
                      </h4>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="m-5" style={{ height: "55vh" }}>
          <div className="d-flex align-items-center justify-content-center w-100">
            <ErrorOutlineIcon className="fs-1 mx-2" />
            <span className="fs-2">No Objectives</span>
          </div>
        </div>
      )}

      <AddTeamWeeklyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setMonthlyObjective={setMonthlyObjective}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
        monthlyObjId={monthlyObjId}
        projectId={projectId}
      />

      <AddMonthlyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setRows={setMonthlyObjective}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
      />

      <EditTeamWeeklyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setMonthlyObjective={setMonthlyObjective}
        Data={viewObjectiveData}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
      />

      <EditTeamMonthlyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        Data={monthlyObjData}
        setMonthlyObjective={setMonthlyObjective}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
      />
    </>
  );
};
