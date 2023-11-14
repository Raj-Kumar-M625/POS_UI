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
import { useQuery } from "react-query";
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
  "Complexity",
  "CreatedBy",
  "UpdatedBy",
  "ProjectId",
  "UICategory",
];

export const AddUserInterface = ({
  openDialog,
  setOpenDialog,
  projectId,
  SetReload,
  data1,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [CategoryUI, setCategoryUI] = useState([]);
  const [save, setSave] = useState<boolean>(false);
  const [open, setOpen] = useState<any>({ add: false });
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  async function fetchCommonMaster() {
    const commonMaster: any = await Get("app/CommonMaster/GetCodeTableList");
    return commonMaster.data;
  }

  const { data } = useQuery("master_UI", fetchCommonMaster);

  const onSubmitHandler = async (data: any) => {
    setSave(true);
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }

    const response: any = await Post("app/Project/AddUserInterface", data);
    if (!response.error && uploadedFiles.length > 0) {
      uploadedFiles.forEach(async (file: any) => {
        var document: Document = {
          TableName: "UserInterface",
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
    if (response?.error) {
      option = {
        title: "Error",
        text: "Error Occured While Saving!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "User Interface Added Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      SetReload((prev: boolean) => !prev);
    });
    handleClose();
  };

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  useEffect(() => {
    SetReload((prev: boolean) => !prev);
  }, [open]);

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setOpenDialog({ add: false });
    setCategoryUI([]);
    setSave(false);
    setUploadedFiles([]);
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
              Add User Interface
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
                label="User Interface Name"
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
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
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
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="UI-Category">UI Category</InputLabel>
                <Select
                  labelId="UI-Category"
                  id="uiCategory"
                  required
                  value={CategoryUI}
                  label="UI Category"
                  {...register("UICategory", {
                    onChange: (e: any) => {
                      setCategoryUI(e.target?.value);
                    },
                  })}
                >
                  {data?.map((e: any) => {
                    if (e.codeType == "UICategory")
                      return (
                        <MenuItem value={e.codeName} key={e.codeValue}>
                          {e.codeName}
                        </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
              <FormControl className="col m-2">
                <InputLabel id="Complexity">Complexity</InputLabel>
                <Select
                  labelId="Complexity"
                  required
                  id="Complexity"
                  label="Complexity"
                  {...register("Complexity")}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="Status">Project Objective</InputLabel>
                <Select
                  labelId="Project-Objective"
                  required
                  id="Status"
                  label="Project Objective"
                  {...register("ProjectObjectiveId")}
                >
                  {data1?.length > 0 &&
                    data1?.map((e: any) => {
                      return (
                        <MenuItem value={e.id} key={e.id}>
                          {e.description}
                        </MenuItem>
                      );
                    })}
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
            <div className="row">
              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("Percentage")} value="0" hidden />
              <input {...register("ProjectId")} value={projectId} hidden />
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
        SetReload={SetReload}
      />
    </div>
  );
};
