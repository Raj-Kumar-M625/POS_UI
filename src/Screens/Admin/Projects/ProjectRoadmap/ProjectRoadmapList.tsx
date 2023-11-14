import { useContextProvider } from "../../../../CommonComponents/Context";
import Flow from "./Flow";
import "./Roapmap.css";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export const ProjectRoadmapList = () => {
  const location = useLocation();
  const { role } = useContextProvider();
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="slateblue" to={`/${role}/Project`}>
          <Typography sx={{ fontWeight: "bold" }}>Projects</Typography>
        </Link>
        <Link
          color="slateblue"
          to={`/${role}/ProjectQuadrant`}
          state={{ ...location.state }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Project Quadrant</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Project Roadmap</Typography>
      </Breadcrumbs>
      <div className="App">
        <Typography
          sx={{ fontWeight: "bold", color: "blue", fontSize: "20px" }}
        >
          Project Roadmap
        </Typography>
        <Flow />
      </div>
    </>
  );
};
