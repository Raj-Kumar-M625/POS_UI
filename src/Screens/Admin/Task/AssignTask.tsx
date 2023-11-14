import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { useState } from "react";
import { Get } from "../../../Services/Axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TaskAssign } from "../../../Services/TaskService";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../Models/Common/AlertOptions";

const formField = [
  "EmployeeId",
  "EstTime",
  "Priority",
  "StartDate",
  "EndDate",
  "Comment",
];

export const AssignTask = ({
  openDialog,
  setOpenDialog,
  selectedRow,
  setLoading,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [teamMember, setTeamMember] = useState<any>([]);
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

  const fetchTeams = async () => {
    const teamList = await Get("app/Team/GetTeamList");
    const teamNames = await Get("app/Team/GetTeamMemberList");
    return { teamList, teamNames };
  };

  const { data }: any = useQuery("AssignTask", fetchTeams);

  const handelTeamChange = (e: any) => {
    let temp: any = [];
    temp = data?.teamNames?.data?.filter(
      (team: any) => team.teamId === e.target.value && team.endDate == null
    );
    setTeamMember(temp || []);
  };

  const onSubmitHandler = async (data: FieldValues) => {
    debugger;
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    setSave(true);
    const { error }: any = await TaskAssign(data, selectedRow);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Task Not Assigned!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Task Assigned Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      showConfirmButton: true,
    }).then(() => {
      setLoading((prev: boolean) => !prev);
    });
    handleClose();
  };

  const handleClose = () => {
    setErrorMsg({
      message: "",
      show: false,
    });
    reset();
    setSave(false);
    setOpenDialog(false);
  };
  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle sx={{ color: "blue", fontWeight: "bold" }}>
              Assign Task
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
              <FormControl fullWidth className="col m-2">
                <InputLabel id="Team-Name">Team Name</InputLabel>
                <Select
                  labelId="Team-Name"
                  id="Team-Name"
                  required
                  defaultValue=""
                  label="Team Name"
                  onChange={(e: any) => handelTeamChange(e)}
                >
                  {data?.teamList?.data?.length > 0
                    ? data?.teamList?.data?.map((e: any) => {
                        return (
                          <MenuItem value={e.id} key={e.id}>
                            {e.name}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
              </FormControl>
              <FormControl fullWidth className="col m-2">
                <InputLabel id="Team-Member">Team Member</InputLabel>
                <Select
                  labelId="Team-Member"
                  required
                  id="Team-Member"
                  label="Team Member"
                  defaultValue=""
                  {...register("EmployeeId")}
                >
                  {teamMember.map((e: any) => {
                    return (
                      <MenuItem value={e.employeeId} key={e.employeeId}>
                        {e.employee?.user?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <TextField
                required
                className="col m-2"
                {...register("EstTime")}
                label="Estimate time"
                type="number"
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth className="col m-2">
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>

                <Select
                  labelId="priority"
                  id="priority"
                  label="Priority"
                  defaultValue=""
                  {...register("Priority")}
                  required
                >
                  <MenuItem value={"High"}>High</MenuItem>
                  <MenuItem value={"Low"}>Low</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="Estimate-start-date">
                  Estimate start date
                </InputLabel>
                <TextField
                  required
                  id="Estimate-start-date"
                  margin="dense"
                  {...register("StartDate")}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="col">
                <InputLabel id="Estimate-end-date">
                  Estimate end date
                </InputLabel>
                <TextField
                  required
                  id="Estimate-end-date"
                  margin="dense"
                  {...register("EndDate")}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row col-md-6">
              <TextField
                required
                className="col-md-4 m-2"
                margin="dense"
                {...register("Comment")}
                label="Comment"
                fullWidth
                type="text"
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
        </form>
      </Dialog>
    </div>
  );
};
