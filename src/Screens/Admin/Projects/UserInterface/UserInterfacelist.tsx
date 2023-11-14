import { Breadcrumbs, Typography, Button, Grid, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import DataTable from "react-data-table-component";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { AddUserInterface } from "./AddUserInterface";
import { EditUserInterface } from "./EditUserInterface";
import { ViewUserInterface } from "./VeiwUserInterface";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserInterface } from "../../../../Models/Project/UserInterface";
import { ConvertDate } from "../../../../Utilities/Utils";
import { Get } from "../../../../Services/Axios";
import { DownloadUserInterfaceList } from "../../../../Services/ProjectService";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import BackDrop from "../../../../CommonComponents/BackDrop";
import { useContextProvider } from "../../../../CommonComponents/Context";
import { ADMIN } from "../../../../Constants/Roles";
import { USER_INTERFACE } from "../../../../Constants/UserInterface/UserInterface";
import { COMPLETED, PENDING } from "../../../../Constants/Common";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlassChart } from "@fortawesome/free-solid-svg-icons";
// import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
// import Stack from '@mui/material/Stack';

// const Items = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
//   flexGrow: 1,
// }));

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

  // const icons: { [index: string]: React.ReactElement } = {
  //   1: (
  //     <FontAwesomeIcon
  //       icon={faMagnifyingGlassChart}
  //       style={{ fontSize: "25px", marginLeft: 5 }}
  //     />
  //   ),
  //   2: <VideoLabelIcon />,
  //   3: <GroupAddIcon />,
  //   4: <VideoLabelIcon />,
  //   5: <FontAwesomeIcon icon={faProductHunt} />,
  // };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {/* {icons[String(props.icon)]} */}
    </ColorlibStepIconRoot>
  );
}

// const MainContent = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
//   justifyContent: "center",
//   width: "288px",
//   height: "40px",
//   border: "1px solid white",
//   color: "white",
// }));

// const Content = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
//   justifyContent: "center",
//   width: "230px",
//   height: "40px",
//   border: "1px solid white",
//   color: "white",
// }));

const Mainsubcontent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
  justifyContent: "center",
  width: "270px",
  height: "40px",
  border: "1px solid white",
  color: "white",
}));

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
//   justifyContent: "center",
//   width: "115px",
//   height: "34px",
//   border: "2px solid white",
// }));

const Mainstatus = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
  width: "88px",
  height: "34px",
  border: "1px solid white",
}));

// const Status = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
//   width: "113px",
//   height: "34px",
//   border: "1px solid white",
// }));

const steps = ["Business Analysis", "Development", "QA", "UAT", "Production"];

export const UserInterfacelist = () => {
  const [filterRows, setfilterRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, SetReload] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [rows, setRows] = useState<any>([]);
  const location = useLocation();
  const { projectReportRoute, status } = location.state;
  const uiNameRef = useRef<HTMLInputElement>(null);
  const statuiRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const complexityRef = useRef<any>();
  const [filter, setfilter] = useState<UserInterface>(USER_INTERFACE);
  const [userInterfacedata, setUserInterfacedata] = useState<any>();
  const [data, setData] = useState([]);
  const { role } = useContextProvider();
  const [UserInterfaceView, setUserInterfaceView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  var activeStep = 0;

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="View"
              className="mx-2"
              onClick={() => {
                setUserInterfaceView({ view: true });
                setUserInterfacedata(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            {role === ADMIN && (
              <Tooltip
                title="Edit"
                className="mx-2"
                onClick={() => {
                  setUserInterfaceView({ edit: true });
                  setUserInterfacedata(row);
                }}
              >
                <EditIcon className="fs-4 text-warning" />
              </Tooltip>
            )}
            <Tooltip title="Stages">
              <StackedBarChartIcon
                onClick={handleOpen}
                className="fs-4 text-primary"
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "name",
      name: "Name",
      width: 280,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => (
        <Tooltip title={row.name}>
          <p className="tableStyle">{row.name}</p>
        </Tooltip>
      ),
    },
    {
      field: "description",
      name: "Description",
      width: "20rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => (
        <Tooltip title={row.description}>
          <p className="tableStyle">{row.description}</p>
        </Tooltip>
      ),
    },
    {
      field: "status",
      name: "Status",
      width: "10rem",
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.status}</p>,
    },
    {
      field: "percentage",
      name: "Percentage",
      type: "number",
      width: "10rem",
      align: "center",
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      right: true,
      selector: (row: any) => <p className="tableStyle">{row.percentage}</p>,
    },
    {
      field: "complexity",
      name: "Complexity",
      width: 150,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.complexity}</p>,
    },
    {
      field: "uiCategory",
      name: "UI Category",
      width: "15rem",
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      editable: false,
      selector: (row: any) => <p className="tableStyle">{row.uiCategory}</p>,
    },
    {
      field: "startDate",
      name: "Start Date",
      type: "Date",
      width: 150,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        const result = ConvertDate(row.startDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "endDate",
      name: "End Date",
      type: "Date",
      width: 150,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        const result = ConvertDate(row.endDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];
  // debugger

  async function fetchData() {
    let UserInterface: any = await Get(
      `app/Project/GetUserInterfaceList?projectId=${location.state.projectId}`
    );
    setRows(UserInterface?.data);

    if (projectReportRoute) {
      if (status === COMPLETED) {
        setfilterRows(
          UserInterface?.data?.filter(
            (x: UserInterface) => x.percentage === 100
          ) || []
        );
      } else if (status === PENDING) {
        setfilterRows(
          UserInterface?.data?.filter(
            (x: UserInterface) => parseInt(`${x.percentage}`) < 100
          ) || []
        );
      } else {
        setfilterRows(UserInterface?.data || []);
      }
    } else {
      setfilterRows(UserInterface?.data || []);
    }

    setLoading(false);

    var objective: any = await Get(
      `app/Project/GetProjectObjective?ProjectId=${location.state.projectId}`
    );
    setData(objective?.data?.projectObjectives || []);
  }

  useEffect(() => {
    fetchData();
  }, [reload]);

  const handleClickOpen = () => {
    setUserInterfaceView({ add: true });
  };

  //   const pendingUI = () => {

  //     const temp = rows?.filter((row: any) =>
  //       row.status.toLowerCase() === 'Pending'
  //     );
  //     setfilterRows(temp);
  // //     const statusArray = rows?.map((row:any) => row?.status);
  // // console.log(statusArray);
  //   }
  // debugger
  const filteredCompleted = Array.isArray(rows)
    ? rows.filter((row: any) => row?.status === "Completed")
    : [];

  const filteredpending = Array.isArray(rows)
    ? rows.filter((row: any) => row?.status === "Pending")
    : [];

  // const filteredpending = rows?.filter((row: any) => row?.status === 'Pending');

  const filteredInProgress = Array.isArray(rows)
    ? rows.filter((row: any) => row?.status === "In Progress")
    : [];
  // const filteredInProgress = rows?.filter((row: any) => row?.status === 'In Progress');
  // console.log(filteredcompleted);

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

    if (filter.complexity != null) {
      temp = temp.filter((e: any) => {
        return e.complexity.toLowerCase() === filter.complexity?.toLowerCase();
      });
      setfilterRows(temp);
    }
  }
  // debugger

  function reset() {
    setfilter(USER_INTERFACE);
    if (uiNameRef.current) uiNameRef.current.value = "";
    if (statuiRef.current) statuiRef.current.clearValue();
    if (percentageRef.current) percentageRef.current.value = "";
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (complexityRef.current) complexityRef.current.clearValue();

    setfilterRows(rows);
  }

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
          <Typography sx={{ fontWeight: "bold" }}>User Interface</Typography>
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
          <Typography sx={{ fontWeight: "bold" }}>User Interface</Typography>
        </Breadcrumbs>
      )}

      <Grid container>
        <Grid xs={9.5}>
          <div className="well mx-5 mt-4" style={{ width: "70rem" }}>
            <div className="row" style={{ width: "90rem" }}>
              <div className="col-sm-2">
                <div className="form-group">
                  <label>User Interface Name</label>
                  <input
                    id="User-Interface-Name"
                    placeholder="User Interface Name"
                    ref={uiNameRef}
                    className="m-1 form-control col"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z ]/g,
                        ""
                      );
                      setfilter((prevState) => ({
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
                    ref={statuiRef}
                    className="select-dropdowns mt-1 col"
                    onChange={(selectedOption: any) => {
                      setfilter((prevState) => ({
                        ...prevState,
                        status: selectedOption ? selectedOption.value : null,
                      }));
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
                    formatOptionLabel={(option: any) => option.label}
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
            </div>
            <div className="row" style={{ width: "90rem" }}>
              <div className="col-md-2">
                <div className="form-group">
                  <label className="mx-1">End Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          endDate: e.target.value == "" ? null : e.target.value,
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
              <div className="col-sm-2">
                <div className="form-group">
                  <label>Complexity</label>
                  <Select
                    aria-label="Floating label select example"
                    isClearable={true}
                    name="complexity"
                    ref={complexityRef}
                    className="select-dropdowns mt-1 col"
                    onChange={(code: any) => {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          complexity: code ? code.value : null,
                        };
                      });
                    }}
                    options={[
                      {
                        label: "Low",
                        value: "Low",
                      },
                      {
                        label: "Medium",
                        value: "Medium",
                      },
                      {
                        label: "High ",
                        value: "High ",
                      },
                    ]}
                    placeholder="Complexity"
                    isSearchable={true}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label className="mx-1">Start Date</label>
                  <input
                    onChange={(e: any) => {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          startDate:
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
              <div className="col-md-3">
                <div className="row justify-content-end">
                  <div className="col-auto" style={{ width: "20rem" }}>
                    <Button
                      variant="contained"
                      endIcon={<SearchIcon />}
                      className="mx-4 mt-4"
                      onClick={() => ApplyFilter()}
                    >
                      search
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<RefreshIcon />}
                      className="mx-1 mt-4"
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </Grid>
        <Grid xs={2.3}>
          <Grid container sx={{ mt: 5 }}>
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
                  Total User Interface
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
          {/* <Grid container> nhy6
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
              Add User Interface
              <AddIcon className="mx-1" />
            </Button>
          )}
          <Button
            variant="contained"
            className="mb-2 float-md-end"
            onClick={() => {
              DownloadUserInterfaceList(filterRows);
            }}
          >
            Download
            <DownloadIcon className="mx-1" />
          </Button>
          <Grid item xs={12} sm={11}>
            <Box style={{ width: "94vw" }}>
              <DataTable
                columns={columns}
                fixedHeader
                responsive
                persistTableHead
                progressPending={loading}
                data={filterRows || []}
                customStyles={{
                  table: {
                    style: {
                      height: "80vh",

                      border: "1px solid rgba(0,0,0,0.1)",
                    },
                  },

                  headRow: {
                    style: {
                      background: "#1e97e8",
                      fontSize: "16px",
                      color: "white",
                      fontFamily: "inherit",
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
                    sx={{ textAlign: "center" }}
                  >
                    User Interface Stages
                  </Typography>
                  <Box sx={{ maxWidth: 900 }}>
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
              {/* <DataGrid
                sx={{
                  overflowX: "scroll",
                  textAlign: "center",
                  width: "94vw",
                }}
                getRowClassName={getRowClassName}
                onRowClick={handleRowClick}
                rows={filterRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                loading={loading}
                style={{ height: 400 }}
                pageSizeOptions={[10, 20, 30, 40, 50]}
              /> */}
            </Box>
          </Grid>
        </Grid>
      </div>
      <AddUserInterface
        openDialog={UserInterfaceView}
        data1={data?.length > 0 ? data : []}
        setOpenDialog={setUserInterfaceView}
        SetReload={SetReload}
        projectId={location.state.projectId}
      />
      <EditUserInterface
        openDialog={UserInterfaceView}
        setOpenDialog={setUserInterfaceView}
        Data={userInterfacedata}
        data1={data?.length > 0 ? data : []}
        projectId={location.state.projectId}
        SetReload={SetReload}
      />
      <ViewUserInterface
        openDialog={UserInterfaceView}
        setOpenDialog={setUserInterfaceView}
        Data={userInterfacedata}
      />
      <BackDrop open={loading} />
    </div>
  );
};
