import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { Breadcrumbs, Button, Tooltip, Typography } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { ConvertDate } from "../../../Utilities/Utils";
import Select from "react-select";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserStory } from "../../../Models/Project/UserStory";
import { SelectCategory } from "./SelectCategory";
export default function SelectUserStoryList() {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const [rows, setRows] = useState<any>([]);
  const [filterRows, setfilterRows] = useState<any>([]);
  const usNameRef = useRef<HTMLInputElement>(null);
  const [filter, setfilter] = useState<UserStory>({});
  const statusRef = useRef<any>();
  const actStartDateRef = useRef<HTMLInputElement>(null);
  const actEndDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let userStoryList = Get(
      `app/Project/GetUserStoryList?projectId=${location.state.projectId}`
    );
    userStoryList.then((response: any) => {
      setRows(response?.data || []);
      setfilterRows(response?.data || []);
      setLoading(false);
    });
  }, [loading]);

  function ApplyFilter() {
    let temp: any = [];

    if (filter.startDate != null) {
      if (filter.endDate == null) {
        actEndDateRef.current?.focus();
        return;
      }
      temp = [];
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].startDate.slice(0, 10) >= filter.startDate &&
          rows[i].endDate.slice(0, 10) <= filter.endDate
        ) {
          temp.push(rows[i]);
        }
      }
      setfilterRows(temp);
    } else {
      temp = rows;
    }

    if (filter.name != null) {
      temp = temp.filter((e: any) => {
        return e.name.toLowerCase().search(filter.name?.toLowerCase()) >= 0;
      });
      setfilterRows(temp);
    }

    if (filter.status != null) {
      temp = temp.filter((e: any) => {
        return e.status.toLowerCase() === filter.status?.toLowerCase();
      });
      setfilterRows(temp);
    }
  }

  const [taskListView, setTaskListView] = useState({ add: false });
  const [userstoryName, setuserstoryName] = useState<string>("");
  const [userstoryId, setuserstoryId] = useState<string>("");

  function reset() {
    setfilter({});
    if (usNameRef.current) usNameRef.current.value = "";
    if (statusRef.current) statusRef.current.clearValue();
    if (actStartDateRef.current) actStartDateRef.current.value = "";
    if (actEndDateRef.current) actEndDateRef.current.value = "";
    setfilterRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`Employee`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="inherit" to={`/Employee/Task`}>
          <Typography sx={{ fontWeight: "bold" }}>Task</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>USer Story List</Typography>
      </Breadcrumbs>

      <div className="userstory-box p-3">
        <div className="row">
          <div className="col-md-2">
            <h1 className="mt-3 fw-bold">
              {location.state.projectName || "-"}
            </h1>
          </div>

          <div className="col-md-2">
            <label>User Story Name</label>
            <input
              id="User-Story-Name"
              placeholder="User Story Name"
              ref={usNameRef}
              className="m-1 form-control col"
              onChange={(e) => {
                const inputValue = e.target.value;
                const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                setfilter((prevState) => ({
                  ...prevState,
                  name: alphabeticValue === "" ? undefined : alphabeticValue,
                }));
              }}
              value={filter.name || ""}
            />
          </div>
          <div className="col-md-2">
            <label>Status</label>
            <Select
              aria-label="Floating label select example"
              isClearable={true}
              name="status"
              ref={statusRef}
              className="select-dropdowns mt-1 col"
              onInputChange={(inputValue: string) => {
                const alphabeticValue = inputValue.replace(/[^A-Za-z\s]/g, ""); // Remove non-alphabetic characters
                return alphabeticValue;
              }}
              onChange={(selectedOption: any) => {
                if (selectedOption) {
                  setfilter((prevState) => ({
                    ...prevState,
                    status:
                      selectedOption.label.trim() === ""
                        ? null
                        : selectedOption.label,
                  }));
                }
              }}
              options={[
                {
                  label: "In Progress",
                  value: "In Progress",
                },
                {
                  label: "Completed",
                  value: "Completed",
                },
                {
                  label: "Pending",
                  value: "Pending",
                },
                {
                  label: "Active",
                  value: "Active",
                },
              ]}
              placeholder="Status"
              isSearchable={true}
              formatOptionLabel={(option: any) => option.label} // Display formatted label
            />
          </div>
          <div className="col-md-2">
            <label className="mx-1">Start Date</label>
            <input
              onChange={(e: any) => {
                setfilter((prevState: any) => {
                  return {
                    ...prevState,
                    startDate: e.target.value == "" ? null : e.target.value,
                  };
                });
              }}
              type="date"
              id="start-date"
              placeholder="Start Date"
              ref={actStartDateRef}
              className="m-1 col form-control"
            />
          </div>
          <div className="col-md-2">
            <label className="mx-1">End Date</label>
            <input
              onChange={(e: any) => {
                setfilter((prevState: any) => {
                  return {
                    ...prevState,
                    endDate: e.target.value == "" ? null : e.target.value,
                  };
                });
              }}
              type="date"
              id="end-date"
              placeholder="End Date"
              ref={actEndDateRef}
              className="m-1 col form-control"
            />
          </div>

          {/* <div  className="row"> */}
          {/* <div className="container"> */}
          {/* <div className="row justify-content-end"> */}
          <div className="col-md-2 mt-4">
            <div className="col-auto">
              <Tooltip title="Search" placement="top">
                <Button
                  variant="contained"
                  // endIcon={<SearchIcon />}
                  className="mx-1  "
                  onClick={() => ApplyFilter()}
                >
                  <SearchIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Reset" placement="top">
                <Button
                  variant="contained"
                  // endIcon={<RefreshIcon />}
                  className="mx-4"
                  onClick={() => reset()}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>

      <div className="emp-atte-his mb-4">
        <div style={{ position: "sticky" }}>
          <h2 className="m-3">User Story List</h2>
        </div>
        <div className="emp-atte-hiss ">
          <div className="m-3 d-flex flex-wrap justify-content-between">
            {filterRows.map((e: any) => (
              <div
                className="flex-3 mt-4 d-flex align-items-center flex-column"
                key={e?.id}
                onClick={() => {
                  debugger;
                  setTaskListView({ add: true });
                  setuserstoryName(e.name);
                  setuserstoryId(e.id);
                }}
              >
                <div className="d-flex align-items-center justify-content-between width">
                  <div className="d-flex align-items-center justify-content-start mx-3">
                    <AutoStoriesIcon
                      className="icon"
                      style={{
                        fontSize: 40,
                        padding: 8,
                      }}
                    />
                    <h5
                      className="mx-2"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "14ch",
                      }}
                      title={e?.name.length > 20 ? e?.name : null}
                    >
                      {e?.name}
                    </h5>
                  </div>
                  <p className={`mx-2 float-end ${e?.status} mt-2`}>
                    {e?.status}
                  </p>
                </div>
                <div className="d-flex justify-content-between width-1">
                  <div className="col-sm-3">
                    <div className="form-group">
                      <p className="mb-1 ">Description</p>
                      <h5
                        id="name"
                        className="time d-flex"
                        style={{
                          width: "17em",
                          height:
                            e?.description && e.description.length > 20
                              ? "5em"
                              : "5em",
                          overflowY:
                            e?.description && e.description.length > 20
                              ? "scroll"
                              : "auto",
                        }}
                      >
                        {e?.description}
                      </h5>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between width-1">
                  <div className="col-sm-3">
                    <div className="form-group">
                      <p className="mb-1 ">Start Date</p>
                      <h5
                        id="name"
                        className="time d-flex"
                        style={{ width: "7em" }}
                      >
                        {ConvertDate(e?.startDate)}
                      </h5>
                    </div>
                  </div>
                  <div className="col-sm-4 ">
                    <div className="form-group">
                      <label htmlFor="name" className="mb-1">
                        End Date
                      </label>
                      <h5
                        id="name"
                        className="time d-flex "
                        style={{ width: "6.5em" }}
                      >
                        {ConvertDate(e?.endDate)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {rows.length % 3 != 0 && (
              <div
                className="flex-2 m-1 d-flex align-items-center flex-column hidden"
                style={{ visibility: "hidden" }}
              ></div>
            )}
          </div>
        </div>
      </div>
      <SelectCategory
        openDialog={taskListView}
        userstoryName={userstoryName}
        userstoryId={userstoryId}
        setOpenDialog={setTaskListView}
      />
    </>
  );
}
