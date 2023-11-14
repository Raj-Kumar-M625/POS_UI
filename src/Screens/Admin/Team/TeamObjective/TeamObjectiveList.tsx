import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import Select from "react-select";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useRef } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ProjectObjective } from "../../../../Models/Project/ProjectObjective";
import { Get } from "../../../../Services/Axios";
import { AddTeamObjective } from "./AddTeamObjective";
import { EditTeamObjective } from "./EditTeamObjective";
import { ViewTeamObjective } from "./ViewTeamObjective";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ADMIN } from "../../../../Constants/Roles";
import { useContextProvider } from "../../../../CommonComponents/Context";

export const TeamObjectiveList = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<any>([]);
  const [filterRows, setfilterRows] = useState<any>([]);
  const [filter, setfilter] = useState<ProjectObjective>({});
  const [viewObjectiveData, setObjectiveData] = useState<any>({});
  const descriptionRef = useRef<HTMLInputElement>(null);
  const percentageRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<any>();
  const { role } = useContextProvider();
  const [objectiveView, setObjectiveView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: 242,
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
                setObjectiveView({ view: true });
                setObjectiveData(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            {role === ADMIN && (
              <Tooltip
                title="Edit"
                className="mx-1"
                onClick={() => {
                  setObjectiveView({ edit: true });
                  setObjectiveData(row);
                }}
              >
                <EditIcon className="fs-4 text-warning" />
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      field: "description",
      name: "Description",
      width: 400,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.description}</p>,
    },
    {
      field: "status",
      name: "Status",
      width: 400,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.status}</p>,
    },
    {
      field: "percentage",
      name: "Percentage (%)",
      width: 400,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "right",
      selector: (row: any) => <p className="tableStyle">{row?.percentage}</p>,
    },
  ];
  useEffect(() => {
    let objectiveList = Get(
      `app/Team/GetTeamObjectiveList?teamId=${location.state?.data?.id}`
    );
    objectiveList.then((response: any) => {
      setRows(response?.data);
      setfilterRows(response?.data || []);
      setLoading(false);
    });
  }, []);

  const handleClickOpen = () => {
    setObjectiveView({ add: true });
  };

  function ApplyFilter() {
    let temp: any = [];

    if (filter.Description != null) {
      temp = rows.filter((row: any) => {
        return (
          row.description
            ?.toLowerCase()
            .search(filter?.Description?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.status != null) {
      temp = rows.filter((row: any) => {
        return row.status.toLowerCase() === filter.status?.toLowerCase();
      });
      setfilterRows(temp);
    }
    if (filter.Percentage != null) {
      temp = rows.filter((row: any) => {
        return row.percentage === Number(filter.Percentage);
      });
      setfilterRows(temp);
    }
  }

  function Reset() {
    setfilter({});
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (percentageRef.current) percentageRef.current.value = "";
    if (statusRef.current) statusRef.current.clearValue();
    setfilterRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to={`/${role}/Team`}>
          <Typography sx={{ fontWeight: "bold" }}>Team</Typography>
        </Link>
        <Link
          to={`/${role}/TeamQuadrant`}
          state={{
            data: {
              id: location.state?.data?.id,
              name: location.state?.data?.name,
            },
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Team Quadrant</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Team Objective</Typography>
      </Breadcrumbs>
      <Typography align="center" className="fs-3">
        Team Name:{" "}
        <span className="fw-bolder ">{location.state?.data?.name}</span>
      </Typography>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Description</label>
              <input
                id="description"
                ref={descriptionRef}
                className="m-1 form-control col"
                onChange={(e: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      Description: e.target.value == "" ? null : e.target.value,
                    };
                  });
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
                onChange={(code: any) => {
                  if (code) {
                    setfilter((prevState) => {
                      return { ...prevState, status: code.label };
                    });
                  }
                }}
                options={[
                  {
                    label: "Completed",
                    value: "Completed",
                  },
                  {
                    label: "InProgress",
                    value: "InProgress",
                  },
                ]}
                placeholder="Status"
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Percentage</label>
              <input
                id="percentage"
                ref={percentageRef}
                className="m-1 form-control col"
                onChange={(e: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      Percentage: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="col-sm-4 mt-1">
            <div className="form-group d-flex">
              <Button
                variant="contained"
                endIcon={<FilterAltIcon />}
                className="mx-2 mt-4"
                onClick={() => ApplyFilter()}
              >
                Apply Filter
              </Button>
              <Button
                variant="contained"
                endIcon={<RefreshIcon />}
                className="mx-2 mt-4"
                onClick={() => Reset()}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mb-5">
        <Grid>
          {role === ADMIN && (
            <Button
              variant="contained"
              className="mb-2 float-md-start"
              onClick={handleClickOpen}
            >
              Add Objective
              <AddIcon className="mx-1" />
            </Button>
          )}

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
            </Box>
          </Grid>
        </Grid>
      </div>

      <AddTeamObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setfilterRows={setfilterRows}
        setRows={setRows}
        teamId={location.state?.data?.id}
      />

      <EditTeamObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        Data={viewObjectiveData}
        teamId={location.state?.data?.id}
        setfilterRows={setfilterRows}
        setRows={setRows}
      />

      <ViewTeamObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        Data={viewObjectiveData}
      />
    </>
  );
};
