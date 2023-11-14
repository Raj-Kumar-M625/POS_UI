import {
  Alert,
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogContent,
  InputLabel,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Swal from "sweetalert2";
import { Get, Post } from "../../../Services/Axios";
import { getDatesBetween } from "../../../Utilities/Utils";
import { AlertOption } from "../../../Models/Common/AlertOptions";
import { CommonMaster } from "../../../Models/Common/CommonMaster";

const formField = [
  "LeaveType",
  "LeaveSubType",
  "Description",
  "StartDate",
  "EndDate",
  "CreatedBy",
  "UpdatedBy",
  "LeaveStatus",
  "EmployeeId",
];

export function ApplyLeave({ openDialog, setOpenDialog, setReload }: any) {
  const { register, handleSubmit, resetField } = useForm();
  const [commonMaster, setCommonMaster] = useState<CommonMaster[]>([]);
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const [save, setSave] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  async function fetchDate() {
    const commonMaster: any = await Get("app/CommonMaster/GetCodeTableList");
    setCommonMaster(commonMaster.data);
  }

  useEffect(() => {
    fetchDate();
  }, []);

  const onSubmitHandler = async (data: any) => {
    data["LeaveRequestDate"] = getDatesBetween(data.StartDate, data.EndDate);

    const { error }: any = await Post(
      "/app/EmployeeLeave/ApplyEmployeeLeave",
      data
    );

    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Applying!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Leave Applied Successfully!",
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

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setSave(false);
    setOpenDialog({ add: false });
  };

  const handleLeaveReasonChange = (e: any) => {
    const inputValue = e.target.value;
    const validCharacters = /^[a-zA-Z0-9\s/\\-]+$/;
    if (validCharacters.test(inputValue)) {
    }
  };

  return (
    <div>
      <Dialog open={openDialog?.add} onClose={handleClose}>
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
              Apply For Leave
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
          <DialogContent className="row popup d-flex justify-content-center">
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row">
              <FormControl className="col mx-1">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  label="Leave Type"
                  className="text-dark"
                  required
                  {...register("LeaveType")}
                >
                  {commonMaster?.map((common: CommonMaster) => {
                    if (common.codeName.trim() === "LeaveType")
                      return (
                        <MenuItem value={common.codeValue}>
                          {common.codeValue}
                        </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
              <FormControl className="col mx-1">
                <InputLabel>Leave Sub-Type</InputLabel>
                <Select
                  label="Leave Sub-Type"
                  className="text-dark"
                  required
                  {...register("LeaveSubType")}
                >
                  {commonMaster?.map((common: CommonMaster) => {
                    if (common.codeName === "LeaveSubType")
                      return (
                        <MenuItem value={common.codeValue}>
                          {common.codeValue}
                        </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="row mt-2">
              <TextareaAutosize
                required
                className="col m-1 form-control"
                placeholder="Description"
                {...register("LeaveReason")}
                style={{ height: 100 }}
                onChange={handleLeaveReasonChange}
              />
            </div>
            <div className="row">
              <FormControl className="col mx-1">
                <label id="Team-Name">From</label>
                <TextField
                  required
                  {...register("StartDate")}
                  type="date"
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="col mx-1">
                <label id="Team-Name">To</label>
                <TextField
                  required
                  {...register("EndDate")}
                  type="date"
                  variant="outlined"
                />
              </FormControl>
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
              type="submit"
              disabled={save}
            >
              {save ? "Applying..." : "Apply"}
            </Button>
          </DialogActions>
          <input {...register("CreatedBy")} value="user" hidden />
          <input {...register("UpdatedBy")} value="user" hidden />
          <input {...register("LeaveStatus")} value="pending" hidden />
          <input
            {...register("EmployeeId")}
            value={sessionUser.employeeId}
            hidden
          />
        </form>
      </Dialog>
    </div>
  );
}
