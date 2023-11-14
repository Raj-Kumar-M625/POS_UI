import {
    Dialog,
    DialogTitle,
    TextField,
    Button,
    DialogContent,
    InputLabel,
    DialogActions,
  } from "@mui/material";
  
  export const EmpViewTeam = ({ openDialog, setOpenDialog, Data }: any) => {
    const handleClose = () => {
      setOpenDialog({ view: false });
    };
  
    return (
      <div>
        <Dialog open={openDialog?.view} onClose={handleClose}>
          <form>
            <DialogTitle sx={{color:"blue", fontWeight:"bold"}}>Team</DialogTitle>
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
  