import { Breadcrumbs, Typography, Grid } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ListSubheader from "@mui/material/ListSubheader";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import List from "@mui/material/List";
import { ConvertDate } from "../../../Utilities/Utils";
import { useQuery } from "react-query";
import { Get } from "../../../Services/Axios";
import BackDrop from "../../../CommonComponents/BackDrop";
import arrow from "../../../assets/arrow.png";
// import HomeIcon from '@mui/icons-material/Home';
// import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
// import ListAltIcon from '@mui/icons-material/ListAlt';

export const TaskOverview = () => {
  const location = useLocation();
  const { isLoading, data } = useQuery("TaskOverview", async () => {
    const employeeDailyTask: any = await Get(
      `app/EmployeeDailyTask/GetEmployeeDailyTaskList?employeeTaskId=${location.state.employeeTaskId}`
    );
    return employeeDailyTask?.data;
  });
  var lastitem = data?.slice(-1)[0]?.percentage;

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link to="/Admin/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Employees</Typography>
        </Link>
        <Link to="/Admin/EmployeeOverView" state={location.state}>
          <Typography sx={{ fontWeight: "bold" }}>
            Employee Task OverView
          </Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Task OverView</Typography>
      </Breadcrumbs>
      <Grid sx={{ textAlign: "center" }}>
        <Typography className="fs-4">
          Task Name:
          <span className="fw-bolder">{location.state.taskname}</span>
        </Typography>
      </Grid>
      <div
        className=" border border-1 emp-over-cont mt-3 mx-auto w-75"
        style={{ backgroundColor: "#ebf5f3" }}
      >
        <List
          sx={{
            width: "100%",
            maxWidth: 1400,
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
              <div className="fs-6">
                <TaskAltIcon /> Task Progress Overview
              </div>
            </ListSubheader>
          }
        >
          {[1].map((sectionId) => (
            <li key={`section-${sectionId}`}>
              <ul>
                {data?.length == 0 ? (
                  <>
                    <h4 className="text-center m-2">No Tasks</h4>
                  </>
                ) : (
                  data?.map((item: any) => (
                    <>
                      <div key={`item-${sectionId}-${item.employeeTaskId}`}>
                        <div className="card m-2">
                          <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between">
                              <div>
                                <p className="card-text fs-6">
                                  <span className="fw-bolder">
                                    Description:
                                  </span>
                                  <span className="mx-1">
                                    {item.description}
                                  </span>
                                </p>
                              </div>
                              <div className="fs-6 mb-1">
                                <span className="fw-bolder">Created By: </span>
                                {item.createdBy}
                              </div>
                            </h5>
                            <div className="d-flex flex-column">
                              <h6 className="mb-2">
                                <span className="fw-bolder">
                                  Estimated Time:{" "}
                                </span>
                                {item.estTime}hrs &nbsp;&nbsp;
                              </h6>
                              <h6 className="mb-2">
                                <span className="fw-bolder">Actual Time: </span>
                                {item.actTime}hrs
                              </h6>
                            </div>
                            <p className="card-text d-flex justify-content-between">
                              <small className="text-muted fs-6">
                                Status:{" "}
                                <span
                                  className={
                                    item.percentage < 100
                                      ? `text-warning`
                                      : "text-success"
                                  }
                                >
                                  {item.status} ({item.percentage}%)
                                </span>
                              </small>

                              <div className="d-flex">
                                <h6 className="mb-2 mx-2 border p-2">
                                  <span className="fw-bolder">
                                    Start Date:{" "}
                                  </span>
                                  {ConvertDate(item.startDate)} &nbsp;&nbsp;
                                </h6>
                                <h6 className="mb-2 mx-2 border p-2">
                                  <span className="fw-bolder">End Date: </span>
                                  {ConvertDate(item.endDate)}
                                </h6>
                              </div>
                            </p>
                          </div>
                        </div>
                        {item?.percentage != lastitem ? (
                          <div className="d-flex ">
                            <img
                              className=""
                              src={arrow}
                              style={{
                                objectFit: "contain",
                                width: 30,
                                marginTop: 50,
                                margin: "0 auto",
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </>
                  ))
                )}
              </ul>
            </li>
          ))}
        </List>
      </div>
      <BackDrop open={isLoading} />
    </>
  );
};
