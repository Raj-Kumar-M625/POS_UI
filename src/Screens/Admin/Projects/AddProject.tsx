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
  TextareaAutosize,
} from "@mui/material";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { Get, Post } from "../../../Services/Axios";
import { useQuery } from "react-query";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../Models/Common/AlertOptions";
const formField = [
  "Name",
  "Type",
  "Description",
  "StartDate",
  "EndDate",
  "Status",
  "Percentage",
  "CreatedBy",
  "UpdatedBy",
  "TechStackId",
  "TeamId",
];

export const AddProject = ({ openDialog, setOpenDialog, setReload }: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [techStack, settechStack] = useState([]);
  const [save, setSave] = useState<boolean>(false);
  const [team, setTeam] = useState([]);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  async function fetchCommonMaster1() {
    const commonMaster: any = await Get("app/CommonMaster/GetCodeTableList");
    const teamName: any = await Get("app/Team/GetTeamList");
    return { commonMaster, teamName };
  }
  const { data } = useQuery("AddProject", fetchCommonMaster1);

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
    settechStack([]);
    setTeam([]);
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
    const { error }: any = await Post("app/Project/AddProject", data);
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
        text: "Project Added Successfully!",
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
    setOpenDialog({ add: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.add}>
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
              Add Project
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
                className="col m-2"
                {...register("Name")}
                label="Project Name"
                type="text"
                variant="outlined"
              />
              <FormControl className="col m-2">
                <InputLabel id="project-type">Project Type</InputLabel>
                <Select
                  labelId="project-type"
                  required
                  id="project-type"
                  label="Project Type"
                  {...register("Type")}
                >
                  {data?.commonMaster?.data?.length > 0 &&
                    data?.commonMaster?.data?.map((e: any) => {
                      if (e.codeType == "ProjectType")
                        return (
                          <MenuItem value={e.codeValue} key={e.codeValue}>
                            {e.codeValue}
                          </MenuItem>
                        );
                    })}
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <TextareaAutosize
                required
                className="col m-2 form-control"
                placeholder="Description"
                {...register("Description")}
                style={{ height: 100 }}
              />
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="start-date">Start date</InputLabel>
                <TextField
                  required
                  id="start-date"
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
                  margin="dense"
                  {...register("EndDate")}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="row mt-2" style={{ marginLeft: "1px" }}>
                <FormControl className="col float-start">
                  <InputLabel id="project-type">Tech Stack</InputLabel>
                  <Select
                    labelId="Tech-Stack"
                    id="Tech-Stack"
                    multiple
                    required
                    value={techStack}
                    label="Tech Stack"
                    {...register("TechStackId", {
                      onChange: (e: any) => {
                        settechStack(e.target.value);
                      },
                    })}
                  >
                    {data?.commonMaster?.data?.length > 0 &&
                      data?.commonMaster?.data?.map((e: any) => {
                        if (e.codeType == "ProjectTechStackCatagory")
                          return (
                            <MenuItem value={e.id} key={e.codeValue}>
                              {e.codeName}
                            </MenuItem>
                          );
                      })}
                  </Select>
                </FormControl>
                &nbsp; &nbsp;&nbsp;
                <FormControl className="col ">
                  <InputLabel id="project-type">Status</InputLabel>
                  <Select
                    labelId="Status"
                    required
                    id="Status"
                    label="Status"
                    {...register("Status")}
                  >
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="In Progress">In Progres</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="row mx-1 mt-2">
                <FormControl className="col float-start">
                  <InputLabel id="team">Team List</InputLabel>
                  <Select
                    labelId="team"
                    id="team"
                    required
                    value={team}
                    label="Team List"
                    {...register("TeamId", {
                      onChange: (e: any) => {
                        setTeam(e.target.value);
                      },
                    })}
                  >
                    {data?.teamName?.data?.length > 0 &&
                      data?.teamName?.data?.map((e: any) => {
                        return (
                          <MenuItem value={e.id} key={e.id}>
                            {e.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("Percentage")} value="0" hidden />
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
