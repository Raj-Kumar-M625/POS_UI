import { Box, Breadcrumbs, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { Get } from "../../../Services/Axios";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Badge from "@mui/material/Badge";
import Select from "react-select";

export const LeaveModule = () => {
  const teamNameRef = useRef<any>(null);
  const [filter, setfilter] = useState<any>({});
  const estEndDateRef = useRef<HTMLInputElement>(null);
  const estStartDateRef = useRef<HTMLInputElement>(null);
  const [TeamListRows, setTeamListRows] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [TeamLeaveCount, setTeamLeaveCount] = useState<any>([]);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  // const [filterRows, setfilterRows] = useState<any>([]);

  const columns: any = [
    {
      field: "name",
      name: "Team Name",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      flex: 1,
      selector: (row: any) => (
        <p className="tableStyle" style={{ textDecoration: "none" }}>
          {row.name}
        </p>
      ),
    },
    {
      field: "Leave Requests",
      name: "Leave Requests",
      type: "Date",
      width: "25rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        var team = TeamLeaveCount.find((x: any) => x.teamId == row.id);
        return (
          <Link
            to="/Admin/LeaveHistoryList"
            state={{
              teamId: row.id,
              teamName: row.name,
            }}
          >
            <div className="p-3">
              <Badge badgeContent={team?.leaveStatusCount} color="primary">
                <FileOpenIcon color="action" />
              </Badge>
            </div>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    let teamList = Get("app/Team/GetTeamList");
    teamList.then((response: any) => {
      setRows(response?.data);
      setTeamListRows(response?.data || []);
      setLoading(false);
    });
    let teamNames = new Set<string>();

    rows?.forEach((row: any) => {
      teamNames.add(row?.name);
    });
    setTeamNames([...teamNames]);
    GetData();
  }, [loading]);

  async function GetData() {
    var response: any = await Get("app/EmployeeLeave/GetLeaveList");
    setTeamLeaveCount(response?.data || []);
  }

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

    if (filter.TeamName != null) {
      temp = temp.filter((e: any) => {
        return e.teamName?.toLowerCase() === filter.TeamName?.toLowerCase();
      });
      // setfilterRows(temp);
    }
  }

  function reset() {
    setfilter({});
    if (teamNameRef.current) teamNameRef.current.clearValue();
    if (estStartDateRef.current) estStartDateRef.current.value = "";
    if (estEndDateRef.current) estEndDateRef.current.value = "";
    setTeamListRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Leave</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="container">
          <div className="row">
            <div className="col-sm-2">
              <div className="form-group">
                <label>Team Name</label>
                <Select
                  aria-label="Floating label select example"
                  isClearable={true}
                  name="status"
                  ref={teamNameRef}
                  className="mt-1"
                  onChange={(code: any) => {
                    if (code) {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          TeamName: code.label == "" ? null : code.label,
                        };
                      });
                    } else {
                      setfilter((prevState: any) => {
                        return {
                          ...prevState,
                          TeamName: code,
                        };
                      });
                    }
                  }}
                  options={teamNames.map((name: string) => {
                    return {
                      value: name,
                      label: name,
                    };
                  })}
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 1000,
                    }),
                  }}
                  isSearchable={true}
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
          </Box>
        </Grid>
      </div>
    </>
  );
};
