import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  TextareaAutosize,
  Typography,
  Grid,
  FormControl,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import "../../../StyleSheets/EditTask.css";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Post } from "../../../Services/Axios";
import {
  ConvertToISO,
  ReduceFiveDays,
  WeekEndingDate,
} from "../../../Utilities/Utils";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../Models/Common/AlertOptions";

type DateRefs = {
  weekEndDate?: string;
  StartDate?: string;
  EndDate?: string;
};

export const MoveTask = ({
  openDialog,
  setOpenDialog,
  Data,
  Project,
  setRefetch,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const weekEndingDate = WeekEndingDate();
  const [dates, setDates] = useState<DateRefs>();
  const [projectName, setprojectName] = useState<string | undefined>("");
  useEffect(() => {
    if (!openDialog?.edit) {
      resetField("WeekEndingDate");
    }
    let temp = "";
    Project?.employeeProjects?.forEach((element: any) => {
      if (Data?.projectId == element.id) {
        temp = element.name;
      }
    });
    setprojectName(temp);
  }, [Data?.projectId, Project?.employeeProjects, openDialog?.edit]);

  const handleClose = () => {
    reset();
    setOpenDialog({ edit: false });
    setDates({});
  };

  const formField = [
    "Name",
    "ProjectId",
    "Id",
    "TaskId",
    "Comment",
    "WeekEndingDate",
    "EstTime",
    "ActTime",
    "Status",
    "Priority",
    "Percentage",
    "EstStartDate",
    "EstEndDate",
    "Description",
    "CreatedBy",
    "EstTime",
    "EndDate",
    "StartDate",
  ];

  const onSubmitHandler = async (data: any) => {
    const { error }: any = await Post("app/EmployeeTask/MoveTask", data);
    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Moving Task!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Task Moved Successfully!",
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

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }
  return (
    <div>
      <Dialog open={openDialog?.edit}>
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Typography
              className="fs-4"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                position: "sticky",
                top: 0,
                zIndex: 30,
              }}
            >
              <CancelOutlinedIcon
                onClick={handleClose}
                sx={{ ml: 65, color: "red", fontSize: "30px" }}
              />
              <span className="info-label">Project Name:</span>{" "}
              <span className="info-value">{projectName}</span>
              <br />
              <span className="info-label">Task Name:</span>{" "}
              <span className="info-value">{Data?.name}</span>
            </Typography>
            <Grid container sx={{ display: "inline-flex" }}>
              <Grid item xs={8}>
                <DialogTitle
                  className="fs-3"
                  style={{
                    textAlign: "center",
                    marginLeft: "45%",
                    color: "orange",
                    fontWeight: "bold",
                  }}
                >
                  Move Task
                </DialogTitle>
              </Grid>
            </Grid>
            <Grid container sx={{ display: "inline-flex" }}>
              <Grid item xs={12} className="mx-3">
                <label id="project-type">Comment</label>
                <TextareaAutosize
                  required
                  className="col form-control"
                  placeholder="Comments"
                  {...register("Comment")}
                  style={{ height: 80 }}
                  maxLength={250}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ display: "inline-flex" }} className="mt-2">
              <Grid item xs={12} className="mx-3">
                <label id="project-type">Estimate Time</label>
                <TextField
                  required
                  className="col form-control"
                  {...register("EstTime")}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ display: "inline-flex" }}>
              <Grid item xs={12} className="mx-3">
                <FormControl fullWidth className="col mt-2">
                  <label id="project-type">Week Ending Date</label>
                  <input
                    type="date"
                    className="form-control py-3"
                    {...register("WeekEndingDate", {
                      onChange: (e: any) => {
                        var date = new Date(e.target.value);
                        resetField("StartDate");
                        resetField("EndDate");
                        var day = date.getUTCDay();
                        if (day !== 5) {
                          Swal.fire({
                            icon: "error",
                            title: "Please Select Only Friday!",
                            showConfirmButton: true,
                          });
                          e.target.value = ConvertToISO(weekEndingDate);
                          return false;
                        }
                        setDates({ ...dates, weekEndDate: e.target.value });
                      },
                    })}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid container sx={{ display: "inline-flex" }} className="mt-2">
                <Grid item xs={12} className="mx-3">
                  <label id="project-type">Start Date</label>
                  <input
                    required
                    min={ReduceFiveDays(dates?.weekEndDate)}
                    max={dates?.weekEndDate}
                    type="date"
                    className="col form-control p-3"
                    {...register("StartDate", {
                      onChange: (e: any) => {
                        if (!dates?.weekEndDate) {
                          Swal.fire({
                            title: "Error",
                            text: "Select Week Ending Date!",
                            icon: "error",
                            confirmButtonColor: "#3085d6",
                          });
                          e.target.value = "";
                          return;
                        }
                        setDates({ ...dates, StartDate: e.target.value });
                      },
                    })}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ display: "inline-flex" }} className="mt-2">
                <Grid item xs={12} className="mx-3">
                  <label id="project-type">End Date</label>
                  <input
                    required
                    min={ReduceFiveDays(dates?.weekEndDate)}
                    max={dates?.weekEndDate}
                    type="date"
                    className="col form-control p-3"
                    {...register("EndDate", {
                      onChange: (e: any) => {
                        if (!dates?.StartDate) {
                          Swal.fire({
                            title: "Error",
                            text: "Select Start Date!",
                            icon: "error",
                            confirmButtonColor: "#3085d6",
                          });
                          e.target.value = "";
                          return;
                        }

                        if (e.target.value < dates.StartDate) {
                          Swal.fire({
                            title: "Error",
                            text: "End date must be after start date!",
                            icon: "error",
                            confirmButtonColor: "#3085d6",
                          });
                          e.target.value = "";
                        }
                      },
                    })}
                  />
                </Grid>
              </Grid>
              <input {...register("Id")} value={Data?.id} hidden />
              <input
                {...register("ProjectId")}
                value={Data?.projectId}
                hidden
              />
              <input {...register("TaskId")} value={Data?.taskId} hidden />
              <input {...register("ActTime")} value={Data?.actTime} hidden />
              <input {...register("Status")} value={Data?.status} hidden />
              <input {...register("Priority")} value={Data?.priority} hidden />
              <input
                {...register("Percentage")}
                value={Data?.percentage}
                hidden
              />
              <input
                {...register("EstStartDate")}
                value={Data?.estStartDate}
                hidden
              />
              <input
                {...register("EstEndDate")}
                value={Data?.estEndDate}
                hidden
              />
              <input
                {...register("Description")}
                value={Data?.description}
                hidden
              />
              <input
                {...register("CreatedBy")}
                value={Data?.createdBy}
                hidden
              />
            </Grid>
            <DialogActions className="mt-4">
              <Button onClick={handleClose} variant="contained" color="error">
                Cancel
              </Button>
              <Button variant="contained" color="success" type="submit">
                Save
              </Button>
            </DialogActions>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
