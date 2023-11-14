import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { Breadcrumbs, TextField, Typography } from "@mui/material";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Get, Post } from "../../../Services/Axios";
import {
  EmplSkillSet,
  EmployeeSkillSet,
} from "../../../Models/Employee/EmployeeSkillSet";
import Swal from "sweetalert2";
import { ADMIN } from "../../../Constants/Roles";
import BackDrop from "../../../CommonComponents/BackDrop";
import { AlertOption } from "../../../Models/Common/AlertOptions";
function not(a: readonly EmployeeSkillSet[], b: readonly EmployeeSkillSet[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(
  a: readonly EmployeeSkillSet[],
  b: readonly EmployeeSkillSet[]
) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly EmployeeSkillSet[], b: readonly EmployeeSkillSet[]) {
  return [...a, ...not(b, a)];
}

export default function AssignSkill() {
  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState<EmployeeSkillSet[]>([]);
  const [left, setLeft] = React.useState<EmployeeSkillSet[]>([]);
  const [right, setRight] = React.useState<EmployeeSkillSet[]>([]);
  const [filter, setFilter] = React.useState<EmployeeSkillSet[]>([]);
  const [save, setSave] = React.useState<boolean>(false);
  const location = useLocation();
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  if (!location.state) {
    return <Navigate to="/Admin/EmployeeList" />;
  }

  async function fetchSkills() {
    setLoading(true);
    const skillList: any = await Get("app/Skillset/GetSkillsetList");
    const empSkillList: any = await Get(
      `app/Employee/GetEmployeeSkillById?employeeId=${location.state?.data?.id}`
    );

    let empSkill: EmployeeSkillSet[] = [];
    for (let i = 0; i < empSkillList.data?.length; i++) {
      let skillSet: EmployeeSkillSet = {
        Category: skillList.data[i]?.category,
        SkillSetId: skillList.data[i]?.id,
        EmployeeId: location.state?.data?.id,
      };
      empSkill.push(skillSet);
    }
    setRight(empSkill);

    let skill: EmployeeSkillSet[] = [];
    for (let i = 0; i < skillList.data?.length; i++) {
      let condition = await empSkill.find(
        (x) => x.SkillSetId == skillList.data[i].id
      );

      if (!condition) {
        let skillSet: EmployeeSkillSet = {
          Category: skillList.data[i].category,
          SkillSetId: skillList.data[i].id,
          EmployeeId: location.state?.data?.id,
        };
        skill.push(skillSet);
      }
    }
    setLeft(skill);
    setFilter(skill || []);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchSkills();
  }, []);

  async function SaveSkill() {
    let temp: EmplSkillSet[] = [];
    right.map((skill) => {
      temp.push({
        SkillSetId: skill.SkillSetId,
        EmployeeId: skill.EmployeeId,
        CreatedBy: ADMIN,
        UpdatedBy: ADMIN,
      });
    });
    setSave(true);
    const { error }: any = await Post("app/Employee/AssignSkill", temp);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Skill Not Assigned!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Skill Assigned Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      showConfirmButton: true,
    });
    setSave(false);
  }

  const handleToggle = (value: EmployeeSkillSet) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const stringOfChecked = (items: readonly EmployeeSkillSet[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly EmployeeSkillSet[]) => () => {
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
      (e: any) => e.Category?.toLowerCase().search(key?.toLowerCase()) >= 0
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
        {title !== "Skills" ? (
          <div>
            <Button
              variant="contained"
              className="m-2"
              disabled={items.length === 0 || save}
              onClick={SaveSkill}
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
        {items.map((value: any) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem key={value} role="listitem" onClick={handleToggle(value)}>
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
              <ListItemText id={labelId} primary={`${value.Category}`} />
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
        <Link color="inherit" to="/Admin/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Employee</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Assign Skill</Typography>
      </Breadcrumbs>
      <Typography align="center" className="fw-bolder fs-3">
        Employee Name: {location.state?.data?.name}
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className="container m-3 mx-auto d-flex flex-column"
      >
        <Grid item>{customList("Assigned Skills", right)}</Grid>
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
        <Grid item>{customList("Skills", left)}</Grid>
      </Grid>
      <BackDrop open={loading} />
    </>
  );
}
