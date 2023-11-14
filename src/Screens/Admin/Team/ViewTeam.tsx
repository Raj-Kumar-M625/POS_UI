import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogContent,
  InputLabel,
  DialogActions,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
export const ViewTeam = ({ openDialog, setOpenDialog, Data }: any) => {
  const handleClose = () => {
    setOpenDialog({ view: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.view} onClose={handleClose}>
        <form>
        <div style={{ backgroundColor: "#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle style={{ color: 'blue', flex: '1' }}>Team</DialogTitle>
          <CancelOutlinedIcon
    onClick={handleClose}
    sx={{ color: "red", fontSize: "30px", marginRight: '10px', cursor: 'pointer' }}
  />
</div>
          <DialogContent className="row popup d-flex justify-content-center">
            <div className="row col-md-8">
              <TextField
                value={Data?.name}
                className="col m-2"
                label="Name"
                type="text"
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="Team-Name">Start Date</InputLabel>
              <TextField
                value={Data?.startDate?.slice(0, 10)}
                className="col m-2"
                type="date"
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="Team-Name">End Date</InputLabel>
              <TextField
                className="col m-2"
                value={Data?.endDate?.slice(0, 10)}
                type="date"
                variant="outlined"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">ok</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
