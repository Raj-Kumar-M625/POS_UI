import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextareaAutosize,
  InputLabel,
  TextField,
  FormControl,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { Get, Post } from "../../../../Services/Axios";
import { useEffect, useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const formField = [
  "Name",
  "Description",
  "WeekEndingDate",
  "ProjectId",
  "Status",
  "Percentage",
];

export const AddMonthlyObjective = ({
  openDialog,
  setOpenDialog,
  setfilterRows,
  setRows,
  teamId,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [project, setProject] = useState<[]>();
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
  useEffect(() => {
    let objectiveList = Get(`app/Team/GetTeamProjectList?teamId=${teamId}`);
    objectiveList.then((response: any) => {
      setProject(response?.data);
    });
  }, []);
  const onSubmitHandler = async (data: any) => {
    setSave(true);
    await Post("app/Team/AddTeamMonthlyObjective", data);
    Swal.fire({
      title: "Success",
      text: "Objective Created Successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let objectiveList = Get(
        `app/Team/GetTeamMonthlyObjective?teamId=${teamId}`
      );
      objectiveList.then((response: any) => {
        setRows(response?.data);
        setfilterRows(response?.data || []);
      });
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setOpenDialog({ add2: false });
    setErrorMsg({
      message: "",
      show: false,
    });
    setSave(false);
  };

  return (
    <div className="w-50">
      <Dialog open={openDialog?.add2} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <input {...register("TeamId")} value={teamId} hidden />
          <input {...register("Percentage")} value={0} hidden />
          <input {...register("Status")} value={"In-Progress"} hidden />
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle>Add Team Monthly Objective </DialogTitle>
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
            <div
              className="row col-md-12"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <TextField
                  type="text"
                  label="Name"
                  className="col m-1 form-control"
                  {...register("Name")}
                />
                <TextareaAutosize
                  required
                  className="col m-1 form-control"
                  placeholder="Description"
                  {...register("Description")}
                  style={{ height: 100 }}
                />
              </div>
              {/* <div className="col">
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
                    />
                  </div> */}
              <div className="row mx-auto">
                <FormControl className="col m-2">
                  <InputLabel id="project-type">Project</InputLabel>
                  <Select
                    labelId="project-type"
                    required
                    id="project-type"
                    label="Project Type"
                    {...register("ProjectId")}
                  >
                    {project &&
                      project?.length > 0 &&
                      project?.map((e: any) => {
                        return (
                          <MenuItem value={e.projectId} key={e.projectId}>
                            {e.projectName}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <FormControl className="col m-2">
                  <InputLabel id="project-type">Priority</InputLabel>
                  <Select
                    labelId="Priority"
                    required
                    id="Priority"
                    label="Priority"
                    {...register("Priority")}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </div>
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
