import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import { useLocation, useNavigate } from "react-router-dom";
import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";
import "../../../StyleSheets/EmployeeOverview.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import "@mui/lab/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { Get, Post } from "../../../Services/Axios";
import DoneIcon from "@mui/icons-material/Done";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Swal from "sweetalert2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { ConvertToISO } from "../../../Utilities/Utils";
import { useContextProvider } from "../../../CommonComponents/Context";
import { CommonMaster } from "../../../Models/Common/CommonMaster";
import { PRIORITYTYPE } from "../../../Constants/CommonMaster/CommonMaster";

export default function CreateTask() {
  const location = useLocation();
  const {
    projectName,
    userstoryId,
    categoryName,
    subcategoryName,
    categoryId,
    userstoryName,
    userInterfaceName,
    projectId,
    UserInterfaceId,
    isUSApplicable,
    isUiApplicable,
  } = location.state;
  var counter = 0;
  const [taskTypeOptions, setTaskTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [classificationOptions, setClassificationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [selectedclassification, setSelectedclassification] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [status, setStatus] = useState("Unassigned");
  const [estimationStartDate, setEstimationStartDate] = useState("");
  const [estimationEndDate, setEstimationEndDate] = useState("");
  const [estimationTime, setEstimationTime] = useState("");
  const [weekEndingDate, setWeekEndingDate] = useState("");
  const [comments, setcomments] = useState("");
  const [stepCompletion, setStepCompletion] = useState({
    category: false,
    subcategory: false,
    project: false,
    userStory: false,
    userInterface: false,
  } as Record<string, boolean>);
  const [taskNameError, setTaskNameError] = useState("");
  const [taskDescriptionError, setTaskDescriptionError] = useState("");
  const [estimationStartdateError, setestimationStartdateError] = useState("");
  const [estimationEnddateError, setestimationEnddateError] = useState("");
  const [estimationTimeError, setestimationTimeError] = useState("");
  const [weekendingdateError, setweekendingdateError] = useState("");
  const [tasktypeError, settasktypeError] = useState("");
  const [priority, setPriority] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [classificationError, setclassificationError] = useState("");
  const [save, setSave] = useState<boolean>(false);
  const [commentsError, setcommentsError] = useState("");
  const [list, setList] = useState<number[]>([1]);
  const navigate = useNavigate();
  const [map, setMap] = useState<Map<number, string>>();
  const { commonMaster } = useContextProvider();

  useEffect(() => {
    const loadConnectionList = async () => {
      try {
        const response: any = await Get("/app/CommonMaster/GetCodeTableList");
        const taskTypeSet = new Set();
        const classificationSet = new Set();

        response.data.forEach(
          (item: { codeName: string; codeValue: unknown }) => {
            if (item.codeName === "TaskType") {
              taskTypeSet.add(item.codeValue);
            } else if (item.codeName === "TaskClassification") {
              classificationSet.add(item.codeValue);
            }
          }
        );

        const taskType: { label: string; value: string }[] = Array.from(
          taskTypeSet
        ).map((codeValue) => ({
          label: codeValue as string,
          value: codeValue as string,
        }));

        const classification: { label: string; value: string }[] = Array.from(
          classificationSet
        ).map((codeValue) => ({
          label: codeValue as string,
          value: codeValue as string,
        }));
        setTaskTypeOptions(taskType);
        setClassificationOptions(classification);
      } catch (error: any) {
        console.log(error.response.data);
      }
    };

    loadConnectionList();
  }, []);

  const handleWeekEndingDateChange = (event: any) => {
    const selectedDate = event.target.value;
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj.getUTCDay() === 5) {
      setWeekEndingDate(selectedDate);
      setweekendingdateError("");
    } else {
      setWeekEndingDate("");
      setweekendingdateError("");
    }
  };

  const handleStartDateChange = (event: any) => {
    if (event.target.value < ConvertToISO(new Date())) {
      setestimationStartdateError(
        "Estimation Start Date should be greater than or equal to today."
      );
      return;
    }
    setestimationStartdateError("");
    setEstimationStartDate(event.target.value);
  };

  const handleEndDateChange = (event: any) => {
    if (event.target.value < estimationStartDate) {
      setestimationEnddateError(
        "Estimation End Date should be greater than or equal to today."
      );
      return;
    }
    setestimationEnddateError("");
    setEstimationEndDate(event.target.value);
  };

  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  useEffect(() => {
    const isCategoryComplete = Boolean(categoryName);
    const isSubcategoryComplete = Boolean(subcategoryName);
    const isProjectComplete = Boolean(projectName);
    const isUserStoryComplete = Boolean(userstoryName);
    const isUserInterfaceComplete = Boolean(userInterfaceName);

    setStepCompletion({
      category: isCategoryComplete,
      subcategory: isSubcategoryComplete,
      project: isProjectComplete,
      userStory: isUserStoryComplete,
      userInterface: isUserInterfaceComplete,
    });
  }, [categoryName, subcategoryName, projectName]);

  const stepsWithUSApplicable = [
    {
      label: `Category ${"\n"}(${categoryName})`,
      completed: stepCompletion.category,
    },
    {
      label: `Sub-Category ${"\n"} (${subcategoryName})`,
      completed: stepCompletion.subcategory,
    },
    {
      label: `Project Name (${projectName})`,
      completed: stepCompletion.project,
    },
    {
      label: `User Story Name (${userstoryName})`,
      completed: stepCompletion.userStory,
    },
    {
      label: `User Interface Name (${userInterfaceName})`,
      completed: stepCompletion.userInterface,
    },
  ];
  const stepsWithoutUSApplicable = [
    {
      label: `Category ${"\n"}(${categoryName})`,
      completed: stepCompletion.category,
    },
    {
      label: `Sub-Category ${"\n"} (${subcategoryName})`,
      completed: stepCompletion.subcategory,
    },
    {
      label: `Project Name (${projectName})`,
      completed: stepCompletion.project,
    },
  ];
  const stepsWithUIApplicable = [
    {
      label: `Category ${"\n"}(${categoryName})`,
      completed: stepCompletion.category,
    },
    {
      label: `Sub-Category ${"\n"} (${subcategoryName})`,
      completed: stepCompletion.subcategory,
    },
    {
      label: `Project Name (${projectName})`,
      completed: stepCompletion.project,
    },
    {
      label: `User Story Name (${userstoryName})`,
      completed: stepCompletion.userStory,
    },
  ];

  let steps;
  if (isUSApplicable && isUiApplicable) {
    steps = stepsWithUSApplicable;
  } else if (isUSApplicable) {
    steps = stepsWithUIApplicable;
  } else {
    steps = stepsWithoutUSApplicable;
  }

  const handleSubmit = () => {
    setTaskNameError("");
    setTaskDescriptionError("");
    setestimationStartdateError("");
    setestimationEnddateError("");
    setestimationTimeError("");
    setweekendingdateError("");
    settasktypeError("");
    setclassificationError("");
    setcommentsError("");

    let formIsValid = true;
    if (taskName.trim() === "") {
      setTaskNameError("Please enter a task name !.");
      formIsValid = false;
    }
    if (taskDescription.trim() === "") {
      setTaskDescriptionError("Please enter a task description !.");
      formIsValid = false;
    }
    if (estimationStartDate.trim() === "") {
      setestimationStartdateError("Please Enter a Estimation Start Date !.");
      formIsValid = false;
    }
    if (estimationEndDate.trim() === "") {
      setestimationEnddateError("Please Enter a Estimation End Date !.");
      formIsValid = false;
    }
    if (estimationTime.trim() === "") {
      setestimationTimeError("Please Enter a Estimation Time !.");
      formIsValid = false;
    }
    if (weekEndingDate.trim() === "") {
      setweekendingdateError("Please Enter a Week Ending Date !.");
      formIsValid = false;
    }
    if (selectedTaskType.trim() === "") {
      settasktypeError("Please Select The Task Type !.");
      formIsValid = false;
    }
    if (selectedclassification.trim() === "") {
      setclassificationError("Please Select The Classification !.");
      formIsValid = false;
    }
    if (comments.trim() === "") {
      setcommentsError("Please Enter The Comments !.");
      formIsValid = false;
    }
    if (priority.trim() === "") {
      setPriorityError("Please Select Priority!.");
      formIsValid = false;
    }
    const startDateObj = new Date(estimationStartDate);
    const endDateObj = new Date(estimationEndDate);

    if (endDateObj < startDateObj) {
      setestimationEnddateError(
        "Estimation End Date should be greater than or equal to the Estimation Start Date."
      );
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }
    setSave(true);

    const newCreateTask: any = {
      employeeId: sessionUser.employeeId,
      projectId: projectId,
      categoryId: categoryId,
      uIId: UserInterfaceId,
      userStoryId: userstoryId,
      name: taskName,
      estTime: estimationTime,
      description: taskDescription,
      status: status,
      percentage: 0,
      actTime: 0,
      startDate: undefined,
      endDate: undefined,
      weekEndingDate: weekEndingDate,
      priority: priority,
      Comment: comments,
      EstimateStartDate: estimationStartDate,
      EstimateEndDate: estimationEndDate,
      taskType: selectedTaskType,
      classification: selectedclassification,
      createdBy: "user",
      updatedBy: "user",
    };

    var postUrl: string = "";
    if (subcategoryName == "CheckList") {
      newCreateTask.CheckListDescriptions = Array.from(map?.values() || []);
      postUrl = "app/Task/CreateTaskCheckList";
    } else {
      postUrl = "app/Task/CreateTask";
    }

    Post(postUrl, newCreateTask)
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Task Added Successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          navigate("/Employee/Task");
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error Creating Task",
          text: "An error occurred while creating the task. Please try again.",
        });
        console.log(error.response.data);
      });
    setSave(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        flexDirection={"column"}
        p={4}
      >
        <div className="mt-4  w-75" style={{ backgroundColor: "#ebf5f3" }}>
          {/* <Box sx={{ width: '100%' }}>
            <Stepper activeStep={steps.length -1} alternativeLabel>
              {isUSApplicable
                ? stepsWithUSApplicable.map((step, index) => (
                  <Step key={index} completed={step.completed}>

                    <StepLabel sx={{
                      ...(step.completed && {
                        '& .MuiStepIcon-root': {
                          color: '#4caf50',
                        },
                      }),
                    }}>{step.label}</StepLabel>
                  </Step>
                ))
                : stepsWithoutUSApplicable.map((step, index) => (
                  <Step key={index} completed={step.completed}>
                    <StepLabel sx={{
                      ...(step.completed && {
                        '& .MuiStepIcon-root': {
                          color: '#4caf50',
                        },
                      }),
                    }}>{step.label}</StepLabel>
                  </Step>
                ))} 
            </Stepper>
          </Box> */}
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={steps.length - 1} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={index} completed={step.completed}>
                  <StepLabel
                    sx={{
                      ...(step.completed && {
                        "& .MuiStepIcon-root": {
                          color: "#4caf50",
                        },
                      }),
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <List
            sx={{
              width: "100%",
              maxWidth: 1250,
              backgroundColor: "#ebf5f3",
              position: "relative",
              overflow: "auto",
              maxHeight: 570,
              fontFamily: "Product Sans",
              "& ul": { padding: 0 },
            }}
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className="fw-bold  -flex align-items-center justify-content-between"
                sx={{ backgroundColor: "#85edc0", padding: 2 }}
              >
                <div className="fs-4 d-flex align-items-center flex-column">
                  <span>
                    <AddTaskIcon /> Create Task
                  </span>
                </div>
              </ListSubheader>
            }
          >
            <div className="card m-2">
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    id="TaskName"
                    label="Task Name"
                    variant="standard"
                    size="small"
                    error={!!taskNameError}
                    helperText={taskNameError}
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    value={taskName}
                    onChange={(event) => {
                      setTaskName(event.target.value);
                      setTaskNameError("");
                    }}
                  />
                  <TextField
                    id="TaskDescription"
                    placeholder="Task Description"
                    variant="standard"
                    size="small"
                    error={!!taskDescriptionError}
                    helperText={taskDescriptionError}
                    value={taskDescription}
                    onChange={(event) => {
                      setTaskDescription(event.target.value);
                      setTaskDescriptionError("");
                    }}
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    multiline
                    rows={4}
                  />
                  <TextField
                    id="Status"
                    label="Status"
                    placeholder="Status"
                    variant="standard"
                    size="small"
                    error={false}
                    helperText={""}
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    disabled={true}
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  />
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{ right: 125, bottom: 10 }}
                  >
                    Estimation Start Date
                  </InputLabel>
                  <TextField
                    id="field3"
                    placeholder="Estimation Start Date"
                    variant="standard"
                    size="small"
                    error={!!estimationStartdateError}
                    helperText={estimationStartdateError}
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    type="date"
                    value={estimationStartDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().slice(0, 10),
                    }}
                  />
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{ right: 125, bottom: 10 }}
                  >
                    Estimation End Date
                  </InputLabel>
                  <TextField
                    id="field3"
                    variant="standard"
                    size="small"
                    error={!!estimationStartdateError}
                    helperText={estimationEnddateError}
                    type="date"
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    value={estimationEndDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().slice(0, 10),
                    }}
                  />
                  <TextField
                    id="field3"
                    label="Estimation Time"
                    variant="standard"
                    size="small"
                    error={!!estimationTimeError}
                    helperText={estimationTimeError}
                    value={estimationTime}
                    onChange={(event) => {
                      setEstimationTime(event.target.value);
                      setestimationTimeError("");
                    }}
                    sx={{
                      width: 400,
                      mb: 5,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{ right: 130, bottom: 10 }}
                  >
                    Week Ending Date
                  </InputLabel>
                  <TextField
                    id="field3"
                    variant="standard"
                    size="small"
                    error={!!weekendingdateError}
                    helperText={weekendingdateError}
                    type="date"
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    value={weekEndingDate || ""}
                    onChange={handleWeekEndingDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().slice(0, 10),
                    }}
                  />
                  <FormControl
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Priority
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={priority}
                      onChange={(event) => {
                        setPriority(event.target.value);
                        setPriorityError("");
                      }}
                      input={<OutlinedInput label="Task Type" />}
                      error={!!priorityError}
                    >
                      {commonMaster.map((option: CommonMaster) => {
                        if (option.codeType === PRIORITYTYPE)
                          return (
                            <MenuItem
                              key={option.codeValue}
                              value={option.codeValue}
                            >
                              {option.codeValue}
                            </MenuItem>
                          );
                      })}
                    </Select>
                    {priorityError && (
                      <span
                        className="error-message"
                        style={{ color: "red", fontSize: "13px" }}
                      >
                        {priorityError}
                      </span>
                    )}
                  </FormControl>
                  <FormControl
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Task Type
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={selectedTaskType}
                      onChange={(event) => {
                        setSelectedTaskType(event.target.value);
                        settasktypeError("");
                      }}
                      input={<OutlinedInput label="Task Type" />}
                      error={!!tasktypeError}
                    >
                      {taskTypeOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Classification
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={selectedclassification}
                      onChange={(event) => {
                        setSelectedclassification(event.target.value);
                        setclassificationError("");
                      }}
                      input={<OutlinedInput label="Classification" />}
                      variant="standard"
                      error={!!classificationError}
                    >
                      {classificationOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {classificationError && (
                      <span
                        className="error-message"
                        style={{ color: "red", fontSize: "13px" }}
                      >
                        {classificationError}
                      </span>
                    )}
                  </FormControl>
                  <TextField
                    id="field3"
                    label="Comments"
                    variant="standard"
                    size="small"
                    error={!!commentsError}
                    helperText={commentsError}
                    multiline
                    value={comments}
                    onChange={(event) => {
                      setcomments(event.target.value);
                      setcommentsError("");
                    }}
                    sx={{
                      width: 400,
                      mb: 4,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  {subcategoryName == "CheckList" && (
                    <>
                      <div className="d-flex align-items-center flex-column">
                        {list.map((e, index) => {
                          counter++;
                          return (
                            <div className="d-flex align-items-center flex-row">
                              <TextField
                                key={e}
                                id="field3"
                                label={`Check List ${counter}`}
                                variant="standard"
                                size="small"
                                onBlur={(event: any) => {
                                  var temp = new Map<number, string>(map);
                                  temp.set(e, event.target.value);
                                  setMap(temp);
                                }}
                                onChange={() => {}}
                                sx={{
                                  width:
                                    index == list.length - 1 && list.length > 1
                                      ? 370
                                      : 400,
                                  mb: 4,
                                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              {index == list.length - 1 && list.length > 1 && (
                                <Tooltip title="Remove Item">
                                  <RemoveCircleOutlineIcon
                                    className="mx-1 float-end"
                                    onClick={() => {
                                      var newMap = new Map<number, string>(map);
                                      newMap.delete(list.length);
                                      setMap(newMap);
                                      var temp: number[] = list.filter(
                                        (x) => x != e
                                      );
                                      setList(temp);
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <Tooltip title="Add Item">
                        <AddCircleOutlineIcon
                          className="mx-1 float-end"
                          onClick={() =>
                            setList([...list, list[list.length - 1] + 1])
                          }
                        />
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </List>
        </div>
      </Box>
      <Button
        sx={{
          width: 400,
          mb: 4,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 77.5,
        }}
        disabled={save}
        variant="contained"
        endIcon={<DoneIcon />}
        onClick={handleSubmit}
      >
        {save ? "Saving..." : "Submit"}
      </Button>
    </>
  );
}
