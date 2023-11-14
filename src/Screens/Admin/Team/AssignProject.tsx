import {
  Breadcrumbs,
  Typography,
  Button,
  ListItemIcon,
  Checkbox,
  List,
  Divider,
  TextField,
} from "@mui/material";
import { Link, Navigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import React from "react";
import { Get, Post } from "../../../Services/Axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { ADMIN } from "../../../Constants/Roles";
import { TeamProject } from "../../../Models/Team/TeamProject";
import BackDrop from "../../../CommonComponents/BackDrop";
import { AlertOption } from "../../../Models/Common/AlertOptions";

function not(a: readonly TeamProject[], b: readonly TeamProject[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly TeamProject[], b: readonly TeamProject[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly TeamProject[], b: readonly TeamProject[]) {
  return [...a, ...not(b, a)];
}

export const AssignProject = () => {
  const [loading, setloading] = React.useState(false);
  const [checked, setChecked] = React.useState<TeamProject[]>([]);
  const [left, setLeft] = React.useState<TeamProject[]>([]);
  const [right, setRight] = React.useState<TeamProject[]>([]);
  const [filter, setFilter] = React.useState<TeamProject[]>([]);
  const location = useLocation();
  const [save, setSave] = React.useState<boolean>(false);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  if (!location.state) {
    return <Navigate to="/Admin/Team" />;
  }

  async function fetchTeamProjects() {
    setloading(true);
    const projectList: any = await Get<Promise<any>>(
      "app/Project/GetUnAssignedProjects"
    );
    const teamProjectList: any = await Get(
      `app/Team/GetTeamProjectList?teamId=${location.state?.data?.id}`
    );

    let left: TeamProject[] = [];
    let right: TeamProject[] = [];

    for (let i = 0; i < teamProjectList.data?.length; i++) {
      let teamProject: TeamProject = {
        ProjectName: teamProjectList.data[i]?.projectName,
        ProjectId: teamProjectList.data[i]?.projectId,
      };
      right.push(teamProject);
    }

    for (let i = 0; i < projectList.data?.length; i++) {
      let teamProject: TeamProject = {
        ProjectName: projectList.data[i].name,
        ProjectId: projectList.data[i].id,
      };
      left.push(teamProject);
    }
    setFilter(left || []);
    setRight(right);
    setLeft(left);
    setloading(false);
  }

  React.useEffect(() => {
    fetchTeamProjects();
  }, []);

  async function Save() {
    setSave(true);
    let temp: TeamProject[] = [];
    right.map((proj: any) => {
      temp.push({
        TeamId: location.state?.data?.id,
        ProjectId: proj.ProjectId,
        CreatedBy: ADMIN,
        UpdatedBy: ADMIN,
      });
    });

    const { error }: any = await Post("app/Team/AddTeamProject", temp);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Assigning!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Project Assigned Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      showConfirmButton: true,
    });
    setSave(false);
  }

  const handleToggle = (value: TeamProject) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const stringOfChecked = (items: readonly TeamProject[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly TeamProject[]) => () => {
    if (stringOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setFilter(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setFilter(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
  const handleSearch = (key: string) => {
    var temp = filter.filter(
      (e: any) => e.ProjectName?.toLowerCase().search(key?.toLowerCase()) >= 0
    );
    setLeft(temp);
  };

  const customList = (title: React.ReactNode, items: readonly any[]) => (
    <Card>
      <div className="d-flex justify-content-between">
        <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <>
              <Checkbox
                onClick={handleToggleAll(items)}
                checked={
                  stringOfChecked(items) === items.length && items.length !== 0
                }
                indeterminate={
                  stringOfChecked(items) !== items.length &&
                  stringOfChecked(items) !== 0
                }
                disabled={items.length === 0}
                inputProps={{
                  "aria-label": "all items selected",
                }}
              />
            </>
          }
          title={title}
          subheader={`${stringOfChecked(items)}/${items.length} selected`}
        />
        {title !== "Projects" ? (
          <div>
            <Button
              variant="contained"
              className="m-2"
              disabled={items.length === 0 || save}
              onClick={Save}
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <div>
            <TextField
              variant="outlined"
              label="Search"
              className="m-3"
              onChange={(e: any) => {
                handleSearch(e.target.value);
              }}
            />
          </div>
        )}
      </div>
      <Divider />
      <List
        sx={{
          width: 700,
          height: 200,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: any, index: number) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem key={index} role="listitem" onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.ProjectName}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Team">
          <Typography sx={{ fontWeight: "bold" }}>Teams</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
          {/* <AssignmentTurnedInIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
          Assign Project
        </Typography>
      </Breadcrumbs>
      <Typography align="center" className="fw-bolder fs-3">
        Team Name: {location.state?.data?.name}
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className="container m-3 mx-auto d-flex flex-column"
      >
        <Grid item>{customList("Assigned Projects", right)}</Grid>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              <KeyboardDoubleArrowDownIcon />
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              className="mx-2"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              <KeyboardDoubleArrowUpIcon />
            </Button>
          </Grid>
        </Grid>

        <Grid item>{customList("Projects", left)}</Grid>
      </Grid>
      <BackDrop open={loading} />
    </>
  );
};
