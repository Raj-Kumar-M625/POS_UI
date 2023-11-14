import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  InputLabel,
  IconButton,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { LinearProgress } from "@mui/material";
import { Post, Get } from "../../../Services/Axios";
import Swal from "sweetalert2";

export const SelectCategory = ({
  openDialog,
  setOpenDialog,
  selectedTaskData,
  setRefetch,
}: any) => {
  const [actStartDate, setActStartDate] = useState("");
  const [actEndDate, setActEndDate] = useState("");
  const [actTime, setActTime] = useState("");
  const [comments, setComments] = useState("");
  const [percentageValue, setPercentageValue] = useState(
    selectedTaskData.percentage
  );
  const [actStartDateError, setActStartDateError] = useState("");
  const [actEndDateError, setActEndDateError] = useState("");
  const [actTimeError, setActTimeError] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [PercentageError, setPercentageError] = useState("");
  const [checkList, setCheckList] = useState<any>([]);
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [checkListId, setCheckListId] = useState<number[]>([]);
  const [save, setSave] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  async function GetCheckList() {
    const response: any = await Get(
      `app/EmployeeDailyTask/GetEmployeeDevChecklist?TaskId=${selectedTaskData?.selectedTaskData?.taskId}`
    );

    const checkListData: any = await Get(
      `app/EmployeeDailyTask/GetEmployeeTaskChecklist?UserStoryUIID=${response?.data[0]?.userStoryUIId}`
    );

    setCheckList(checkListData?.data ?? []);
  }

  useEffect(() => {
    GetCheckList();
  }, [selectedTaskData?.selectedTaskData?.taskId]);

  useEffect(() => {
    setPercentageValue(selectedTaskData.percentage);
  }, [selectedTaskData?.selectedTaskData?.taskId]);

  const handleCloseIconClick = () => {
    setCheckList([]);
    setOpenDialog({ add: false });
  };
  const handlePercentageChange = (event: any) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setPercentageValue("");
      setPercentageError("");
      return;
    }
    const newPercentageValue = parseFloat(inputValue);
    if (
      isNaN(newPercentageValue) ||
      newPercentageValue < 0 ||
      newPercentageValue > 100
    ) {
      setPercentageError("Please Enter a valid percentage between 0 and 100.");
    } else {
      setPercentageValue(newPercentageValue.toString());
      setPercentageError("");
    }
  };

  const workedOn = new Date();

  const handleStartDateChange = (event: any) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      setActStartDateError(
        "Actual Start Date should be greater than or equal to today."
      );
      return;
    }

    setActStartDateError("");
    setActStartDate(event.target.value);
  };

  const handleEndDateChange = (event: any) => {
    const selectedEndDate = new Date(event.target.value);
    const selectedStartDate = new Date(actStartDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedEndDate < currentDate) {
      setActEndDateError(
        "Actual End Date should be greater than or equal to today."
      );
      return;
    }
    if (selectedEndDate < selectedStartDate) {
      setActEndDateError(
        "Actual End Date should be greater than or equal to the Actual Start Date."
      );
      return;
    }
    setActEndDateError("");
    setActEndDate(event.target.value);
  };

  function handleCheckListSelection(event: any, list: any) {
    var ids = [] as number[];
    if (event.target.checked) {
      ids = [...checkListId, list.id];
      setCheckListId(ids);
    } else {
      ids = checkListId.filter((x: number) => x !== list.id);
      setCheckListId(ids);
    }
    setSize(checkListId.length);
  }

  const handleSubmit = () => {
    if (checkList.length > 0 && size === 0) {
      setOpenCheckList(true);
      return;
    }

    setActStartDateError("");
    setActEndDateError("");
    setActTimeError("");
    setCommentsError("");
    setPercentageError("");
    let formIsValid = true;

    if (!actStartDate || actStartDate.trim() === "") {
      setActStartDateError("Please Enter Actual Start Date!");
      formIsValid = false;
    }
    if (!actEndDate || actEndDate.trim() === "") {
      setActEndDateError("Please Enter Actual End Date!");
      formIsValid = false;
    }
    if (!actTime || actTime.trim() === "") {
      setActTimeError("Please Enter Actual Time!");
      formIsValid = false;
    }
    if (!comments || comments.trim() === "") {
      setCommentsError("Please Enter The Comments!");
      formIsValid = false;
    }
    if (!percentageValue) {
      setPercentageValue(selectedTaskData.percentage);
      setPercentageError("Please Enter a Percentage!");
      formIsValid = false;
    }
    const startDate = new Date(actStartDate);
    const endDate = new Date(actEndDate);
    if (startDate > endDate) {
      setActStartDateError("Start Date cannot be greater than End Date");
      setActEndDateError("End Date cannot be less than Start Date");
      formIsValid = false;
    }
    if (!formIsValid) {
      return;
    }
    setSave(true);
    const AssignRequest = {
      id: selectedTaskData.selectedTaskData.id,
      employeeId: sessionUser.employeeId,
      taskId: selectedTaskData.selectedTaskData.taskId,
      employeeTaskId: selectedTaskData.selectedTaskData.employeeTaskId,
      projectObjectiveId: null,
      projectId: selectedTaskData.selectedTaskData.projectId,
      name: selectedTaskData.selectedTaskData.name,
      employeeName: "",
      projectName: "",
      description: "",
      startDate: actStartDate,
      endDate: actEndDate,
      estTime: selectedTaskData.selectedTaskData.estTime,
      actTime: actTime,
      weekEndingDate: undefined,
      status: "",
      priority: "high",
      percentage: percentageValue,
      comment: comments,
      workedOn: workedOn,
      TaskChecklistId: checkListId,
    };
    Post("/app/EmployeeDailyTask/AddEmployeeDailyTask", AssignRequest)
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Daily Task Updated Successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          setRefetch((prev: boolean) => !prev);
          setOpenDialog({ add: false });
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error Occured In Updating Daily Task",
          text: "An Error Occurred While Updating The Task. Please try again.",
        });
      });
    setSave(false);
    handleClose();
  };

  function handleClose() {
    setActStartDate("");
    setActEndDate("");
    setActTime("");
    setPercentageValue("");
    setComments("");
  }
  return (
    <div>
      <Dialog
        open={openDialog?.add}
        PaperProps={{
          style: { width: "35%", maxWidth: "1200px", height: "80%" },
        }}
        onClose={handleCloseIconClick}
      >
        <Typography
          className="fs-4"
          style={{
            backgroundColor: "#f0f0f0",
            padding: "20px",
            position: "relative",
            top: 0,
          }}
        >
          <IconButton
            onClick={handleCloseIconClick}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>
          <div>
            <span className="info-label">Project Name:</span>{" "}
            <span className="info-value">{selectedTaskData.ProjectName}</span>
            <br />
            <span className="info-label">Task Name:</span>{" "}
            <span className="info-value">{selectedTaskData.taskName}</span>
            <br />
          </div>
        </Typography>

        <DialogTitle
          style={{
            color: "orange",
            fontWeight: "bold",
          }}
        >
          Complete Daily Task
        </DialogTitle>
        <DialogContent className="row popup">
          <div className="row" style={{ justifyContent: "center" }}>
            <div className="row col-md-10">
              <InputLabel id="Team-Name" sx={{ left: 10 }}>
                Actual Start Date
              </InputLabel>
              <TextField
                required
                className="col m-2"
                value={actStartDate}
                error={!!actStartDateError}
                helperText={actStartDateError}
                onChange={handleStartDateChange}
                type="date"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 10) }}
              />
            </div>

            <div className="row col-md-10">
              <InputLabel id="Team-Name" sx={{ left: 10 }}>
                Actual End Date
              </InputLabel>
              <TextField
                required
                className="col m-2"
                value={actEndDate}
                error={!!actEndDateError}
                helperText={actEndDateError}
                onChange={handleEndDateChange}
                type="date"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 10) }}
              />
            </div>
            <div className="row col-md-10">
              <TextField
                required
                label="Actual Time"
                className="col m-2"
                value={actTime}
                error={!!actTimeError}
                helperText={actTimeError}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  const regex = /^\d{0,2}(\.\d{0,2})?$/;
                  if (regex.test(inputValue)) {
                    setActTime(inputValue);
                    setActTimeError("");
                  } else {
                    setActTime("");
                    setActTimeError("Please Enter a valid time format.");
                  }
                }}
                type="text"
                variant="standard"
              />
            </div>

            <div className="row col-md-10">
              <TextField
                required
                label="Percentage"
                className="col m-2"
                value={percentageValue}
                error={!!PercentageError}
                helperText={PercentageError}
                onChange={handlePercentageChange}
                type="text"
                variant="standard"
              />
            </div>
            <LinearProgress
              variant="determinate"
              value={percentageValue}
              style={{ width: "77%", height: "4%" }}
            />
            <div className="row col-md-10">
              <TextField
                required
                label="Comments"
                className="col m-2"
                value={comments}
                error={!!commentsError}
                helperText={commentsError}
                onChange={(event) => {
                  setComments(event.target.value);
                  setCommentsError("");
                }}
                type="text"
                variant="standard"
                multiline
                rows={3}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: "2rem",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleCloseIconClick}
          >
            Cancel
            <CancelIcon style={{ marginLeft: 20 }} />
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={save}
          >
            {checkList.length > 0 && size == 0
              ? "Continue to checklist"
              : save
              ? "Saving..."
              : "Submit"}
            <SendIcon style={{ marginLeft: 20 }} />
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCheckList} style={{ maxHeight: 500 }}>
        <DialogTitle
          style={{
            color: "orange",
            fontWeight: "bold",
          }}
        >
          Select Check List Items
        </DialogTitle>
        <DialogContent>
          {checkList.map((list: any, index: number) => (
            <React.Fragment key={index}>
              <div className="d-flex justify-content-between">
                <div>
                  <h6>
                    <b>CheckList</b>
                  </h6>
                  <b>Desription:</b> <p>{list.checkListDescription}</p>
                </div>
                <input
                  type="checkbox"
                  className="p-3"
                  onChange={(e: any) => handleCheckListSelection(e, list)}
                />
              </div>
              <Divider className="m-1" />
            </React.Fragment>
          ))}
          <Button
            variant="contained"
            color="success"
            className="float-end"
            onClick={() => {
              if (checkListId.length == 0) {
                Swal.fire({
                  title: "Error",
                  text: "Select CheckList Items!",
                  icon: "error",
                  confirmButtonColor: "#3085d6",
                });
                return;
              }
              setOpenCheckList(false);
            }}
          >
            {save ? "Saving..." : "Save"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
