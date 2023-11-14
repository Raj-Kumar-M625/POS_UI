import {
  Breadcrumbs,
  Button,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AddMonthlyObjective } from "./AddMonthlyObjective";
import { useEffect, useRef, useState } from "react";
import { Get } from "../../../../Services/Axios";
import {
  ConvertDate,
  ConvertToISO,
  WeekEndingDate,
} from "../../../../Utilities/Utils";
import { EditTeamWeeklyObjective } from "./EditTeamWeeklyObjective";
import Swal from "sweetalert2";
import { EditTeamMonthlyObjective } from "./EditTeamMonthlyObjective";
import { AddTeamWeeklyObjective } from "./AddTeamWeeklyObjective";
import objective from "../../../../assets/Objective.png";
import { useContextProvider } from "../../../../CommonComponents/Context";
import { ADMIN } from "../../../../Constants/Roles";

export const MonthlyObjective = () => {
  const currentDate = new Date();
  const location = useLocation();
  const [monthlyObjective, setMonthlyObjective] = useState<any>([]);
  const [weeklyObjective, setWeeklyObjective] = useState<any>([]);
  const [viewObjectiveData, setObjectiveData] = useState<any>({});
  const [monthlyObjData, setMonthlyObjData] = useState<any>({});
  const [monthlyObjId, setMonthlyObjId] = useState(0);
  const [projectId, setProjectId] = useState<any>({});
  const [reload, setReload] = useState<boolean>(false);
  const dateRef = useRef<any>("dd-yy-mmmm");
  const { role } = useContextProvider();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const [objectiveView, setObjectiveView] = useState<any>({
    view: false,
    edit: false,
    add: false,
    add2: false,
  });

  useEffect(() => {
    let objectiveList = Get(
      `app/Team/GetTeamMonthlyObjective?teamId=${location.state?.data?.id}`
    );
    objectiveList.then((response: any) => {
      setMonthlyObjective(response.data ?? []);
      const monthlyObjectiveId = response?.data[0]?.id ?? 0;
      const weeklyObj =
        response?.data.find((x: any) => x.id === monthlyObjectiveId) ?? [];
      handleObjectiveClick(monthlyObjectiveId);
      setWeeklyObjective(weeklyObj.teamWeeklyObjectives);
    });
  }, [reload]);

  const handleObjectiveClick = (id: number) => {
    var objectives = monthlyObjective.find((x: any) => x.id === id) ?? [];
    setMonthlyObjId(id);
    setWeeklyObjective(objectives.teamWeeklyObjectives ?? []);
    if (dateRef.current) dateRef.current.value = "";
  };

  const handleClickOpen = (id: any) => {
    setMonthlyObjId(id);
    setObjectiveView({ add: true });
  };

  const handleWeekEndDateChange = (date: string) => {
    var monthlyObj = monthlyObjective.find((x: any) => x.id == monthlyObjId);
    var weeklyObj = monthlyObj?.teamWeeklyObjectives?.filter(
      (x: any) => ConvertToISO(x.weekEndingDate) == date
    );
    setWeeklyObjective(weeklyObj ?? []);
  };

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
        <Typography sx={{ fontWeight: "bold" }}>
          Team Monthly Objective
        </Typography>
      </Breadcrumbs>
      <Typography align="center" className="fs-3">
        Team Name:{" "}
        <span className="fw-bolder">{location.state?.data?.name}</span>
      </Typography>
      {role === ADMIN && (
        <Button
          variant="contained"
          className="mx-4"
          onClick={() => setObjectiveView({ add2: true })}
        >
          <AddIcon />
          Add Monthly Objective
        </Button>
      )}
      <div className="d-flex w-100">
        <div
          className="mt-4 border border-1 overflow-scroll w-25  emp-over-cont mx-4"
          style={{ backgroundColor: "#ebf5f3" }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 400,
              maxHeight: 570,
              backgroundColor: "#ebf5f3",
              fontFamily: "Product Sans",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className="fs-5 text-light"
                sx={{ backgroundColor: "#6b4af0", padding: 1 }}
              >
                <img src={objective} className="mx-2" width={40} height={40} />
                Monthly Objectives
              </ListSubheader>
            }
          >
            {monthlyObjective.length == 0 ? (
              <>
                <h5 className="text-center m-2" key="124QW">
                  No Objectives
                </h5>
              </>
            ) : (
              monthlyObjective.map((e: any, index: number) => (
                <div key={index}>
                  <div className="d-flex">
                    <ListItemButton
                      onClick={() => handleObjectiveClick(e.id)}
                      sx={{
                        background: `${monthlyObjId == e.id ? "#ade1f0" : ""}`,
                      }}
                    >
                      <Tooltip title={`${e.description}}`}>
                        <ListItemText primary={`${e.name}`} />
                      </Tooltip>
                    </ListItemButton>
                    {role === ADMIN && (
                      <Tooltip title="Add Weekly Objective">
                        <Button
                          onClick={() => {
                            setProjectId(e.projectId);
                            handleClickOpen(e.id);
                          }}
                        >
                          <AddIcon color="success" />
                        </Button>
                      </Tooltip>
                    )}
                    {role === ADMIN && (
                      <Tooltip title="Edit Monthly Objective">
                        <Button
                          onClick={() => {
                            setObjectiveView({ edit2: true });
                            setMonthlyObjData(e);
                          }}
                        >
                          <EditIcon color="warning" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  <Divider />
                </div>
              ))
            )}
          </List>
        </div>
        <div
          className="mt-4 border border-1 emp-over-cont mx-4 w-75"
          style={{ backgroundColor: "#ebf5f3" }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 1100,
              backgroundColor: "#ebf5f3",
              position: "relative",
              overflow: "auto",
              maxHeight: 570,
              ontFamily: "Product Sans",
              "& ul": { padding: 0 },
            }}
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className="fw-bold d-flex align-items-center justify-content-between text-light"
                sx={{ backgroundColor: "#6b4af0", padding: 1 }}
              >
                <div className="fs-6  d-flex align-items-center flex-column">
                  <span>
                    <img
                      src={objective}
                      className="mx-2"
                      width={40}
                      height={40}
                    />
                    Weekly Objectives
                  </span>
                </div>
                <FormControl className="col-md-7  d-flex flex-row justify-content-end">
                  {/* <div className="mx-1">
                    Status
                    <select
                      className="form-select"
                      id="status"
                      placeholder="status"
                      // ref={statusRef}
                      onChange={() => {
                        // handleStatusChnage(e.target.value);
                      }}
                    >
                      <option value="" selected disabled>
                        Select Status
                      </option>
                      <option value="All">All</option>
                      <option value="Completed">Completed</option>
                      <option value="In-Progress">In Progress</option>
                      <option value="Ready-For-UAT">Ready For UAT</option>
                      <option value="Move">Move</option>
                      <option value="ReAssign">ReAssign</option>
                    </select>
                  </div> */}
                  <div className="mx-1">
                    Week Ending Date
                    <input
                      type="date"
                      ref={dateRef}
                      onFocus={() => {
                        dateRef.current.min = ConvertToISO(firstDayOfMonth);
                        dateRef.current.max = ConvertToISO(lastDayOfMonth);
                      }}
                      onBlur={() => {
                        dateRef.current.min = "";
                        dateRef.current.max = "";
                      }}
                      className="form-select"
                      // defaultValue={
                      //   location.state.weekendingDate ??
                      //   ConvertToISO(weekEndingDate)
                      // }
                      // ref={weekEndRef}
                      onChange={(e: any) => {
                        var date = new Date(e.target.value);
                        var day = date.getUTCDay();

                        if (day !== 5) {
                          Swal.fire({
                            icon: "error",
                            title: "Please Select Only Friday!",
                            showConfirmButton: true,
                          });
                          e.target.value = ConvertToISO(WeekEndingDate());
                          return false;
                        }
                        handleWeekEndDateChange(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <Tooltip title="Reset">
                      <Button
                        variant="contained"
                        color="warning"
                        className="mt-5"
                        onClick={() => {
                          // if (weekEndRef.current)
                          //   weekEndRef.current.value =
                          //     ConvertToISO(weekEndingDate);
                          // setselectedWeekEnd(ConvertToISO(weekEndingDate));
                          if (dateRef.current) dateRef.current.value = "";
                          // if (statusRef.current) statusRef.current.value = "";
                          setReload(!reload);
                        }}
                      >
                        <RefreshIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </FormControl>
              </ListSubheader>
            }
          >
            {[1].map((sectionId) => (
              <li key={`section-${sectionId}`}>
                <ul>
                  {weeklyObjective?.length == 0 ? (
                    <>
                      <h4 className="text-center m-2">No Objectives</h4>
                    </>
                  ) : (
                    weeklyObjective?.map((item: any) => (
                      <div key={`item-${sectionId}-${1}`}>
                        <div className="card m-2">
                          <ListItem>
                            <div className="card-body">
                              <h5 className="card-title d-flex justify-content-between">
                                <div>
                                  <span className="fw-bolder">Name: </span>
                                  {item.name}
                                </div>
                                <div className="">
                                  {role === ADMIN && (
                                    <Tooltip title="Edit">
                                      <Button
                                        className="m-3"
                                        onClick={() => {
                                          setObjectiveView({ edit: true });
                                          setObjectiveData(item);
                                        }}
                                      >
                                        <EditIcon color="warning" />
                                      </Button>
                                    </Tooltip>
                                  )}
                                </div>
                              </h5>
                              <p className="card-text fs-6">
                                <span className="fw-bolder">Description:</span>
                                <span className="mx-1">{item.description}</span>
                              </p>
                              <p className="card-text fs-6">
                                <span className="fw-bolder">
                                  Week Ending Date:
                                </span>
                                <span className="mx-1">
                                  {ConvertDate(item.weekEndingDate)}
                                </span>
                              </p>
                              <p className="card-text d-flex justify-content-between">
                                <small className="text-muted fs-6">
                                  Status:{" "}
                                  <span
                                    className={
                                      item.percentage < 100
                                        ? `text-warning`
                                        : "text-success"
                                    }
                                  >
                                    {item.status} ({item.percentage}%)
                                  </span>
                                </small>
                              </p>
                            </div>
                          </ListItem>
                        </div>
                      </div>
                    ))
                  )}
                </ul>
              </li>
            ))}
          </List>
        </div>
      </div>
      <AddMonthlyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setRows={setMonthlyObjective}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
      />
      <EditTeamWeeklyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setWeeklyObjective={setWeeklyObjective}
        Data={viewObjectiveData}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
      />
      <EditTeamMonthlyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        Data={monthlyObjData}
        setMonthlyObjective={setMonthlyObjective}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
      />
      <AddTeamWeeklyObjective
        openDialog={objectiveView}
        setOpenDialog={setObjectiveView}
        setWeeklyObjective={setWeeklyObjective}
        teamId={location.state?.data?.id}
        teamName={location.state?.data?.name}
        monthlyObjId={monthlyObjId}
        projectId={projectId}
      />
    </>
  );
};
