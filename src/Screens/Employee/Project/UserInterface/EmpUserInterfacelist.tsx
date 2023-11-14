import { Breadcrumbs, Typography, Button, Grid } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { AddUserInterface } from "./AddUserInterface";
import { EditUserInterface } from "./EditUserInterface";
import { ViewUserInterface } from "./VeiwUserInterface";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserInterface } from "../../../../Models/Project/UserInterface";
import { ConvertDate } from "../../../../Utilities/Utils";
import { Get } from "../../../../Services/Axios";
import { DownloadEmpUserInterfaceList } from "../../../../Services/ProjectService";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";

export const EmpUserInterfacelist = () => {
  const [filterRows, setfilterRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);
  const [rows, setRows] = useState<any>([]);
  const location = useLocation();
  const uiNameRef = useRef<HTMLInputElement>(null);
  const statuiRef = useRef<any>();
  const percentageRef = useRef<HTMLInputElement>(null);
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const complexityRef = useRef<any>();
  const [filter, setfilter] = useState<UserInterface>({});
  const [userInterfacedata, setUserInterfacedata] = useState<any>();
  const [data, setData] = useState([]);
  const [UserInterfaceView, setUserInterfaceView] = useState<any>({
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
                setUserInterfaceView({ view: true });
                setUserInterfacedata(params.row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>

            <Tooltip
              className="mx-2"
              title="Edit"
              onClick={() => {
                setUserInterfaceView({ edit: true });
                setUserInterfacedata(params.row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>

            <Link
              to="/Admin/UserStoryList"
              state={{ projectId: params.row.id }}
              style={{ textDecoration: "none" }}
            ></Link>
          </>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 280,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "description",
      headerName: "Description",
      width: 500,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      editable: false,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      type: "number",
      width: 100,
      align: "right",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "complexity",
      headerName: "Complexity",
      width: 150,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
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

  async function fetchData() {
    let UserInterface = Get(
      `app/Project/GetUserInterfaceList?projectId=${location.state.projectId}`
    );
    UserInterface.then((response: any) => {
      setRows(response?.data);
      setfilterRows(response?.data || []);
      setLoading(false);
    });
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

    if (filter.Complexity != null) {
      temp = temp.filter((e: any) => {
        return e.complexity.toLowerCase() === filter.Complexity?.toLowerCase();
      });
      setfilterRows(temp);
    }
  }

  function reset() {
    setfilter({});
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
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Employee/Project">
          <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>User Interface</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Interface Name</label>
              <input
                id="User-Interface-Name"
                placeholder="User Interface Name"
                ref={uiNameRef}
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
                ref={statuiRef}
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
              <label>Complexity</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="complexity"
                ref={complexityRef}
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
                      Complexity:
                        selectedOption.label.trim() === ""
                          ? null
                          : selectedOption.label,
                    }));
                  }
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
                formatOptionLabel={(option: any) => option.label}
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
          <div className="container">
            <div className="row">
              <div className="col-md-2">
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
              <div className="col-md-10">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <Button
                      variant="contained"
                      endIcon={<SearchIcon />}
                      className="mx-1 mt-4"
                      onClick={() => ApplyFilter()}
                    >
                      search
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<RefreshIcon />}
                      className="mx-3 mt-4"
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
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Grid>
          <Button
            variant="contained"
            className="mb-2 float-md-start"
            onClick={handleClickOpen}
          >
            Add User Interface
            <AddIcon className="mx-1" />
          </Button>
          <Button
            variant="contained"
            className="mb-2 float-md-end"
            onClick={() => {
              DownloadEmpUserInterfaceList(filterRows);
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
                rows={filterRows}
                columns={columns}
                loading={loading}
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
      <AddUserInterface
        openDialog={UserInterfaceView}
        setOpenDialog={setUserInterfaceView}
        setReload={setReload}
        projectId={location.state.projectId}
        data1={data?.length > 0 ? data : []}
      />
      <EditUserInterface
        openDialog={UserInterfaceView}
        setOpenDialog={setUserInterfaceView}
        Data={userInterfacedata}
        setReload={setReload}
        projectId={location.state.projectId}
      />
      <ViewUserInterface
        openDialog={UserInterfaceView}
        setOpenDialog={setUserInterfaceView}
        Data={userInterfacedata}
      />
    </div>
  );
};
