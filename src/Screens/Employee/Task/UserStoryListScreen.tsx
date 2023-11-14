import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TaskIcon from "@mui/icons-material/Task";
import Divider from "@mui/material/Divider";
import { Link, useLocation } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import "../../../StyleSheets/EmployeeOverview.css";
import BackDrop from "../../../CommonComponents/BackDrop";
import { useQuery } from "react-query";
import { Get } from "../../../Services/Axios";
import { useState } from "react";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

export default function SelectEmployeeUserStory() {
  const location = useLocation();
  const { categoryName, subcategoryName, categoryId,isUiApplicable } = location.state;
  const [list, setList] = useState<any>([]);
  const [USList, setUSList] = useState<any>([]);
  const [projectName, setProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [stepCompletion, setStepCompletion] = useState({
    category: false,
    subcategory: false,
    project: false,
    userStory: false,
    userInterface: false,
  } as Record<string, boolean>);
 

  const { isLoading } = useQuery("SelectEmployeeUserStory", async () => {
    if (list.length > 0) {
      await LoadUSList(list[0].id);
    }
  });
  
  const loadconnectionlist = async () => {
    try {
      const response: any = await Get("/app/Project/GetEmployeeProjectlist");
      setList(response.data);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  
  const LoadUSList = async (projectId: number) => {
    debugger
    try {
      const response: any = await Get(`app/Task/GetProjectUSlist?ProjectId=${projectId}`);
      const userStories = response.data;
      setUSList(userStories);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
 
  useEffect(() => {
    loadconnectionlist();
    if (list.length > 0 && selectedProjectId !== null) {
      LoadUSList(selectedProjectId);
    }
  }, [list, selectedProjectId]);


  useEffect(() => {
    loadconnectionlist();
  }, []); 


  const handleProjectClick = (projectId: any) => {
    setSelectedProjectId(projectId.id); 
    setProjectName(projectId.name);
  };
  
  useEffect(() => {
    // Check if data is available for each step and update the completion status
    const isCategoryComplete = Boolean(categoryName);
    const isSubcategoryComplete = Boolean(subcategoryName);
    const isProjectComplete = Boolean(projectName && selectedProjectId);
    const isUserStoryComplete = Boolean(USList.length > 0);
    const isUserInterfaceComplete = false; // You can add a condition here based on your data

    setStepCompletion({
      category: isCategoryComplete,
      subcategory: isSubcategoryComplete,
      project: isProjectComplete,
      userStory: isUserStoryComplete,
      userInterface: isUserInterfaceComplete,
    });
  }, [categoryName, subcategoryName, projectName, selectedProjectId, USList]);

  const steps = [
    {
      label: `Category ${'\n'}(${categoryName})`,
      completed: stepCompletion.category,
    },
    {
      label: `Sub-Category ${'\n'} (${subcategoryName})`,
      completed: stepCompletion.subcategory,
    },
    {
      label: `Project Name (${projectName})`,
      completed: stepCompletion.project,
    },
  ];

  return (
    <>
      <div className="d-flex w-100">
        <div
          className="mt-4 border border-1 overflow-scroll w-25  emp-over-cont mx-4"
          style={{ backgroundColor: "#ebf5f3" }}
        >
         
<List
  sx={{
    width: "100%",
    maxWidth: 390,
    maxHeight: 570,
    backgroundColor: "#ebf5f3",
    fontFamily: "Product Sans",
  }}
  component="nav"
  aria-labelledby="nested-list-subheader"
  subheader={
    <ListSubheader
      component="div"
      id="nested-list-subheader"
      className="fs-5"
      sx={{ backgroundColor: "#85edc0", padding: 1 }}
    >
      <TaskIcon />
      Projects
    </ListSubheader>
  }
>

  <h5 className="text-center m-2">{projectName}</h5>
</List>
  
  {list.length === 0 ? (
    <h5 className="text-center m-2">No Projects</h5>
  ) : (
    list.map((e: any) => (
      <div key={e.name}>
        <ListItemButton onClick={() => handleProjectClick(e)}>
          <ListItemText
            primary={`${e.name} `}
          />
        </ListItemButton>
        <Divider />
      </div>
    ))
  )}
        </div>
        <div
          className="mt-4 border border-1 emp-over-cont mx-4 w-75"
          style={{ backgroundColor: "#ebf5f3" }}
        >
            <Box sx={{ width: '100%' }}>
              <Stepper alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={index} completed={step.completed}>
                    <StepLabel
                      sx={{
                        ...(step.completed && {
                          '& .MuiStepIcon-root': {
                            color: '#4caf50', // Green color for completed step
                          },
                        }),
                      }}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          <List
            sx={{
              width: "100%",
              maxWidth: 1190,
              backgroundColor: "#ebf5f3",
              position: "relative",
              overflow: "auto",
              maxHeight: 570,
              ontFamily: "Product Sans",
              "& ul": { padding: 0 },
            }}
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className="fw-bold d-flex align-items-center justify-content-between"
                sx={{ backgroundColor: "#85edc0", padding: 1 }}
              >
                <div className="fs-6  d-flex align-items-center flex-column">
                  <span>
                    <TaskAltIcon /> User Story ({" "}
                    {projectName?.length > 15 ? (
                      <abbr
                        title={projectName}
                        className=" text-decoration-none"
                      >
                        {projectName.slice(0, 15) + "..."}
                      </abbr>
                    ) : (
                      projectName || "No Projects"
                    )}{" "}
                    ) 
                  </span>
                </div>
              </ListSubheader>
            }
          >
          {USList && USList.length > 0 ? (
  USList.map((item: any) => (
    <li key={`item-${item.id}`}>
      <ul>
        <div className="card m-2">
        {isUiApplicable ? (
          <Link
            to="/Employee/SelectUserInterface"
            style={{ color: "inherit" }}
            state={{
              ...location.state,
              userstoryId:item.id,
    projectId: selectedProjectId,
    projectName: projectName,
    categoryName:categoryName,
    subcategoryName:subcategoryName,
    categoryId:categoryId,
    userstoryName:item.name,
            }}
          >
            <ListItemButton>
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                  <div>
                    <span className="fw-bolder">Name: </span>
                    {item.name}
                  </div>
                </h5>
                <p className="card-text fs-6">
                  <span className="fw-bolder">Description: </span>
                  <span className="mx-1">{item.description}</span>
                </p>
                <p className="card-text d-flex justify-content-between">
                  <small className="text-muted fs-6">
                    <span className="fw-bolder">Status: </span>
                    <span
                      className={
                        item.percentage < 100
                          ? "text-warning"
                          : "text-success"
                      }
                    >
                      {item.status} ({item.percentage}%)
                    </span>
                  </small>
                </p>
              </div>
            </ListItemButton>
          </Link>
        ):(
          <Link
          to="/Employee/CreateTask"
          style={{ color: "inherit" }}
          state={{
            ...location.state,
            userstoryId:item.id,
  projectId: selectedProjectId,
  projectName: projectName,
  categoryName:categoryName,
  subcategoryName:subcategoryName,
  categoryId:categoryId,
  userstoryName:item.name,
  isUiApplicable:isUiApplicable,
          }}
        >
          <ListItemButton>
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-between">
                <div>
                  <span className="fw-bolder">Name: </span>
                  {item.name}
                </div>
              </h5>
              <p className="card-text fs-6">
                <span className="fw-bolder">Description: </span>
                <span className="mx-1">{item.description}</span>
              </p>
              <p className="card-text d-flex justify-content-between">
                <small className="text-muted fs-6">
                  <span className="fw-bolder">Status: </span>
                  <span
                    className={
                      item.percentage < 100
                        ? "text-warning"
                        : "text-success"
                    }
                  >
                    {item.status} ({item.percentage}%)
                  </span>
                </small>
              </p>
            </div>
          </ListItemButton>
        </Link>
      )}
        </div>
      </ul>
    </li>
  ))
) : (
  <h4 className="text-center m-2">
                {selectedProjectId ? "No User Stories" : "Select Project To View the User Story"}
              </h4>
)}

      </List>
    </div>
  </div>
  <BackDrop open={isLoading} />
</>
  );
}
