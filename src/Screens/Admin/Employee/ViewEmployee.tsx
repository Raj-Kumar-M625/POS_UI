import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
export const ViewEmployee = ({ viewEmployee, setviewEmployee, data }: any) => {
  const handleClose = () => {
    setviewEmployee({ view: false });
  };
  return (
    <>
      <Dialog open={viewEmployee?.view}>
        <form>
        <div style={{ backgroundColor: "#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle style={{ color: 'blue', flex: '1' }}>Employee Details</DialogTitle>
          <CancelOutlinedIcon
    onClick={handleClose}
    sx={{ color: "red", fontSize: "30px", marginRight: '10px', cursor: 'pointer' }}
  />
</div>
          <DialogContent className="row popup">
            <div className="row">
              <TextField
                className="col m-2"
                margin="dense"
                aria-readonly
                value={data.userId}
                label="User Id"
                fullWidth
                variant="outlined"
              />
              <TextField
                className="col m-2"
                margin="dense"
                id="name"
                aria-readonly
                label="Name"
                value={data.user?.name}
                variant="outlined"
              />
            </div>
            <div className="row">
              <TextField
                className="col m-2"
                margin="dense"
                aria-readonly
                id="phoneNumber"
                value={data.phoneNumber}
                label="Phone Number"
                variant="outlined"
              />
              <TextField
                className="col m-2"
                margin="dense"
                id="secondaryPhoneNumber"
                value={data.user?.secondaryPhoneNumber}
                aria-readonly
                label="Secondary Phone Number"
                variant="outlined"
                inputProps={{
                  maxLength: 250,
                  onInput: (event) => {
                    const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                    const newValue = input.value.replace(/\D/g, '');
 // Remove non-alphabetic characters
                    if (newValue !== input.value) {
                      input.value = newValue;
                    }
                  },
                }}
              />
            </div>
            <div className="row">
              <TextField
                className="col m-2"
                aria-readonly
                margin="dense"
                value={data.user?.email}
                label="Email"
                variant="outlined"
              />
              <TextField
                className="col m-2"
                margin="dense"
                id="secondaryEmail"
                aria-readonly
                value={data.user?.secondaryEmail}
                label="Secondary Email"
                variant="outlined"
              />
            </div>
            <div className="row">
              <TextField
                className="col m-2"
                aria-readonly
                margin="dense"
                value={data.category}
                label="category"
                fullWidth
                variant="outlined"
              />
              <TextField
                className="col m-2"
                margin="dense"
                aria-readonly
                value={data.department}
                label="Department"
                fullWidth
                variant="outlined"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
            variant="contained"
              onClick={() => {
                setviewEmployee({ view: false });
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
