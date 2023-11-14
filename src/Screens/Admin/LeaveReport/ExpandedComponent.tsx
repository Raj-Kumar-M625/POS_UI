import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRef, useState } from "react";
import { EmployeeLeave } from "../../../Models/EmployeeLeave/EmployeeLeave";
import { Post } from "../../../Services/Axios";
import { ConvertDate } from "../../../Utilities/Utils";
import { TextareaAutosize } from "@mui/material";
import Swal from "sweetalert2";
import { AlertOption } from "../../../Models/Common/AlertOptions";

export default function ExpandedComponent({ data }: any) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const rejectedReason = useRef<any>();
  const setRowSelectionModel = (rows: any) => {
    setSelectedRows(rows);
    if (rows.length === data.leaveHistory.length) {
      if (rejectedReason.current != null) rejectedReason.current.value = "";
    }
  };

  const handleActionButtonClick = async () => {
    setIsUpdating(true);
    var employeeLeave: EmployeeLeave = {
      id: data.id,
      leaveStatus: "",
      leaveHistory: [],
    };
    data.leaveHistory.forEach((_leave: any) => {
      var isApproved = selectedRows.find((x: number) => x == _leave.id);
      if (isApproved) {
        _leave.approveStatus = "Approved";
      } else {
        _leave.approveStatus = "Rejected";
      }
      _leave.rejectedReason = rejectedReason.current.value;
      employeeLeave?.leaveHistory?.push(_leave);
    });

    if (
      selectedRows.length === 0 ||
      selectedRows.length < data.leaveHistory.length
    ) {
      if (rejectedReason.current.value.length === 0) {
        Swal.fire({
          title: "Error",
          text: `Please specify rejected reason!`,
          icon: "warning",
        });
        setIsUpdating(false);

        return;
      }
    }

    if (selectedRows.length === 0) {
      employeeLeave.leaveStatus = "Rejected";
    } else if (selectedRows.length === data.leaveHistory.length) {
      employeeLeave.leaveStatus = "Approved";
    } else if (selectedRows.length < data.leaveHistory.length) {
      employeeLeave.leaveStatus = "Partially Approved";
    }

    const { error }: any = await Post(
      "/app/EmployeeLeave/UpdateLeaveRequest",
      employeeLeave
    );

    var option: AlertOption;
    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Updating!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Leave Updated Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    });
    setSelectedRows([]);
    setIsUpdating(false);
  };

  const columns: GridColDef[] = [
    {
      field: "leaveRequestDate",
      headerName: "Leave Request Date",
      width: 160,
      valueGetter: (params) => ConvertDate(params.row.leaveRequestDate),
    },
    {
      field: "approveStatus",
      headerName: "Status",
      width: 160,
    },
    {
      field: "approvedBy",
      headerName: "ApprovedBy",
      width: 160,
    },
    {
      field: "rejectedReason",
      headerName: "RejectReason",
      width: 160,
    },
  ];

  return (
    <div>
      <DataGrid
        rows={data.leaveHistory}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        loading={isUpdating}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      <div>
        <TextareaAutosize
          ref={rejectedReason}
          disabled={selectedRows.length === data.leaveHistory.length}
          style={{ height: 100, width: 300 }}
          placeholder="Rejected Reason"
          className="m-3"
        />
        <div className="m-1 d-flex justify-content-start">
          <button
            className={`btn ${
              selectedRows.length === 0
                ? "btn-danger"
                : selectedRows.length < data.leaveHistory.length
                ? "btn-warning"
                : "btn-success"
            }  mx-3 mb-3 text-light`}
            onClick={() => {
              handleActionButtonClick();
            }}
          >
            {selectedRows.length === 0
              ? "Reject"
              : selectedRows.length < data.leaveHistory.length
              ? "Partially Approve"
              : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
