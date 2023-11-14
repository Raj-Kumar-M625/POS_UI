import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { ConvertToISO } from "../../../Utilities/Utils";

export function LeaveeView({ openDialog, setOpenDialog, Data }: any) {
  const handleClose = () => {
    setOpenDialog({ edit: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.edit} onClose={handleClose}>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle style={{ color: "blue", flex: "1" }}>
            Leave Details
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
        <DialogContent className="row popup d-flex justify-content-center">
          <div className="row">
            <TextField
              className={`col m-2`}
              defaultValue={Data?.employeeName?.replace(/[^A-Za-z ]/g, "")}
              label="Employee Name"
              type="text"
              fullWidth
              variant="outlined"
              disabled={true}
            />
          </div>
          <div className="row d-flex justify-content-center">
            <TextField
              disabled
              defaultValue={Data?.leaveType}
              variant="outlined"
              label="Leave Type"
              className="col m-2"
            />
            <TextField
              disabled
              defaultValue={Data?.leaveSubType}
              variant="outlined"
              label="Leave Sub-Type"
              className="col m-2"
            />
          </div>
          <div className="row">
            <TextareaAutosize
              className="col m-2"
              placeholder="Description"
              disabled
              defaultValue={Data?.leaveReason}
              style={{ height: 100 }}
            />
          </div>
          <div className="row d-flex justify-content-center">
            <TextField
              disabled
              defaultValue={ConvertToISO(Data?.createdDate)}
              variant="outlined"
              label="Applied Date"
              className="col m-2"
            />
            <TextField
              disabled
              defaultValue={Data?.leaveStatus}
              variant="outlined"
              label="Status"
              className="col m-2"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            size="medium"
            variant="contained"
            color="success"
            onClick={handleClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
