import { Breadcrumbs, Typography, Grid, Button, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import DownloadIcon from "@mui/icons-material/Download";
import { ConvertDate } from "../../../../Utilities/Utils";
import { Get } from "../../../../Services/Axios";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserStory } from "../../../../Models/Project/UserStory";
import { DownloadUserStoryList } from "../../../../Services/ProjectService";
import { AddUserStory } from "./AddUserStory";
import { EditUserStory } from "./EditUserStory";
import { ViewUserStory } from "./ViewUserStory";
import { useQuery } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Modal from "@mui/material/Modal";
import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlassChart } from "@fortawesome/free-solid-svg-icons";
// import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import BackDrop from "../../../../CommonComponents/BackDrop";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 700,
  width: 600,
  bgcolor: "White",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// import "./table.css";
import { useContextProvider } from "../../../../CommonComponents/Context";
import { ADMIN } from "../../../../Constants/Roles";
import { USER_STORY } from "../../../../Constants/UserStory/UserStory";
import { COMPLETED, PENDING } from "../../../../Constants/Common";

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? 'lightgray' : 'lightgray',
//   justifyContent: 'center',
//   height: "55px",
//   border: '2px solid white'
// }))

const Mainsubcontent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
  justifyContent: "center",
  width: "270px",
  height: "40px",
  border: "1px solid white",
  color: "white",
}));

// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 10,
//     left: 'calc(-50% + 16px)',
//     right: 'calc(50% + 16px)',
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: '#784af4',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: '#784af4',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//     borderTopWidth: 3,
//     borderRadius: 1,
//   },
// }));

// const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
//   ({ theme, ownerState }) => ({
//     color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
//     display: 'flex',
//     height: 22,
//     alignItems: 'center',
//     ...(ownerState.active && {
//       color: '#784af4',
//     }),
//     '& .QontoStepIcon-completedIcon': {
//       color: '#784af4',
//       zIndex: 1,
//       fontSize: 18,
//     },
//     '& .QontoStepIcon-circle': {
//       width: 8,
//       height: 8,
//       borderRadius: '50%',
//       backgroundColor: 'currentColor',
//     },
//   }),
// );

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    // 1: (
    //   <FontAwesomeIcon
    //     icon={faMagnifyingGlassChart}
    //     style={{ fontSize: "25px", marginLeft: 5 }}
    //   />
    // ),
    // 2: <VideoLabelIcon />,
    // 3: <GroupAddIcon />,
    // 4: <VideoLabelIcon />,
    // 5: <FontAwesomeIcon icon={faProductHunt} />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: 125,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      Width: 10,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 65,
    width: 10,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

export type UserStorysdetails = {
  name: string;
  description: string;
  status: string;
  percentage: number;
};

// const MainContent = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? 'lightgray' : 'lightgray',
//   justifyContent: 'center',
//   width: "288px",
//   height: "40px",
//   border: '1px solid white',
//   color: 'white'
// }))

// const Content = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? 'lightgray' : 'lightgray',
//   justifyContent: 'center',
//   width: "230px",
//   height: "40px",
//   border: '1px solid white',
//   color: 'white'
// }))

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? 'lightgray' : 'lightgray',
//   justifyContent: 'center',
//   width: "115px",
//   height: "34px",
//   border: '2px solid white'
// }))

const Mainstatus = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
  width: "88px",
  height: "34px",
  border: "1px solid white",
}));

const steps = ["Business Analysis", "Development", "QA", "UAT", "Production"];

export const UserStoryList = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const { projectReportRoute, status } = location.state;
  const [filter, setfilter] = useState<UserStory>(USER_STORY);
  const [rows, setRows] = useState<any>([]);
  const [userStorydata, setUserStorydata] = useState<any>();
  const [filterRows, setfilterRows] = useState<any>([]);
  const usNameRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const { role } = useContextProvider();
  const [userStoryView, setUserStoryView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const activeStep = 0;

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="View"
              className="mx-2 bg-light"
              sx={{ zIndex: 99 }}
              onClick={() => {
                setUserStoryView({ view: true });
                setUserStorydata(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" sx={{ zIndex: 99 }} />
            </Tooltip>
            {role === ADMIN && (
              <Tooltip
                title="Edit"
                className="mx-2"
                onClick={() => {
                  setUserStoryView({ edit: true });
                  setUserStorydata(row);
                }}
              >
                <EditIcon className="fs-4 text-warning" />
              </Tooltip>
            )}
            {role === ADMIN && !projectReportRoute && (
              <Link
                className="mx-2"
                to="/Admin/AssignUI"
                state={{
                  ...location?.state,
                  UserStoryName: row.name,
                  UserStoryId: row.id,
                }}
                style={{ textDecoration: "none" }}
              >
                <Tooltip title="Assign UI">
                  <AssignmentTurnedInIcon className="fs-4 text-primary" />
                </Tooltip>
              </Link>
            )}
            {/* <Link
              className="mx-2"
              to="/Admin/AssignUI"
              state={{
                ...location?.state,
                UserStoryName: row.name,
                UserStoryId: row.id,
              }}
              style={{ textDecoration: "none" }}
            > */}
            <Tooltip title="Stages">
              <StackedBarChartIcon
                onClick={handleOpen}
                className="fs-4 text-primary"
              />
            </Tooltip>
            {/* </Link> */}
          </>
        );
      },
    },
    {
      field: "name",
      name: "Name",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row.name}>
          {!projectReportRoute ? (
            <Link
              className="tableStyle"
              to="/Admin/UserInterface"
              state={{ USid: row.id, UserStoryName: row.name }}
              style={{ textDecoration: "none" }}
            >
              {row.name}
            </Link>
          ) : (
            <p className="tableStyle">{row.name}</p>
          )}
        </Tooltip>
      ),
    },
    {
      field: "description",
      name: "Description",
      width: "30rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row.description}>
          <p className="tableStyle">{row.description}</p>
        </Tooltip>
      ),
    },
    {
      field: "status",
      name: "Status",
      width: "8rem",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.status}</p>,
    },
    {
      field: "percentage",
      name: "Percentage",
      type: "number",
      width: "10rem",
      align: "right",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      right: true,
      selector: (row: any) => <p className="tableStyle">{row.percentage}</p>,
    },
    {
      field: "startDate",
      name: "Start Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = ConvertDate(row.startDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "endDate",
      name: "End Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = ConvertDate(row.endDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  useEffect(() => {
    let userStoryList = Get(
      `app/Project/GetUserStoryList?projectId=${location.state.projectId}`
    );
    userStoryList.then((response: any) => {
      setRows(response?.data || []);

      if (projectReportRoute) {
        if (status === COMPLETED) {
          setfilterRows(
            response?.data?.filter((x: UserStory) => x.percentage === 100) || []
          );
        } else if (status === PENDING) {
          setfilterRows(
            response?.data?.filter(
              (x: UserStory) => parseInt(`${x.percentage}`) < 100
            ) || []
          );
        } else {
          setfilterRows(response?.data || []);
        }
      } else {
        setfilterRows(response?.data || []);
      }
      setLoading(false);
    });
  }, []);

  const { data, refetch } = useQuery("AddUserStory", () => {
    var objective: any = Get(
      `app/Project/GetProjectObjective?ProjectId=${location.state.projectId}`
    );
    return objective;
  });

  const handleClickOpen = () => {
    setUserStoryView({ add: true });
  };

  function ApplyFilter() {
    let temp: any = [];

    if (filter.startDate != null) {
      if (filter.endDate == null) {
        actEndDateRef.current?.focus();
        return;
      }
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].startDate.slice(0, 10) >= filter.startDate &&
          rows[i].endDate.slice(0, 10) <= filter.endDate
        ) {
          temp.push(rows[i]);
        }
      }
      setfilterRows(temp);
    } else {
      temp = rows;
    }

    if (filter.name != null) {
      temp = temp.filter((e: any) => {
        return e.name.toLowerCase().search(filter.name?.toLowerCase()) >= 0;
      });
      setfilterRows(temp);
    }

    if (filter.description != null) {
      temp = temp.filter((e: any) => {
        return (
          e.description.toLowerCase() === filter.description?.toLowerCase()
        );
      });
      setfilterRows(temp);
    }
    if (filter.status != null) {
      temp = temp.filter((e: any) => {
        return e.status.toLowerCase() === filter.status?.toLowerCase();
      });
      setfilterRows(temp);
    }

    if (filter.percentage != null) {
      temp = temp.filter((e: any) => {
        return e.percentage === Number(filter.percentage);
      });
      setfilterRows(temp);
    }
  }

  function reset() {
    setfilter(USER_STORY);
    if (usNameRef.current) usNameRef.current.value = "";
    if (statusRef.current) statusRef.current.clearValue();
    if (percentageRef.current) percentageRef.current.value = "";
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    setfilterRows(rows);
  }

  const filteredCompleted = Array.isArray(rows)
    ? rows.filter((row: any) => row?.status === "Completed")
    : [];

  const filteredpending = Array.isArray(rows)
    ? rows.filter((row: any) => row?.status === "Pending")
    : [];

  const filteredInProgress = Array.isArray(rows)
    ? rows.filter((row: any) => row?.status === "In Progress")
    : [];

  const InprogressUI = () => {
    const temp = rows?.filter(
      (row: any) => row?.status?.toLowerCase() === "in progress"
    );
    setfilterRows(temp);
  };

  const pendingUI = () => {
    const temp = rows?.filter(
      (row: any) => row?.status?.toLowerCase() === "pending"
    );
    setfilterRows(temp);
  };

  const completedUI = () => {
    const temp = rows?.filter(
      (row: any) => row?.status?.toLowerCase() === "completed"
    );
    setfilterRows(temp);
  };

  return (
    <div>
      {!projectReportRoute && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to={`/${role}`}>
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link to={`/${role}/Project`}>
            <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>User Storys</Typography>
        </Breadcrumbs>
      )}

      {projectReportRoute && (
        <Breadcrumbs className="mt-3 mx-3" separator=">">
          <Link color="inherit" to="/Admin">
            <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
          </Link>
          <Link color="inherit" to="/Admin/Project">
            <Typography sx={{ fontWeight: "bold" }}>Projects</Typography>
          </Link>
          <Link
            color="inherit"
            to="/Admin/ProjectQuadrant"
            state={{ ...location.state }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Project Quadrant
            </Typography>
          </Link>
          <Link
            color="inherit"
            to="/Admin/ProjectQuadrant/ProjectReport"
            state={{ ...location.state }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Project Report</Typography>
          </Link>
          <Typography sx={{ fontWeight: "bold" }}>User Storys</Typography>
        </Breadcrumbs>
      )}

      <Grid container>
        <Grid xs={9.5}>
          <div className="well mx-auto mt-4 " style={{ width: "70rem" }}>
            <div className="row">
              <div className="col-sm-2">
                <div className="form-group">
                  <label>User Story Name</label>
                  <input
                    id="User-Story-Name"
                    placeholder="User Story Name"
                    ref={usNameRef}
                    className="m-1 form-control col"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z ]/g,
                        ""
                      );
                      setfilter((prevState: UserStory) => ({
                        ...prevState,
                        name: e.target.value === "" ? null : e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    id="Description"
                    placeholder="Description"
                    ref={descriptionRef}
                    className="m-1 form-control col"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z ]/g,
                        ""
                      );
                      setfilter((prevState) => ({
                        ...prevState,
                        description:
                          e.target.value === "" ? null : e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <label>Status</label>
                  <Select
                    aria-label="Floating label select example"
                    isClearable={true}
                    name="status"
                    ref={statusRef}
                    className="select-dropdowns mt-1 col"
                    onInputChange={(inputValue: string) => {
                      const alphabeticValue = inputValue.replace(
                        /[^A-Za-z\s]/g,
                        ""
                      ); // Remove non-alphabetic characters
                      return alphabeticValue;
                    }}
                    onChange={(selectedOption: any) => {
                      if (selectedOption) {
                        setfilter((prevState) => ({
                          ...prevState,
                          Status:
                            selectedOption.label.trim() === ""
                              ? null
                              : selectedOption.label,
                        }));
                      }
                    }}
                    options={[
                      {
                        label: "In Progress",
                        value: "In Progress",
                      },
                      {
                        label: "Completed",
                        value: "Completed",
                      },
                      {
                        label: "Pending",
                        value: "Pending",
                      },
                      {
                        label: "Active",
                        value: "Active",
                      },
                    ]}
                    placeholder="Status"
                    isSearchable={true}
                    formatOptionLabel={(option: any) => option.label} // Display formatted label
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <label>Percentage</label>
                  <input
                    id="percentage"
                    placeholder="Percentage"
                    className="m-1 form-control col"
                    ref={percentageRef}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      setfilter((prevState) => ({
                        ...prevState,
                        percentage: parseInt(e.target.value),
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <label className="mx-1">Start Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          StartDate:
                            e.target.value == "" ? null : e.target.value,
                        };
                      });
                    }}
                    type="date"
                    id="start-date"
                    placeholder="Start Date"
                    ref={actStartDateRef}
                    className="m-1 col form-control"
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div className="form-group">
                  <label className="mx-1">End Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          EndDate: e.target.value == "" ? null : e.target.value,
                        };
                      });
                    }}
                    type="date"
                    id="end-date"
                    placeholder="End Date"
                    ref={actEndDateRef}
                    className="m-1 col form-control"
                  />
                </div>
              </div>
              <div className="container">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <Button
                      variant="contained"
                      endIcon={<SearchIcon />}
                      className="mx-3 mt-3 "
                      onClick={() => ApplyFilter()}
                    >
                      search
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<RefreshIcon />}
                      className="mx-3 mt-3 "
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid xs={2.3}>
          <Grid container sx={{ mt: 4 }}>
            <Box>
              <Mainsubcontent className="bg-primary text-light text-center">
                <Typography
                  onClick={() => reset()}
                  sx={{
                    textAlign: "center",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  Total User Story
                </Typography>
              </Mainsubcontent>
            </Box>
            <Box>
              <Mainsubcontent>
                <Typography
                  onClick={() => reset()}
                  sx={{
                    textAlign: "center",
                    color: "#238acf",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {rows?.length || "0"}
                </Typography>
              </Mainsubcontent>
            </Box>
          </Grid>
          <Grid container sx={{ width: "18rem" }}>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  onClick={completedUI}
                  sx={{ fontSize: "13px", width: "87px", height: "34px" }}
                >
                  Completed
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={completedUI}
                  sx={{
                    textAlign: "center",
                    color: "#0388fc",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {filteredCompleted?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  {/* In- */}
                  Progress
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={InprogressUI}
                  sx={{
                    textAlign: "center",
                    color: "#fc9403",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {filteredInProgress?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={pendingUI}
                  sx={{ fontSize: "13px", width: "87px", height: "34px" }}
                >
                  Pending
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={pendingUI}
                  sx={{
                    textAlign: "center",
                    color: "red",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {filteredpending?.length}
                </Typography>
              </Mainstatus>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ display: "flex", mt: 3 }}>
        <Grid xs={2.3} sx={{ ml: 5 }}>
          <Grid container>
            <Mainsubcontent className="bg-secondary text-light text-center">
              <Typography sx={{ textAlign: "center", fontSize: "20px" }}>
                Business Analysis
              </Typography>
            </Mainsubcontent>
            <Mainsubcontent>
              <Typography
                sx={{ textAlign: "center", color: "#238acf", fontSize: "25px" }}
              >
                {/* {rows?.length} */}68
              </Typography>
            </Mainsubcontent>
          </Grid>
          <Grid container>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  onClick={completedUI}
                  sx={{ fontSize: "13px", width: "87px", height: "34px" }}
                >
                  Completed
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={completedUI}
                  sx={{
                    textAlign: "center",
                    color: "#0388fc",
                    fontSize: "25px",
                  }}
                >
                  {/* {filteredCompleted?.length} */}36
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  Progress
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={InprogressUI}
                  sx={{
                    textAlign: "center",
                    color: "#fc9403",
                    fontSize: "25px",
                  }}
                >
                  {/* {filteredInProgress?.length} */}10
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  Pending
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={pendingUI}
                  sx={{
                    textAlign: "center",
                    color: "red",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {/* {filteredpending?.length} */}6
                </Typography>
              </Mainstatus>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={2.3}>
          <Grid container>
            <Box>
              <Mainsubcontent className="bg-success text-light text-center">
                <Typography sx={{ textAlign: "center", fontSize: "20px" }}>
                  Development
                </Typography>
              </Mainsubcontent>
            </Box>
            <Box>
              <Mainsubcontent>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#238acf",
                    fontSize: "25px",
                  }}
                >
                  {/* {rows?.length} */}50
                </Typography>
              </Mainsubcontent>
            </Box>
          </Grid>
          <Grid container>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  onClick={completedUI}
                  sx={{ fontSize: "13px", width: "87px", height: "34px" }}
                >
                  Completed
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={completedUI}
                  sx={{
                    textAlign: "center",
                    color: "#0388fc",
                    fontSize: "25px",
                  }}
                >
                  {/* {filteredcompleted?.length} */}54
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  Progress
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={InprogressUI}
                  sx={{
                    textAlign: "center",
                    color: "#fc9403",
                    fontSize: "25px",
                  }}
                >
                  {filteredInProgress?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  Pending
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={pendingUI}
                  sx={{
                    textAlign: "center",
                    color: "red",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {/* {filteredpending?.length} */}6
                </Typography>
              </Mainstatus>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={2.3}>
          <Grid container>
            <Box>
              <Mainsubcontent className="bg-danger text-light text-center">
                <Typography sx={{ textAlign: "center", fontSize: "20px" }}>
                  QA
                </Typography>
              </Mainsubcontent>
            </Box>
            <Box>
              <Mainsubcontent>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#238acf",
                    fontSize: "25px",
                  }}
                >
                  {/* {rows?.length} */}30
                </Typography>
              </Mainsubcontent>
            </Box>
          </Grid>
          <Grid container>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  onClick={completedUI}
                  sx={{ fontSize: "13px", width: "87px", height: "34px" }}
                >
                  Completed
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={completedUI}
                  sx={{
                    textAlign: "center",
                    color: "#0388fc",
                    fontSize: "25px",
                  }}
                >
                  {/* {filteredcompleted?.length} */}54
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  Progress
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={InprogressUI}
                  sx={{
                    textAlign: "center",
                    color: "#fc9403",
                    fontSize: "25px",
                  }}
                >
                  {filteredInProgress?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={InprogressUI}
                  sx={{ fontSize: "12px", width: "87px", height: "34px" }}
                >
                  Pending
                </Button>
              </Mainstatus>
              <Mainstatus>
                <Typography
                  onClick={pendingUI}
                  sx={{
                    textAlign: "center",
                    color: "red",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                >
                  {/* {filteredpending?.length} */}6
                </Typography>
              </Mainstatus>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={2.3}>
          <Grid container>
            <Box>
              <Mainsubcontent sx={{ backgroundColor: "#2618ed" }}>
                <Typography sx={{ textAlign: "center", fontSize: "20px" }}>
                  UAT
                </Typography>
              </Mainsubcontent>
            </Box>
            <Box>
              <Mainsubcontent>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#238acf",
                    fontSize: "25px",
                  }}
                >
                  {/* {rows?.length} */}10
                </Typography>
              </Mainsubcontent>
            </Box>
          </Grid>
          {/* <Grid container>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button variant="contained" size="small" onClick={completedUI} sx={{ fontSize: "13px", width: "87px", height: "34px" }}>Completed</Button>
              </Mainstatus>
              <Mainstatus>
                <Typography onClick={completedUI} sx={{ textAlign: 'center', color: "#0388fc", fontSize: "25px" }}>
                  {filteredcompleted?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button variant="contained" size="small" color="warning" onClick={InprogressUI} sx={{ fontSize: "12px", width: "87px", height: "34px" }}>Progress</Button>
              </Mainstatus>
              <Mainstatus>
                <Typography onClick={InprogressUI} sx={{ textAlign: 'center', color: "#fc9403", fontSize: "25px" }}>
                  {filteredInProgress?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button variant="contained" size="small" color="error" onClick={InprogressUI} sx={{ fontSize: "12px", width: "87px", height: "34px" }}>Pending</Button>
              </Mainstatus>
              <Mainstatus>
              <Typography onClick={pendingUI} sx={{ textAlign: 'center', color: "red", fontSize: "25px", cursor:'pointer'}}>
                {filteredpending?.length}
              </Typography>
              </Mainstatus>
            </Grid>
          </Grid> */}
        </Grid>
        <Grid xs={2.3}>
          <Grid container>
            <Box>
              <Mainsubcontent sx={{ backgroundColor: "#6a0be6" }}>
                <Typography sx={{ textAlign: "center", fontSize: "20px" }}>
                  Production
                </Typography>
              </Mainsubcontent>
            </Box>
            <Box>
              <Mainsubcontent>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#238acf",
                    fontSize: "25px",
                  }}
                >
                  {/* {rows?.length} */}2
                </Typography>
              </Mainsubcontent>
            </Box>
          </Grid>
          {/* <Grid container>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button variant="contained" size="small" onClick={completedUI} sx={{ fontSize: "13px", width: "87px", height: "34px" }}>Completed</Button>
              </Mainstatus>
              <Mainstatus>
                <Typography onClick={completedUI} sx={{ textAlign: 'center', color: "#0388fc", fontSize: "25px" }}>
                  {filteredcompleted?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button variant="contained" size="small" color="warning" onClick={InprogressUI} sx={{ fontSize: "12px", width: "87px", height: "34px" }}>Progress</Button>
              </Mainstatus>
              <Mainstatus>
                <Typography onClick={InprogressUI} sx={{ textAlign: 'center', color: "#fc9403", fontSize: "25px" }}>
                  {filteredInProgress?.length}
                </Typography>
              </Mainstatus>
            </Grid>
            <Grid xs={3.8}>
              <Mainstatus>
                <Button variant="contained" size="small" color="error" onClick={InprogressUI} sx={{ fontSize: "12px", width: "87px", height: "34px" }}>Pending</Button>
              </Mainstatus>
              <Mainstatus>
              <Typography onClick={pendingUI} sx={{ textAlign: 'center', color: "red", fontSize: "25px", cursor:'pointer'}}>
                {filteredpending?.length}
              </Typography>
              </Mainstatus>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <div className="d-flex flex-column justify-content-center align-items-center mt-4">
        <Grid>
          {role === ADMIN && (
            <Button
              variant="contained"
              className="mb-2 float-md-start"
              onClick={handleClickOpen}
            >
              Add User Story
              <AddIcon className="mx-1" />
            </Button>
          )}
          <Button
            variant="contained"
            className="mb-2 float-md-end"
            onClick={() => {
              DownloadUserStoryList(filterRows);
            }}
          >
            Download
            <DownloadIcon className="mx-1" />
          </Button>
          <Grid item xs={12} sm={11}>
            <Box style={{ width: "94vw" }}>
              <DataTable
                columns={columns}
                fixedHeader={true}
                responsive
                persistTableHead
                progressPending={loading}
                data={filterRows || []}
                customStyles={{
                  table: {
                    style: {
                      height: "80vh",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      position: "relative",
                    },
                  },
                  headRow: {
                    style: {
                      background: "#1e97e8",
                      fontSize: "16px",
                      color: "white",
                      fontFamily: "inherit",
                      position: "sticky",
                      left: 10,
                      top: 0,
                    },
                  },
                }}
                pagination
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, 100, 200]}
                pointerOnHover={true}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ textAlign: "center", color: "blue" }}
                  >
                    User Story Stages
                  </Typography>
                  <Box sx={{ maxWidth: 900, mt: 2 }}>
                    <Stepper
                      activeStep={activeStep}
                      connector={<ColorlibConnector />}
                      orientation={steps.length < 2 ? "horizontal" : "vertical"} // Conditionally set the orientation
                    >
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel StepIconComponent={ColorlibStepIcon}>
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === steps.length && (
                      <Paper square elevation={4} sx={{ p: 3 }}>
                        <Typography>
                          All steps completed - you&apos;re finished
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Box>
              </Modal>
            </Box>
          </Grid>
        </Grid>
      </div>
      <AddUserStory
        openDialog={userStoryView}
        data={data ?? []}
        setOpenDialog={setUserStoryView}
        setRows={setRows}
        setfilterRows={setfilterRows}
        refetch={refetch}
        projectId={location.state.projectId}
      />
      <EditUserStory
        openDialog={userStoryView}
        data={data ?? []}
        setOpenDialog={setUserStoryView}
        setRows={setRows}
        Data={userStorydata}
        setfilterRows={setfilterRows}
        projectId={location.state.projectId}
      />
      <ViewUserStory
        openDialog={userStoryView}
        data={data?.data?.length > 0 ? data : []}
        setOpenDialog={setUserStoryView}
        Data={userStorydata}
      />
      <BackDrop open={loading} />
    </div>
  );
};
