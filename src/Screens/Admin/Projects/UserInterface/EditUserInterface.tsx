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
import { useQuery } from "react-query";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../../Models/Common/AlertOptions";
import { Document } from "../../../../Models/Project/UserStory";
import { EditFileUpload } from "../../../../CommonComponents/EditFileUpload";
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
  "id",
  "UICategory",
];

export const EditUserInterface = ({
  openDialog,
  setOpenDialog,
  projectId,
  Data,
  data1,
  SetReload,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [CategoryUI, setCategoryUI] = useState([]);
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

  async function fetchCommonMaster() {
    const commonMaster: any = await Get("app/CommonMaster/GetCodeTableList");
    return commonMaster.data;
  }
  var objetive: any = data1?.data?.projectObjectives?.find(
    (x: any) => x.id === Data?.projectObjectiveId
  );
  const { data } = useQuery("master_UI1", fetchCommonMaster);

  const onSubmitHandler = async (data: any) => {
    setSave(true);
    if (data.StartDate > data.EndDate) {
      setErrorMsg({
        message: "Start Date must be before End Date",
        show: true,
      });
      return;
    }
    debugger;
    const { error }: any = await Post("app/Project/UpdateUserInterface", data);

    if (!error && selectedFiles.length > 0) {
      selectedFiles.forEach(async (file: any) => {
        var document: Document = {
          TableName: "UserInterface",
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
        text: "User Interface Updated Successfully!",
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

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setOpenDialog({ edit: false });
    setSave(false);
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
            <DialogTitle style={{ color: "blue", flex: "1" }}>
              Edit User Interface
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
                defaultValue={Data?.name}
                className="col m-2"
                {...register("Name")}
                label="User Interface Name"
                type="text"
                variant="outlined"
              />

              <FormControl fullWidth className="col m-2">
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  labelId="Status"
                  required
                  defaultValue={Data?.status}
                  margin="dense"
                  id="Status"
                  label="Status"
                  {...register("Status")}
                >
                  <MenuItem value="In Progress">In progress</MenuItem>
                  <MenuItem value="Completed">Completed </MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="Description">Description</InputLabel>
                <TextareaAutosize
                  required
                  className="col form-control"
                  defaultValue={Data?.description}
                  placeholder="Description"
                  {...register("Description")}
                  style={{ height: 100 }}
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
            </div>

            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="UI-Category">UI Category</InputLabel>
                <Select
                  labelId="UI-Category"
                  id="uiCategory"
                  required
                  defaultValue={Data?.uiCategory?.trim()}
                  label="UI Category"
                  {...register("UICategory", {
                    onChange: (e: any) => {
                      setCategoryUI(e.target.value);
                    },
                  })}
                >
                  {data?.map((e: any) => {
                    if (e.codeType == "UICategory")
                      return (
                        <MenuItem value={e.codeName.trim()} key={e.codeValue}>
                          {e.codeName}
                        </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
              <FormControl className="col m-2">
                <InputLabel id="Complexity">Complexity</InputLabel>
                <Select
                  required
                  labelId="Complexity"
                  defaultValue={Data?.complexity}
                  margin="dense"
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
                  defaultValue={objetive?.id}
                  id="Status"
                  {...register("ProjectObjectiveId")}
                  label="Project Objective"
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
            <div className="row">
              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("ProjectId")} value={projectId} hidden />
              <input {...register("id")} value={Data?.id} hidden />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              size="medium"
              variant="contained"
              color="error"
              type="submit"
            >
              Cancel
            </Button>
            <Button
              size="medium"
              variant="contained"
              color="success"
              disabled={save}
              type="submit"
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <input type="text" value={CategoryUI} hidden />
    </div>
  );
};
