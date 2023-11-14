import "../../../StyleSheets/EmployeeAttendance.css";
import HomeIcon from "@mui/icons-material/Home";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import BackDrop from "../../../CommonComponents/BackDrop";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import  { useState, useEffect } from "react";
import { Get } from "../../../Services/Axios";


export const Checklist = () => {
    const [projectList, setProjectList] = useState<any>([]);

    async function fetchData(){
      const response:any = await Get("app/Project/getCheckListProject");
      setProjectList(response?.data || [])
    }
  
    useEffect(() => {
      fetchData()
    }, []);
 console.log(projectList)
return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
          <Typography color="slateblue">
            <SpellcheckIcon sx={{ mr: 0.5 }} fontSize="inherit" />
           CheckList
          </Typography>
      </Breadcrumbs>
      <div className="emp-atte-his p-3 overflow-scroll mb-4">
     <h2 className="m-3">Project List</h2>

  <div className="m-3 d-flex flex-wrap justify-content-between">
        {projectList.map((project:any) => (
        <Link to="/Admin/ProjectTasks"  
        state={{
          projectId: project.id,
        }} key={project.id}>
    
     <div  className="flex-2 mt-4 d-flex align-items-center flex-column">
       
        <div className="d-flex align-items-center justify-content-between width">
          <div className="d-flex align-items-center justify-content-start mx-3">
          <h5 className="mx-2" style={{ marginTop: 10 }}>{project.projectName}</h5>
          </div>
          
        </div>
        <div className="d-flex justify-content-between width-1">
          <div className="col-sm-3">
            <div className="form-group">
              <p className="mb-1 ">DEV Checked</p>
              <h5
                id="name"
                className="time d-flex"
                style={{ width: "5em" }}
              >
                {project.devCheckCount}

              </h5>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group">
              <p className="mb-1 ">QA Checked</p>
              <h5
                id="name"
                className="time d-flex"
                style={{ width: "5em" }}
              >
                  {project.qaCheckCount}

              </h5>
            </div>
          </div>
        </div>
      </div></Link>
    ))}
    {[1,2,3,4,5,6,7,8,9].length % 3 !== 0 && (
      <div
        className="flex-2 m-1 d-flex align-items-center flex-column hidden"
        style={{ visibility: "hidden" }}
      ></div>
    )}
  </div>
</div>
<BackDrop open={false} />
</>
);
};
