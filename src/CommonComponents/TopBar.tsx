import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import "../StyleSheets/TopBar.css";
import List from "@mui/material/List";
import { useEffect, useState } from "react";
// import { Get } from "../Services/Axios";
import {
  ADMIN,
  CUSTOMER,
  EMPLOYEE,
  // EMPLOYEE
} from "../Constants/Roles";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Grid, Hidden, Tooltip, styled } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import LoginIcon from "@mui/icons-material/Login";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { useQuery } from "react-query";
// import { ConvertToISO } from "../Utilities/Utils";
// import ScrumIcon from "../assets/Scrum_Icon.png";
import { SessionUser } from "../Models/Employee/Employee";
import { AdminPages, Admindrawer } from "../Constants/AdminPages";
import { EmployeeDrawer, EmployeePages } from "../Constants/EmployeePages";
import { CustomerPages, Customerdrawer } from "../Constants/CustomerPages";

// type EnableTopbarData = {
//   id: number;
//   name: string;
// };

export const TopBar = () => {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const [drawer, setDrawer] = useState([]);
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser: SessionUser = JSON.parse(json);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const navigate = useNavigate();

  useEffect(() => {
    var PAGES: any;
    var DRAWER: any;
    switch (sessionUser?.userRoles) {
      case ADMIN:
        PAGES = AdminPages;
        DRAWER = Admindrawer;
        break;
      case EMPLOYEE:
        PAGES = EmployeePages;
        DRAWER = EmployeeDrawer;
        break;
      case CUSTOMER:
        PAGES = CustomerPages;
        DRAWER = Customerdrawer;
        break;
      default:
        PAGES = [];
        DRAWER = [];
    }
    setPages(PAGES);
    setDrawer(DRAWER);
  }, [sessionUser]);

  // async function fetchdata() {

  //   const responses: any = await Get("app/EmployeeTime/GetEmployeeTimeDetails");
  //   // debugger
  //   if (responses?.data?.length === 0 ){
  //     setnext(true);
  //   } else {
  //     setnext(false);
  //   }
  //   const response: any = await Get(
  //     `app/EmployeeDailyTask/GetEmployeeDailyTask?EmployeeId=${
  //       sessionUser.employeeId
  //     }`
  //   );
  //   const temp = response?.data?.filter(
  //     (x: any) => x.workedOn.slice(0, 10) === ConvertToISO(new Date())
  //   );
  //   // debugger
  //   if(temp?.length === 0){
  //     setshare(true);
  //   } else {
  //     setshare(false);
  //   }
  // }

  // useEffect(() => {
  //   fetchdata();
  // }, []);

  // const { data: EnableTopbarData, refetch } = useQuery<EnableTopbarData>(
  //   "Topbar",
  //   async () => {
  //     const EnableTopbar: any = await Get<EnableTopbarData>(
  //       `app/EmployeeDailyTask/GetEmployeeDailyTask?EmployeeId=${sessionUser.employeeId}`
  //     );
  //     const TaskTopbar: any = await Get(
  //       `app/EmployeeTime/GetEmployeeTimeDetails`
  //     );

  //     if (TaskTopbar?.data?.length === 0) {
  //       setnext(true);
  //     } else {
  //       setnext(false);
  //     }
  //     var temp;
  //     if (sessionUser.userRoles === EMPLOYEE) {
  //       temp = EnableTopbar?.data?.filter(
  //         (x: any) => x?.workedOn?.slice(0, 10) === ConvertToISO(new Date())
  //       );
  //     }

  //     if (temp?.length === 0) {
  //       setshare(true);
  //     } else {
  //       setshare(false);
  //     }
  //     return {
  //       EnableTopbarData,
  //       TaskTopbarData: TaskTopbar?.data,
  //     };
  //   }
  // );

  const handleCloseNavMenu = (page: string) => {
    navigate(page);
  };

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  const Logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.setItem("isLoggedIn", "Login");
    setPages([]);
    navigate("/Login");
  };

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Grid container>
              <Grid>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontFamily: "Product Sans",
                    fontWeight: 600,
                    fontSize: 24,
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  {sessionUser == null ? null : (
                    <MenuIcon
                      className="mx-3 text-light"
                      onClick={() => setOpen(true)}
                    />
                  )}
                  <Link
                    to={`/${sessionUser?.userRoles ?? "Login"}`}
                    style={{ color: "inherit" }}
                  >
                    Project Oversight
                  </Link>
                </Typography>
              </Grid>
              <Hidden only={["md", "xs"]}>
                <Grid>
                  <Box
                    sx={{
                      display: {
                        md: "hidden",
                        width: "max-content",
                      },
                    }}
                  >
                    {pages.map((page: any, index: number) => {
                      return (
                        <>
                          <MenuItem
                            sx={{ fontFamily: "Product Sans" }}
                            key={index}
                            onClick={() =>
                              handleCloseNavMenu(
                                `/${sessionUser.userRoles}/` +
                                  page?.name?.replaceAll(" ", "")
                              )
                            }
                          >
                            <page.icon className="mx-1" />
                            {page?.name}
                          </MenuItem>
                        </>
                      );
                    })}
                    {/* {sessionUser == null
                    ? null
                    : sessionUser.userRoles == ADMIN
                    ? AdminPages.map((page, index) => {
                        return (
                          <>
                            <MenuItem
                              sx={{ fontFamily: "Product Sans" }}
                              key={index}
                              onClick={() =>
                                handleCloseNavMenu(
                                  "/Admin/" + page?.name?.replaceAll(" ", "")
                                )
                              }
                            >
                              <page.icon className="mx-1" />
                              {page?.name}
                            </MenuItem>
                          </>
                        );
                      })
                    : EmployeePages.map((page, index) => {
                        return (
                          <MenuItem
                            key={index}
                            // disabled={
                            //   page.name === "Task" ||
                            //   page.name === "Project" ||
                            //   page.name === "Team"
                            //     ? next
                            //     : page.name === "Whatsapp Task List" ||
                            //       page.name === "Task Progress" ||
                            //       page.name === "Daily Task"
                            //     ? share
                            //     : page.name === "Employee Time"
                            //     ? false
                            //     : true
                            // }
                            onClick={() =>
                              handleCloseNavMenu(
                                "/Employee/" + page.name.replaceAll(" ", "")
                              )
                            }
                          >
                            <page.icon className="mx-1" /> {page.name}
                          </MenuItem>
                        );
                      })} */}
                  </Box>
                </Grid>
              </Hidden>
              <Grid
                style={{ width: "20rem", position: "absolute", right: "4px" }}
              >
                <Box className="float-end d-flex align-items-center">
                  {sessionUser == null ? null : (
                    <>
                      <AccountCircleIcon className="mx-1" />
                      <span>{sessionUser?.userName}</span>
                    </>
                  )}
                  <Button color="inherit" onClick={() => Logout()} className="">
                    {sessionStorage.getItem("isLoggedIn") == "Logout" ? (
                      <Tooltip title={"Logout"}>
                        <LogoutIcon className="mx-1" />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader className="d-flex align-items-center justify-content-between">
          <span className="mx-1 fw-bolder">Project Oversight</span>
          <IconButton onClick={handleDrawerClose}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawer.map((text: any, index: number) => (
            <>
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setOpen(!open);
                    handleCloseNavMenu(
                      `/${sessionUser?.userRoles}/` +
                        text?.name?.replaceAll(" ", "")
                    );
                  }}
                >
                  <text.icon className="mx-2" />{" "}
                  <ListItemText primary={text?.name} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Drawer>
      {/* {sessionUser == null ? null : sessionUser.userRoles == ADMIN ? (
        <Drawer
          sx={{
            width: 300,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 300,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader className="d-flex align-items-center justify-content-between">
            <span className="mx-1 fw-bolder">Project Oversight</span>
            <IconButton onClick={handleDrawerClose}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {Admindrawer.map((text, index) => (
              <>
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      handleCloseNavMenu(
                        "/Admin/" + text?.name?.replaceAll(" ", "")
                      );
                    }}
                  >
                    <text.icon className="mx-2" />{" "}
                    <ListItemText primary={text?.name} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Drawer>
      ) : (
        <>
          <Drawer
            sx={{
              width: 300,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 300,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={employeeDrawerOpen}
          >
            <DrawerHeader className="d-flex align-items-center justify-content-between">
              <span className="mx-1 fw-bolder">Project Oversight</span>
              <IconButton onClick={() => setEmployeeDrawerOpen(false)}>
                {employeeDrawerOpen ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
              <IconButton onClick={() => setEmployeeDrawerOpen(false)}>
                {!employeeDrawerOpen ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {EmployeeDrawer.map((text: any, index: number) => (
                <>
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      disabled={
                        text.name === "Task" ||
                        text.name === "Project" ||
                        text.name === "Team"
                          ? next
                          : text.name === "Whatsapp Task List" ||
                            text.name === "Task Progress" ||
                            text.name === "Daily Task"
                          ? share
                          : text.name === "Employee Time"
                          ? false
                          : true
                      }
                      onClick={() => {
                        setEmployeeDrawerOpen(false);
                        handleCloseNavMenu(
                          "/Employee/" + text?.name?.replaceAll(" ", "")
                        );
                      }}
                    >
                      <text.icon className="mx-2" />{" "}
                      <ListItemText primary={text?.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Drawer>
        </>
      )} */}
    </>
  );
};
