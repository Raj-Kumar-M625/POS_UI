import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useQuery } from "react-query";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import "reactflow/dist/style.css";
import { Get } from "../../../../Services/Axios";
import Box from "@mui/material/Box";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Handle, Position } from "reactflow";

const onUserInterface = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  async function getRoadmap() {
    const userinterfacelist = await Get(
      `app/Project/GetUserInterfaceList?projectId=${location.state?.projectId}`
    );
    return { userinterfacelist };
  }
  const { data }: any = useQuery("ProjectUserInterface", getRoadmap);

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
        sx={{ mt: 50, ml: 66 }}
      >
        <Paper
          style={{
            backgroundColor: "#d6ccc5",
            width: 280,
            maxHeight: "290px",
            overflowY: "auto",
          }}
        >
          <Typography
            sx={{ fontFamily: "cursive", fontSize: "20px", color: "blue" }}
          >
            User Interface List{" "}
            <span style={{ color: "black", fontSize: "20px" }}>
              [{data?.userinterfacelist?.data?.length}]
            </span>
          </Typography>
          {data &&
          Array.isArray(data.userinterfacelist?.data) &&
          data.userinterfacelist.data.length > 0 ? (
            data.userinterfacelist.data.map((e: any) => (
              <Typography sx={{ color: "#db291d" }} key={e.name}>
                <ArrowRightAltIcon />
                {e.name}
              </Typography>
            ))
          ) : (
            <Typography sx={{ color: "#db291d" }}>
              No UserInterfaceList
            </Typography>
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
                  User Interface
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
export default onUserInterface;
