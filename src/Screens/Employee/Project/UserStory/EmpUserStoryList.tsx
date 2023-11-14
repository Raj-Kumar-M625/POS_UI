import { Breadcrumbs, Typography, Button, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useQuery } from "react-query";

export const EmpUserStoryList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const [reload, setReload] = useState<boolean>(false);
  const [filter, setfilter] = useState<UserStory>({});
  const [rows, setRows] = useState<any>([]);
  const [userStorydata, setUserStorydata] = useState<any>();
  const [filterRows, setfilterRows] = useState<any>([]);
  const usNameRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [userStoryView, setUserStoryView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const columns: GridColDef[] = [
    {
      field: "Action",
      headerName: "Action",
      type: "Date",
      width: 200,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        return (
          <>
            <Tooltip
              className="mx-2"
              title="View"
              onClick={() => {
                setUserStoryView({ view: true });
                setUserStorydata(params.row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>

            <Tooltip
              className="mx-2"
              title="Edit"
              onClick={() => {
                setUserStoryView({ edit: true });
                setUserStorydata(params.row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>

            <Link
              className="mx-2"
              to="/Employee/AssignUI"
              state={{
                ...location?.state,
                UserStoryName: params.row.name,
                UserStoryId: params.row.id,
              }}
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="Assign UI">
                <AssignmentTurnedInIcon className="fs-4 text-primary" />
              </Tooltip>
            </Link>
          </>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "description",
      headerName: "Description",
      width: 400,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "status",
      headerName: "Status",
      width: 135,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      editable: false,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      type: "number",
      width: 150,
      align: "right",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "Date",
      width: 150,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const result = ConvertDate(params.row.startDate);
        return <p>{result}</p>;
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "Date",
      width: 150,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const result = ConvertDate(params.row.endDate);
        return <p>{result}</p>;
      },
    },
  ];

  const { data, refetch } = useQuery("AddUserStory", () => {
    var objective: any = Get(
      `app/Project/GetProjectObjective?ProjectId=${location.state.projectId}`
    );
    return objective;
  });

  useEffect(() => {
    let userStoryList = Get(
      `app/Project/GetUserStoryList?projectId=${location.state.projectId}`
    );
    userStoryList.then((response: any) => {
      setRows(response?.data || []);
      setfilterRows(response?.data || []);
      setLoading(false);
    });
  }, [reload]);

  const handleClickOpen = () => {
    setUserStoryView({ add: true });
  };

  function ApplyFilter() {
    let temp: any = [];

    if (filter.StartDate != null) {
      if (filter.EndDate == null) {
        actEndDateRef.current?.focus();
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
      setfilterRows(temp);
    } else {
      temp = rows;
    }

    if (filter.Name != null) {
      temp = temp.filter((e: any) => {
        return e.name.toLowerCase().search(filter.Name?.toLowerCase()) >= 0;
      });
      setfilterRows(temp);
    }

    if (filter.Description != null) {
      temp = temp.filter((e: any) => {
        return (
          e.description.toLowerCase() === filter.Description?.toLowerCase()
        );
      });
      setfilterRows(temp);
    }
    if (filter.Status != null) {
      temp = temp.filter((e: any) => {
        return e.status.toLowerCase() === filter.Status?.toLowerCase();
      });
      setfilterRows(temp);
    }

    if (filter.Percentage != null) {
      temp = temp.filter((e: any) => {
        return e.percentage === Number(filter.Percentage);
      });
      setfilterRows(temp);
    }
  }

  function reset() {
    setfilter({});
    if (usNameRef.current) usNameRef.current.value = "";
    if (statusRef.current) statusRef.current.clearValue();
    if (percentageRef.current) percentageRef.current.value = "";
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";

    setfilterRows(rows);
  }

  return (
    <div>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Employee/Project">
          <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>User Storys</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Story Name</label>
              <input
                id="User-Story-Name"
                placeholder="User Story Namee"
                ref={usNameRef}
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                  setfilter((prevState) => ({
                    ...prevState,
                    Name: alphabeticValue === "" ? undefined : alphabeticValue,
                  }));
                }}
                value={filter.Name || ""}
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
                  const inputValue = e.target.value;
                  const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                  setfilter((prevState) => ({
                    ...prevState,
                    Description:
                      alphabeticValue === "" ? undefined : alphabeticValue,
                  }));
                }}
                value={filter.Description || ""}
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
                      status:
                        selectedOption.label.trim() === ""
                          ? null
                          : selectedOption.label,
                    }));
                  }
                }}
                options={[
                  {
                    label: "Active",
                    value: "Active",
                  },
                  {
                    label: "In Active",
                    value: "In Active",
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
                  const inputValue = e.target.value;
                  const numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue) || inputValue === "") {
                    setfilter((prevState) => ({
                      ...prevState,
                      Percentage: isNaN(numericValue)
                        ? undefined
                        : numericValue,
                    }));
                  }
                }}
                value={filter.Percentage !== undefined ? filter.Percentage : ""}
                onKeyDown={(e) => {
                  if (
                    // Allow numeric keys, backspace, delete, and arrow keys
                    !/[\d.eE-]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
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
                      StartDate: e.target.value == "" ? null : e.target.value,
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
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Grid>
          <Button
            variant="contained"
            className="mb-2 float-md-start"
            onClick={handleClickOpen}
          >
            Add User Story
            <AddIcon className="mx-1" />
          </Button>
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
            <Box>
              <DataGrid
                sx={{
                  overflowX: "scroll",
                  textAlign: "center",
                  width: "94vw",
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "white",
                  },
                }}
                loading={loading}
                rows={filterRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                style={{ height: 400 }}
                pageSizeOptions={[10, 20, 30, 40, 50]}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
      <AddUserStory
        openDialog={userStoryView}
        setOpenDialog={setUserStoryView}
        projectId={location.state.projectId}
        setReload={setReload}
        data={data}
        refetch={refetch}
      />
      <EditUserStory
        data={data ?? []}
        openDialog={userStoryView}
        setOpenDialog={setUserStoryView}
        Data={userStorydata}
        setReload={setReload}
        projectId={location.state.projectId}
      />
      <ViewUserStory
        openDialog={userStoryView}
        setOpenDialog={setUserStoryView}
        Data={userStorydata}
      />
    </div>
  );
};
