import {
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
import Select from "@mui/material/Select";
import { Get } from "../../../Services/Axios";
import { ConvertDate } from "../../../Utilities/Utils";
import { useEffect, useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/system";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export const ViewProject = ({ openDialog, setOpenDialog, Data }: any) => {
  const [techStack, settechStack] = useState<any>([]);
  const [commonMaster, setCommonMaster] = useState<any>([]);

  const handleClose = () => {
    setOpenDialog({ add: false });
  };

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
    line-height: 4.5;
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

  async function fetchCommonMaster2() {
    const commonMaster: any = await Get("app/CommonMaster/GetCodeTableList");
    const teamName: any = await Get("app/Team/GetTeamList");
    setCommonMaster(commonMaster.data);
    return teamName;
  }

  useEffect(() => {
    fetchCommonMaster2();
    let temp: any = [];
    Data?.projectTechStacks?.map((e: any) => {
      temp.push(e.techStack);
    });
    settechStack(temp);
    fetchCommonMaster2();
  }, [openDialog?.view]);

  return (
    <div>
      <Dialog open={openDialog?.view || false}>
        <form>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle style={{ color: "blue", flex: "1" }}>
              View Project
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
            <div className="row">
              <TextField
                className="col m-2"
                label="Project Name"
                aria-readonly
                value={Data?.name}
                type="text"
                variant="outlined"
              />
              <TextField
                className="col m-2"
                label="Project Type"
                aria-readonly
                value={Data?.type}
                type="text"
                variant="outlined"
              />
            </div>
            <div className="row">
              <InputLabel id="description" sx={{ ml: 2 }}>
                Description
              </InputLabel>
              <StyledTextarea
                disabled={true}
                id="description"
                className="col m-2 mb-3"
                aria-label="empty textarea"
                defaultValue={Data?.description}
              />
            </div>
            <div className="row">
              <div className="col">
                <InputLabel id="start-date">Start date</InputLabel>
                <TextField
                  aria-readonly
                  id="start-date"
                  margin="dense"
                  label=""
                  type="text"
                  value={ConvertDate(Data?.startDate)}
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="col">
                <InputLabel id="end-date">End date</InputLabel>
                <TextField
                  aria-readonly
                  id="end-date"
                  margin="dense"
                  label=""
                  value={ConvertDate(Data?.endDate)}
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row">
              <FormControl className="col mt-2 mx-2">
                <InputLabel id="project-type">Tech Stack</InputLabel>
                <Select
                  labelId="Tech-Stack"
                  id="Tech-Stack"
                  multiple
                  aria-readonly
                  defaultValue={techStack}
                  label="Tech Stack"
                  style={{ pointerEvents: "none", touchAction: "none" }}
                >
                  {commonMaster?.map((e: any) => {
                    if (e.codeType == "ProjectTechStackCatagory")
                      return (
                        <MenuItem value={e.id} key={e.codeValue}>
                          {e.codeName}
                        </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
              <div className="col">
                <TextField
                  aria-readonly
                  margin="dense"
                  label="Status"
                  value={Data?.status}
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
