import {
  Autocomplete,
  Button,
  InputLabel,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { TaskDTO } from "../../../../Models/Task/Task";
import { Dispatch, SetStateAction, useState } from "react";
import { Post } from "../../../../Services/Axios";
import { useContextProvider } from "../../../../CommonComponents/Context";
import { CommonMaster } from "../../../../Models/Common/CommonMaster";
import {
  PRIORITYTYPE,
  TASKCLASSIFICATION,
  TASKTYPE,
} from "../../../../Constants/CommonMaster/CommonMaster";
import { TASK } from "../../../../Constants/Task/Task";
import { RGX_CHAR_NUM, RGX_NUMBER } from "../../../../Constants/Regex/Regex";
import { ConvertToISO, WeekEndingDate } from "../../../../Utilities/Utils";
import Swal from "sweetalert2";
import { AlertOption } from "../../../../Models/Common/AlertOptions";

type AddTaskProp = {
  task: TaskDTO;
  setTask: Dispatch<SetStateAction<TaskDTO>>;
  handleClose: () => void;
  setReload: Dispatch<SetStateAction<boolean>>;
};

type ModalError = {
  name: boolean;
  description: boolean;
  estimateStartDate: boolean;
  estimateEndDate: boolean;
  estTime: boolean;
  priority: boolean;
  taskType: boolean;
  classification: boolean;
  comment: boolean;
};

export const AddTask = ({
  setTask,
  task,
  handleClose,
  setReload,
}: AddTaskProp) => {
  const { commonMaster } = useContextProvider();
  const [modalError, setError] = useState<ModalError>({
    name: false,
    description: false,
    estimateStartDate: false,
    estimateEndDate: false,
    estTime: false,
    priority: false,
    taskType: false,
    classification: false,
    comment: false,
  });

  function isWeekEndingDate(date: string): boolean {
    const selectedDate = new Date(date);
    if (selectedDate.getUTCDay() === 5) return true;
    return false;
  }

  type taskType = keyof typeof modalError;

  async function saveTask() {
    var errors: any = {};
    var isModelError = false;

    Object.keys(modalError).forEach((key: string) => {
      if (task[key as taskType]?.toString().length === 0) {
        errors[`${key}`] = true;
        isModelError = true;
      } else {
        errors[`${key}`] = false;
      }
    });

    setError(errors);
    if (isModelError) return;
    debugger;
    const response: any = await Post("app/Task/CreateTask", task);

    var option: AlertOption;
    if (!response?.error) {
      option = {
        title: "Success",
        text: "Task Added Successfully!",
        icon: "success",
      };
    } else {
      option = {
        icon: "error",
        title: "Error Creating Task",
        text: "An error occurred while creating the task. Please try again.",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setReload((prev: boolean) => !prev);
    });

    setTask(TASK);
    handleClose();
  }

  return (
    <>
      <div className="row w-75 mx-auto">
        <TextField
          required
          className="col m-2"
          error={modalError?.name}
          onChange={(e: any) => {
            setError({ ...modalError, name: false });
            e.target.value = e.target.value.replace(RGX_CHAR_NUM, "");
            setTask((prev: TaskDTO) => {
              return { ...prev, name: e.target.value };
            });
          }}
          label="Task Name"
          type="text"
          variant="outlined"
        />
        <TextField
          required
          className="col m-2"
          disabled
          defaultValue={"Unassigned"}
          label="Status"
          type="text"
          variant="outlined"
        />
      </div>
      <div className="row w-75 mx-auto">
        <TextareaAutosize
          required
          className="col m-2 form-control"
          placeholder="Description"
          onChange={(e: any) => {
            e.target.value = e.target.value.replace(RGX_CHAR_NUM, "");
            setError({ ...modalError, description: false });
            setTask((prev: TaskDTO) => {
              return { ...prev, description: e.target.value };
            });
          }}
          style={{
            height: 80,
            borderColor: `${modalError.description ? "red" : ""}`,
          }}
        />
      </div>
      <div className="row w-75 mx-auto">
        <div className="col">
          <InputLabel id="start-date">Start date</InputLabel>
          <TextField
            required
            error={modalError?.estimateStartDate}
            id="start-date"
            margin="dense"
            label=""
            inputProps={{
              min: new Date().toISOString().slice(0, 10),
            }}
            onChange={(e: any) => {
              setError({ ...modalError, estimateStartDate: false });
              setTask((prev: TaskDTO) => {
                return { ...prev, estimateStartDate: e.target.value };
              });
            }}
            type="date"
            fullWidth
            variant="outlined"
          />
        </div>
        <div className="col">
          <InputLabel id="end-date">End date</InputLabel>
          <TextField
            required
            error={modalError?.estimateEndDate}
            id="end-date"
            margin="dense"
            inputProps={{
              min: new Date().toISOString().slice(0, 10),
            }}
            onChange={(e: any) => {
              setError({ ...modalError, estimateEndDate: false });
              setTask((prev: TaskDTO) => {
                return { ...prev, estimateEndDate: e.target.value };
              });
            }}
            label=""
            type="date"
            fullWidth
            variant="outlined"
          />
        </div>
      </div>
      <div className="row w-75 mx-auto">
        <div className="col">
          <InputLabel id="end-date" className="mb-4"></InputLabel>
          <TextField
            required
            type="text"
            error={modalError?.estTime}
            variant="outlined"
            fullWidth
            label="Estimated Time"
            onChange={(e: any) => {
              e.target.value = e.target.value.replace(RGX_NUMBER, "");
              setError({ ...modalError, estTime: false });
              setTask((prev: TaskDTO) => {
                return { ...prev, estTime: e.target.value };
              });
            }}
            margin="dense"
          />
        </div>
        <div className="col">
          <InputLabel id="end-date">Week Ending Date</InputLabel>
          <TextField
            required
            id="end-date"
            margin="dense"
            label=""
            type="date"
            defaultValue={ConvertToISO(WeekEndingDate())}
            inputProps={{
              min: new Date().toISOString().slice(0, 10),
            }}
            onChange={(e: any) => {
              var date: any = "";
              if (isWeekEndingDate(e.target.value)) {
                date = e.target.value;
              } else {
                date = task.weekEndingDate;
                e.target.value = task.weekEndingDate;
              }
              setTask((prev: TaskDTO) => {
                return { ...prev, weekEndingDate: date };
              });
            }}
            fullWidth
            variant="outlined"
          />
        </div>
      </div>
      <div className="row w-75 mx-auto">
        <Autocomplete
          disablePortal
          className="col mt-2"
          onChange={(e: any, value: any) => {
            setTask((prev: TaskDTO) => {
              return { ...prev, priority: value?.label ?? "" };
            });
            setError({ ...modalError, priority: false });
            return e;
          }}
          options={commonMaster
            .filter((x) => x.codeType === PRIORITYTYPE)
            .map((commonMaster: CommonMaster) => ({
              label: commonMaster.codeValue,
              id: commonMaster.codeValue,
            }))}
          renderInput={(params) => (
            <TextField
              {...params}
              error={modalError?.priority}
              label="Priority"
            />
          )}
        />
        <Autocomplete
          disablePortal
          className="col mt-2"
          options={commonMaster
            .filter((x) => x.codeType === TASKTYPE)
            .map((commonMaster: CommonMaster) => ({
              label: commonMaster.codeValue,
              id: commonMaster.codeValue,
            }))}
          onChange={(e: any, value: any) => {
            setTask((prev: TaskDTO) => {
              return { ...prev, taskType: value?.label ?? "" };
            });
            setError({ ...modalError, taskType: false });
            return e;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={modalError?.taskType}
              label="Task Type"
            />
          )}
        />
      </div>
      <div className="row w-75 mx-auto">
        <Autocomplete
          disablePortal
          className="col mt-3"
          options={commonMaster
            .filter((x) => x.codeType === TASKCLASSIFICATION)
            .map((commonMaster: CommonMaster) => ({
              label: commonMaster.codeValue,
              id: commonMaster.codeValue,
            }))}
          onChange={(e: any, value: any) => {
            setTask((prev: TaskDTO) => {
              return { ...prev, classification: value?.label ?? "" };
            });
            setError({ ...modalError, classification: false });
            return e;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={modalError?.classification}
              label="Classification"
            />
          )}
        />
        <TextField
          required
          className="col mt-3 mx-2"
          label="Comments"
          error={modalError?.comment}
          onChange={(e: any) => {
            e.target.value = e.target.value.replace(RGX_CHAR_NUM, "");
            setTask((prev: TaskDTO) => {
              return { ...prev, comment: e.target.value };
            });
            setError({ ...modalError, comment: false });
          }}
          type="text"
          variant="outlined"
        />
      </div>
      <div className="row w-25 mx-auto m-5">
        <Button
          variant="contained"
          color="success"
          className="w-50 mx-auto fw-bold"
          onClick={() => saveTask()}
          style={{ backgroundColor: "#08c441" }}
        >
          Save
        </Button>
      </div>
    </>
  );
};
