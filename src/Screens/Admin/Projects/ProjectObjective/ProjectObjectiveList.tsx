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
import { AddProjectObjective } from "./AddProjectObjective";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { EditProjectObjective } from "./EditProjectObjective";
import { ViewProjectObjective } from "./ViewProjectObjective";
import { ProjectObjective } from "../../../../Models/Project/ProjectObjective";
import { Get } from "../../../../Services/Axios";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { DownloadProjectObjectiveList } from "../../../../Services/ProjectService";

export const ProjectObjectiveList = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<any>([]);
  const [filterRows, setfilterRows] = useState<any>([]);
  const [filter, setfilter] = useState<ProjectObjective>({});
  const [viewObjectiveData, setObjectiveData] = useState<any>({});
  const descriptionRef = useRef<HTMLInputElement>(null);
  const percentageRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<any>();
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
                setObjectiveView({ view: true });
                setObjectiveData(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            <Tooltip
              title="Edit"
              className="mx-2"
              onClick={() => {
                setObjectiveView({ edit: true });
                setObjectiveData(row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "description",
      name: "Description",
      width: "40rem",
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
      width: "20rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.status}</p>,
    },
    {
      field: "percentage",
      name: "Percentage (%)",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      right: true,
      selector: (row: any) => <p className="tableStyle">{row.percentage}</p>,
    },
  ];

  useEffect(() => {
    let employeeList = Get(
      `app/Project/GetProjectObjective?ProjectId=${location.state.projectId}`
    );
    employeeList.then((response: any) => {
      setRows(response?.data ?? []);
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
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="slateblue" to="/Admin/Project">
          <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
        </Link>
        <Link
          color="slateblue"
          to="/Admin/ProjectQuadrant"
          state={{ ...location.state }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Project Quadrant</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>
          Project Objective List
        </Typography>
      </Breadcrumbs>

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
          <Button
            variant="contained"
            className="mb-2 float-md-start"
            onClick={handleClickOpen}
          >
            Add Objective
            <AddIcon className="mx-1" />
          </Button>
          <Button
            variant="contained"
            className="mb-2 float-md-end"
            onClick={() => {
              DownloadProjectObjectiveList(filterRows);
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
                data={filterRows?.projectObjectives ?? []}
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

      <AddProjectObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setfilterRows={setfilterRows}
        setRows={setRows}
        ProjectId={location.state.projectId}
      />
      <ViewProjectObjective
        openDialog={objectiveView}
        left
        setOpenDialog={setObjectiveView}
        Data={viewObjectiveData}
      />
      <EditProjectObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setfilterRows={setfilterRows}
        setRows={setRows}
        ProjectId={location.state.projectId}
        Data={viewObjectiveData}
      />
    </>
  );
};
