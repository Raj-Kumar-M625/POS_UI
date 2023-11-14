import {
  Alert,
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogContent,
  InputLabel,
  DialogActions,
  TextareaAutosize,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Post } from "../../../Services/Axios";
import Swal from "sweetalert2";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
const formField = ["HolidayName", "StartDate", "EndDate", "id"];

export const EditCalendar = ({
  openDialog,
  setOpenDialog,
  setRefetch,
  Data,
  setReload
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
  const [holidayApplicable, setholidayApplicable] = useState<boolean>(false);
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
    debugger;
    setSave(true);
    
    data.HolidayApplicable = data.HolidayApplicable == "true" ? true : false;
    if (data.HolidayName.length == 0) data.HolidayName = null;
    await Post("/app/EmployeeLeave/UpdateDay", data);
    Swal.fire({
      title: "Success",
      text: "Holiday Added Successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setRefetch((prev: boolean) => !prev);
      setReload((prev: boolean) => !prev);
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setSave(false);
    setOpenDialog({ edit: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.edit} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle style={{ color: "blue", flex: "1" }}>
              Edit Holiday
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
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row col-md-8">
              <InputLabel id="Team-Name">Date</InputLabel>
              <TextField
                required
                className="col m-2"
                defaultValue={Data?.date?.slice(0, 10)}
                //   {...register("EndDate")}
                type="date"
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <TextareaAutosize
                required={holidayApplicable}
                defaultValue={Data?.holidayName}
                className="col m-2"
                {...register("HolidayName")}
                placeholder="Holiday Name"
                style={{ height: 95 }}
              />
            </div>
            <div className="row col-md-8">
              <FormControl>
                <InputLabel id="Team-Name">Holiday Applicable</InputLabel>
                <Select
                  label="Holiday Applicable"
                  className="col m-2"
                  defaultValue={Data?.holidayApplicable}
                  required
                  {...register("HolidayApplicable", {
                    onChange: (event: any) => {
                      const newValue = event.target.value === "true";
                      setholidayApplicable(newValue);
                    },
                  })}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">
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
          <input {...register("CreatedBy")} value="user" hidden />
          <input {...register("UpdatedBy")} value="user" hidden />
          <input {...register("id")} value={Data?.id} hidden />
        </form>
      </Dialog>
    </div>
  );
};
