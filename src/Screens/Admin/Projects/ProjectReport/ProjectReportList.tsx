import { useLocation, Link } from "react-router-dom";
import Select from "react-select";
import { Typography, Breadcrumbs, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { RectangleCard, SquareCard } from "../../../../CommonComponents/Card";
import { COMPLETED, PENDING } from "../../../../Constants/Common";
import DataTable from "react-data-table-component";
import {
  FILTER,
  PRIORITY_TASKS,
  PROJECTREPORT,
  TASK_LIST,
} from "../../../../Constants/ProjectReport/ProjectReport";
import { useEffect, useRef, useState } from "react";
import {
  ProjectReportVM,
  ReportFilter,
} from "../../../../Models/Project/Project";
import { Get } from "../../../../Services/Axios";
import { UserInterface } from "../../../../Models/Project/UserInterface";
import { UserStory } from "../../../../Models/Project/UserStory";
import { Task, TaskListDto } from "../../../../Models/Task/Task";
import BackDrop from "../../../../CommonComponents/BackDrop";
import { ConvertDate } from "../../../../Utilities/Utils";
import { useContextProvider } from "../../../../CommonComponents/Context";
import { Category } from "../../../../Models/Common/CommonMaster";
import Swal from "sweetalert2";
import "../../../../App.css";

const ProjectReportList = () => {
  const location = useLocation();
  const { startDate, endDate }: any = location.state;
  const [filter, setFilter] = useState<ReportFilter>(FILTER);
  const [loading, setLoading] = useState<boolean>(false);
  const [highPriorityTasks, setHighPriorityTasks] = useState<
    Array<TaskListDto>
  >(PROJECTREPORT.highPriorityTasks);
  const [projectReport, SetProjectReport] =
    useState<ProjectReportVM>(PROJECTREPORT);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const userStoryRef = useRef<any>();
  const userInterfaceRef = useRef<any>();
  const categoryRef = useRef<any>();
  const subCategoryRef = useRef<any>();
  const { category, role } = useContextProvider();
  const categorySet = new Set<string>();

  category.forEach((category: Category) => {
    categorySet.add(category.categories);
  });

  async function GetData() {
    setLoading(true);
    const response: any = await Get(
      `app/Project/GetProjectReportDetails?projectId=${location.state.projectId}`
    );
    SetProjectReport(response?.data ?? PROJECTREPORT);
    setHighPriorityTasks(response?.data?.highPriorityTasks);
    setLoading(false);
  }

  useEffect(() => {
    GetData();
  }, []);

  function ApplyFilter() {
    var temp: Array<TaskListDto> = projectReport.highPriorityTasks;

    if (filter.startDate !== null) {
      if (filter.endDate === null) {
        Swal.fire({
          title: "",
          text: "Please select End Date!",
          icon: "warning",
        });
        return;
      } else {
        temp = projectReport.highPriorityTasks.filter(
          (x) =>
            x.actualStartDate.slice(0, 10) >= `${filter?.startDate}` &&
            x.actualStartDate.slice(0, 10) <= `${filter?.endDate}`
        );
        setHighPriorityTasks(temp);
      }
    }

    if (filter.userStory !== null) {
      temp = temp.filter(
        (task: TaskListDto) =>
          task?.usName
            ?.toLowerCase()
            .search(`${filter.userStory?.toLowerCase()}`) >= 0
      );
      setHighPriorityTasks(temp);
    }

    if (filter.userInterface !== null) {
      temp = temp.filter(
        (task: TaskListDto) =>
          task?.uiName
            ?.toLowerCase()
            .search(`${filter.userInterface?.toLowerCase()}`) >= 0
      );
      setHighPriorityTasks(temp);
    }

    if (filter.category !== null) {
      temp = temp.filter(
        (task: TaskListDto) =>
          task?.category
            ?.toLowerCase()
            .search(`${filter.category?.toLowerCase()}`) >= 0
      );
      setHighPriorityTasks(temp);
    }

    if (filter.subCategory !== null) {
      temp = temp.filter(
        (task: TaskListDto) =>
          task?.subCategory
            ?.toLowerCase()
            .search(`${filter.subCategory?.toLowerCase()}`) >= 0
      );
      setHighPriorityTasks(temp);
    }
  }

  function reset() {
    if (startDateRef.current) startDateRef.current.value = "";
    if (endDateRef.current) endDateRef.current.value = "";
    if (categoryRef.current) categoryRef.current.clearValue();
    if (subCategoryRef.current) subCategoryRef.current.clearValue();
    if (userInterfaceRef.current) userInterfaceRef.current.clearValue();
    if (userStoryRef.current) userStoryRef.current.clearValue();
    setFilter(FILTER);
    setHighPriorityTasks(projectReport.highPriorityTasks);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="inherit" to="/Admin/Project">
          <Typography sx={{ fontWeight: "bold" }}>Projects</Typography>
        </Link>
        <Link
          color="inherit"
          to="/Admin/ProjectQuadrant"
          state={{ ...location.state }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Project Quadrant</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Project Report</Typography>
      </Breadcrumbs>
      <div className="d-flex justify-content-between mx-5  mt-3">
        <span>
          <h5>
            Project Name: <b>{location.state.projectName}</b>
          </h5>
        </span>
        <div>
          <h5>
            Project Start Date: <b>{ConvertDate(startDate)}</b>
          </h5>
          <h5>
            Project End Date: <b>{ConvertDate(endDate)}</b>
          </h5>
        </div>
      </div>

      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">Start Date</label>
              <input
                onChange={(e: any) => {
                  setFilter((prevState: ReportFilter) => {
                    return {
                      ...prevState,
                      startDate: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                type="date"
                id="end-date"
                placeholder="End Date"
                ref={startDateRef}
                className="m-1 col form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="mx-1">End Date</label>
              <input
                onChange={(e: any) => {
                  setFilter((prevState: ReportFilter) => {
                    return {
                      ...prevState,
                      endDate: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
                type="date"
                id="end-date"
                placeholder="End Date"
                ref={endDateRef}
                className="m-1 col form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Story</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="UserStory"
                ref={userStoryRef}
                className="select-dropdowns mt-1 col"
                onChange={(code: any) => {
                  setFilter((prevState: ReportFilter) => {
                    return {
                      ...prevState,
                      userStory: code ? code.value : null,
                    };
                  });
                }}
                options={projectReport.highPriorityTasks
                  .filter((x) => x.usName?.length > 0)
                  .map((task: TaskListDto) => ({
                    label: task.usName.trim(),
                    value: task.usName.trim(),
                  }))}
                placeholder="User Story"
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Interface</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="UserInterface"
                ref={userInterfaceRef}
                className="select-dropdowns mt-1 col"
                onChange={(code: any) => {
                  setFilter((prevState: ReportFilter) => {
                    return {
                      ...prevState,
                      userInterface: code ? code.value : null,
                    };
                  });
                }}
                options={projectReport.highPriorityTasks
                  .filter((x) => x.uiName?.length > 0)
                  .map((task: TaskListDto) => ({
                    lable: task.uiName,
                    value: task.uiName,
                  }))}
                placeholder="User Interface"
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Category</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="Category"
                ref={categoryRef}
                className="select-dropdowns mt-1 col"
                onChange={(code: any) => {
                  setFilter((prevState: ReportFilter) => {
                    return {
                      ...prevState,
                      category: code ? code.value : null,
                    };
                  });
                }}
                options={[...categorySet].map((category: string) => ({
                  label: category,
                  value: category,
                }))}
                placeholder="Category"
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Sub Category</label>
              <Select
                aria-label="Floating label select example"
                isClearable={true}
                name="SubCategory"
                ref={subCategoryRef}
                className="select-dropdowns mt-1 col"
                onChange={(code: any) => {
                  setFilter((prevState: ReportFilter) => {
                    return {
                      ...prevState,
                      subCategory: code ? code.value : null,
                    };
                  });
                }}
                options={category
                  .filter((x) => x.categories === filter.category)
                  .map((category: Category) => ({
                    label: category.subCategory,
                    value: category.subCategory,
                  }))}
                placeholder="Sub Category"
                isSearchable={true}
              />
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-auto">
                <Button
                  variant="contained"
                  endIcon={<SearchIcon />}
                  className="mx-3 mt-3 "
                  onClick={() => ApplyFilter()}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  endIcon={<RefreshIcon />}
                  className="mx-3 mt-3 "
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="border border-4 mx-5 d-flex p-2 g-3 justify-content-evenly"
        style={{ backgroundColor: "#e1f4f5" }}
      >
        <div>
          <div style={{ height: "6rem" }} />
          <RectangleCard text={COMPLETED} />
          <RectangleCard text={PENDING} />
        </div>
        <div className="p-2">
          <div className="d-flex">
            <Link
              to={`/${role}/UserStory`}
              state={{
                ...location.state,
                projectReportRoute: true,
                status: "",
              }}
            >
              <SquareCard
                text={"User Stories"}
                count={projectReport.userStory.length}
                classNames="squareCard hoverEffect"
              />
            </Link>
            <Link
              to={`/${role}/UserInterface`}
              state={{
                ...location.state,
                projectReportRoute: true,
                status: "",
              }}
            >
              <SquareCard
                text={"User Interface"}
                count={projectReport.userInterface.length}
                classNames="squareCard hoverEffect"
              />
            </Link>
            <Link
              to={`/${role}/Task`}
              state={{
                ...location.state,
                projectReportRoute: true,
                status: "",
              }}
            >
              <SquareCard
                text={"Total No.of Tasks"}
                count={projectReport.task.length}
                classNames="squareCard hoverEffect"
              />
            </Link>
            <SquareCard
              text={"Total No.of Resources"}
              count={projectReport.totalResource}
              classNames="squareCard"
            />

            <SquareCard
              text={"Total No.of Resources Hours"}
              count={projectReport.totalResourceHours}
              classNames="squareCard"
            />

            <SquareCard
              text={`Project Completion %`}
              classNames="squareCard"
              count={parseFloat(
                `${projectReport.completedPercentage ?? 0}`
              ).toFixed(2)}
            />
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <div>
                <Link
                  to={`/${role}/UserStory`}
                  state={{
                    ...location.state,
                    projectReportRoute: true,
                    status: COMPLETED,
                  }}
                >
                  <RectangleCard
                    count={
                      projectReport.userStory.filter(
                        (x: UserStory) => x.percentage === 100
                      ).length
                    }
                    classNames="rectangleCard"
                  />
                </Link>
                <Link
                  to={`/${role}/UserStory`}
                  state={{
                    ...location.state,
                    projectReportRoute: true,
                    status: PENDING,
                  }}
                >
                  <RectangleCard
                    classNames="rectangleCard"
                    count={
                      projectReport.userStory.filter(
                        (x: UserStory) => parseInt(`${x.percentage}`) < 100
                      ).length
                    }
                  />
                </Link>
              </div>
              <div>
                <Link
                  to={`/${role}/UserInterface`}
                  state={{
                    ...location.state,
                    projectReportRoute: true,
                    status: COMPLETED,
                  }}
                >
                  <RectangleCard
                    classNames="rectangleCard"
                    count={
                      projectReport.userInterface.filter(
                        (x: UserInterface) => x.percentage === 100
                      ).length
                    }
                  />
                </Link>
                <Link
                  to={`/${role}/UserInterface`}
                  state={{
                    ...location.state,
                    projectReportRoute: true,
                    status: PENDING,
                  }}
                >
                  <RectangleCard
                    classNames="rectangleCard"
                    count={
                      projectReport.userInterface.filter(
                        (x: UserInterface) => parseInt(`${x.percentage}`) < 100
                      ).length
                    }
                  />
                </Link>
              </div>
              <div>
                <Link
                  to={`/${role}/Task`}
                  state={{
                    ...location.state,
                    projectReportRoute: true,
                    status: COMPLETED,
                  }}
                >
                  <RectangleCard
                    classNames="rectangleCard"
                    count={
                      projectReport.task.filter(
                        (x: Task) => x.percentage === 100
                      ).length
                    }
                  />
                </Link>
                <Link
                  to={`/${role}/Task`}
                  state={{
                    ...location.state,
                    projectReportRoute: true,
                    status: PENDING,
                  }}
                >
                  <RectangleCard
                    classNames="rectangleCard"
                    count={
                      projectReport.task.filter((x: Task) => x.percentage < 100)
                        .length
                    }
                  />
                </Link>
              </div>
            </div>
            <div>
              <div>
                <RectangleCard
                  text={`${parseFloat(
                    `${projectReport.completedPercentage ?? 0} `
                  ).toFixed(2)}%`}
                />
                <RectangleCard
                  text={`${parseFloat(
                    `${projectReport?.pendingPercentage ?? 0}`
                  ).toFixed(2)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mx-5 mt-5 p-3 text-light d-flex align-items-center"
        style={{ backgroundColor: "#747de3" }}
      >
        <h5 className="m-1 fw-bold">List Of Top Priority Tasks</h5>
      </div>
      <div className="mx-5 mt-2">
        <DataTable
          customStyles={{
            table: {
              style: {
                height: "80vh",
                border: "1px solid rgba(0,0,0,0.1)",
              },
            },

            headRow: {
              style: {
                background: "#1e97e8",
                fontSize: "16px",
                color: "white",
                fontFamily: "inherit",
              },
            },
          }}
          columns={PRIORITY_TASKS}
          data={highPriorityTasks}
        />
      </div>
      <div
        className="mx-5 mt-5 p-3 text-light d-flex align-items-center"
        style={{ backgroundColor: "#747de3" }}
      >
        <h5 className="m-1 fw-bold">List Of Tasks</h5>
      </div>
      <div className="mx-5 mt-2">
        <DataTable
          customStyles={{
            table: {
              style: {
                height: "80vh",
                border: "1px solid rgba(0,0,0,0.1)",
              },
            },

            headRow: {
              style: {
                background: "#1e97e8",
                fontSize: "16px",
                color: "white",
                fontFamily: "inherit",
              },
            },
          }}
          columns={TASK_LIST}
          data={projectReport.todaysTasks ?? []}
        />
      </div>
      <BackDrop open={loading} />
    </>
  );
};

export default ProjectReportList;
