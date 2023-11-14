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
  Select,
  TextareaAutosize,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Get, Post, PostFiles } from "../../../../Services/Axios";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AddProjectObjective } from "../ProjectObjective/AddProjectObjective";
import { AlertOption } from "../../../../Models/Common/AlertOptions";
import { FileUpload } from "../../../../CommonComponents/FileUpload";
import { Document } from "../../../../Models/Project/UserStory";

const formField = [
  "Name",
  "Description",
  "StartDate",
  "EndDate",
  "Status",
  "Percentage",
  "CreatedBy",
  "UpdatedBy",
  "ProjectId",
  "ProjectObjectiveIds",
];
export const AddUserStory = ({
  openDialog,
  setOpenDialog,
  setRows,
  projectId,
  setfilterRows,
  data,
  refetch,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });
  const [open, setOpen] = useState<any>({ add: false });
  const [IDs, setId] = useState<any>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  const onSubmitHandler = async (data: any) => {
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    setSave(true);
    const response: any = await Post("app/Project/AddUserStory", data);
    if (!response.error && uploadedFiles.length > 0) {
      uploadedFiles.forEach(async (file: any) => {
        var document: Document = {
          TableName: "UserStory",
          AttributeId: response.data.id,
          ProjectId: data.ProjectId,
          DocType: data.DocType,
          FileName: file.name,
          FileType: file.type,
          File: file,
          IsActive: true,
          CreatedBy: "user",
          UpdatedBy: "user",
        };
        await PostFiles("app/Project/UploadFiles", document);
      });
    }

    var option: AlertOption;
    if (response.error) {
      option = {
        title: "Error",
        text: "Error Occured While Saving!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "User Story Added Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let userStoryList = Get(
        `app/Project/GetUserStoryList?projectId=${projectId}`
      );
      userStoryList.then((response: any) => {
        setRows(response?.data);
        setfilterRows(response?.data || []);
      });
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
    setId([]);
    setUploadedFiles([]);
  };

  useEffect(() => {
    refetch();
  }, [open]);

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
            <DialogTitle>Add User Story</DialogTitle>
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
                label="User Story Name"
                type="text"
                variant="outlined"
              />

              <FormControl className="col m-2">
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  labelId="Status"
                  required
                  id="Status"
                  label="Status"
                  {...register("Status")}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
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

              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("Percentage")} value="0" hidden />
              <input {...register("ProjectId")} value={projectId} hidden />
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="Project-Objective">
                  Project Objective
                </InputLabel>
                <Select
                  labelId="Project-Objective"
                  multiple
                  required
                  value={IDs}
                  label="Project Objective"
                  {...register("ProjectObjectiveIds", {
                    onChange: (e: any) => {
                      setId(e.target.value);
                    },
                  })}
                >
                  {data?.data?.projectObjectives?.map(
                    (e: any, index: number) => {
                      return (
                        <MenuItem value={e.id} key={index}>
                          {e.description}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
            </div>
            <div>
              <Button
                variant="contained"
                size="small"
                className="mt-2 mx-4 col-sm-5 float-end"
                onClick={() => setOpen({ add: true })}
              >
                Add Project Objective
              </Button>
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <FileUpload
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              </FormControl>
              <FormControl className="col m-2">
                <InputLabel id="Status">Document Type</InputLabel>
                <Select
                  labelId="Document Type"
                  id="DocumentType"
                  label="Document Type"
                  required={uploadedFiles.length > 0}
                  {...register("DocType")}
                >
                  <MenuItem value="Input">Input</MenuItem>
                  <MenuItem value="Process">Process</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Sample Code">Sample Code</MenuItem>
                </Select>
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
              disabled={save}
              color="success"
              type="submit"
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <AddProjectObjective
        openDialog={open}
        setOpenDialog={setOpen}
        ProjectId={projectId}
      />
    </div>
  );
};
