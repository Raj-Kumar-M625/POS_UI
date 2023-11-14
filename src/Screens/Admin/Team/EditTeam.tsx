import {
  Alert,
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogContent,
  InputLabel,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Post } from "../../../Services/Axios";
import Swal from "sweetalert2";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../Models/Common/AlertOptions";
const formField = ["Name", "StartDate", "EndDate"];

export const EditTeam = ({
  openDialog,
  setOpenDialog,
  setReload,
  Data,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
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
    setSave(true);
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    const { error }: any = await Post("app/Team/Updateteam", data);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Updating!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Team Updated Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
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
              Edit Team{" "}
              <span style={{ color: "blue" }}>{" - " + Data?.name}</span>
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
              <TextField
                required
                defaultValue={Data?.name}
                className="col m-2"
                {...register("Name")}
                label="Name"
                type="text"
                variant="outlined"
                // inputProps={{
                //   maxLength: 250,
                //   onInput: (event) => {
                //     const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                //     const newValue = input.value.replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
                //     if (newValue !== input.value) {
                //       input.value = newValue;
                //     }
                //   },
                // }}
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="Team-Name">Start Date</InputLabel>
              <TextField
                required
                defaultValue={Data?.startDate?.slice(0, 10)}
                className="col m-2"
                {...register("StartDate")}
                type="date"
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="Team-Name">End Date</InputLabel>
              <TextField
                required
                className="col m-2"
                defaultValue={Data?.endDate?.slice(0, 10)}
                {...register("EndDate")}
                type="date"
                variant="outlined"
              />
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
