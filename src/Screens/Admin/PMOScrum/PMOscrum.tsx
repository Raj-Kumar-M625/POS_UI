import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Select from "react-select";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { YesterdayDetails } from "./YesterdayDetails";
import { AttentionDetails } from "./AttentionDetails";
import { ScrumDetails } from "./ScrumDetails";
import {
  DialogOptions,
  PMOScrum,
  PMOScrumDto,
} from "../../../Models/PMOScrum/PMOScrum";
import { Get, Post } from "../../../Services/Axios";
import { AlertOption } from "../../../Models/Common/AlertOptions";
import Swal from "sweetalert2";
import { ConvertToISO } from "../../../Utilities/Utils";

export const PMOscrum = () => {
  const [Scrum, setScrum] = useState<PMOScrum[]>([]);
  const [pmoScrum, setPmoScrum] = useState<PMOScrum | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [PMOScrumDto, setPMOScrumDto] = useState<PMOScrumDto | undefined>();
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [filter, setFilter] = useState<PMOScrum | undefined>();
  const [filterRows, setFilterRows] = useState<PMOScrum[]>([]);
  const employeeNameRef = useRef<any>(null);
  const statusRef = useRef<any>();
  const [objectiveView, setObjectiveView] = useState<DialogOptions>({
    employeehistory: false,
    attentiondetails: false,
    scrumdetails: false,
  });

  async function GetPMOScrum() {
    setLoading(true);
    const date = ConvertToISO(new Date());
    const response: any = await Get<PMOScrum>(
      `app/PMO/GetPMOList?selectedDate=${date}`
    );
    setScrum(response.data || []);
    setFilterRows(response.data || []);
    setLoading(false);
  }

  function showPopup(message: string) {
    var option: AlertOption;
    option = {
      title: "",
      text: message,
      icon: "warning",
    };
    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    });
  }

  async function updateScrum() {
    if (!PMOScrumDto?.attendanceStatus) {
      showPopup("Please Select Attendance Status!");
      return;
    }

    if (PMOScrumDto?.payAttention === undefined) {
      showPopup("Please Select Pay Attention!");
      return;
    }

    if (!PMOScrumDto?.scrumStatus) {
      showPopup("Please Select Scrum Status!");
      return;
    }

    if (
      PMOScrumDto?.payAttention === true &&
      PMOScrumDto.payAttentions?.length === 0
    ) {
      option = {
        title: "",
        text: "Please Select Attentation Details!",
        icon: "warning",
      };
      Swal.fire({
        ...option,
        confirmButtonColor: "#3085d6",
      }).then(() => setObjectiveView({ attentiondetails: true }));
      return;
    }

    const { error }: any = await Post("app/PMO/UpdateScrum", PMOScrumDto);

    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Updating!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Scrum Updated!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setRefetch((prev: boolean) => !prev);
      setPMOScrumDto(undefined);
    });
  }

  useEffect(() => {
    GetPMOScrum();
  }, [refetch]);

  const columns: any = [
    {
      field: "employeeName",
      name: "Employee Name",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: any) => (
        <p className="tableStyle">
          {row.employeeName.replace(/[^A-Za-z ]/g, "")}
        </p>
      ),
    },
    {
      field: "",
      name: "Attendance",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: PMOScrum) => (
        <select
          className="form-select"
          disabled={row.attendanceStatus ? true : false}
          defaultValue={row?.attendanceStatus ?? ""}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setPMOScrumDto({
              ...PMOScrumDto,
              attendanceStatus: event.target.value,
              id: row.id,
            });
          }}
        >
          <option value={undefined}>Select</option>
          <option value="Absent">Absent</option>
          <option value="Present">Present</option>
        </select>
      ),
    },
    {
      field: "",
      name: "Yesterday Detail",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "center",
      flex: 1,
      selector: (row: PMOScrum) => (
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            setEmployeeId(row.employeeId ?? 0);
            setObjectiveView({ employeehistory: true });
          }}
        >
          View
        </Button>
      ),
    },

    {
      field: "",
      name: "Pay Attention",
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      align: "left",
      width: "20rem",
      selector: (row: PMOScrum) => (
        <div className="d-flex g-1 align-items-center">
          <div className="col">
            <select
              disabled={row?.payAttention !== null ? true : false}
              value={
                row?.payAttention !== null
                  ? row.payAttention === true
                    ? "Yes"
                    : "No"
                  : undefined
              }
              className="form-select"
              onChange={(event) => {
                const selectedValue = event.target.value;
                if (selectedValue === "Yes") {
                  setPMOScrumDto({
                    ...PMOScrumDto,
                    payAttention: true,
                    id: row.id,
                  });
                  setPmoScrum(row);
                  setObjectiveView({ attentiondetails: true });
                } else {
                  setPMOScrumDto({
                    ...PMOScrumDto,
                    payAttention: false,
                    id: row.id,
                  });
                  setObjectiveView({ attentiondetails: false });
                }
              }}
            >
              <option value={undefined}>Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {row?.payAttention && (
            <div className="col">
              <button
                className="btn btn-warning btn-sm text-light mx-1"
                onClick={() => {
                  setPmoScrum(row);
                  setObjectiveView({ attentiondetails: true });
                }}
              >
                View
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      field: "",
      name: "Status",
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: PMOScrum) => (
        <select
          className="form-select"
          disabled={row.scrumStatus !== "Pending" ? true : false}
          defaultValue={row.scrumStatus}
          onChange={(event) => {
            const selectedValue = event.target.value;
            setPMOScrumDto({
              ...PMOScrumDto,
              scrumStatus: selectedValue,
              id: row.id,
            });
            if (selectedValue === "Scrum Not Taken") {
              setObjectiveView({ scrumdetails: false });
            } else {
              setObjectiveView({ scrumdetails: false });
            }
          }}
        >
          <option value={undefined}>Select</option>
          <option value="Pending">Pending</option>
          <option value="Scrum Not Taken">Scrum Not Taken</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
    {
      field: "Action",
      name: "Action",
      width: "10rem",
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: PMOScrum) => {
        return (
          <>
            <Button
              variant="contained"
              color="success"
              disabled={row.scrumStatus !== "Pending" ? true : false}
              onClick={() => updateScrum()}
            >
              Submit
            </Button>
          </>
        );
      },
    },
  ];

  function applyFilter() {
    let temp: Array<PMOScrum> = Scrum;

    if (filter?.employeeName) {
      temp = temp.filter(
        (x) =>
          x.employeeName?.replace(/[^A-Za-z ]/g, "") === filter?.employeeName
      );
      setFilterRows(temp);
    }

    if (filter?.scrumStatus) {
      temp = temp.filter((x) => x.scrumStatus?.trim() === filter?.scrumStatus);
      setFilterRows(temp);
    }
  }

  function reset() {
    if (employeeNameRef.current) employeeNameRef.current.clearValue();
    if (statusRef.current) statusRef.current.clearValue();
    setFilterRows(Scrum);
    setFilter({});
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>PMO Scrum</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Employee Name</label>
                <Select
                  aria-label="Floating label select example"
                  isClearable={true}
                  name="status"
                  ref={employeeNameRef}
                  className="mt-1"
                  onChange={(selectedOption: any) => {
                    if (selectedOption) {
                      setFilter((prevState) => ({
                        ...prevState,
                        employeeName:
                          selectedOption.value === ""
                            ? undefined
                            : selectedOption.value.replace(/[^A-Za-z ]/g, ""),
                      }));
                    }
                  }}
                  options={Scrum.map((e: PMOScrum) => {
                    return {
                      value: e.employeeName?.replace(/[^A-Za-z ]/g, ""),
                      label: e.employeeName?.replace(/[^A-Za-z ]/g, ""),
                    };
                  })}
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
                <label>Status</label>
                <Select
                  aria-label="Floating label select example"
                  isClearable={true}
                  name="status"
                  ref={statusRef}
                  className="mt-1"
                  onChange={(selectedOption: any) => {
                    if (selectedOption) {
                      setFilter((prevState) => ({
                        ...prevState,
                        scrumStatus:
                          selectedOption.value === ""
                            ? undefined
                            : selectedOption.value,
                      }));
                    }
                  }}
                  options={[
                    {
                      label: "Pending",
                      value: "Pending",
                    },
                    {
                      label: "Scrum Not Taken",
                      value: "Scrum Not Taken",
                    },
                    {
                      label: "Completed",
                      value: "Completed",
                    },
                  ]}
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
            <div className="col-md-6">
              <div className="row justify-content-end">
                <div className="col-auto">
                  <Button
                    variant="contained"
                    endIcon={<SearchIcon />}
                    className="mx-2 mt-4"
                    onClick={() => applyFilter()}
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
              data={filterRows}
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
      <YesterdayDetails
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        employeeId={employeeId}
      />
      <AttentionDetails
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        PMOScrum={pmoScrum}
        PMOScrumDto={PMOScrumDto}
        setPMOScrumDto={setPMOScrumDto}
      />
      <ScrumDetails
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
      />
    </>
  );
};
