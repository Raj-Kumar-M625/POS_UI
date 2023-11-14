import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextareaAutosize,
  Button,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Get, Post } from "../../../../Services/Axios";

const formField = ["Description", "ProjectId", "Status", "Percentage", "id"];

export const EditTeamObjective = ({
  openDialog,
  setOpenDialog,
  Data,
  setfilterRows,
  setRows,
  teamId,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    await Post("app/Team/UpdateTeamObjective", data);
    Swal.fire({
      title: "Success",
      text: "Objective Updated Successfully!",
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
  };
  return (
    <div className="w-50">
      <Dialog open={openDialog?.edit} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle sx={{ color: "orange", fontWeight: "bold" }}>
            Team Objective
          </DialogTitle>
          <DialogContent
            className="row popup d-flex justify-content-center"
            sx={{
              width: 590,
            }}
          >
            <div className="row col-md-8">
              <TextareaAutosize
                className="col m-2 form-control"
                placeholder="Description"
                required
                {...register("Description")}
                style={{ height: 100 }}
                defaultValue={Data?.description}
              />
            </div>
            <div className="row col-md-8">
              <FormControl className="col m-2">
                <InputLabel id="project-type">Status</InputLabel>
                <Select
                  labelId="Status"
                  id="Status"
                  required
                  {...register("Status")}
                  label="Status"
                  defaultValue={Data?.status}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="In Progress">In Progres</MenuItem>
                </Select>
              </FormControl>
            </div>
            <input type="text" {...register("id")} value={Data?.id} hidden />
            <input {...register("CreatedBy")} value="user" hidden />
            <input {...register("UpdatedBy")} value="user" hidden />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="success">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
