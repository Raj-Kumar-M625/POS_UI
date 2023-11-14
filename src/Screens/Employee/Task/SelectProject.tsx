import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Backdrop,
} from "@mui/material";
import Select from "@mui/material/Select";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Link } from "react-router-dom";
import { Get } from "../../../Services/Axios";

const SelectProject = ({ openDialog, setOpenDialog }: any) => {
  const [list, setList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  const loadConnectionList = async () => {
    try {
      const response: any = await Get("/app/Project/GetEmployeeProjectlist");
      setList(response.data || []);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  interface Project {
    id: string;
    name: string;
  }
  const handleClose = () => {
    setSelectedProject("");
    setErrorMsg({
      message: "",
      show: false,
    });
    setOpenDialog({ add: false });
  };

  useEffect(() => {
    loadConnectionList();
  }, []);

  const handleCloseIconClick = () => {
    setSelectedProject("");
    setOpenDialog({ add: false });
  };

  return (
    <div>
      <Dialog
        open={openDialog?.selectProject}
        PaperProps={{
          style: { width: "40%", maxWidth: "1200px" },
        }}
        BackdropComponent={Backdrop}
        onClose={handleCloseIconClick}
      >
        <div
          style={{
            backgroundColor: "rgb(0 125 209)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle style={{ color: "#fff", flex: "1" }}>
            Select Project
          </DialogTitle>
          <CancelOutlinedIcon
            onClick={handleClose}
            sx={{
              color: "#fff",
              fontSize: "30px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          />
        </div>
        <DialogContent
          className="row popup"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="row"
            style={{ justifyContent: "center", marginBottom: "4rem" }}
          >
            <FormControl className="col m-2" style={{ width: "90%" }}>
              <InputLabel id="project">Project Name</InputLabel>
              <Select
                labelId="project"
                required
                id="project"
                label="Project Name"
                onChange={(event: any) =>
                  setSelectedProject(event.target.value)
                }
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                style={{ width: "100%" }}
              >
                {list.map((option: Project) => (
                  <MenuItem value={option.id} key={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            {errorMsg.show}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Button
                onClick={handleClose}
                variant="contained"
                style={{ background: "#e3165b" }}
              >
                Cancel
              </Button>
              {selectedProject && (
                <Link
                  to="/Employee/SelectUserStoryList"
                  state={{
                    projectId: selectedProject,
                    projectName: list.find(
                      (option) => option.id === selectedProject
                    )?.name,
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Button type="button" variant="contained" color="primary">
                    Continue To User Story
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default SelectProject;
