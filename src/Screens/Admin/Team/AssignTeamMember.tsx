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
import { Employee } from "../../../Models/Employee/Employee";
import Grid from "@mui/material/Grid";
import React, { useEffect } from "react";
import { Get, Post } from "../../../Services/Axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { ADMIN } from "../../../Constants/Roles";
import { TeamEmployee } from "../../../Models/Employee/TeamEmployee";
import BackDrop from "../../../CommonComponents/BackDrop";
import { AlertOption } from "../../../Models/Common/AlertOptions";

function not(a: readonly Employee[], b: readonly Employee[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly Employee[], b: readonly Employee[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly Employee[], b: readonly Employee[]) {
  return [...a, ...not(b, a)];
}

export const AssignTeamMember = () => {
  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState<Employee[]>([]);
  const [left, setLeft] = React.useState<Employee[]>([]);
  const [right, setRight] = React.useState<Employee[]>([]);
  const [filter, setFilter] = React.useState<Employee[]>([]);
  const location = useLocation();
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  if (!location.state) {
    return <Navigate to="/Admin/EmployeeList" />;
  }

  async function fetchEmployees() {
    setLoading(true);
    const empList: any = await Get<Promise<any>>(
      "app/Employee/GetEmployeeList"
    );
    const teamEmpList: any = await Get(
      `app/Team/GetTeamEmployeelist?teamId=${location.state?.data?.id}`
    );

    let left: Array<Employee> = [];
    let right: Array<Employee> = [];
    for (let i = 0; i < empList.data?.length; i++) {
      let temp = teamEmpList.data?.find(
        (e: any) => e.employeeId == empList.data[i].id
      );

      let employee: Employee = {
        userId: empList.data[i].id,
        name: empList.data[i].user?.name,
      };
      if (temp) {
        right.push(employee);
      } else {
        left.push(employee);
      }
    }
    setFilter(left || []);
    setRight(right);
    setLeft(left);
    setLoading(false);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function SaveSkill() {
    let temp: TeamEmployee[] = [];
    right.map((emp: any) => {
      temp.push({
        TeamId: location.state?.data?.id,
        EmployeeId: emp.UserId,
        CreatedBy: ADMIN,
        UpdatedBy: ADMIN,
        StartDate: new Date(),
      });
    });
    const { error }: any = await Post("app/Team/AssignEmployeeToTeam", temp);
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
        text: "Employee Assigned Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      showConfirmButton: true,
    });
  }

  const handleToggle = (value: Employee) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const stringOfChecked = (items: readonly Employee[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly Employee[]) => () => {
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
      (e: any) => e.Name?.toLowerCase().search(key?.toLowerCase()) >= 0
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
        {title !== "Employees" ? (
          <div>
            <Button
              variant="contained"
              className="m-2"
              disabled={items.length === 0}
              onClick={SaveSkill}
            >
              Save
            </Button>
          </div>
        ) : (
          <div>
            <TextField
              variant="outlined"
              label="Search"
              className="m-3"
              onChange={(event: any) => {
                handleSearch(event.target.value);
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
        {items.map((value: any) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem
              key={value.Name}
              role="listitem"
              onClick={handleToggle(value)}
            >
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
              <ListItemText id={labelId} primary={`${value.Name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Team">
          <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
            Teams
          </Typography>
        </Link>
        <Link
          to="/Admin/TeamQuadrant"
          state={{
            data: {
              id: location.state?.data?.id,
              name: location.state?.data?.name,
            },
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#807c7c" }}>
            Team Quadrant
          </Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Assign Team Member</Typography>
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
        <Grid item>{customList("Assigned Employees", right)}</Grid>

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
        <Grid item>{customList("Employees", left)}</Grid>
      </Grid>
      <BackDrop open={loading} />
    </>
  );
};
