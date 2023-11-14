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
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Get, Post } from "../../../../Services/Axios";
import { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const formField = [
  "Name",
  "Description",
  "WeekEndingDate",
  "ProjectId",
  "Status",
  "Percentage",
  "id",
];
export const EditTeamWeeklyObjective = ({
  openDialog,
  setOpenDialog,
  Data,
  teamId,
  setWeeklyObjective,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    setSave(true);
    await Post("app/Team/UpdateTeamWeeklyObjective", data);
    Swal.fire({
      title: "Success",
      text: "Objective Updated Successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let objectiveList = Get(
        `app/Team/GetTeamMonthlyObjective?teamId=${teamId}`
      );
      objectiveList.then((response: any) => {
        var objectives =
          response.data.find((x: any) => x.id === Data?.monthlyObjectiveId) ??
          [];
        setWeeklyObjective(objectives.teamWeeklyObjectives);
      });
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setOpenDialog({ add: false });
    setSave(false);
  };
  return (
    <div className="w-50">
      <Dialog open={openDialog?.edit} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <input {...register("TeamId")} value={teamId} hidden />
          <input type="text" {...register("id")} value={Data?.id} hidden />
          <input {...register("CreatedBy")} value="user" hidden />
          <input {...register("UpdatedBy")} value="user" hidden />
          <input {...register("Priority")} value={Data?.priority} hidden />
          <input {...register("Percentage")} value={Data?.percentage} hidden />
          <input {...register("ProjectId")} value={Data?.projectId} hidden />
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle>Edit Team Weekly Objective</DialogTitle>
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
            <div>
              <>
                <div
                  className="row col-md-12 "
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div>
                    <TextField
                      type="text"
                      required
                      className="col m-1 form-control"
                      placeholder="Name"
                      {...register("Name")}
                      defaultValue={Data?.name}
                    />
                    <TextareaAutosize
                      required
                      className="col m-1 form-control"
                      placeholder="Description"
                      {...register("Description")}
                      style={{ height: 100 }}
                      defaultValue={Data?.description}
                    />
                  </div>

                  <div className="row mx-1">
                    <div className="col">
                      <InputLabel id="start-date">Week Ending date</InputLabel>
                      <TextField
                        required
                        id="start-date"
                        margin="dense"
                        {...register("WeekEndingDate")}
                        label=""
                        type="date"
                        fullWidth
                        variant="outlined"
                        defaultValue={Data?.weekEndingDate?.slice(0, 10)}
                      />
                    </div>
                    <FormControl className="col" style={{ marginTop: "30px" }}>
                      <InputLabel id="project-type">Status</InputLabel>
                      <Select
                        labelId="Priority"
                        defaultValue={Data?.status}
                        required
                        id="Priority"
                        label="Priority"
                        {...register("Status")}
                      >
                        <MenuItem value="In-Progress">In-Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Hold">Hold</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </>
            </div>
            <input {...register("CreatedBy")} value="user" hidden />
            <input {...register("UpdatedBy")} value="user" hidden />
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
