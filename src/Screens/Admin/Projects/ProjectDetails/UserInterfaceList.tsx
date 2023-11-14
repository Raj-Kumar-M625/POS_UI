import { styled } from "@mui/material/styles";
import {
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { Get } from "../../../../Services/Axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "lightgray" : "lightgray",
  justifyContent: "center",
  height: "55px",
  border: "2px solid white",
}));

const Content = styled(Paper)(() => ({
  justifyContent: "center",
  height: "55px",
  border: "1px solid white",
  color: "white",
}));

const UsList = styled(Paper)(() => ({
  height: "358px",
  border: "1px solid yellow",
  width: "310px",
  textAlign: "center",
}));

export const UserInterfacelistPD = () => {
  const location = useLocation();
  // const [UIList, setUIList] = useState<any>([]);

  useEffect(() => {
    let userInterfaceList = Get(
      `app/Project/GetUserInterfacelist?projectId=${location.state.projectId}`
    );
    userInterfaceList.then(() => {
      // setUIList(response?.data || [])
    });
  });
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link color="inherit" to="/Admin/Project">
          <Typography>
            <TaskIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Projects
          </Typography>
        </Link>
        <Link color="inherit" to="/Admin/ProjectQuadrant">
          <Typography color="slateblue">
            <Diversity3Icon sx={{ mr: 0.5 }} fontSize="inherit" />
            Project Quadrant
          </Typography>
        </Link>
        <Link color="inherit" to="/Admin/ProjectQuadrant/ProjectDetails">
          <Typography color="slateblue">User Story List</Typography>
        </Link>
        <Typography color="slateblue"></Typography>
      </Breadcrumbs>
      <Grid container>
        <Grid container sx={{ display: "flex", mt: 3 }}>
          <Grid xs={1.5} sx={{ ml: 45 }}>
            <Box>
              <Content sx={{ backgroundColor: "green" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  Completed
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "darkgreen",
                    fontSize: "25px",
                  }}
                >
                  25
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#dea407" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  In-Progress
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#dea407",
                    fontSize: "25px",
                  }}
                >
                  35
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#e0190b" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  Pending
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#078fde",
                    fontSize: "25px",
                  }}
                >
                  42
                </Typography>
              </Item>
            </Box>
          </Grid>
          <Grid xs={1.5} sx={{ ml: 2 }}>
            <Box>
              <Content sx={{ backgroundColor: "#2618ed" }}>
                <Typography sx={{ textAlign: "center", pt: 1 }}>
                  Total Task
                </Typography>
              </Content>
            </Box>
            <Box>
              <Item>
                <Typography
                  sx={{
                    textAlign: "center",
                    pt: 1,
                    color: "#2618ed",
                    fontSize: "25px",
                  }}
                >
                  30
                </Typography>
              </Item>
            </Box>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 8 }}>
          <Grid xs={4} sx={{ ml: 10 }}>
            <UsList>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "blue",
                  borderBottom: "1px solid black",
                  backgroundColor: "lightgray",
                }}
              >
                USER INERFACE LIST
              </Typography>

              <ListItem>
                <ListItemButton
                  sx={{
                    textAlign: "center",
                    color: "#0b4be0",
                    fontWeight: "bold",
                    pl: 5,
                  }}
                >
                  LOGIN SCREEN
                </ListItemButton>
                <Paper
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    width: "72px",
                    fontSize: "12px",
                    pl: 1,
                    mt: 5,
                  }}
                >
                  Completed
                </Paper>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemButton
                  sx={{
                    textAlign: "center",
                    color: "#0b4be0",
                    fontWeight: "bold",
                    pl: 5,
                  }}
                >
                  CHECK LIST
                </ListItemButton>
                <Paper
                  sx={{
                    backgroundColor: "#dea407",
                    color: "white",
                    width: "72px",
                    fontSize: "12px",
                    pl: 1,
                    mt: 5,
                  }}
                >
                  In-Progress
                </Paper>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemButton
                  sx={{
                    textAlign: "center",
                    color: "#0b4be0",
                    fontWeight: "bold",
                    pl: 5,
                  }}
                >
                  CHECK LIST
                </ListItemButton>
                <Paper
                  sx={{
                    backgroundColor: "#dea407",
                    color: "white",
                    width: "72px",
                    fontSize: "12px",
                    pl: 1,
                    mt: 5,
                  }}
                >
                  In-Progress
                </Paper>
              </ListItem>
              <Divider />
            </UsList>
          </Grid>
          <Grid xs={6}>
            <Box
              sx={{
                width: "768px",
                border: "1px solid yellow",
                height: "358px",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#dea407",
                }}
              >
                TASK LIST
              </Typography>
              <ListItem>
                <Typography></Typography>
              </ListItem>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
