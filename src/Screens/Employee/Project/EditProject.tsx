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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { Get, Post } from "../../../Services/Axios";
import { useQuery } from "react-query";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/system";
import { AlertOption } from "../../../Models/Common/AlertOptions";

const formField = [
  "Name",
  "Type",
  "Description",
  "StartDate",
  "EndDate",
  "Status",
  "Percentage",
  "CreatedBy",
  "UpdatedBy",
  "TechStackId",
  "id",
];

export const EditProject = ({
  openDialog,
  setOpenDialog,
  Data,
  setReload,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [techStack, settechStack] = useState<any>([]);
  const [save, setSave] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });
  var temp = new Set();

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#0653cf",
  };

  const grey = {
    50: "#f6f8fa",
    100: "#eaeef2",
    200: "#d0d7de",
    300: "#afb8c1",
    400: "#8c959f",
    500: "#6e7781",
    600: "#57606a",
    700: "#424a53",
    800: "#32383f",
    900: "#24292f",
  };

  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 200px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 5.5;
    padding: 12px;
    border-radius: 5px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1.5px solid ${
      theme.palette.mode === "dark" ? grey[700] : grey[200]
    };

    &:hover {
      border-color: ${grey[900]}; 
    }

    &:focus {
      border-color: ${blue[400]};
      border:2px solid ${blue[900]}
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  async function fetchCommonMaster() {
    const commonMaster: any = await Get("app/CommonMaster/GetCodeTableList");
    return commonMaster.data;
  }
  const { data } = useQuery("C3RG5RSD", fetchCommonMaster);

  useEffect(() => {
    let temp: any = [];
    Data?.projectTechStacks?.map((e: any) => {
      temp.push(e.techStack);
    });
    settechStack(temp);
  }, []);

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
    setSave(true);
    data.TechStackId = techStack;

    const { error }: any = await Post(`app/Project/UpdateProject`, data);
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
        text: "Project Updated Successfully!",
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

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setSave(false);
    setOpenDialog({ edit: false });
  };
  return (
    <div>
      <Dialog open={openDialog?.edit || false}>
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
              Edit Project
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
                label="Project Name"
                type="text"
                variant="outlined"
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
              <FormControl className="col m-2">
                <InputLabel id="project-type">Project Type</InputLabel>
                <Select
                  labelId="project-type"
                  required
                  defaultValue={Data?.type.trim()}
                  id="project-type"
                  label="Project Type"
                  {...register("Type")}
                >
                  <MenuItem value="Web-App">Web App</MenuItem>
                  <MenuItem value="Mob-App">Mobile App</MenuItem>
                  <MenuItem value="Mob-App & Web-App">
                    Web and Mobile App
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <InputLabel id="Description" sx={{ ml: 2 }}>
                Description
              </InputLabel>
              <StyledTextarea
                required
                id="Description"
                {...register("Description")}
                className="col m-2 mt-2"
                aria-label="empty textarea"
                defaultValue={Data?.description}
                placeholder="Description"
              />
              <InputLabel id="Description" sx={{ ml: 2 }}>
                Description
              </InputLabel>
              <StyledTextarea
                required
                id="Description"
                {...register("Description")}
                className="col m-2 mt-2"
                aria-label="empty textarea"
                defaultValue={Data?.description}
              />
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="start-date">Start date</InputLabel>
                <TextField
                  required
                  id="start-date"
                  margin="dense"
                  defaultValue={Data?.startDate?.slice(0, 10)}
                  {...register("StartDate")}
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
                  defaultValue={Data?.endDate?.slice(0, 10)}
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="row">
                <FormControl className="col-md-6 m-2">
                  <InputLabel id="project-type">Tech Stack</InputLabel>
                  <Select
                    labelId="Tech-Stack"
                    id="Tech-Stack"
                    multiple
                    required
                    defaultValue={techStack ? techStack : []}
                    label="Tech Stack"
                    {...register("TechStackId", {
                      onChange: (e: any) => {
                        let arr = [...e.target.value];
                        temp = new Set(arr);
                        settechStack([...temp]);
                      },
                    })}
                  >
                    {data?.map((e: any) => {
                      if (e.codeType == "ProjectTechStackCatagory")
                        return (
                          <MenuItem value={e.id} key={e.codeValue}>
                            {e.codeName}
                          </MenuItem>
                        );
                    })}
                  </Select>
                </FormControl>
                <FormControl className="col m-2">
                  <InputLabel id="project-type">Status</InputLabel>
                  <Select
                    labelId="Status"
                    defaultValue={Data?.status}
                    required
                    id="Status"
                    label="Status"
                    {...register("Status")}
                  >
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="In Progress">In Progres</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("Percentage")} value="0" hidden />
              <input {...register("id")} value={Data?.id} hidden />
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
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
