import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
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
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { Get } from "../../../Services/Axios";

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

export const ProjectTasks = () => {
  const location = useLocation();
  const [ProjectCheckList, setProjectCheckList] = useState<any>([]);

  async function fetchProjectCheckList() {
    try {
      const projectId = location.state?.data?.id;
      if (true) {
        const response: any = await Get(
          `app/Task/GetUserTaskCheckList?projectId=${projectId}`
        );
        if (response && response.data) {
          setProjectCheckList(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching project tasks:", error);
    }
  }

  useEffect(() => {
    fetchProjectCheckList();
  }, []);

  console.log(ProjectCheckList);

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link to="/Admin/CheckList">
          <Typography color="slateblue">
            <GroupsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            checklist
          </Typography>
        </Link>
        <Link
          to="/Admin/ProjectTasks"
          state={{
            data: {
              id: location.state?.data?.id,
              name: location.state?.data?.name,
            },
          }}
        >
          <Typography color="slateblue">
            <Diversity3Icon sx={{ mr: 0.5 }} fontSize="inherit" />
            project
          </Typography>
        </Link>
      </Breadcrumbs>
      <div
        className="border-start p-4 card mx-auto m-3"
        style={{
          height: "80vh",
          background: "rgba(10, 200, 250, 0.6)",
          width: "90vw",
        }}
      >
        <h3 className="text-bolder position-sticky">Project Tasks</h3>
        <div className="overflow-scroll scroll">
          {ProjectCheckList.map((task: any) => (
            <div key={task.id} className="m-1">
              <div className="card d-flex flex-row border p-3 justify-content-between">
                <div>
                  <p className="fs-6">
                    <span className="fw-bolder">Name:</span> {task.taskName}
                  </p>
                  <p className="fs-6">
                    <span className="fw-bolder">QA checked:</span>{" "}
                    {task.qaCheckCount}
                  </p>
                  <p className="fs-6">
                    <span className="fw-bolder">DEV checked:</span>{" "}
                    {task.devCheckCount}
                  </p>
                </div>
                <div>
                  {task?.userTaskCheckLists.some((e: any) => e.isQAChecked) && (
                    <div
                      id="name1"
                      className="flex-1 mt-3 d-flex flex-column overflow-scroll"
                      style={{
                        width: "9em",
                        height: "30vh",
                        marginBottom: "15px",
                        fontSize: 44,
                        padding: 7,
                      }}
                    >
                      <h4>QA Checked</h4>
                      {task?.userTaskCheckLists?.map((e: any) => {
                        if (e.isQAChecked) {
                          return (
                            <div style={{ marginBottom: "20px" }}>
                              <p
                                className="fs-6"
                                style={{
                                  marginBottom: "5px",
                                  textAlign: "left",
                                }}
                              >
                                <span className="fw-bolder">Description:</span>
                                {e.checkListDescription}
                              </p>
                              <p
                                className="fs-6"
                                style={{
                                  marginBottom: "20px",
                                  textAlign: "left",
                                }}
                              >
                                <span className="fw-bolder">CreatedBy:</span>
                                {e.userName}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
                <div>
                  {task?.userTaskCheckLists.some(
                    (e: any) => e.isDevChecked
                  ) && (
                    <div
                      id="name2"
                      className="flex-1 mt-3 d-flex flex-column overflow-scroll"
                      style={{
                        width: "9em",
                        height: "30vh",
                        marginBottom: "15px",
                        fontSize: 44,
                        padding: 7,
                      }}
                    >
                      <h4>Dev Checked</h4>
                      {task?.userTaskCheckLists?.map((e: any) => {
                        if (e.isDevChecked) {
                          return (
                            <div style={{ marginBottom: "20px" }}>
                              <p
                                className="fs-6"
                                style={{
                                  marginBottom: "5px",
                                  textAlign: "left",
                                }}
                              >
                                <span className="fw-bolder">Description:</span>
                                {e.checkListDescription}
                              </p>
                              <p
                                className="fs-6"
                                style={{
                                  marginBottom: "20px",
                                  textAlign: "left",
                                }}
                              >
                                <span className="fw-bolder">CreatedBy:</span>
                                {e.userName}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
