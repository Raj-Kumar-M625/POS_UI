import { Breadcrumbs, Typography, Button, Grid, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import DataTable from "react-data-table-component";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Get } from "../../../Services/Axios";
import { LeaveeView } from "./LeaveeView";
import ExpandedComponent from "./ExpandedComponent";
import { ConvertDate } from "../../../Utilities/Utils";

export const LeaveHistoryList = ({ setReload }: any) => {
  const [filter, setfilter] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<any>([]);
  const location = useLocation();
  const [filterRows, setfilterRows] = useState<any>([]);
  const employeenameRef = useRef<any>(null);
  const leavetypeRef = useRef<any>(null);
  const leavesubtypeRef = useRef<any>(null);
  const leavestatusRef = useRef<any>(null);
  const createddateRef = useRef<any>(null);
  const [viewLeaveData, setviewLeaveData] = useState<any>({});
  const [LeaveView, setLeaveView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  var employeeSet = new Set<any>();
  var employees: string[] = [];

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "12rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="Edit"
              className="mx-2"
              onClick={() => {
                setLeaveView({ edit: true });
                setviewLeaveData(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-warning" />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "Employee Name",
      name: "Employee Name",
      width: "13rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <p className="tableStyle">
          {row.employeeName?.replace(/[^A-Za-z ]/g, "")}
        </p>
      ),
    },
    {
      field: "name",
      name: "Leave Type",
      width: "13rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => <p className="tableStyle">{row.leaveType}</p>,
    },
    {
      field: "name",
      name: "Leave SubType",
      width: "13rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => <p className="tableStyle">{row.leaveSubType}</p>,
    },
    {
      field: "leave reason",
      name: "Leave Reason",
      width: "18rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => <p className="tableStyle">{row.leaveReason}</p>,
    },
    {
      field: "leave status",
      name: "Leave Status",
      width: "12rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => <p className="tableStyle">{row.leaveStatus}</p>,
    },
    {
      field: "postedDate",
      name: "Applied Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        const result = ConvertDate(row.createdDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  useEffect(() => {
    let EmployeeLeaveList = Get(
      `app/EmployeeLeave/GetLeaveByTeamId?teamid=${location.state.teamId}`
    );
    EmployeeLeaveList.then((response: any) => {
      setRows(response?.data || []);
      setfilterRows(response?.data || []);
      setLoading(false);
    });
  }, []);

  rows?.forEach((row: any) => {
    employeeSet.add(row?.employeeName);
  });
  employees = [...employeeSet];

  function reset() {
    setfilter({});
    if (employeenameRef.current) employeenameRef.current.clearValue();
    if (leavetypeRef.current) leavetypeRef.current.clearValue();
    if (leavesubtypeRef.current) leavesubtypeRef.current.clearValue();
    if (leavestatusRef.current) leavestatusRef.current.clearValue();
    if (createddateRef.current) createddateRef.current.value = "";

    setfilterRows(rows);
  }

  function ApplyFilter() {
    let temp: any = [];
    if (filter.EmployeeName != null) {
      temp = rows.filter((row: any) => {
        return (
          row.employeeName
            ?.toLowerCase()
            .search(filter?.EmployeeName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.LeaveType != null) {
      temp = rows.filter((row: any) => {
        return (
          row.leaveType
            ?.toLowerCase()
            .search(filter?.LeaveType?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.LeaveSubType != null) {
      temp = rows.filter((row: any) => {
        return (
          row.leaveSubType
            ?.toLowerCase()
            .search(filter?.LeaveSubType?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.LeaveStatus != null) {
      temp = rows.filter((row: any) => {
        return (
          row.leaveStatus
            ?.toLowerCase()
            .search(filter?.LeaveStatus?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.CreatedDate != null) {
      temp = rows.filter((row: any) => {
        return (
          row.createdDate
            ?.toLowerCase()
            .search(filter?.CreatedDate?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }
  }
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Leave">
          <Typography sx={{ fontWeight: "bold" }}>Leave</Typography>
        </Link>
        <Typography>
          <Typography sx={{ fontWeight: "bold" }}>Leave History</Typography>
        </Typography>
      </Breadcrumbs>
      <Grid sx={{ textAlign: "center" }}>
        <Typography className="fw-bolder fs-3">
          Team Name: {location.state?.teamName}
        </Typography>
      </Grid>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>Employee Name</label>
              <Select
                id="employee-name"
                isClearable={true}
                ref={employeenameRef}
                className="m-1"
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      EmployeeName: selectedOption
                        ? selectedOption.value
                        : null,
                    };
                  });
                }}
                options={employees.map((name) => ({
                  label: name.replace(/[^A-Za-z\s]/g, ""),
                  value: name,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Leave Type</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="leaveType"
                ref={leavetypeRef}
                className="select-dropdowns mt-1 col"
                onInputChange={(inputValue: string) => {
                  const alphabeticValue = inputValue.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  );
                  return alphabeticValue;
                }}
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      LeaveType: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={[
                  {
                    label: "Sick Leave",
                    value: "Sick Leave",
                  },
                  {
                    label: "Personal Leave",
                    value: "Personal Leave",
                  },
                  {
                    label: "Emergency Leave",
                    value: "Emergency Leave",
                  },
                  {
                    label: "Vacation",
                    value: "Vacation",
                  },
                  {
                    label: "DayOff",
                    value: "DayOff",
                  },
                ]}
                placeholder="leave Type"
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Leave SubType</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="leaveSubType"
                ref={leavesubtypeRef}
                className="select-dropdowns mt-1 col"
                onInputChange={(inputValue: string) => {
                  const alphabeticValue = inputValue.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  );
                  return alphabeticValue;
                }}
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      LeaveSubType: selectedOption
                        ? selectedOption.value
                        : null,
                    };
                  });
                }}
                options={[
                  {
                    label: "First Half",
                    value: "First Half",
                  },
                  {
                    label: "Second Half",
                    value: "Second Half",
                  },
                ]}
                placeholder="leave SubType"
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>LeaveStatus</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="status"
                ref={leavestatusRef}
                className="select-dropdowns mt-1 col"
                onInputChange={(inputValue: string) => {
                  const alphabeticValue = inputValue.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  );
                  return alphabeticValue;
                }}
                onChange={(selectedOption: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      LeaveStatus: selectedOption ? selectedOption.value : null,
                    };
                  });
                }}
                options={[
                  {
                    label: "Approved",
                    value: "Approved",
                  },
                  {
                    label: "Rejected",
                    value: "Rejected",
                  },
                  {
                    label: "Partially Approved",
                    value: "Partially Approved",
                  },
                ]}
                placeholder="Status"
                isSearchable={true}
                formatOptionLabel={(option: any) => option.label}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label className="mx-1">Applied Date</label>
              <input
                onChange={(e: any) => {
                  setfilter((prevState: any) => {
                    return {
                      ...prevState,
                      CreatedDate: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                type="date"
                id="start-date"
                placeholder="Post Date"
                ref={createddateRef}
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
                  className="mx-1 mt-1"
                  onClick={() => ApplyFilter()}
                >
                  search
                </Button>
                <Button
                  variant="contained"
                  endIcon={<RefreshIcon />}
                  className="mx-3 mt-1"
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
        <Grid item xs={12} sm={11}>
          <Box style={{ width: "94vw" }}>
            <DataTable
              columns={columns}
              fixedHeader
              responsive
              persistTableHead
              progressPending={loading}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
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
      </div>
      <LeaveeView
        openDialog={LeaveView}
        setOpenDialog={setLeaveView}
        setRows={setRows}
        setReload={setReload}
        Data={viewLeaveData}
      />
    </>
  );
};

export default LeaveHistoryList;
