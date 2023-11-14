// import React from "react";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Breadcrumbs, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import Diversity3Icon from "@mui/icons-material/Diversity3";
// import { Button } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
// import { Link } from 'react-router-dom';
import BallotIcon from "@mui/icons-material/Ballot";
// import List from '@mui/material/List';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Get } from "../../../../Services/Axios";
// import { Button, ListItemIcon, MenuItem } from '@mui/material';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MuiGrid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Divider from "@mui/material/Divider";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Check from "@mui/icons-material/Check";
import { Tooltip } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const steps = ["Business Analysist", "Development", "QA", "UAT", "Production"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
  justifyContent: "center",
  height: "55px",
  border: "2px solid white",
}));

const Content = styled(Paper)(() => ({
  justifyContent: "center",
  height: "55px",
  border: "1px solid white",
  color: "white",
}));

const Details = styled(Paper)(() => ({
  backgroundColor: "#f5faf6",
  width: "75%",
  bgcolor: "#ebf0ec",
  height: "35%",
  marginLeft: 55,
  marginTop: 10,
}));

const Dropdown = styled(Paper)(() => ({
  backgroundColor: "#f5faf6",
  width: "90%",
  bgcolor: "#ebf0ec",
  height: "175px",
  marginLeft: 5,
  marginTop: 10,
  overflowY: "scroll",
  border: "1px solid Orange",
}));

const Count = styled(Paper)(() => ({
  backgroundColor: "lightgray",
  textAlign: "center",
  height: "30px",
  width: "55px",
  border: "2px solid white",
  fontSize: 22,
}));

const TotalCount = styled(Paper)(() => ({
  backgroundColor: "lightgray",
  textAlign: "center",
  height: "50px",
  width: "75px",
  border: "2px solid white",
  marginTop: "23px",
  marginLeft: "44px",
  fontSize: 22,
  paddingTop: 7,
}));

export type UserStorysdetails = {
  name: string;
  description: string;
  status: string;
  percentage: number;
};

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

export const ProjectDetails = () => {
  // const [progress, setProgress] = useState(0);
  const location = useLocation();
  const [Data, setData] = useState<UserStorysdetails[]>([]);
  //   const [loading, setLoading] = useState<boolean>(true);
  const [UIList, setUIList] = useState<any>([]);

  // console.log(UIList);
  //   const datadetails: any = [
  //     {
  //       name: "Dashboard",
  //       Description: "User will a Select a Use Case from this UC",
  //       status: "Active",
  //       Percentage: 50,
  //     },
  //     {
  //       name: "Change of Unit Information",
  //       Description:
  //         "User will be able to Monitior and Change the Unit Related Information",
  //       status: "In-Active",
  //       Percentage: 0,
  //     },
  //   ];

  const columns = useMemo<MRT_ColumnDef[]>(
    //column definitions...
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: (row: any) => (
          <Link
            to="/Admin/ProjectQuadrant/UserInterfaceList"
            state={{
              projectId: row?.id,
              projectName: row?.name,
            }}
            style={{ textDecoration: "none" }}
          >
            <Tooltip color="info" title="User Interface List">
              {row?.name}
            </Tooltip>
            <AutoStoriesIcon />
          </Link>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        width: "150px",
      },
      {
        accessorKey: "percentage",
        header: "percentage",
      },
      {
        accessorKey: "status",
        header: "status",
      },
      {
        accessorKey: "stages",
        header: "stages",
      },
    ],
    []
    //end
  );

  // async function getProjectDetail() {
  //     const userStoryList = Get(
  //         `app/Project/GetUserStoryList?projectId=${location.state.projectId}`
  //     );
  //     return{ userStoryList };
  // }
  // const { data }:any = useQuery("ProjectDetails", getProjectDetail);

  // console.log(data?.userStoryList?.data);
  // useEffect(() => {
  //     // const interval = setInterval(() => {
  //     //     setProgress((oldProgress) => {
  //     //         const newProgress = Math.random() * 20;
  //     //         return Math.min(oldProgress + newProgress, 100);
  //     //     });
  //     // }, 1000);
  //     // return () => clearInterval(interval);
  //     let userStoryList = Get(
  //         `app/Project/GetUserStoryList?projectId=${location.state.projectId}`
  //     );
  //     userStoryList.then((response: any) => {
  //         setRows(response?.data || []);
  //         setLoading(false);
  //         console.log(response.data)
  //     });

  // }, []);

  useEffect(() => {
    let userStoryList = Get(
      `app/Project/GetUserStoryList?projectId=${location.state.projectId}`
    );

    let userInterfaceList = Get(
      `app/Project/GetUserInterfacelist?projectId=${location.state.projectId}`
    );

    userStoryList.then((response: any) => {
      setData(response?.data || []);
      //   setfilterRows(response?.data || []);
      //   setLoading(false);
      // console.log(response.data)
    });

    userInterfaceList.then((response: any) => {
      setUIList(response?.data || []);
    });
  }, []);
  //   debugger
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link color="inherit" to="/Admin/Project">
          <Typography>
            <TaskIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Projects
          </Typography>
        </Link>
        <Link color="inherit" to="Admin/ProjectQuadrant">
          <Typography color="slateblue">
            <Diversity3Icon sx={{ mr: 0.5 }} fontSize="inherit" />
            Project Quadrant
          </Typography>
        </Link>
        <Typography color="slateblue">
          <BallotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Project Details
        </Typography>
      </Breadcrumbs>
      <Grid container>
        <Grid xs={12} sx={{ textAlign: "center", mt: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>USER STORY LIST</Typography>
        </Grid>
        <Grid container sx={{ display: "flex", mt: 3 }}>
          <Grid xs={1.5} sx={{ ml: 30 }}>
            <Box>
              <Content sx={{ backgroundColor: "lightgreen" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  Business Analysis
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "darkgreen",
                    fontSize: "25px",
                  }}
                >
                  25
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#dea407" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  Development
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#dea407",
                    fontSize: "25px",
                  }}
                >
                  35
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#078fde" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>QA</Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#078fde",
                    fontSize: "25px",
                  }}
                >
                  42
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#2618ed" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>UAT</Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#2618ed",
                    fontSize: "25px",
                  }}
                >
                  30
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#6a0be6" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  Production
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#6a0be6",
                    fontSize: "25px",
                  }}
                >
                  28
                </Typography>
              </Item>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={4} sx={{ mt: 2 }}>
            <Grid container>
              <Details>
                <Item>
                  <Typography
                    sx={{
                      fontSize: "25px",
                      fontFamily: "unset",
                      textAlign: "center",
                    }}
                  >
                    {/* <PlayArrowIcon /> */}
                    User Story
                  </Typography>
                </Item>
                <Grid container>
                  <Grid xs={6}>
                    <ListItem>
                      <ListItemIcon>
                        <IndeterminateCheckBoxIcon sx={{ color: "red" }} />

                        <ListItemText primary="Pending" />
                        <Count sx={{ color: "red", ml: 4.5 }}>25</Count>
                      </ListItemIcon>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <IndeterminateCheckBoxIcon sx={{ color: "blue" }} />

                        <ListItemText primary="Completed" />

                        <Count sx={{ color: "blue", ml: 2 }}>35</Count>
                      </ListItemIcon>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BeenhereIcon sx={{ color: "indigo" }} />

                        <ListItemText primary="Approved" />
                        <Count sx={{ color: "indigo", ml: 3 }}>30</Count>
                      </ListItemIcon>
                    </ListItem>
                  </Grid>
                  <Grid xs={5}>
                    <Typography
                      sx={{
                        fontSize: "25px",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      Total
                    </Typography>
                    <TotalCount>60</TotalCount>
                  </Grid>
                </Grid>
              </Details>
              <Details>
                <Item>
                  <Typography
                    sx={{
                      fontSize: "25px",
                      fontFamily: "unset",
                      textAlign: "center",
                    }}
                  >
                    {/* <PlayArrowIcon /> */}
                    User Interface
                  </Typography>
                </Item>
                <Grid container>
                  <Grid xs={6}>
                    <ListItem>
                      <ListItemIcon>
                        <IndeterminateCheckBoxIcon sx={{ color: "red" }} />

                        <ListItemText primary="Pending" />
                        <Count sx={{ color: "red", ml: 4.5 }}>45</Count>
                      </ListItemIcon>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <IndeterminateCheckBoxIcon sx={{ color: "blue" }} />

                        <ListItemText primary="Completed" />

                        <Count sx={{ color: "blue", ml: 2 }}>72</Count>
                      </ListItemIcon>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BeenhereIcon sx={{ color: "indigo" }} />

                        <ListItemText primary="Approved" />
                        <Count sx={{ color: "indigo", ml: 3 }}>60</Count>
                      </ListItemIcon>
                    </ListItem>
                  </Grid>
                  <Grid xs={5}>
                    <Typography
                      sx={{
                        fontSize: "25px",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      Total
                    </Typography>
                    <TotalCount>117</TotalCount>
                  </Grid>
                </Grid>
              </Details>
            </Grid>
          </Grid>
          <Grid xs={7.5} sx={{ mt: 2, height: "80%" }}>
            <div className="shadow w-100 bg-light m-2 ">
              <MaterialReactTable
                columns={columns}
                data={Data}
                enableColumnOrdering
                enableGrouping
                enablePinning
                initialState={{
                  showColumnFilters: false,
                  pagination: { pageIndex: 0, pageSize: 5 },
                }}
                positionToolbarAlertBanner="bottom"
                renderDetailPanel={() => (
                  <>
                    <Grid sx={{ width: "100%" }}>
                      <Box sx={{ width: "100%" }}>
                        <Stepper
                          alternativeLabel
                          activeStep={1}
                          connector={<QontoConnector />}
                        >
                          {steps.map((label) => (
                            <Step key={label}>
                              <StepLabel StepIconComponent={QontoStepIcon}>
                                {label}
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </Box>
                      <Grid container>
                        <Grid xs={6}>
                          <Typography
                            sx={{ fontWeight: "bold", color: "blue" }}
                          >
                            User Interface Lists
                          </Typography>
                          <Dropdown>
                            {UIList.map((e: any) => (
                              <>
                                <List
                                  component="nav"
                                  aria-label="project folders"
                                >
                                  <ListItemText sx={{ color: "orange" }}>
                                    {e.name}
                                  </ListItemText>
                                  <Stepper activeStep={1} alternativeLabel>
                                    {steps.map((label) => (
                                      <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                      </Step>
                                    ))}
                                  </Stepper>
                                  <Divider />
                                </List>
                              </>
                            ))}
                          </Dropdown>
                        </Grid>
                        <Grid xs={6}>
                          <Typography
                            sx={{ fontWeight: "bold", color: "blue" }}
                          >
                            Task Lists
                          </Typography>
                          <Dropdown>
                            {UIList.map((e: any) => (
                              <>
                                <List
                                  component="nav"
                                  aria-label="project folders"
                                >
                                  <ListItemText sx={{ color: "orange" }}>
                                    {e.name}
                                  </ListItemText>

                                  <Divider />
                                </List>
                              </>
                            ))}
                          </Dropdown>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                  // <Box
                  //     sx={{
                  //         display: 'flex',
                  //         justifyContent: 'space-around',
                  //         alignItems: 'center',

                  //     }}
                  // >
                  //     <img
                  //         alt="avatar"
                  //         height={200}
                  //         // src={avatar}
                  //         loading="lazy"
                  //         style={{ borderRadius: '50%' }}
                  //     />
                  //     <Box sx={{ textAlign: 'center' }}>
                  //         <Typography variant="h4">Stages</Typography>
                  //         <Typography variant="h3">
                  //             {/* &quot;{row.original.signatureCatchPhrase}&quot; */}Realted UI List
                  //         </Typography>
                  //     </Box>
                  // </Box>
                )}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

// import React, { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { data, type Person } from './makeData';
// import { Button } from '@mui/material';

// const Example = () => {
//     const columns = useMemo<MRT_ColumnDef<Person>[]>(
//         //column definitions...
//         () => [
//             {
//                 accessorKey: 'firstName',
//                 header: 'First Name',
//             },
//             {
//                 accessorKey: 'lastName',
//                 header: 'Last Name',
//             },
//             {
//                 accessorKey: 'email',
//                 header: 'Email',
//             },
//             {
//                 accessorKey: 'city',
//                 header: 'City',
//             },
//         ],
//         [],
//         //end
//     );

//     //simulate random progress for demo purposes
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setProgress((oldProgress) => {
//                 const newProgress = Math.random() * 20;
//                 return Math.min(oldProgress + newProgress, 100);
//             });
//         }, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <MaterialReactTable
//             columns={columns}
//             data={data}
//             muiLinearProgressProps={({ isTopToolbar }) => ({
//                 color: 'secondary',
//                 variant: 'determinate', //if you want to show exact progress value
//                 value: progress, //value between 0 and 100
//                 sx: {
//                     display: isTopToolbar ? 'block' : 'none', //hide bottom progress bar
//                 },
//             })}
//             renderTopToolbarCustomActions={() => (
//                 <Button onClick={() => setProgress(0)} variant="contained">
//                     Reset
//                 </Button>
//             )}
//             state={{ showProgressBars: true }}
//         />
//     );
// };

// export default Example;
