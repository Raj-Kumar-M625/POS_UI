import { useEffect, useState } from "react";
import { Get } from "../../../../Services/Axios";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { UserInterface } from "../../../../Models/Project/UserInterface";
import { TaskDTO } from "../../../../Models/Task/Task";

type SelectUserInterface = {
  setTask: Dispatch<SetStateAction<TaskDTO>>;
  task: TaskDTO;
};

export const SelectUserInterface = ({ setTask, task }: SelectUserInterface) => {
  const [userInterfaces, setuserInterfaces] = useState<UserInterface[]>([]);
  const [userInterfaceId, setUserInterfaceId] = useState<number>(0);

  async function fetchData() {
    const response: any = await Get(
      `app/Task/GetUserInterfacelist?UserStoryId=${task.userStoryId}`
    );
    setuserInterfaces(response.data || []);
  }
  useEffect(() => {
    fetchData();
  }, [task.userStoryId]);

  return (
    <div className="row  userStory-container m-1 d-flex justify-content-center">
      <FormControl className="w-50  mx-auto mt-1">
        <Autocomplete
          disablePortal
          options={userInterfaces.map((userInterface: UserInterface) => ({
            label: userInterface.name,
            id: userInterface.id,
          }))}
          onChange={(e: any, value: any) => {
            if (value) {
              setUserInterfaceId(value.id);
              setTask((prev: TaskDTO) => {
                return { ...prev, uiId: value.id };
              });
            } else {
              setTask((prev: TaskDTO) => {
                return { ...prev, uiId: 0 };
              });
              setUserInterfaceId(0);
              return e;
            }
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Search User Interface" />
          )}
        />
      </FormControl>
      <div className="border border-2 m-2 userStory overflow-scroll">
        {userInterfaces
          .filter((x) => x.id == userInterfaceId)
          .map((userInterface: UserInterface, index: number) => (
            <div className="card m-2" key={index}>
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                  <div className="fs-6">
                    <span className="fw-bolder">Name: </span>
                    {userInterface.name}
                  </div>
                </h5>
                <p className="card-text fs-6">
                  <span className="fw-bolder">Description: </span>
                  <span className="mx-1">{userInterface.description}</span>
                </p>
                <p className="card-text d-flex justify-content-between">
                  <small className="text-muted fs-6">
                    <span className="fw-bolder">Status: </span>
                    <span
                      className={
                        parseInt(`${userInterface.percentage}`) < 100
                          ? "text-warning"
                          : "text-success"
                      }
                    >
                      {userInterface.status} ({userInterface.percentage})
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
