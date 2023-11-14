import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Typography,
  TextField,
  Button,
  TextareaAutosize,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../../../StyleSheets/ReleaseNotes.css";
import { useEffect, useRef, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Get, Post } from "../../../Services/Axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ConvertDate } from "../../../Utilities/Utils";

export const ReleaseNotes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [Project, setProject] = useState<any>({
    ProjectId: 0,
    ProjectName: "",
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { register, handleSubmit, resetField } = useForm();
  const versionRef = useRef<HTMLInputElement>();
  const [Version, SetVersion] = useState<string>("0.0");
  const [ReleaseNotes, setReleaseNotes] = useState<any>([]);
  const map = new Map<number, string>();

  async function GetProjects() {
    const response: any = await Get("app/Project/GetAllProjectlist");
    setProjects(response.data || []);
  }

  async function GetProjectTasks() {
    const response: any = await Get(
      `app/ReleaseNotes/GetReadyForUATTaskList?projectId=${Project.ProjectId}`
    );
    setTasks(response.data || []);
  }

  async function GetReleaseNotes() {
    const response: any = await Get(
      `app/ReleaseNotes/GetReleaseNotes?projectId=${Project.ProjectId}`
    );

    const response2: any = await Get(
      `app/ReleaseNotes/GetReleaseNotesHistory?projectId=${Project.ProjectId}`
    );

    setReleaseNotes(response2.data || []);

    if (versionRef.current)
      versionRef.current.value = response.data.version || "0.0";
    SetVersion(response.data.version || "0.0");
  }

  useEffect(() => {
    GetProjects();
    GetProjectTasks();
    GetReleaseNotes();
  }, [loading]);

  const onSubmit = async (data: any) => {
    if (map.size == 0) {
      Swal.fire({
        icon: "error",
        title: "Please Select Release Notes!",
        showConfirmButton: true,
      });
      return;
    }

    if (Version == data.Version || data.Version == "0.0") {
      Swal.fire({
        icon: "error",
        title: "Please Change Version!",
        showConfirmButton: true,
      });
      return;
    } else if (data.Version < Version) {
      Swal.fire({
        icon: "error",
        title: "Version Should be Greater Than Current Version!",
        showConfirmButton: true,
      });
      return;
    }

    data.ProjectId = Project.ProjectId;
    data.TaskIdList = [...map.keys()];
    await Post("app/ReleaseNotes/AddReleaseNotes", data);
    setLoading(!loading);
    resetField("ReleasedDate");
    resetField("Description");
    Swal.fire({
      icon: "success",
      title: "Release Notes Added!",
      showConfirmButton: true,
    });
  };

  return (
    <div>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Release Notes</Typography>
      </Breadcrumbs>
      <div className="row col-md-6 m-5">
        <FormControl className="col-md-4">
          <InputLabel id="project">Select project</InputLabel>
          <Select
            labelId="Team-Name"
            id="Team-Name"
            required
            defaultValue=""
            label="Team Name"
            onChange={(e: any) => {
              var name: any = projects.find(
                (x: any) => x.id === e.target.value
              );
              setProject({
                ProjectId: e.target.value,
                ProjectName: name?.name,
              });
              setLoading(!loading);
            }}
          >
            {projects.map((e: any, index: number) => (
              <MenuItem value={e.id} key={index}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="d-flex mx-auto flex-box-container">
        <div className="ReleaseNotes w-50 border border-4 m-1">
          <h3 className="m-4">Release Notes</h3>
          <div
            className="m-3 overflow-scroll scroll border-bottom-white"
            style={{ height: 300 }}
          >
            {tasks.length > 0 ? (
              tasks.map((e: any, index: number) => {
                return (
                  <div key={index} className="d-flex">
                    <div>
                      <input
                        type="checkbox"
                        key={e.id}
                        onChange={(event: any) => {
                          if (event.target.checked) {
                            map.set(e.id, e.description);
                          } else {
                            map.delete(e.id);
                          }
                        }}
                        className="form-check-input mx-2"
                      />
                    </div>
                    <p style={{ cursor: "pointer" }}>{e.description}</p>
                  </div>
                );
              })
            ) : (
              <>
                {Project.ProjectId != 0 ? (
                  <div className="mt-5 fs-4 w-100 d-flex align-items-center justify-content-center">
                    <ErrorOutlineIcon className="fs-2 mx-2" />
                    No Data
                  </div>
                ) : (
                  <div className="mt-5 fs-4 w-100 d-flex align-items-center justify-content-center">
                    <ErrorOutlineIcon className="fs-2 mx-2" />
                    Select Project
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <form
          className="inputs w-50 border border-4 m-1 p-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputLabel className="m-2">
            Version<span className="text-danger">*</span>
          </InputLabel>
          <TextField
            required
            className="col-md-4 m-2"
            type="text"
            fullWidth
            inputRef={versionRef}
            defaultValue={"0.0"}
            {...register("Version")}
            variant="outlined"
          />
          <InputLabel className="m-2">Description*</InputLabel>
          <TextareaAutosize
            required
            {...register("Description")}
            className="col m-2 text-area form-control"
            style={{ height: 100, width: 695 }}
          />
          <InputLabel className="m-2">Released Date*</InputLabel>
          <TextField
            required
            className="col-md-4 m-2"
            type="date"
            {...register("ReleasedDate")}
            fullWidth
            variant="outlined"
          />
          <input
            type="number"
            defaultValue={Project.ProjectId}
            {...register("ProjectId")}
            hidden
          />
          <input {...register("CreatedBy")} value="user" hidden />
          <input {...register("UpdatedBy")} value="user" hidden />
          <Button
            variant="contained"
            color="success"
            className="m-2 float-end"
            type="submit"
          >
            Save
          </Button>
        </form>
      </div>
      <Typography variant="h4" className="mx-4">
        Released Notes
      </Typography>
      <div
        className="border border-2 m-4 overflow-hidden"
        style={{ height: "62vh" }}
      >
        <Typography variant="h5" className="mx-4 mt-3">
          Project Name: <b>{Project.ProjectName}</b>
        </Typography>
        <Divider className="m-3" />
        <div
          className="mx-4 mt-3  overflow-scroll scroll"
          style={{ height: "60vh", marginBottom: "10px" }}
        >
          {ReleaseNotes?.map((notes: any, index: number) => {
            return (
              <div key={index}>
                <h5>
                  Version: <b>{notes?.version}</b>
                </h5>
                <h5>
                  Released Date: <b>{ConvertDate(notes?.releasedDate)}</b>
                </h5>
                <h5 className="mb-3">
                  Description: <b>{notes?.description}</b>
                </h5>
                {notes?.tasks?.map((task: any, index: number) => (
                  <>
                    <span key={index + "P"}>
                      {index + 1}. {task.description}
                    </span>
                    <br />
                  </>
                ))}
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
