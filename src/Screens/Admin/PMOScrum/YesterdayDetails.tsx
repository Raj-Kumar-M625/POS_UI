import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";
import { Get } from "../../../Services/Axios";
import { EmployeeYesterdayTaskDetailsDTO } from "../../../Models/PMOScrum/PMOScrum";
import { useEffect, useState } from "react";
import BackDrop from "../../../CommonComponents/BackDrop";
import { ConvertTime, ConvertToISO } from "../../../Utilities/Utils";

const date = new Date();
const YESTERDAY_DATE = ConvertToISO(
  new Date(
    `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate() - 1}`
  )
);

export const YesterdayDetails = ({
  openDialog,
  setOpenDialog,
  employeeId,
}: any) => {
  const [yesterdayTaskDetails, setYesterdayTaskDetails] = useState<
    EmployeeYesterdayTaskDetailsDTO | undefined
  >();
  const handleClose = () => {
    setOpenDialog({ employeehistory: false });
  };

  async function GetYesterdayTaskDetails() {
    const response: any = await Get<EmployeeYesterdayTaskDetailsDTO>(
      `app/PMO/GetEmployeeYesterdayTaskDetails?selectedDate=${YESTERDAY_DATE}&employeeId=${employeeId}`
    );
    setYesterdayTaskDetails(response.data);
  }

  useEffect(() => {
    setYesterdayTaskDetails(undefined);
    GetYesterdayTaskDetails();
  }, [openDialog?.employeehistory]);

  return (
    <div className="w-50">
      <Dialog open={openDialog?.employeehistory} onClose={handleClose}>
        <form>
          <DialogTitle sx={{ color: "blue", fontWeight: "bold" }}>
            Employee History Details
          </DialogTitle>
          <DialogContent
            className="row popup d-flex justify-content-center"
            sx={{
              width: 590,
            }}
          >
            <div className="row col-md-8">
              <InputLabel id="start-date">Date</InputLabel>
              <TextField
                required
                id="start-date"
                defaultValue={YESTERDAY_DATE}
                margin="dense"
                className="read-only-input"
                type="date"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="InTime">In Time</InputLabel>
              <TextField
                required
                id="InTime"
                value={ConvertTime(yesterdayTaskDetails?.inTime ?? null, "AM")}
                margin="dense"
                className="read-only-input"
                type="text"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="OutTime">Out Time</InputLabel>
              <TextField
                required
                id="OutTime"
                value={ConvertTime(yesterdayTaskDetails?.outTime ?? null, "PM")}
                margin="dense"
                className="read-only-input"
                type="text"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="EstimatedHour">Estimated Hour</InputLabel>
              <TextField
                required
                id="EstimatedHour"
                value={yesterdayTaskDetails?.totalEstTime}
                margin="dense"
                className="read-only-input"
                type="text"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="ActualHour">Actual Hour</InputLabel>
              <TextField
                required
                id="ActualHour"
                value={yesterdayTaskDetails?.totalActTime}
                margin="dense"
                className="read-only-input"
                type="text"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </div>
            <div>
              <BackDrop open={false} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
