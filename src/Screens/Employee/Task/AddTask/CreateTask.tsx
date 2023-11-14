import { Dispatch, SetStateAction, useState } from "react";
import "../../../../StyleSheets/AddTask.css";
import Modal from "react-bootstrap/Modal";
import { SelectProject } from "./SelectProject";
import { SelectUserStory } from "./SelectUserStory";
import { SelectCategory } from "./SelectCategory";
import { AddTask } from "./AddTask";
import { SelectUserInterface } from "./SelectUserInterface";
import { TaskDTO } from "../../../../Models/Task/Task";
import { TASK } from "../../../../Constants/Task/Task";
import { X } from "lucide-react";

type CreateTaskProp = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setReload: Dispatch<SetStateAction<boolean>>;
};

export function CreateTask({ open, setOpen, setReload }: CreateTaskProp) {
  const [Index, setIndex] = useState(0);
  const [task, setTask] = useState<TaskDTO>(TASK);
  const [uiApplicable, setUIApplicable] = useState<boolean>(false);
  const SIZE = uiApplicable ? 5 : 4;

  function showNext() {
    setIndex((index) => {
      if (index === SIZE - 1) return index;
      return index + 1;
    });
    disableButton();
  }

  function showPrev() {
    setIndex((index) => {
      if (index === 0) return 0;
      return index - 1;
    });
  }

  function handleClose() {
    setOpen(false);
    setIndex(0);
    setTask(TASK);
  }

  function disableButton(): boolean | undefined {
    switch (Index) {
      case 0:
        if (task.projectId === 0) return true;
        break;
      case 1:
        if (task.userStoryId === 0) return true;
        break;
      case 2:
        if (task.categoryId === 0) return true;
        break;
      case 3:
        if (uiApplicable) if (task.uiId === 0) return true;
        break;
    }
    return false;
  }

  return (
    <Modal show={open} contentClassName="add-task-modal mt-4" centered>
      <Modal.Header className="bg-primary text-light">
        <Modal.Title>Create Task</Modal.Title>
        <X onClick={handleClose} style={{ cursor: "pointer" }} />
      </Modal.Header>
      <Modal.Body>
        <section
          aria-label="Image Slider"
          style={{
            width: "60rem",
            height: "28rem",
          }}
        >
          <a href="#after-image-slider-controls" className="skip-link">
            Skip Image Slider Controls
          </a>
          <div
            style={{
              width: "60rem",
              height: "28rem",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden={Index !== 0}
              className="img-slider-img border border-3"
              style={{
                translate: `${-100 * Index}%`,
              }}
            >
              <h3 className="mx-3 mt-3 fw-bolder text-center">
                Select Project
              </h3>
              <SelectProject setTask={setTask} />
            </div>
            <div
              aria-hidden={Index !== 0}
              className="img-slider-img border border-3"
              style={{
                translate: `${-100 * Index}%`,
              }}
            >
              <h3 className="mx-3 mt-3 fw-bolder text-center">
                Select User Story
              </h3>
              <SelectUserStory setTask={setTask} task={task} />
            </div>

            <div
              aria-hidden={Index !== 0}
              className="img-slider-img border border-3"
              style={{
                translate: `${-100 * Index}%`,
              }}
            >
              <h3 className="mx-3 mt-3 fw-bolder text-center">
                Select Categories
              </h3>
              <SelectCategory
                setUIApplicable={setUIApplicable}
                setTask={setTask}
              />
            </div>
            {uiApplicable && (
              <div
                aria-hidden={Index !== 0}
                className="img-slider-img border border-3"
                style={{
                  translate: `${-100 * Index}%`,
                }}
              >
                <h3 className="mx-3 mt-3 fw-bolder text-center">
                  Select User Interface
                </h3>
                <SelectUserInterface setTask={setTask} task={task} />
              </div>
            )}
            <div
              aria-hidden={Index !== 0}
              className="img-slider-img border border-3 overflow-scroll"
              style={{
                translate: `${-100 * Index}%`,
              }}
            >
              <h3 className="mx-3 mt-3 fw-bolder text-center">Add Task</h3>
              <AddTask
                task={task}
                setTask={setTask}
                handleClose={handleClose}
                setReload={setReload}
              />
            </div>
          </div>
          {Index !== 0 && (
            <button
              onClick={showPrev}
              className="img-slider-btn btn btn-info btn-sm mx-3"
              style={{ left: 0 }}
              aria-label="View Previous Image"
            >
              PREVIOUS
            </button>
          )}
          {Index != SIZE - 1 && (
            <button
              onClick={showNext}
              className="img-slider-btn btn btn-info btn-sm mx-3"
              style={{ right: 0 }}
              aria-label="View Next Image"
              disabled={disableButton()}
            >
              NEXT
            </button>
          )}
          <div id="after-image-slider-controls" />
        </section>
      </Modal.Body>
    </Modal>
  );
}
