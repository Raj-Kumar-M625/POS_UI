import {
  Breadcrumbs,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  List,
  Typography,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Get, Post } from "../../../Services/Axios";
import React from "react";
import { EmployeeProject } from "../../../Models/Employee/EmployeeProject";
import BackDrop from "../../../CommonComponents/BackDrop";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { ADMIN } from "../../../Constants/Roles";
import Swal from "sweetalert2";
import { AlertOption } from "../../../Models/Common/AlertOptions";

function not(a: readonly EmployeeProject[], b: readonly EmployeeProject[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(
  a: readonly EmployeeProject[],
  b: readonly EmployeeProject[]
) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly EmployeeProject[], b: readonly EmployeeProject[]) {
  return [...a, ...not(b, a)];
}

export const AssignEmployee = () => {
  const location = useLocation();
  const [left, setLeft] = React.useState<EmployeeProject[]>([]);
  const [right, setRight] = React.useState<EmployeeProject[]>([]);
  const [filter, setFilter] = React.useState<EmployeeProject[]>([]);
  const [checked, setChecked] = React.useState<EmployeeProject[]>([]);
  const [save, setSave] = React.useState<boolean>(false);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const [loading, setLoading] = React.useState(false);

  async function fetchData() {
    setLoading(true);
    const employees: any = await Get<Promise<any>>(
      "app/Employee/GetEmployeeList"
    );

    const employeeProject: any = await Get<Promise<any>>(
      `app/Employee/GetEmployeeProject?projectId=${location.state.projectId}`
    );

    let left: EmployeeProject[] = [];
    let right: EmployeeProject[] = [];
    employees?.data?.map((e: any) => {
      let condition = employeeProject?.data?.find(
        (x: any) => x.employeeId === e.id
      );
      if (condition) {
        right.push(e);
      } else {
        left.push(e);
      }
    });
    setFilter(left || []);
    setLeft(left || []);
    setRight(right || []);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  async function Save() {
    setSave(true);
    let employeeProject: EmployeeProject[] = [];
    right.map((e: any) => {
      employeeProject.push({
        ProjectId: location.state.projectId,
        EmployeeId: e.id,
        CreatedBy: ADMIN,
        UpdatedBy: ADMIN,
      });
    });
    const { error }: any = await Post(
      "app/Project/AssignEmployeeProject",
      employeeProject
    );

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
    setSave(false);
  }

  const handleToggle = (value: EmployeeProject) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const stringOfChecked = (items: readonly EmployeeProject[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly EmployeeProject[]) => () => {
    if (stringOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setFilter(not(left, leftChecked));
    setLeft(not(left, leftChecked));
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
      (e: any) => e.user?.name?.toLowerCase().search(key?.toLowerCase()) >= 0
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
              onChange={(e) => {
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
        {items.map((value: any) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem
              key={value.user?.name}
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
              <ListItemText id={labelId} primary={`${value.user?.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <div>
      {" "}
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Project">
          <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Assign Employee</Typography>
      </Breadcrumbs>
      <Typography align="center" className="fw-bolder fs-3">
        Project Name: {location.state?.projectName}
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
    </div>
  );
};
