import { useEffect, useState } from "react";
import { Get } from "../../../../Services/Axios";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { UserStory } from "../../../../Models/Project/UserStory";
import { Dispatch, SetStateAction } from "react";
import { TaskDTO } from "../../../../Models/Task/Task";

type SelectUserStoryProp = {
  setTask: Dispatch<SetStateAction<TaskDTO>>;
  task: TaskDTO;
};

export const SelectUserStory = ({ setTask, task }: SelectUserStoryProp) => {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [userStoryId, setUserStoryId] = useState<number>(0);

  async function fetchData() {
    const response: any = await Get(
      `app/Project/GetUserStoryList?projectId=${task.projectId}`
    );
    setUserStories(response.data || []);
  }
  useEffect(() => {
    fetchData();
  }, [task.projectId]);

  return (
    <div className="row  userStory-container m-1 d-flex justify-content-center">
      <FormControl className="w-50  mx-auto mt-1">
        <Autocomplete
          disablePortal
          options={userStories.map((userStory: UserStory) => ({
            label: userStory.name,
            id: userStory.id,
          }))}
          onChange={(e: any, value: any) => {
            if (value) {
              setUserStoryId(value.id);
            } else {
              setUserStoryId(0);
            }
            setTask((prev: TaskDTO) => {
              return { ...prev, userStoryId: value?.id ?? 0 };
            });
            return e;
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Search User Story" />
          )}
        />
      </FormControl>
      <div className="border border-2 m-2 userStory overflow-scroll">
        {userStories
          .filter((x) => x.id == userStoryId)
          .map((userStory: UserStory, index: number) => (
            <div className="card m-2" key={index}>
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                  <div className="fs-6">
                    <span className="fw-bolder">Name: </span>
                    {userStory.name}
                  </div>
                </h5>
                <p className="card-text fs-6">
                  <span className="fw-bolder">Description: </span>
                  <span className="mx-1">{userStory.description}</span>
                </p>
                <p className="card-text d-flex justify-content-between">
                  <small className="text-muted fs-6">
                    <span className="fw-bolder">Status: </span>
                    <span
                      className={
                        parseInt(`${userStory.percentage}`) < 100
                          ? "text-warning"
                          : "text-success"
                      }
                    >
                      {userStory.status} ({userStory.percentage})
                    </span>
                  </small>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
