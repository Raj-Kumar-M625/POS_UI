import {
  Breadcrumbs,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import CircleIcon from "@mui/icons-material/Circle";
import PersonIcon from "@mui/icons-material/Person";
import BackDrop from "../../../CommonComponents/BackDrop";
import { useContextProvider } from "../../../CommonComponents/Context";
import { ADMIN } from "../../../Constants/Roles";

export const TeamQuadrant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useContextProvider();

  async function fetchData() {
    const teamMembers = await Get(
      `app/Team/GetTeamEmployeelist?teamId=${location.state?.data?.id}`
    );
    const teamObjective = await Get(
      `app/Team/GetTeamObjectiveList?teamId=${location.state?.data?.id}`
    );
    const teamProject = await Get(
      `app/Team/GetTeamProjectList?teamId=${location.state?.data?.id}`
    );
    const teamWeeklyObjective = await Get(
      `app/Team/GetTeamWeeklyObjective?teamId=${location.state?.data?.id}`
    );
    return { teamMembers, teamObjective, teamProject, teamWeeklyObjective };
  }

  const { data, isLoading }: any = useQuery("teamName", fetchData);

  return (
    <div>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to={`/${role}/Team`}>
          <Typography sx={{ fontWeight: "bold" }}>Team</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Team Quadrant</Typography>
      </Breadcrumbs>
      <Typography align="center" className="fw-bolder fs-3">
        Team Name: {location.state?.data?.name}
      </Typography>
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
                  data?.teamMembers?.data?.length > 3 ? "scroll" : "hidden"
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
                  <PersonIcon className="mx-2" />
                  Team Members ({data?.teamMembers?.data?.length || 0})
                </ListSubheader>
              }
            >
              {(data &&
                data.teamMembers?.data?.length !== 0 &&
                data?.teamMembers?.data?.map((e: any) => (
                  <>
                    <ListItemButton>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <Link
                        to={`/${role}/EmployeeOverView`}
                        state={{
                          ...location.state,
                          employeeId: e.employeeId,
                          employeeName: e.employeeName,
                          route: "teamQuadrant",
                        }}
                      >
                        <ListItemText
                          primary={`${e.employeeName}`}
                          key={e.employeeId}
                        />
                      </Link>
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
                  navigate("/Admin/AssignTeamMember", {
                    state: {
                      data: {
                        id: location.state?.data?.id,
                        name: location.state?.data?.name,
                      },
                    },
                  });
                }}
              >
                <AddIcon className="px-1 fs-5" /> Add Member
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
                  data?.teamObjective?.data?.length > 3 ? "scroll" : "hidden"
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
                  <ModeStandbyIcon className="mx-2" />
                  Team Objective ({data?.teamObjective?.data?.length || 0})
                </ListSubheader>
              }
            >
              {(data &&
                data.teamObjective?.data !== "" &&
                data?.teamObjective?.data?.map((e: any) => (
                  <>
                    <ListItemButton>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText primary={`${e.description}`} key={e.id} />
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
            <Button
              color="primary"
              variant="contained"
              className="px-1 m-2"
              onClick={() => {
                navigate(`/${role}/TeamObjective`, {
                  state: {
                    data: {
                      id: location.state?.data?.id,
                      name: location.state?.data?.name,
                    },
                  },
                });
              }}
            >
              Team Objective
            </Button>
          </div>
          <div className="item m-2 mb-5">
            <List
              sx={{
                width: "100vw",
                maxWidth: 460,
                maxHeight: "25vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${
                  data?.teamProject?.data?.length > 3 ? "scroll" : "hidden"
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
                  <AssignmentIcon className="mx-2" />
                  Team Projects ({data?.teamProject?.data?.length || 0})
                </ListSubheader>
              }
            >
              {(data &&
                data?.teamProject?.data !== "" &&
                data?.teamProject?.data?.map((e: any) => (
                  <>
                    <ListItemButton>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.projectName}`}
                        key={e.projectId}
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
          <div className="item m-2 mb-5">
            <List
              sx={{
                width: "100vw",
                maxWidth: 460,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${
                  data?.teamWeeklyObjective?.data?.length > 3
                    ? "scroll"
                    : "hidden"
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
                  <ModeStandbyIcon className="mx-2" />
                  Team Weekly Objective (
                  {
                    data?.teamWeeklyObjective?.data?.filter((e: any) => {
                      const weekEndingDate = new Date(e.weekEndingDate);
                      const startOfWeek = new Date();
                      startOfWeek.setDate(
                        startOfWeek.getDate() - startOfWeek.getDay()
                      );
                      startOfWeek.setHours(0, 0, 0, 0);

                      const endOfWeek = new Date(startOfWeek);
                      endOfWeek.setDate(
                        startOfWeek.getDate() + (5 - startOfWeek.getDay())
                      );
                      endOfWeek.setHours(23, 59, 59, 999);

                      return (
                        weekEndingDate >= startOfWeek &&
                        weekEndingDate <= endOfWeek
                      );
                    }).length
                  }
                  )
                </ListSubheader>
              }
            >
              {(data &&
                data.teamWeeklyObjective?.data !== "" &&
                data?.teamWeeklyObjective?.data
                  ?.filter((e: any) => {
                    const weekEndingDate = new Date(e.weekEndingDate);
                    const startOfWeek = new Date();
                    startOfWeek.setDate(
                      startOfWeek.getDate() - startOfWeek.getDay()
                    );
                    startOfWeek.setHours(0, 0, 0, 0);

                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(
                      startOfWeek.getDate() + (5 - startOfWeek.getDay())
                    );
                    endOfWeek.setHours(23, 59, 59, 999);

                    return (
                      weekEndingDate >= startOfWeek &&
                      weekEndingDate <= endOfWeek
                    );
                  })
                  .map((e: any) => (
                    <>
                      <ListItemButton>
                        <ListItemIcon>
                          <CircleIcon sx={{ fontSize: 10 }} />
                        </ListItemIcon>
                        <ListItemText primary={`${e.name}`} key={e.id} />
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
            <Button
              color="primary"
              variant="contained"
              className="px-1 m-2"
              onClick={() => {
                navigate(`/${role}/MonthlyObjective`, {
                  state: {
                    data: {
                      id: location.state?.data?.id,
                      name: location.state?.data?.name,
                    },
                  },
                });
              }}
            >
              Team Weekly Objective
            </Button>
          </div>
        </div>
      </div>
      <BackDrop open={isLoading} />
    </div>
  );
};
