import { Button, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../../../StyleSheets/Leave.css";
import { ApplyLeave } from "./ApplyLeave";
import EmployeeLeaveList from "./EmployeeLeaveList";

export const LeaveModule = () => {
  const [reload, setReload] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Employee">
          <Typography className="fw-bold">Home</Typography>
        </Link>
        <Typography className="fw-bold">Leave</Typography>
      </Breadcrumbs>
      <div className="m-3 d-flex justify-content-end">
        <Button
          variant="contained"
          color="warning"
          className="mx-4"
          onClick={() => setOpenDialog({ add: true })}
        >
          Request For Leave
        </Button>
      </div>
      <EmployeeLeaveList reload={reload} setReload={setReload} />
      <ApplyLeave
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setReload={setReload}
      />
    </>
  );
};
