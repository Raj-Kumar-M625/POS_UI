import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Post } from "../../../Services/Axios";
import Swal from "sweetalert2";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { ConvertToISO } from "../../../Utilities/Utils";
import { useState } from "react";
import { AlertOption } from "../../../Models/Common/AlertOptions";

const formField = ["date", "EstTime", "Description"];

export const AddDailyTask = ({ openDialog, setOpenDialog, Data }: any) => {
  const { handleSubmit, register, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  async function onSubmitHandler(data: any) {
    const DayPlan: any = {
      employeeId: sessionUser.employeeId,
      taskId: Data?.id,
      employeeTaskId: Data?.employeeTaskId,
      projectObjectiveId: 1,
      projectId: Data?.projectId,
      name: Data?.name,
      employeeName: "",
      projectName: "",
      comment: "",
      status: "In-Progress",
      description: data.Description,
      estTime: Number(data.EstTime),
      weekEndingDate: undefined,
      priority: "high",
      workedOn: data.date,
    };
    setSave(true);
    const { error }: any = await Post(
      "/app/EmployeeDailyTask/AddEmployeeDayPlan",
      DayPlan
    );

    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error Occured!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Daily task Added!",
        icon: "success",
      };
    }

    handleClose();
    reset();
    Swal.fire({
      ...option,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/Employee/WhatsappTaskList";
      }
    });
  }

  function handleClose() {
    setOpenDialog({ daily: false });
    reset();
    setSave(false);
  }

  return (
    <>
      <Dialog open={openDialog?.daily} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle>Add Daily Task</DialogTitle>
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
                className="col m-2"
                {...register("date")}
                label="Date"
                fullWidth
                defaultValue={ConvertToISO(new Date())}
                type="date"
                variant="outlined"
              />
            </div>

            <div className="row">
              <TextField
                required
                className="col m-2"
                {...register("EstTime")}
                label="Estimation Time"
                type="text"
                fullWidth
                variant="outlined"
              />
            </div>

            <div className="row">
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("Description")}
                label="Task Description"
                fullWidth
                type="text"
                variant="outlined"
              />
            </div>
            <input
              type="text"
              hidden
              {...register("EmployeeId")}
              value={sessionUser.employeeId}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              size="medium"
              variant="contained"
              color="error"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={save}
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
