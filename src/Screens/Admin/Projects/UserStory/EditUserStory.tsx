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
import { AlertOption } from "../../../../Models/Common/AlertOptions";
import { EditFileUpload } from "../../../../CommonComponents/EditFileUpload";
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
  "id",
];

export const EditUserStory = ({
  openDialog,
  setOpenDialog,
  setRows,
  projectId,
  setfilterRows,
  Data,
  data,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [deleteFileIds, setDeleteFileIds] = useState<Array<number>>([]);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  useEffect(() => {
    setUploadedFiles(Data?.documents ?? []);
  }, [openDialog?.edit]);

  var objective: any[] = [];
  data?.data?.projectObjectiveMappings?.forEach((e: any) => {
    if (e.userStoryId === Data?.id) objective.push(e.projectObjectiveId);
  });
  const onSubmitHandler = async (data: any) => {
    if (typeof data.ProjectObjectiveIds === "string") {
      data.ProjectObjectiveIds = data.ProjectObjectiveIds.split(",");
    }

    setSave(true);
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    const { error }: any = await Post("app/Project/UpdateUserStory", data);

    if (!error && selectedFiles.length > 0) {
      selectedFiles.forEach(async (file: any) => {
        var document: Document = {
          TableName: "UserStory",
          AttributeId: data.id,
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

    if (deleteFileIds.length > 0) {
      deleteFileIds.forEach((_id: number) => {
        Post(`app/Project/DeleteFile?id=${_id}`, "");
      });
    }

    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Updating!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "User Story Updated Successfully!",
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
    setOpenDialog({ edit: false });
    setSelectedFiles([]);
    setDeleteFileIds([]);
  };

  return (
    <div>
      <Dialog open={openDialog?.edit}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle style={{ color: "blue" }}>Edit User Story</DialogTitle>
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
                defaultValue={Data?.name}
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
                  defaultValue={Data?.status}
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
              <div className="col">
                <InputLabel id="Description">Description</InputLabel>
                <TextareaAutosize
                  required
                  className="col m-2 form-control"
                  defaultValue={Data?.description}
                  placeholder="Description"
                  {...register("Description")}
                  style={{ height: 100 }}
                  // inputProps={{
                  //   maxLength: 250,
                  //   onInput: (event) => {
                  //     const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                  //     const newValue = input.value.replace(/[^A-Za-z_ ]/g, ""); // Remove non-alphabetic characters
                  //     if (newValue !== input.value) {
                  //       input.value = newValue;
                  //     }
                  //   },
                  // }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="start-date">Start date</InputLabel>
                <TextField
                  required
                  id="start-date"
                  defaultValue={Data?.startDate?.slice(0, 10)}
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
                  defaultValue={Data?.endDate?.slice(0, 10)}
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
              <input {...register("id")} value={Data?.id} hidden />
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="Status">Project Objective</InputLabel>
                <Select
                  labelId="Project-Objective"
                  multiple
                  required
                  defaultValue={objective}
                  id="Status"
                  {...register("ProjectObjectiveIds")}
                  label="Project Objective"
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
            <div className="row">
              <FormControl className="col m-2">
                <EditFileUpload
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  setDeleteFileIds={setDeleteFileIds}
                  deleteFileIds={deleteFileIds}
                />
              </FormControl>
              <FormControl className="col m-2">
                <InputLabel id="Status">Document Type</InputLabel>
                <Select
                  labelId="Document Type"
                  id="DocumentType"
                  label="Document Type"
                  defaultValue={Data?.documents[0]?.docType}
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
