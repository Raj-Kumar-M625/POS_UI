import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { Typography, Grid, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { Listteam } from "../../../Models/Team/Teamfilter";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Get } from "../../../Services/Axios";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
// import { AddTeam } from "./AddTeam";
// import { EditTeam } from "./EditTeam";
// import { ViewTeam } from "./ViewTeam";
// import HomeIcon from "@mui/icons-material/Home";
// import GroupsIcon from "@mui/icons-material/Groups";
// import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import TaskIcon from "@mui/icons-material/Task";
// import AddBoxIcon from "@mui/icons-material/AddBox";
// import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { EmpViewTeam } from "./VeiwEmpTeam";

export const EmpTeamList = () => {
  const [rows, setRows] = useState<any>([]);
  const TeamnameRef = useRef<HTMLInputElement>(null);
  const estStartDateRef = useRef<HTMLInputElement>(null);
  const [viewTeamData, setviewTeamData] = useState<any>({});
  //const [weekEndingDates, setweekEndingDates] = useState<string[]>([]);
  const estEndDateRef = useRef<HTMLInputElement>(null);
  const [TeamListRows, setTeamListRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setfilter] = useState<Listteam>({});
  const [TeamView, setTeamView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "20rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="View"
              className="mx-1"
              onClick={() => {
                setTeamView({ view: true });
                setviewTeamData(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            {/* <Tooltip
              title="Edit"
              className="mx-1"
              onClick={() => {
                setTeamView({ edit: true });
                setviewTeamData(row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip> */}
            {/* <Link
              to="/Admin/AssignProject"
              state={{ data: { id: row.id, name: row.name } }}
            >
              <Tooltip title=" Assign Project" className="mx-1">
                <TaskIcon className="fs-4 text-primary" />
              </Tooltip>
            </Link> */}
            {/* <Link
              to="/Admin/TeamTaskQuadrant"
              state={{
                data: {
                  teamId: row.id,
                  teamName: row.name,
                  teamRoute: true,
                },
                weekEndDate: weekEndingDates,
              }}
            >
              <Tooltip title="Team Task Quadrant" className="mx-1">
                <AddBoxIcon className="fs-4 text-secondary" />
              </Tooltip>
            </Link>
            <Link
              to="/Admin/TeamDashBoard"
              state={{
                data: {
                  teamId: row.id,
                  teamName: row.name,
                  teamRoute: true,
                },
              }}
            >
              <Tooltip title="Team Dashboard" className="mx-1">
              <DashboardCustomizeIcon/>
              </Tooltip>
            </Link> */}
          </>
        );
      },
    },
    {
      field: "name",
      name: "Team Name",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: any) => <p className="tableStyle">{row.name}</p>,
    },
    {
      field: "startDate",
      name: "Start Date",
      type: "Date",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: any) => {
        const result = new Date(row.startDate)
          .toLocaleDateString("en-bz")
          .replaceAll("/", "-");
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "endDate",
      name: "End Date",
      type: "Date",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: any) => {
        const result = new Date(row.endDate)
          .toLocaleDateString("en-bz")
          .replaceAll("/", "-");
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  useEffect(() => {
    let teamList = Get("app/Employee/GetEmployeeTeamList");
    teamList.then((response: any) => {
      setRows(response?.data);
      setTeamListRows(response?.data || []);
      setLoading(false);
    });

    // let dates = new Set<string>();
    // taskList.then((response: any) => {
    //   response?.data?.forEach((row: any) => {
    //     dates.add(row.weekEndDate);
    //   });
    //   setweekEndingDates([...dates]);
    // });
  }, []);

  // const handleClickOpen = () => {
  //   setTeamView({ add: true });
  // };

  function ApplyFilter() {
    let temp: any = [];

    if (filter.StartDate != null) {
      if (filter.EndDate == null) {
        estEndDateRef.current?.focus();
        return;
      }
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].startDate.slice(0, 10) >= filter.StartDate &&
          rows[i].endDate.slice(0, 10) <= filter.EndDate
        ) {
          temp.push(rows[i]);
        }
      }
      setTeamListRows(temp);
    } else {
      temp = rows;
    }

    if (filter.Name != null) {
      temp = rows.filter((row: any) => {
        return row.name.toLowerCase().search(filter.Name?.toLowerCase()) >= 0;
      });
      setTeamListRows(temp);
    }
  }

  function reset() {
    setfilter({});
    if (TeamnameRef.current) TeamnameRef.current.value = "";
    if (estStartDateRef.current) estStartDateRef.current.value = "";
    if (estEndDateRef.current) estEndDateRef.current.value = "";
    setTeamListRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Employee">
          <Typography sx={{fontWeight:'bold'}}> 
            Home
            </Typography>
        </Link>
        <Typography sx={{fontWeight:'bold'}}>
          Team
        </Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Team Name</label>
                <input
                  id="name"
                  ref={TeamnameRef}
                  placeholder="Team Name"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        Name: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label className="mx-1">Start Date</label>
                <input
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        StartDate: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                  ref={estStartDateRef}
                  type="date"
                  id="estimated-start-date"
                  placeholder="Estimated Start Date"
                  className="m-1  form-control"
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label className="mx-1">End Date</label>
                <input
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        EndDate: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                  ref={estEndDateRef}
                  type="date"
                  id="estimated-End-date"
                  placeholder="Estimated End Date"
                  className="m-1  form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="row justify-content-end">
                <div className="col-auto">
                  <Button
                    variant="contained"
                    endIcon={<SearchIcon />}
                    className="mx-2 mt-4"
                    onClick={() => ApplyFilter()}
                  >
                    Search
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<RefreshIcon />}
                    className="mx-2 mt-4"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mb-5">
        <Grid>
          <Grid item xs={12} sm={11}>
            <Box style={{ width: "94vw" }}>
              <DataTable
                columns={columns}
                fixedHeader
                responsive
                persistTableHead
                progressPending={loading}
                data={TeamListRows || []}
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
              {/* <DataGrid
                sx={{
                  overflowX: "scroll",
                  textAlign: "center",
                  width: "94vw",
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "white",
                  },
                }}
                getRowClassName={getRowClassName}
                onRowClick={handleRowClick}
                rows={TeamListRows}
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
      {/* <AddTeam
        openDialog={TeamView}
        setOpenDialog={setTeamView}
        setTeamListRows={setTeamListRows}
        setRows={setRows}
      />
      <EditTeam
        openDialog={TeamView}
        setOpenDialog={setTeamView}
        setTeamListRows={setTeamListRows}
        setRows={setRows}
        Data={viewTeamData}
      /> */}
      <EmpViewTeam
        openDialog={TeamView}
        setOpenDialog={setTeamView}
        Data={viewTeamData}
      />
    </>
  );
};
