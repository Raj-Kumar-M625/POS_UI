import { useState } from "react";
import { Button, ListItem } from "@mui/material";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import "reactflow/dist/style.css";
import { Get } from "../../../../Services/Axios";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Handle, Position } from "reactflow";

const onTasks = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  async function getRoadmap() {
    const tasks = await Get(
      `app/EmployeeTask/GetProjectTasklist?Id=${location.state?.projectId}`
    );
    return { tasks };
  }
  const { data }: any = useQuery("ProjectTasks", getRoadmap);

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  return (
    <Box>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
        sx={{ mt: 55, ml: 2 }}
      >
        <Paper
          style={{
            backgroundColor: "#d6ccc5",
            width: 270,
            maxHeight: "290px",
            overflowY: "auto",
          }}
        >
          <Typography
            sx={{ fontFamily: "cursive", fontSize: "25px", color: "blue" }}
          >
            Task List{" "}
            <span style={{ color: "black", fontSize: "20px" }}>
              [{data?.tasks?.data?.length}]
            </span>
          </Typography>
          {data &&
          Array.isArray(data.tasks?.data) &&
          data.tasks.data.length > 0 ? (
            data.tasks.data.map((e: any, index: number) => (
              <ListItem sx={{ color: "#db291d" }} key={index}>
                <ArrowRightAltIcon />
                {e.description}
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ color: "#db291d" }}>No Task</ListItem>
          )}
        </Paper>
      </Popper>
      <Grid container>
        <div className="text-updater-node">
          <Handle type="target" position={Position.Top} />
          <div>
            <Grid container>
              <Grid>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: "198px",
                    borderRadius: "15px",
                    height: 47,
                    fontSize: "18px",
                    mt: 0.1,
                  }}
                  onClick={handleClick("left")}
                >
                  TASKS
                </Button>
              </Grid>
            </Grid>
          </div>
          <Handle type="source" position={Position.Bottom} id="a" />
          <Handle type="source" position={Position.Bottom} id="b" />
        </div>
      </Grid>
    </Box>
  );
};
export default onTasks;
