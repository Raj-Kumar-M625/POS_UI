import { useState, useRef } from "react";
import { Get } from "../../../Services/Axios";
import { useQuery } from "react-query";
import { DownloadCommentList } from "../../../Services/CommentService";
import DataTable from "react-data-table-component";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Comment } from "../../../Models/Comments/Comment";

export const EmployeeDailyTask = () => {
  const [rows, setRows] = useState<any>([]);
  const [filterRows, setfilterRows] = useState<any>([]);
  const { isLoading } = useQuery("EmployeeDailyTask", async () => {
    const comments: any = await Get("app/EmployeeDailyTask/GetComments");
    setRows(comments.data || []);
    setfilterRows(comments.data || []);
    return comments.data;
  });
  const projectNameRef = useRef<HTMLInputElement>(null);
  const employeeNameRef = useRef<HTMLInputElement>(null);
  const [filter, setfilter] = useState<Comment>({});

  const ApplyFilter = () => {
    let temp: any = [];
    if (filter.Project != null) {
      temp = rows.filter((row: any) => {
        return (
          row.project?.toLowerCase().search(filter?.Project?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }
    if (filter.Employee != null) {
      temp = rows.filter((row: any) => {
        return (
          row.employee?.toLowerCase().search(filter?.Employee?.toLowerCase()) >=
          0
        );
      });
      setfilterRows(temp);
    }
  };

  const Reset = () => {
    setfilter({});
    if (projectNameRef.current) projectNameRef.current.value = "";
    if (employeeNameRef.current) employeeNameRef.current.value = "";
    setfilterRows(rows);
  };

  const columns: any = [
    {
      field: "employeeDailyTaskId",
      name: "Employee Daily Task Id",
      width: "13rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      right: true,
      selector: (row: any) => (
        <p className="tableStyle">{row?.employeeDailyTaskId}</p>
      ),
    },
    {
      field: "employee",
      name: "Employee Name",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.employee}</p>,
    },
    {
      field: "project",
      name: "Project",
      width: 324,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.project}</p>,
    },
    {
      field: "comment",
      name: "Comment",
      width: 324,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.comment}</p>,
    },
  ];
  return (
    <>
      <div className="well mx-auto mt-4" style={{ width: "84.5vw" }}>
        <div className="containe">
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Employee Name</label>
                <input
                  id="Category1"
                  ref={employeeNameRef}
                  placeholder="Employee Name"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState: any) => {
                      return {
                        ...prevState,
                        Employee: e.target.value == "" ? null : e.target.value,
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
                    setfilter((prevState) => {
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
      <div className="container">
        <Button
          variant="contained"
          className="mb-2 float-md-end"
          onClick={() => {
            DownloadCommentList(filterRows);
          }}
        >
          Download
          <DownloadIcon className="mx-1" />
        </Button>
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
    </>
  );
};
