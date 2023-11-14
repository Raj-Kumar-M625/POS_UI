import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  InputLabel,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Get, Post } from "../../../Services/Axios";
import Swal from "sweetalert2";
import { AlertOption } from "../../../Models/Common/AlertOptions";

const formField: string[] = [
  "EmployeeId",
  "EstTime",
  "EstStartDate",
  "EstEndDate",
  "CreatedBy",
  "UpdatedBy",
  "Id",
];

export const ReassignTask = ({
  setOpenDialog,
  openDialog,
  TeamId,
  Data,
  setRefetch,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [teamMembers, setTeamMembers] = useState<any>([]);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });
  useEffect(() => {
    const response: any = Get(`app/Team/GetTeamEmployeelist?teamId=${TeamId}`);
    response.then((res: any) => {
      setTeamMembers(res.data || []);
    });
  }, [TeamId]);

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    const { error }: any = await Post("app/EmployeeTask/ReassignTask", data);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error Occurred while Re-Assigning!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Task Re-Assigned Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setRefetch((prev: boolean) => !prev);
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setOpenDialog({ add: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.reassign} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle>Re-Assign task ({teamMembers[0]?.teamName})</DialogTitle>
          <DialogContent className="row popup d-flex justify-content-center">
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row col-md-8">
              <FormControl fullWidth className="col m-2">
                <InputLabel required id="Team-Member">
                  Select Employee
                </InputLabel>
                <Select
                  labelId="Team-Member"
                  required
                  id="category"
                  label="Select Employee"
                  defaultValue=""
                  {...register("EmployeeId")}
                >
                  {teamMembers?.map((e: any) => {
                    return (
                      <MenuItem value={e.employeeId} key={e.employeeId}>
                        {e.employeeName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="row col-md-8">
              <TextField
                required
                label="Estimate Time"
                className="col m-2"
                {...register("EstTime")}
                type="text"
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="Team-Name">Estimate Start Date</InputLabel>
              <TextField
                required
                className="col m-2"
                {...register("EstStartDate")}
                type="date"
                variant="outlined"
              />
            </div>
            <div className="row col-md-8">
              <InputLabel id="Team-Name">Estimate End Date</InputLabel>
              <TextField
                required
                className="col m-2"
                {...register("EstEndDate")}
                type="date"
                variant="outlined"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
          <input {...register("CreatedBy")} value="user" hidden />
          <input {...register("UpdatedBy")} value="user" hidden />
          <input {...register("Id")} value={Data?.id} hidden />
        </form>
      </Dialog>
    </div>
  );
};
