import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import "reactflow/dist/style.css";
import { Get } from "../../../../Services/Axios";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Handle, Position } from "reactflow";

const onUserStory = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  async function getRoadmap() {
    const userStoryUI = await Get(
      `app/Project/GetAllUserStory?projectId=${location.state.projectId}`
    );
    return { userStoryUI };
  }

  const { data }: any = useQuery("ProjectUserStory", getRoadmap);

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
      setShowTooltip(!showTooltip);
      setAnchorEl(null);
    };

  return (
    <Box>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        data-trigger="focus"
        transition
        sx={{ mt: 55, ml: 122 }}
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
            User Story List{" "}
            <span style={{ color: "black", fontSize: "20px" }}>
              [{data?.userStoryUI?.data?.length}]
            </span>
          </Typography>
          {data &&
          Array.isArray(data.userStoryUI?.data) &&
          data.userStoryUI.data.length > 0 ? (
            data.userStoryUI.data.map((e: any, index: number) => (
              <Typography sx={{ color: "#db291d" }} key={index}>
                {index + 1 + " . "}
                {e.name}
                <Typography
                  sx={{ ml: "35px", color: "green", display: "inline-flex" }}
                >
                  AssignUserInterfaceList :{" "}
                  <Typography sx={{ color: "red" }}>
                    {" "}
                    {" [" + e.userStoryUIs.length + "]"}
                  </Typography>
                </Typography>
                {e.userStoryUIs.map((r: any, innerIndex: number) => (
                  <Typography
                    sx={{
                      fontFamily: "cursive",
                      fontSize: "15px",
                      color: "blue",
                      ml: "35px",
                    }}
                    key={innerIndex}
                  >
                    {innerIndex + 1}
                    <ArrowRightAltIcon />
                    {r.uiName}
                  </Typography>
                ))}
              </Typography>
            ))
          ) : (
            <Typography sx={{ color: "#db291d" }}>No user Story</Typography>
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
                  User Story
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
export default onUserStory;
