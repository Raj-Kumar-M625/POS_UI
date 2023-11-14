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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import CircleIcon from "@mui/icons-material/Circle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useState } from "react";
import BackDrop from "../../../CommonComponents/BackDrop";

function getSum(total: any, num: any): number {
  return total + num.assignedHours;
}

export const TaskQuadrant = () => {
  const location: any = useLocation();
  const [weekendingDate, setweekendingDate] = useState<string | null>(null);

  async function fetchData() {
    const teamEmpoyee = await Get(
      `app/Employee/GetEmployeeTask?teamId=${
        location.state?.data?.employeeTask?.employee?.team?.id
      }&weekend=${weekendingDate || ""}`
    );
    return { teamEmpoyee };
  }

  const { data, refetch, isLoading }: any = useQuery("fetchData", fetchData);
  let temp = data?.teamEmpoyee?.data?.reduce(getSum, 0);
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          Home
        </Link>
        <Link color="inherit" to="/Admin/Task">
          Tasks
        </Link>
        <Typography color="text.primary">Team Task Quadrant</Typography>
      </Breadcrumbs>
      <div className="dateFilter col-md-2 mx-auto">
        <FormControl fullWidth className="col-md-8 m-2">
          <InputLabel id="Team-Name">Week Ending Date</InputLabel>
          <Select
            labelId="Team-Name"
            id="Team-Name"
            required
            defaultValue={""}
            label="Week Ending Date"
            onChange={(e: any) => {
              setweekendingDate(e.target.value);
              refetch();
            }}
          >
            {location?.state?.weekEndDate?.map((e: any) => {
              return (
                <MenuItem value={e} key={e + "1"}>
                  {e?.slice(0, 10)} (Friday)
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div className="container">
        <div className="grid1">
          <div className="item1 m-2">
            <List
              sx={{
                width: "100vw",
                maxWidth: 300,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflow: "scroll",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3 scroll"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <HourglassFullIcon className="mx-2" /> Actual Available Hours
                  ( {data?.teamEmpoyee?.data?.length * 40}hrs )
                </ListSubheader>
              }
            >
              {(data &&
                data.teamEmpoyee?.data !== "" &&
                data?.teamEmpoyee?.data?.map((e: any) => (
                  <>
                    <ListItemButton key={0}>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.employeeName}`}
                        key={e.employeeId}
                      />
                      <Typography> 40hrs</Typography>
                    </ListItemButton>
                    <Divider />
                  </>
                ))) || (
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
                width: "100vw",
                maxWidth: 300,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflow: "scroll",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3 scroll"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <HourglassTopIcon className="mx-2" />
                  Assigned Hours ( {temp}hrs )
                </ListSubheader>
              }
            >
              {(data &&
                data?.teamEmpoyee?.data !== "" &&
                data?.teamEmpoyee?.data?.map((e: any) => (
                  <>
                    <ListItemButton key={0}>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.employeeName}`}
                        key={e.employeeId}
                      />
                      <Typography> {e.assignedHours}hrs</Typography>
                    </ListItemButton>
                    <Divider />
                  </>
                ))) || (
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
                width: "100vw",
                maxWidth: 300,
                maxHeight: "30vh",
                position: "relative",
                bgcolor: "background.paper",
                overflow: "scroll",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              className="m-3 scroll"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="fw-bold"
                >
                  <HourglassEmptyIcon className="mx-2" />
                  UnAssigned Hours ({" "}
                  {data?.teamEmpoyee?.data?.length * 40 - temp}hrs )
                </ListSubheader>
              }
            >
              {(data &&
                data.teamEmpoyee.data !== "" &&
                data?.teamEmpoyee?.data?.map((e: any) => (
                  <>
                    <ListItemButton key={0}>
                      <ListItemIcon>
                        <CircleIcon sx={{ fontSize: 10 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${e.employeeName}`}
                        key={e.employeeId}
                      />
                      <Typography> {40 - e.assignedHours}hrs</Typography>
                    </ListItemButton>
                    <Divider />
                  </>
                ))) || (
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
      <BackDrop open={isLoading} />
    </>
  );
};
