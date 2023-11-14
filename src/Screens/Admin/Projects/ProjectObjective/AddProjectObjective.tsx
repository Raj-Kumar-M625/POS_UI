import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextareaAutosize,
} from "@mui/material";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { Post } from "../../../../Services/Axios";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../../Models/Common/AlertOptions";

const formField = ["Description", "ProjectId", "Status", "Percentage"];

export const AddProjectObjective = ({
  openDialog,
  setOpenDialog,
  SetReload,
  ProjectId,
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
    const { error }: any = await Post("app/Project/AddProjectObjective", data);
    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Saving!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Objective Added Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      SetReload((prev: boolean) => !prev);
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setOpenDialog({ add: false });
    setErrorMsg({
      message: "",
      show: false,
    });
    setSave(false);
  };

  return (
    <div className="w-50">
      <Dialog open={openDialog?.add} onClose={handleClose}>
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
              Add Project Objective
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
          <DialogContent
            className="row popup d-flex justify-content-center"
            sx={{
              width: 590,
            }}
          >
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row col-md-8">
              <TextareaAutosize
                required
                className="col m-2 form-control"
                placeholder="Description"
                {...register("Description")}
                style={{ height: 100 }}
              />
            </div>
            <div className="row col-md-8">
              <FormControl className="col m-2">
                <InputLabel id="project-type">Status</InputLabel>
                <Select
                  labelId="Status"
                  required
                  id="Status"
                  label="Status"
                  {...register("Status")}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                </Select>
              </FormControl>
            </div>
            <input {...register("CreatedBy")} value="user" hidden />
            <input {...register("UpdatedBy")} value="user" hidden />
            <input {...register("ProjectId")} value={ProjectId} hidden />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={save}
              variant="contained"
              color="success"
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
