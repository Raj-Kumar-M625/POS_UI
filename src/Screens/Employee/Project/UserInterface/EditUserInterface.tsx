import {
  Alert,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Get, Post } from "../../../../Services/Axios";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../../Models/Common/AlertOptions";
const formField = [
  "Name",
  "Description",
  "StartDate",
  "EndDate",
  "Status",
  "Percentage",
  "Complexity",
  "CreatedBy",
  "UpdatedBy",
  "ProjectId",
  "id",
];

export const EditUserInterface = ({
  openDialog,
  setOpenDialog,
  projectId,
  Data,
  setReload,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  const onSubmitHandler = async (data: any) => {
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    setSave(true);
    const { error }: any = await Post("app/Project/UpdateUserInterface", data);
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
        text: "User Interface Updated Successfully!",
        icon: "success",
      };
    }
    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let userStoryList = Get(
        `app/Project/GetUserInterfaceList?projectId=${projectId}`
      );
      userStoryList.then(() => {
        setReload((prev: boolean) => !prev);
      });
    });
    handleClose();
  };

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

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
      <Dialog open={openDialog?.edit}>
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
              Edit User Interface
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
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row">
              <TextField
                required
                defaultValue={Data?.name}
                className="col m-2"
                {...register("Name")}
                label="User Interface Name"
                type="text"
                variant="outlined"
              />
              <TextField
                required
                className="col m-2"
                defaultValue={Data?.description}
                {...register("Description")}
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
              />
            </div>

            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="Complexity">Complexity</InputLabel>
                <Select
                  required
                  labelId="Complexity"
                  className="col m-2"
                  defaultValue={Data?.complexity}
                  margin="dense"
                  id="Complexity"
                  label="Complexity"
                  {...register("Complexity")}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                className="col m-2"
                defaultValue={Data?.percentage}
                {...register("Percentage")}
                margin="dense"
                label="Percentage"
                type="type"
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
                  defaultValue={Data?.startDate?.slice(0, 10)}
                  margin="dense"
                  {...register("StartDate")}
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
                  defaultValue={Data?.endDate?.slice(0, 10)}
                  margin="dense"
                  {...register("EndDate")}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>

              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("ProjectId")} value={projectId} hidden />
              <input {...register("id")} value={Data?.id} hidden />
            </div>
            <div className="row col-md-6">
              <FormControl fullWidth className="col-md-4 m-2">
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  labelId="Status"
                  required
                  defaultValue={Data?.status}
                  margin="dense"
                  id="Status"
                  label="Status"
                  {...register("Status")}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Progress">In progress</MenuItem>
                  <MenuItem value="Completed">Completed </MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </div>
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
              size="medium"
              variant="contained"
              color="success"
              disabled={save}
              type="submit"
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
