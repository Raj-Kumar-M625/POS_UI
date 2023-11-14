import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
export const ViewUserStory = ({ openDialog, setOpenDialog, Data }: any) => {
  const handleClose = () => {
    setOpenDialog({ view: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.view}>
        <form>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle style={{ color: "blue", flex: "1" }}>
              User Story
            </DialogTitle>
            <CancelOutlinedIcon
              onClick={handleClose}
              sx={{
                color: "red",
                fontSize: "30px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
          </div>
          <DialogContent className="row popup">
            <div className="row">
              <TextField
                required
                value={Data?.name}
                className="col m-2"
                label="User Story Name"
                type="text"
                variant="outlined"
              />
              <TextField
                required
                className="col m-2"
                value={Data?.description}
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
              />
            </div>

            <div className="row">
              <div className="col">
                <InputLabel id="start-date">Start date</InputLabel>
                <TextField
                  required
                  id="start-date"
                  value={Data?.startDate?.slice(0, 10)}
                  margin="dense"
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="col">
                <InputLabel id="end-date">End date</InputLabel>
                <TextField
                  required
                  id="end-date"
                  value={Data?.endDate?.slice(0, 10)}
                  margin="dense"
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row col-md-7">
              <FormControl className="col-md-10  m-2">
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  labelId="Status"
                  required
                  value={Data?.status}
                  id="Status"
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Active">In Active</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              size="medium"
              variant="contained"
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
