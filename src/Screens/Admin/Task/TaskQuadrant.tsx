import {
  Breadcrumbs,
  ListSubheader,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import CircleIcon from "@mui/icons-material/Circle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useRef, useState } from "react";
import BackDrop from "../../../CommonComponents/BackDrop";
import {
  ConvertToISO,
  ReduceFiveDays,
  WeekEndingDate,
} from "../../../Utilities/Utils";
import Swal from "sweetalert2";
import { useContextProvider } from "../../../CommonComponents/Context";

function ActualHour(total: any, num: any): number {
  return total + num.actualHour;
}

function EstHour(total: any, num: any): number {
  return total + num.estHour;
}

export const TaskQuadrant = () => {
  const location: any = useLocation();
  const weekend = WeekEndingDate();
  const [weekendingDate, setweekendingDate] = useState<string | null>(null);
  const [teamEmployees, setteamEmployee] = useState([]);
  const [teamProject, setTeamProject] = useState([]);
  const [projectId, setProjectId] = useState<number>(0);
  const [hour, setHour] = useState<number>(40);
  const [date, setDate] = useState<string | null>(null);
  const dateRef = useRef<any>("dd-yy-mmmm");
  const [minDate, setMinDate] = useState<string>(ReduceFiveDays(weekend));
  const [maxDate, setMaxDate] = useState<string>(ConvertToISO(weekend));
  const { role } = useContextProvider();

  async function fetchData() {
    const teamEmpoyee: any = await Get(
      `app/Employee/GetEmployeeTask?teamId=${
        location.state?.data?.teamId
      }&weekend=${weekendingDate || ""}&ProjectId=${projectId}&date=${
        date || ""
      }`
    );

    const teamProjects: any = await Get(
      `app/Team/GetProjectList?teamId=${location.state?.data?.teamId}`
    );
    setTeamProject(teamProjects.data || []);
    var employeeId = new Set<number>();
    var teamEmployeeList: any = [];

    teamEmpoyee?.data?.forEach((e: any) => {
      employeeId.add(e.employeeId);
    });

    employeeId.forEach((e: number) => {
      let employee = teamEmpoyee?.data?.filter((x: any) => x.employeeId === e);
      teamEmployeeList.push({
        employeeName: employee[0]?.employeeName,
        ActualHour: employee.reduce(ActualHour, 0),
        EstHour: employee.reduce(EstHour, 0),
        id: e,
      });
    });
    setteamEmployee(teamEmployeeList);
    return { teamEmpoyee };
  }
  const { data, refetch, isFetching }: any = useQuery("fetchData", fetchData);
  let temp = data?.teamEmpoyee?.data?.reduce(EstHour, 0);
  let estHour = data?.teamEmpoyee?.data?.reduce(EstHour, 0);
  let ActHour = data?.teamEmpoyee?.data?.reduce(ActualHour, 0);

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        {location.state?.data?.teamRoute ? (
          <Link color="inherit" to={`/${role}/Team`}>
            <Typography sx={{ fontWeight: "bold" }}>Teams</Typography>
          </Link>
        ) : (
          <Link color="inherit" to={`/${role}/Task`}>
            <Typography sx={{ fontWeight: "bold" }}>Tasks</Typography>
          </Link>
        )}
        <Typography sx={{ fontWeight: "bold" }}>
          Team Loading & availability
        </Typography>
      </Breadcrumbs>
      <Grid sx={{ textAlign: "center" }}>
        <Typography className="fw-bolder fs-3">
          Team Name : {location.state?.data.teamName}
        </Typography>
      </Grid>
      <div className="dateFilter mx-auto row" style={{ width: "30rem" }}>
        <FormControl fullWidth className="col mx-2 mb-2">
          {/* <InputLabel id="Team-Name">Week Ending Date</InputLabel> */}
          <TextField
            id="Team-Name"
            type="date"
            label="Week Ending Date"
            required
            defaultValue={ConvertToISO(WeekEndingDate())}
            onChange={async (e: any) => {
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
              setMinDate(ReduceFiveDays(e.target.value));
              setMaxDate(ConvertToISO(e.target.value));
              await setweekendingDate(e.target.value);
              refetch();
            }}
          />
        </FormControl>
        <FormControl fullWidth className="col mx-2 mb-2">
          <InputLabel id="Project">Project</InputLabel>
          <Select
            labelId="Project"
            id="Project-1"
            label="Project"
            defaultValue={0}
            onChange={async (event: any) => {
              await setProjectId(event.target.value);
              refetch();
            }}
          >
            <MenuItem value={0}>All Projects</MenuItem>
            {teamProject.map((e: any) => {
              return (
                <MenuItem value={e.id} key={e.id}>
                  {e.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth className="col mx-2 mb-2">
          <input
            id="Team-Name"
            type="date"
            className="form-control py-3"
            ref={dateRef}
            onFocus={() => {
              dateRef.current.min = minDate;
              dateRef.current.max = maxDate;
            }}
            onBlur={() => {
              dateRef.current.min = "";
              dateRef.current.max = "";
            }}
            required
            onChange={async (e: any) => {
              if (e.target.value.length > 0) {
                setHour(8);
              } else {
                setHour(40);
              }
              await setDate(e.target.value);
              refetch();
            }}
          />
        </FormControl>
      </div>
      <div className="container mb-3">
        <div className="grid1">
          <div className="item1 m-2">
            <List
              sx={{
                width: "120vw",
                maxWidth: 400,
                maxHeight: "60vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${teamEmployees.length > 9 ? "scroll" : "hidden"}`,
                overflowX: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <HourglassFullIcon className="mx-2" /> Available Hours ({" "}
                  {teamEmployees.length * hour} )
                </ListSubheader>
              }
            >
              {teamEmployees.map((e: any, index: number) => (
                <>
                  <ListItemButton key={index}>
                    <ListItemIcon>
                      <CircleIcon sx={{ fontSize: 10 }} />
                    </ListItemIcon>
                    <ListItemText primary={`${e.employeeName}`} />
                    <Typography>{hour}</Typography>
                  </ListItemButton>
                  <Divider />
                </>
              )) || (
                <>
                  <ListItemButton key={1}>
                    <ListItemIcon>
                      <ErrorOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="No data!" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
            </List>
          </div>
          <div className="item1 m-2">
            <List
              sx={{
                width: "120vw",
                maxWidth: 400,
                maxHeight: "60vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${teamEmployees.length > 9 ? "scroll" : "hidden"}`,
                overflowX: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <HourglassTopIcon className="mx-2" />
                  Assigned Hours ( {ActHour} / {estHour})
                </ListSubheader>
              }
            >
              {teamEmployees.map((e: any) => (
                <>
                  <Link
                    to={`/${role}/EmployeeOverView`}
                    state={{
                      ...location.state.data,
                      employeeId: e.id,
                      employeeName: e.employeeName,
                      route: "teamTaskQuadrant",
                      weekendingDate,
                    }}
                  >
                    <ListItemButton key={0}>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.employeeName}`}
                        key={e.employeeName}
                      />
                      <Typography className="text-dark">
                        {" "}
                        {e.ActualHour} / {e.EstHour}
                      </Typography>
                    </ListItemButton>
                    <Divider />
                  </Link>
                </>
              )) || (
                <>
                  <ListItemButton key={1}>
                    <ListItemIcon>
                      <ErrorOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="No data!" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
            </List>
          </div>
          <div className="item1 m-2">
            <List
              sx={{
                width: "120vw",
                maxWidth: 400,
                maxHeight: "60vh",
                position: "relative",
                bgcolor: "background.paper",
                overflowY: `${teamEmployees.length > 9 ? "scroll" : "hidden"}`,
                overflowX: "hidden",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <HourglassEmptyIcon className="mx-2" />
                  UnAssigned Hours ({" "}
                  {teamEmployees.length * hour >= temp
                    ? parseFloat(
                        `${teamEmployees.length * hour - temp}`
                      ).toFixed(2)
                    : parseFloat("0").toFixed(2)}
                  )
                </ListSubheader>
              }
            >
              {teamEmployees.map((e: any) => (
                <>
                  <ListItemButton key={0}>
                    <ListItemIcon>
                      <CircleIcon sx={{ fontSize: 10 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${e.employeeName}`}
                      key={e.employeeName}
                    />
                    <Typography>
                      {" "}
                      {e.EstHour > hour
                        ? parseFloat("0").toFixed(2)
                        : parseFloat(`${hour - e.EstHour}`).toFixed(2)}
                    </Typography>
                  </ListItemButton>
                  <Divider />
                </>
              )) || (
                <>
                  <ListItemButton key={1}>
                    <ListItemIcon>
                      <ErrorOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary="No data!" />
                  </ListItemButton>
                  <Divider />
                </>
              )}
            </List>
          </div>
        </div>
      </div>
      <BackDrop open={isFetching} />
    </>
  );
};
