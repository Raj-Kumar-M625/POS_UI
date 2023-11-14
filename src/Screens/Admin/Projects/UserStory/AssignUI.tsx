import {
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Get, Post } from "../../../../Services/Axios";
import { UserInterFace } from "../../../../Models/Project/UserInterface";
import React from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { ADMIN } from "../../../../Constants/Roles";
import Swal from "sweetalert2";
import BackDrop from "../../../../CommonComponents/BackDrop";
import { AlertOption } from "../../../../Models/Common/AlertOptions";

function not(a: readonly UserInterFace[], b: readonly UserInterFace[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(
  a: readonly UserInterFace[],
  b: readonly UserInterFace[]
) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly UserInterFace[], b: readonly UserInterFace[]) {
  return [...a, ...not(b, a)];
}

export const AssignUI = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<UserInterFace[]>([]);
  const [left, setLeft] = React.useState<UserInterFace[]>([]);
  const [right, setRight] = React.useState<UserInterFace[]>([]);
  const [filter, setFilter] = React.useState<UserInterFace[]>([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  async function fetchUserInterface() {
    setLoading(true);
    const userInterface: any = await Get<Promise<any>>(
      `app/Project/GetUserInterfacelist?projectId=${location.state.projectId}`
    );
    const userStoryUi: any = await Get<Promise<any>>(
      `app/Project/GetUserStoryUIList?userStoryId=${location.state.UserStoryId}`
    );

    let left: UserInterFace[] = [];
    let right: UserInterFace[] = [];

    userInterface?.data?.map((e: any) => {
      let condition = userStoryUi?.data?.find((x: any) => x.uIid === e.id);
      if (condition) {
        right.push(e);
      } else {
        left.push(e);
      }
    });

    setLeft(left || []);
    setFilter(left || []);
    setRight(right || []);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchUserInterface();
  }, []);

  async function SaveUserStoryUI() {
    let userInterface: UserInterFace[] = [];
    right.map((UI: any) => {
      userInterface.push({
        UIId: UI.id,
        UserStoryId: location.state.UserStoryId,
        UserInterfaceName: UI.name,
        CreatedBy: ADMIN,
        UpdatedBy: ADMIN,
      });
    });
    const { error }: any = await Post(
      "app/Project/AddUserStoryUI",
      userInterface
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
        text: "UI Assigned Successfully!",
        icon: "success",
      };
    }
    Swal.fire({
      ...option,
      showConfirmButton: true,
    });
  }

  const handleToggle = (value: UserInterFace) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const stringOfChecked = (items: readonly UserInterFace[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly UserInterFace[]) => () => {
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
      (e: any) => e.name?.toLowerCase().search(key?.toLowerCase()) >= 0
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
        {title !== "User Interfaces" ? (
          <div>
            <Button
              variant="contained"
              className="m-2"
              disabled={items.length === 0}
              onClick={SaveUserStoryUI}
            >
              Save
            </Button>
          </div>
        ) : (
          <div>
            <TextField
              variant="outlined"
              label="Search"
              className="m-2"
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
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <div>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Project">
          <Typography sx={{ fontWeight: "bold" }}>Project</Typography>
        </Link>
        <Link to="/Admin/UserStory" state={location.state}>
          <Typography sx={{ fontWeight: "bold" }}>User Storys</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Assign UI</Typography>
      </Breadcrumbs>
      <div className="d-flex justify-content-center">
        <Typography color="text.primary" className="mx-3 fs-4 ">
          Project Name: <b className="fw-bold">{location.state?.projectName}</b>
        </Typography>
        <Typography color="text.primary" className="mx-3 fs-4">
          User Story Name:{" "}
          <b className="fw-bold">{location.state?.UserStoryName}</b>
        </Typography>
      </div>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className="container m-3 mx-auto d-flex flex-column"
      >
        <Grid item>{customList("Assigned User Interfaces", right)}</Grid>
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
        <Grid item>{customList("User Interfaces", left)}</Grid>
      </Grid>
      <BackDrop open={loading} />
    </div>
  );
};
