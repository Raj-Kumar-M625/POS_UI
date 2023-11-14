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
import { Get, Post } from "../../../../Services/Axios";
const formField = ["Description", "ProjectId", "Status", "Percentage"];

export const AddTeamObjective = ({
  openDialog,
  setOpenDialog,
  setfilterRows,
  setRows,
  teamId,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
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
    await Post("app/Team/AddTeamObjective", data);
    Swal.fire({
      title: "Success",
      text: "Objective Created Successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let objectiveList = Get(`app/Team/GetTeamObjectiveList?teamId=${teamId}`);
      objectiveList.then((response: any) => {
        setRows(response?.data);
        setfilterRows(response?.data || []);
      });
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
  };

  return (
    <div className="w-50">
      <Dialog open={openDialog?.add} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <input {...register("TeamId")} value={teamId} hidden />
          <input {...register("Percentage")} value={0} hidden />
          <DialogTitle>Add Team Objective</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
