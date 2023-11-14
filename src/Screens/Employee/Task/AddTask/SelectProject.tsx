import { useEffect, useState } from "react";
import { Project } from "../../../../Models/Project/Project";
import { Get } from "../../../../Services/Axios";
import { FormControl, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Dispatch, SetStateAction } from "react";
import { TaskDTO } from "../../../../Models/Task/Task";

type SelectProjectProp = {
  setTask: Dispatch<SetStateAction<TaskDTO>>;
};

export const SelectProject = ({ setTask }: SelectProjectProp) => {
  const [projects, setProjects] = useState<Project[]>([]);

  async function fetchData() {
    const response: any = await Get("/app/Project/GetEmployeeProjectlist");
    setProjects(response.data || []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="row w-50 mx-auto mt-5 h-50 d-flex align-items-center">
      <FormControl className="col m-2">
        <Autocomplete
          disablePortal
          options={projects.map((project: Project) => ({
            label: project.name,
            id: project.id,
          }))}
          onChange={(e: any, value: any) => {
            setTask((prev: TaskDTO) => {
              return { ...prev, projectId: value?.id ?? 0 };
            });
            return e;
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Project Name" />
          )}
        />
      </FormControl>
    </div>
  );
};
