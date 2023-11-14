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

const onObjective = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  async function getRoadmap() {
    const objective = await Get(
      `app/Project/GetProjectObjective?ProjectId=${location.state?.projectId}`
    );
    return { objective };
  }
  const { data }: any = useQuery("ProjectObjective", getRoadmap);

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
        sx={{ mt: 25, ml: 153 }}
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
            Project Objective List{" "}
            <span style={{ color: "black", fontSize: "20px" }}>
              [{data?.objective?.data?.length}]
            </span>
          </Typography>
          {data &&
          Array.isArray(data.objective?.data) &&
          data.objective.data.length > 0 ? (
            data.objective.data.map((e: any) => (
              <ListItem sx={{ color: "#db291d" }} key={e.description}>
                <ArrowRightAltIcon />
                {e.description}
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ color: "#db291d" }}>No Objectives</ListItem>
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
                  color="primary"
                  sx={{
                    width: "197px",
                    borderRadius: "15px",
                    height: 47,
                    fontSize: "18px",
                    mt: 0.1,
                  }}
                  onClick={handleClick("left")}
                >
                  Objectives
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
export default onObjective;
