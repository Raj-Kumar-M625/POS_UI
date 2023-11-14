import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import DataTable from "react-data-table-component";
import Box from "@mui/material/Box";
import { Get } from "../../../Services/Axios";
import { EditLeave } from "./EditLeave";
import { ConvertDate } from "../../../Utilities/Utils";

function ExpandedComponent({ data }: any): JSX.Element {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>Leave Request Date</th>
          <th>Approve Status</th>
          <th>Approved By</th>
          <th>Rejected Reason</th>
        </tr>
      </thead>
      <tbody>
        {data?.leaveHistory.map((historyEntry: any, index: any) => (
          <tr key={index}>
            <td>{ConvertDate(historyEntry.leaveRequestDate)}</td>
            <td>{historyEntry.approveStatus}</td>
            <td>{historyEntry.approvedBy || "Admin"}</td>
            <td>{historyEntry.rejectedReason || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const EmployeeLeaveList = ({ reload, setReload }: any) => {
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const [viewLeaveData, setviewLeaveData] = useState<any>({});
  const [LeaveView, setLeaveView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="Edit"
              className="mx-1"
              onClick={() => {
                setLeaveView({ edit: true });
                setviewLeaveData(row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "name",
      name: "Leave Type",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: any) => <p className="tableStyle">{row.leaveType}</p>,
    },
    {
      field: "name",
      name: "Leave SubType",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      flex: 1,
      selector: (row: any) => <p className="tableStyle">{row.leaveSubType}</p>,
    },
    {
      field: "Leave Reason",
      name: "Leave Reason",
      width: "20rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Tooltip title={row.LeaveReason} style={{ textDecoration: "none" }}>
          <p className="tableStyle">{row.leaveReason}</p>
        </Tooltip>
      ),
    },
    {
      name: "Leave Status",
      width: "12rem",
      selector: (row: any) => <p className="tableStyle">{row.leaveStatus}</p>,
    },
  ];

  useEffect(() => {
    let EmployeeLeaveList = Get(
      `/app/EmployeeLeave/GetLeaveRequestedDate?employeeId=${sessionUser.employeeId}`
    );
    EmployeeLeaveList.then((response: any) => {
      setRows(response?.data || []);
      setLoading(false);
    });
  }, [reload]);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center mb-5">
        <Grid item xs={12} sm={11}>
          <Box style={{ width: "94vw" }}>
            <DataTable
              columns={columns}
              fixedHeader
              responsive
              persistTableHead
              progressPending={loading}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              data={rows || []}
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
          </Box>
        </Grid>
      </div>
      <EditLeave
        openDialog={LeaveView}
        setOpenDialog={setLeaveView}
        setRows={setRows}
        setReload={setReload}
        Data={viewLeaveData}
      />
    </>
  );
};
export default EmployeeLeaveList;
