import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  DialogContent,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Get, Post } from "../../../Services/Axios";
import { useQuery } from "react-query";
import "../../../StyleSheets/Quadrant.css";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircleIcon from "@mui/icons-material/Circle";
import TaskIcon from "@mui/icons-material/Task";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackDrop from "../../../CommonComponents/BackDrop";
import Swal from "sweetalert2";
import { AlertOption } from "../../../Models/Common/AlertOptions";
import { useContextProvider } from "../../../CommonComponents/Context";
import { ADMIN } from "../../../Constants/Roles";
import InfoIcon from "@mui/icons-material/Info";

export const ProjectQuadrant = () => {
  const location = useLocation();
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const [userId, setuserId] = useState(null);
  const [open, setopen] = useState<boolean>(false);
  const { role } = useContextProvider();

  async function getTeamName() {
    const teamname = await Get(
      `app/Team/GetTeamNames?projectId=${location.state?.projectId}`
    );
    const objective = await Get(
      `app/Project/GetProjectObjective?ProjectId=${location.state?.projectId}`
    );

    const tasks = await Get(
      `app/EmployeeTask/GetProjectTasklist?Id=${location.state?.projectId}`
    );

    const Totaltask = await Get(
      `app/Task/getProjectTaskList?projectId=${location.state?.projectId}`
    );

    return { teamname, objective, tasks, Totaltask };
  }
  const { data, isLoading, refetch }: any = useQuery(
    "ProjectQuadrant",
    getTeamName
  );

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${role}/ProjectQuadrant/ProjectObjectiveList`, {
      state: { ...location.state },
    });
  };

  const roadmapClick = () => {
    navigate(`/${role}/ProjectQuadrant/ProjectRoadmapList`, {
      state: {
        ...location.state,
      },
    });
  };

  const ProjectReportClick = () => { 
    if (sessionUser?.userRoles === "Admin") {
    navigate("/Admin/ProjectQuadrant/ProjectReport", {
      state: {
        ...location.state,
        projectName: location.state?.projectName,
        projectId: location.state?.projectId,
        Projectuserstory: location.state?.projectuserstory,
      },
    });
  }
  };

  async function AssignLead() {
    const { error }: any = await Post(
      `app/Project/AssignLead?userId=${userId}&projectId=${location.state?.projectId}`,
      ""
    );
    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Assigning!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Lead Assigned Successfully!",
        icon: "success",
      };
    }
    Swal.fire({
      ...option,
      showCloseButton: true,
    }).then(() => {
      refetch();
    });
  }
  debugger;
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="inherit" to={`/${role}/Project`}>
          <Typography sx={{ fontWeight: "bold" }}>Projects</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Project Quadrant</Typography>
      </Breadcrumbs>
      <Grid container>
        <Grid xs={6} sx={{ marginLeft: 75 }}>
          <Typography className="fw-bolder fs-3">
            Project Name : {location.state?.projectName}
          </Typography>
        </Grid>
        <Grid xs={2}></Grid>
      </Grid>
      <div className="container">
        <div className="grid">
          <div className="item m-2">
            <List
              sx={{
                width: "100vw",
                maxWidth: 460,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${
                  data?.teamname?.data?.length > 3 ? "scroll" : "hidden"
                }`,
                overflowx: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <PersonIcon className="mx-2" />
                  Team Members ({data?.teamname?.data?.length || 0})
                </ListSubheader>
              }
            >
              {(data &&
                data.teamname?.data !== "" &&
                data?.teamname?.data?.map((e: any) => (
                  <>
                    <ListItemButton>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${
                          e.userId == e.leadId
                            ? e.username + " (Lead)"
                            : e.username
                        }`}
                        key={e.userId}
                      />
                    </ListItemButton>
                    <Divider />
                  </>
                ))) || (
                <>
                  <ListItemButton>
                    <ListItemIcon>
                      <ErrorOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="No data!" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
            </List>

            {role === ADMIN && (
              <Button
                color="primary"
                variant="contained"
                className="px-1 m-2"
                onClick={() => {
                  setopen(true);
                }}
              >
                Assign Lead
              </Button>
            )}
          </div>
          <div className="item m-2">
            <List
              sx={{
                width: "100vw",
                maxWidth: 460,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${
                  data?.objective?.data?.projectObjectives?.length > 3
                    ? "scroll"
                    : "hidden"
                }`,
                overflowx: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <DescriptionIcon className="mx-2" />
                  Project Objective (
                  {data?.objective?.data?.projectObjectives?.length || 0})
                </ListSubheader>
              }
            >
              {(data &&
                data?.objective?.data?.projectObjectives !== "" &&
                data?.objective?.data?.projectObjectives?.map((e: any) => (
                  <>
                    <ListItemButton>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.description}`}
                        key={e.userId}
                      />
                    </ListItemButton>
                    <Divider />
                  </>
                ))) || (
                <>
                  <ListItemButton>
                    <ListItemIcon>
                      <ErrorOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="No data!" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
            </List>
            <div className="row">
              <div className="col">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ right: "6rem", width: "8rem" }}
                  className="px-1 m-2"
                  onClick={roadmapClick}
                >
                  Project Roadmap
                </Button>
              </div>
              <div className="col">
                <Button
                  color="primary"
                  variant="contained"
                  className="px-1 m-2"
                  onClick={handleClick}
                >
                  Objective List
                </Button>
              </div>
            </div>
          </div>
          <div className="item m-2">
            <List
              sx={{
                width: "100vw",
                maxWidth: 460,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${
                  data?.tasks?.data?.length > 3 ? "scroll" : "hidden"
                }`,
                overflowX: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <TaskIcon className="mx-2" />
                  Project Tasks ({data?.tasks?.data?.length || 0})
                </ListSubheader>
              }
            >
              {(data &&
                data.tasks?.data !== "" &&
                data?.tasks?.data?.map((e: any) => (
                  <>
                    <ListItemButton>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.description}`}
                        key={e.userStoryUIId}
                      />
                    </ListItemButton>
                    <Divider />
                  </>
                ))) || (
                <>
                  <ListItemButton>
                    <ListItemIcon>
                      <ErrorOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="No data!" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
            </List>
          </div>
          <div className="item m-2">
            <h5 className="text-center m-1" style={{ color: "#07eb1a" }}>
              Project Report
            </h5>
            <div className="d-flex flex-column justify-content-center align-items-center mt-2">
              <div className="">
                <h4 className="text-secondary border border-2 p-2">
                  Total Task :{data?.Totaltask?.data?.totalTask}
                </h4>
                <h4 className="text-warning border border-2 p-2">
                  Ready For UAT :{data?.Totaltask?.data?.readyForUAT}
                </h4>
                <h4 className="text-success border border-2 p-2">
                  Completed Task :{data?.Totaltask?.data?.completed}
                </h4>
                <h6 className="p-2 mb-3 d-flex justify-content-center">
                  <span
                    className="btn btn-sm btn-info text-light"
                    onClick={ProjectReportClick}
                  >
                    <InfoIcon sx={{ mr: 1 }} />
                    View Report
                  </span>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open}>
        <DialogTitle>Assign Lead</DialogTitle>
        <DialogContent className="row d-flex justify-content-center">
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <div className="row d-flex justify-content-center">
            <FormControl className="m-2">
              <InputLabel id="project-type">Employee Names</InputLabel>
              <Select
                labelId="Employee-Names"
                required
                onChange={(e: any) => {
                  setuserId(e.target.value);
                }}
                id="Employee-Names"
                label="Employee Names"
              >
                {data &&
                  data?.teamname?.data !== "" &&
                  data?.teamname?.data?.map((e: any) => (
                    <MenuItem value={e.userId} key={e.userId}>
                      {e.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="d-flex justify-content-end">
              <Button
                variant="contained"
                className="mx-2 mt-4"
                onClick={() => {
                  setopen(false);
                  AssignLead();
                }}
              >
                Assign
              </Button>
              <Button
                variant="contained"
                className="mx-2 mt-4"
                onClick={() => {
                  setopen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </DialogContent>
      </Dialog>
      <BackDrop open={isLoading} />
    </>
  );
};
