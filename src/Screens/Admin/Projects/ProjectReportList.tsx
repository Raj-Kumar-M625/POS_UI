import { useState, useRef} from "react";
import { useLocation, Link } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { Typography, Breadcrumbs, Button, Grid, Box, ListItemButton } from "@mui/material";
import Select from "react-select";
import DataTable from "react-data-table-component";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import { UserStory } from "../../../Models/Project/UserStory";
import { UserInterface } from "../../../Models/Project/UserInterface";
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import BackDrop from "../../../CommonComponents/BackDrop";
import { useQuery } from "react-query";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ProjectReportList = () => {

  const location = useLocation();
  const userstoryRef = useRef<any>(null);
  const [rows, setRows] = useState([]);
  const statusRef = useRef<any>();
  const [filterUS, setfilterUS] = useState<UserStory>({});
  const [filterUI, setfilterUI] = useState<UserInterface>({});
  const percentageRef = useRef<HTMLInputElement>(null);
  const projectTypeRef = useRef<any>();
  const [filterRows, setfilterRows] = useState<any>([]);
  const [TeamMember,setTeamMemeber] = useState<any>([]);
  const [selectedBugDetails, setSelectedBugDetails] = useState<any[]>([]);
  const [selectedUserstoryName, setSelectedUserstoryName] = useState<string | null>(null);
  const [selectedUserInterfaceName, setSelectedUserInterfaceName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openRequest, setopenRequest] = useState(false);
  const [openTask, setopenTask] = useState(false);

  const handleOpen = (bugDetails: any, userstoryName: string | null, userInterfaceName: string | null) => {
    setSelectedBugDetails(bugDetails);
    setSelectedUserstoryName(userstoryName);
    setSelectedUserInterfaceName(userInterfaceName);
    setOpen(true);
  };

  const handleOpenRequest = (bugDetails: any, userstoryName: string | null, userInterfaceName: string | null) => {
    setSelectedBugDetails(bugDetails);
    setSelectedUserstoryName(userstoryName);
    setSelectedUserInterfaceName(userInterfaceName);
    setopenRequest(true);
  };

  const handleopenTask = (bugDetails: any, userstoryName: string | null, userInterfaceName: string | null) => {
    setSelectedBugDetails(bugDetails);
    setSelectedUserstoryName(userstoryName);
    setSelectedUserInterfaceName(userInterfaceName);
    setopenTask(true);
  };

  const handleClose = () => {
    setOpen(false);
    setopenRequest(false);
    setopenTask(false);
  };

  const { isLoading, refetch } = useQuery("ProjectReport", async () => {
    const ProjectReportlist: any = await Get(
      `app/Project/getCustomerProjectReport?projectId=${location.state?.Projectid}`
    );
    const teamname:any = await Get(
      `app/Team/GetTeamNames?projectId=${location.state?.Projectid}`
    );

    setRows(ProjectReportlist?.data || []) ;
    setfilterRows(ProjectReportlist?.data || []);
    setTeamMemeber(teamname?.data || [])
  })

  const uniqueUserStoryNames = new Set();

  rows?.forEach((row: any) => {
    if (row?.report?.userstory) {
      uniqueUserStoryNames.add(row?.report?.userstory);
    }
  });

  const uniqueUserStoryCount = uniqueUserStoryNames.size;

  let overallTotalActTime = 0;

  rows?.forEach((row: any) => {
    const completedBugs = row?.report?.tasKList;

    if (completedBugs.length > 0) {
      const totalActTime = completedBugs.reduce((acc: any, item: any) => acc + item.actTime, 0);

      overallTotalActTime += totalActTime;
    }
  });


  let overallTotal = 0;

rows?.forEach((row: any) => {
  let overallTotalTask = row?.userInterfacelistsCount;

  if (overallTotalTask) {
    overallTotal += overallTotalTask;
  }
});

var CompletedUIStatus = rows.filter((e: any) => e.report?.userInterfacelists?.some((s: any) => s.status === "Completed"))

  const columns: any = [
    {
      field: "SI.No",
      name: "SI.No",
      type: "number",
      width: "12rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any, index: number) => (
        <p className="tableStyle">{index + 1}</p>
      ),
    },
    {
      field: "userstory",
      name: "User Story",
      width: "13rem",
      editable: false,
      headerAlign:
        "left",
      align: "left",
      selector: (row: any) => (
        <p className="tableStyle text-right">{row?.report?.userstory}</p>
      ),
    },
    {
      field: "userinterfacename",
      name: "User Interface",
      width: "13rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        return (
          <>
            {row?.report?.userInterfacelists?.map((item: any, index: any) => (
              <p className="tableStyle" key={index}>{item.name}</p>
            ))}
          </>
        );
      },
    },
    {
      field: "status",
      name: "Status",
      width: "10rem",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      editable: false,
      selector: (row: any) => {
        return (
          <>
            {row?.report?.userInterfacelists?.map((item: any, index: any) => (
              <p className="tableStyle" key={index}>{item.status}</p>
            ))}
          </>
        );
      },
    },
    {
      field: "No of Bugs",
      name: "No of Bugs",
      type: "number",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const bugs = row?.report?.tasKList?.filter((item: any) => item.taskType === 'Bug');
        const userInterfaceName = row?.report?.userInterfacelists?.map((item: any) => (item.name));
        return (
          <Button sx={{fontWeight:'bold',cursor:'pointer'}} onClick={() => handleOpen(bugs, row?.report?.userstory, userInterfaceName)}>
            {bugs.length}
          </Button>
        );
      },
    },
    {
      field: "No of Bugs Completed",
      name: "No of Bugs Completed",
      type: "number",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const completedBugs = row?.report?.tasKList?.filter((item: any) => item.taskType === 'Bug' && item.status === 'Completed');
        return (
          <Typography >
            {completedBugs.length}
          </Typography>
        );
      },
    },
    {
      field: "Change Request",
      name: "Change Request",
      type: "number",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const completedBugs = row?.report?.tasKList?.filter((item: any) => item.taskType === 'CR Bugs');
        const userInterfaceName = row?.report?.userInterfacelists?.map((item: any) => (item.name));
        return (
          <Button sx={{fontWeight:'bold',cursor:'pointer'}} onClick={() => handleOpenRequest(completedBugs, row?.report?.userstory, userInterfaceName)}>
            {completedBugs.length}
          </Button>
        );
      },
    },
    {
      field: "Type of Change",
      name: "Type of Change",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const completedBugs = row?.report?.tasKList?.map((item: any) => (item.classification));
        return (
          <Typography >
            {completedBugs}
          </Typography>
        );
      },
    },
    {
      field: "No of Hrs Worked",
      name: "No of Hrs Worked",
      type: "number",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const UserStoryUI = row?.report?.uIid
        const completedBugs = row?.report?.tasKList?.filter((item: any) => item.uiUserStoryId === UserStoryUI);
        if (completedBugs.length > 0) {

          const totalActTime = completedBugs.reduce((acc: any, item: any) => acc + item.actTime, 0);

          return (
            <Typography>
              {totalActTime}
            </Typography>
          );
        } else {
          return (
            <Typography>
              0
            </Typography>
          );
        }
      },
    },
    {
      field: "Tasks",
      name: "Tasks",
      type: "number",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const completedBugs = row?.report?.tasKList;
        const userInterfaceName = row?.report?.userInterfacelists?.map((item: any) => (item.name));
        return (
          <Button sx={{fontWeight:'bold',cursor:'pointer'}} onClick={() => handleopenTask(completedBugs, row?.report?.userstory, userInterfaceName)}>
            {completedBugs.length}
          </Button>
        );
      },
    },
  ];

  async function ApplyFilter() {
    let temp: any = [];
    await refetch();

    if (filterUI.Name != null) {
      temp = rows?.filter((e: any) => {
        const filteredUserInterfacelists = e?.report?.userInterfacelists.filter((item: any) => {
          return item.name.toLowerCase().includes(filterUI.Name?.toLowerCase());
        });
        e.userInterfacelists = filteredUserInterfacelists;
        return filteredUserInterfacelists.length > 0;
      });

      setfilterRows(temp);
    }

    if (filterUS.Name != null) {
      temp = rows?.filter((e: any) => {
        return (
          e?.report?.userstory.toLowerCase().search(filterUS.Name?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filterUI.Status != null) {
      temp = rows?.filter((e: any) => {
        return e?.report?.status.toLowerCase() === filterUI.Status?.toLowerCase();
      });
      setfilterRows(temp);
    }
  }

  async function reset() {
    setfilterUI({});
    setfilterUS({});
    if (userstoryRef.current) userstoryRef.current.clearValue();
    if (statusRef.current) statusRef.current.clearValue();
    if (percentageRef.current) percentageRef.current.value = "";
    if (projectTypeRef.current) projectTypeRef.current.clearValue();
    await refetch();
    setfilterRows(rows);
  };
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Customer">
          <Typography sx={{ fontWeight: 'bold' }}>
            Home
          </Typography>
        </Link>
        <Link color="inherit" to="/Customer/Project">
          <Typography sx={{ fontWeight: 'bold', color: '#807c7c' }}>
            Projects
          </Typography>
        </Link>
        <Link color="inherit"
          to="/Customer/Project/ProjectQuadrant"
          state={{ ...location.state }}
        >
          <Typography sx={{ fontWeight: 'bold', color: '#807c7c' }}>
            Project Quadrant
          </Typography>
        </Link>
        <Typography sx={{ fontWeight: 'bold' }}>
          Project Report
        </Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Story</label>
              <Select
                id="userstory"
                isClearable={true}
                ref={userstoryRef}
                className="col mt-1 custom-select"
                onChange={(selectedOption: any) => {
                  setfilterUS((prevState) => {
                    return {
                      ...prevState,
                      Name: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={Array.from(uniqueUserStoryNames).map((userStoryName) => ({
                  label: userStoryName,
                  value: userStoryName,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000, // Adjust z-index if needed
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Interface</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="projectType"
                ref={projectTypeRef}
                className="select-dropdowns mt-1 col"
                onChange={(selectedOption: any) => {
                  setfilterUI((prevState) => {
                    return {
                      ...prevState,
                      Name: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={rows?.flatMap((e: any) =>
                  e?.report?.userInterfacelists?.map((item: any) => ({
                    label: item.name,
                    value: item.name,
                  }))
                )}
                placeholder="Project Type"
                isSearchable={true}
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
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000, // Adjust z-index if needed
                  }),
                }}
                onInputChange={(inputValue: string) => {
                  const alphabeticValue = inputValue.replace(/[^A-Za-z\s]/g, ''); // Remove non-alphabetic characters
                  return alphabeticValue;
                }}
                onChange={(selectedOption: any) => {
                  if (selectedOption) {
                    setfilterUI((prevState) => ({
                      ...prevState,
                      status: selectedOption.label.trim() === '' ? null : selectedOption.label,
                    }));
                  }
                }}
                options={[
                  {
                    label: "BA Completed",
                    value: "BA Completed",
                  },
                  {
                    label: "Dev Completed",
                    value: "Dev Completed",
                  },
                  {
                    label: "QA Testing",
                    value: "QA Testing",
                  },
                  {
                    label: "Production",
                    value: "Production",
                  },
                ]}
                placeholder="Status"
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
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
                  Search
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
      <Grid container >
        <Grid xs={1.9} sx={{ marginLeft: '2.5%' }}>
          <ListItemButton
            sx={{ height: '85%' }}
            className="card m-2 bg-info text-light text-center"
            onClick={async () => {
              await setfilterUS({
                ...filterUS,
              });
            }}
          >
            <span className="m-0 fs-4 fw-bold text-center text-light">
              User Story
            </span>
            {uniqueUserStoryCount}
          </ListItemButton>
        </Grid>
        <Grid xs={1.9}>
          <ListItemButton
            sx={{ height: '85%' }}
            className="card m-2 bg-info text-light text-center"
            onClick={async () => {
              await setfilterUI({
                ...filterUI,
              });
            }}
          >
            <span className="m-0 fs-4 fw-bold text-center text-light">
              User Interface
            </span>
            {rows?.length}
          </ListItemButton>
        </Grid>
        <Grid xs={1.9}>
          <ListItemButton
            sx={{ height: '85%' }}
            className="card m-2 bg-info text-light text-center"
            onClick={async () => {
              await setfilterUI({
                ...filterUI,
              });
            }}
          >
            <span className="m-0 fs-6 fw-bold text-center text-light">
              Total No. of Employees
            </span>
            {TeamMember.length}
          </ListItemButton>
        </Grid>
        <Grid xs={1.9}>
          <ListItemButton
            sx={{ height: '85%' }}
            className="card m-2 bg-info text-light text-center"
            onClick={async () => {
              await setfilterUI({
                ...filterUI,
              });
            }}
          >
            <span className="m-0 fs-6 fw-bold text-center text-light">
              Total No. of Task
            </span>
            {overallTotal}
          </ListItemButton>
        </Grid>
        <Grid xs={1.9}>
          <ListItemButton
            sx={{ height: '85%' }}
            className="card m-2 bg-info text-light text-center">
            <span className="m-0 fs-6 fw-bold text-center text-light">
              Total No. of Resource hrs
            </span>
            {overallTotalActTime}
          </ListItemButton>
        </Grid>
        <Grid xs={1.9}>
          <ListItemButton
            sx={{ height: '85%' }}
            className="card m-2 bg-info text-light text-center">
            <span className="m-0 fs-6 fw-bold text-center text-light">
              Project Completion %
            </span>
            {CompletedUIStatus.length}
          </ListItemButton>
        </Grid>
      </Grid>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Grid>
          <Button
            variant="contained"
            className="mb-2 float-md-end download"
            onClick={() => {
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
                progressPending={isLoading}
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
            </Box>
          </Grid>
        </Grid>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, width: 1000 }}>
            <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>VIEW BUG DETAILS</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead sx={{ position: 'sticky',backgroundColor:'skyblue'}}>
                  <TableRow>
                    <TableCell  sx={{color:'white'}}>Bug ID</TableCell>
                    <TableCell  sx={{color:'white'}} align="center">User Story</TableCell>
                    <TableCell  sx={{color:'white'}} align="center">User Interface</TableCell>
                    <TableCell  sx={{color:'white',width: '40%'}} align="center">Description</TableCell>
                    <TableCell  sx={{color:'white'}} align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBugDetails.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell  component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{selectedUserstoryName}</TableCell>
                      <TableCell align="center">{selectedUserInterfaceName}</TableCell>
                      <TableCell align="center">{row.taskDescription}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleClose}>Back</Button>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          open={openRequest}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, width: 1000 }}>
            <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>VIEW CHANGE REQUEST DETAILS</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead sx={{ position: 'sticky',backgroundColor:'skyblue'}}>
                  <TableRow>
                    <TableCell sx={{color:'white'}}>ID</TableCell>
                    <TableCell  sx={{color:'white'}} align="center">User Story</TableCell>
                    <TableCell  sx={{color:'white'}} align="center">User Interface</TableCell>
                    <TableCell  sx={{color:'white',width: '40%'}} align="center">Change Request Description</TableCell>
                    <TableCell  sx={{color:'white'}} align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBugDetails.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{selectedUserstoryName}</TableCell>
                      <TableCell align="center">{selectedUserInterfaceName}</TableCell>
                      <TableCell align="center">{row.taskDescription}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleClose}>Back</Button>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          open={openTask}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, width: 1000 }}>
            <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>VIEW TASK DETAILS</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead sx={{ position: 'sticky',backgroundColor:'skyblue'}}>
                  <TableRow>
                    <TableCell sx={{color:'white'}}>Task ID</TableCell>
                    <TableCell sx={{color:'white'}} align="center">User Story</TableCell>
                    <TableCell sx={{color:'white'}} align="center">User Interface</TableCell>
                    <TableCell sx={{color:'white',width:'20%'}} align="center" >Task Description</TableCell>
                    <TableCell sx={{color:'white',width:'20%'}} align="center">Employee Name</TableCell>
                    <TableCell sx={{color:'white'}} align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBugDetails.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{selectedUserstoryName}</TableCell>
                      <TableCell align="right">{selectedUserInterfaceName}</TableCell>
                      <TableCell align="center">{row.taskDescription}</TableCell>
                      <TableCell align="center">{row.employeeName}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleClose}>Back</Button>
          </Box>
        </Modal>
      </div>
      <BackDrop open={isLoading}/>
      </>
  );
};

export default ProjectReportList;
