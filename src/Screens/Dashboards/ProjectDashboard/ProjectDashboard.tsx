import "../../../StyleSheets/ProjectDashboard.css";
import ReactTable from "./ReactTable";
import { Breadcrumbs, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import { Get } from "../../../Services/Axios";
import { PieChart } from "./PieChart";
import BackDrop from "../../../CommonComponents/BackDrop";

export const ProjectDashboard = () => {
  const [projectDashboardDto, setProjectDashboardDto] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    const response: any = await Get("app/Project/getProjectDashBoardData");
    setProjectDashboardDto(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="slateblue">
          <TaskAltIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Project Dashboard
        </Typography>
      </Breadcrumbs>
      <h1 className="fw-bolder text-center m-4">Project Dashboard
      <span>
      <Link
        to={"/Admin/ProjectsReport"}
        >
        <Button variant='contained' className="mt-3" sx={{float:'right'}}>
        PROJECT REPORTS
        </Button>
        </Link>
        </span></h1>
      <div className="grid-box m-2">
        <div className="item-4 text-dark">
          <h3 className="text-center">Project</h3>
          <PieChart props={projectDashboardDto?.commonProject || {}} />
        </div>
        <div className="item-1 text-dark">
          <h3 className="text-center">User Story</h3>
          <PieChart props={projectDashboardDto?.commonUserStory || {}} />
        </div>
        <div className="item-2 text-dark">
          <h3 className="m-2 text-center">User Interface</h3>
          <PieChart props={projectDashboardDto?.commonUserInterface || {}} />
        </div>
        <div className="item-3 text-dark">
          <h3 className="m-2 text-center">Tasks</h3>
          <PieChart props={projectDashboardDto?.commonTask || {}} />
        </div>
        <div
          className="item-6 overflow-x-scroll scroll"
          style={{ gridColumn: "span 4", width: "98vw" }}
        >
          <ReactTable data={projectDashboardDto || []} />
        </div>
      </div>
      <BackDrop open={loading} />
    </>
  );
};
