import MessageIcon from "@mui/icons-material/Message";
import { useState, useRef } from "react";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import { Button, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DataTable from "react-data-table-component";
import { Comment } from "../../../Models/Comments/Comment";
import { ConvertDate } from "../../../Utilities/Utils";
import { ViewTaskComment } from "./ViewTaskComments";

export const TaskComment = () => {
  const [rows, setRows] = useState<any>([]);
  const [filterRows, setfilterRows] = useState<any>([]);
  const [taskdata, setTaskId] = useState<any>();
  const [data, setdata] = useState([]);
  const [taskView, setTaskCommentView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const { isLoading, refetch } = useQuery("TaskComment", async () => {
    const tasks: any = await Get("app/Task/GetTaskListValue");
    const comments: any = await Get(`app/Task/GetComments?taskId=${taskdata}`);
    setdata(comments.data || []);
    setRows(tasks.data || []);
    setfilterRows(tasks.data || []);
    return comments.data;
  });

  const projectNameRef = useRef<HTMLInputElement>(null);
  const taskNameRef = useRef<HTMLInputElement>(null);
  const [filter, setfilter] = useState<Comment>({});

  const ApplyFilter = () => {
    let temp: any = [];
    if (filter.TaskName != null) {
      temp = rows.filter((row: any) => {
        return (
          row.name?.toLowerCase().search(filter?.TaskName?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }
    if (filter.Project != null) {
      temp = rows.filter((row: any) => {
        return (
          row.project.name
            ?.toLowerCase()
            .search(filter?.Project?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }
  };

  const Reset = () => {
    setfilter({});
    if (projectNameRef.current) projectNameRef.current.value = "";
    if (taskNameRef.current) taskNameRef.current.value = "";
    setfilterRows(rows);
  };

  const columns: any[] = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "8rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="View Comment"
              className="mx-1"
              onClick={async () => {
                setTaskCommentView({ view: true });
                await setTaskId(row.id);
                refetch();
              }}
            >
              <MessageIcon />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "name",
      name: "Task Name",
      width: "23rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row?.name}>
          <p className="tableStyle">{row?.name}</p>
        </Tooltip>
      ),
    },
    {
      field: "description",
      name: "Task description",
      width: "23rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row?.description}>
          <p className="tableStyle">{row?.description}</p>
        </Tooltip>
      ),
    },
    {
      field: "Project Name",
      name: "Project Name",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.project.name}</p>,
    },
    {
      field: "actualStartDate",
      name: "Actual Start Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = ConvertDate(row.actualStartDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
    {
      field: "actualEndDate",
      name: "Actual End Date",
      type: "Date",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => {
        const result = ConvertDate(row.actualEndDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  return (
    <>
      <div className="well mx-auto mt-4" style={{ width: "84.5vw" }}>
        <div className="containe">
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Task Name</label>
                <input
                  id="Category1"
                  ref={taskNameRef}
                  placeholder="Task Name"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState: any) => {
                      return {
                        ...prevState,
                        TaskName: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  id="subCategory3"
                  placeholder="Project Name"
                  ref={projectNameRef}
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState: any) => {
                      return {
                        ...prevState,
                        Project: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-4 float-end" style={{ width: "54.3vw" }}>
              <div className="row justify-content-end">
                <div className="col-auto">
                  <Button
                    variant="contained"
                    endIcon={<SearchIcon />}
                    className="mx-2 mt-4"
                    onClick={() => ApplyFilter()}
                  >
                    Search
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<RefreshIcon />}
                    className="mx-2 mt-4"
                    onClick={() => Reset()}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ width: "84.5vw" }}>
        <DataTable
          columns={columns}
          fixedHeader
          responsive
          persistTableHead
          progressPending={isLoading}
          data={filterRows || []}
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
          pagination
          paginationPerPage={50}
          paginationRowsPerPageOptions={[50, 100, 200]}
          pointerOnHover={true}
        />
      </div>
      <ViewTaskComment
        openDialog={taskView}
        setOpenDialog={setTaskCommentView}
        data={data}
        refetch={refetch}
      />
    </>
  );
};
