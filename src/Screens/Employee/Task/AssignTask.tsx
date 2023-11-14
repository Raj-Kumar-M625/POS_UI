import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TaskAssign } from "../../../Services/TaskService";
import Swal from "sweetalert2";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { ConvertToISO, WeekEndingDate } from "../../../Utilities/Utils";
import { AlertOption } from "../../../Models/Common/AlertOptions";

const formField = [
  "EmployeeId",
  "EstTime",
  "Priority",
  "StartDate",
  "EndDate",
  "Comment",
];

export const AssignTask = ({
  openDialog,
  setOpenDialog,
  selectedRow,
  setReload,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }

    const { error }: any = await TaskAssign(data, selectedRow);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Assigning!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Task Assigned Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      showConfirmButton: true,
    }).then(() => {
      setReload((prev: boolean) => !prev);
    });

    handleClose();
  };

  const handleClose = () => {
    setErrorMsg({
      message: "",
      show: false,
    });
    reset();
    setOpenDialog({ assign: false });
  };
  return (
    <div>
      <Dialog open={openDialog.assign} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle>Assign Task</DialogTitle>
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
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row">
              <TextField
                required
                className="col m-2"
                {...register("EstTime")}
                label="Estimate time"
                type="text"
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth className="col m-2">
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>

                <Select
                  labelId="priority"
                  id="priority"
                  label="Priority"
                  defaultValue=""
                  {...register("Priority")}
                  required
                >
                  <MenuItem value={"High"}>High</MenuItem>
                  <MenuItem value={"Low"}>Low</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="Estimate-start-date">
                  Estimate start date
                </InputLabel>
                <TextField
                  required
                  id="Estimate-start-date"
                  margin="dense"
                  {...register("StartDate")}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="col">
                <InputLabel id="Estimate-end-date">
                  Estimate end date
                </InputLabel>
                <TextField
                  required
                  id="Estimate-end-date"
                  margin="dense"
                  {...register("EndDate")}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row">
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("Comment")}
                label="Comment"
                fullWidth
                type="text"
                variant="outlined"
              />
              <FormControl fullWidth className="col m-2">
                <TextField
                  id="Team-Name"
                  type="date"
                  required
                  label="Week Ending Date"
                  {...register("WeekEndingDate")}
                  defaultValue={ConvertToISO(WeekEndingDate())}
                  onChange={async (e: any) => {
                    debugger;
                    var date = new Date(e.target.value);
                    var day = date.getUTCDay();

                    if (day !== 5) {
                      Swal.fire({
                        icon: "error",
                        title: "Please Select Only Friday!",
                        showConfirmButton: true,
                      });
                      e.target.value = ConvertToISO(WeekEndingDate());
                      return false;
                    }
                  }}
                />
                {/* <InputLabel id="Week-Ending-Date">Week Ending Date</InputLabel>
                <Select
                  labelId="Week-Ending-Date"
                  id="Week-Ending-Date1"
                  required
                  label="Week Ending Date"
                  {...register("WeekEndingDate")}
                >
                  {GetFridaysOfMonth().map((e: any) => {
                    return (
                      <MenuItem value={ConvertToISO(e)} key={e}>
                        {ConvertDate(e)}
                      </MenuItem>
                    );
                  })}
                </Select> */}
              </FormControl>
            </div>
            <input
              type="text"
              hidden
              {...register("EmployeeId")}
              value={sessionUser.employeeId}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error" variant="contained">
              Cancel
            </Button>
            <Button type="submit" color="success" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
