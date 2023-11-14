import { Dialog, DialogTitle, DialogContent, Tooltip } from "@mui/material";

import { useEffect, useState } from "react";
import { Get } from "../../../Services/Axios";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { EditCalendar } from "./EditCalendar";
import { ConvertDate } from "../../../Utilities/Utils";

export const Calendar = ({ openDialog, setOpenDialog }: any) => {
  const [refetch, setRefetch] = useState<boolean>(false);
  const [rows, setRows] = useState<any>([]);
  const [dateFilter, setDateFilter] = useState<any>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [TeamView, setTeamView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });
  const [viewTeamData, setviewTeamData] = useState<any>({});

  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  useEffect(() => {
    let holidayList = Get(
      `app/EmployeeLeave/GetHolidayList?year=${dateFilter.year}&month=${dateFilter.month}`
    );
    holidayList.then((response: any) => {
      setRows(response?.data || []);
    });
  }, [refetch]);

  const handleClose = () => {
    setOpenDialog({ edit: false });
  };

  return (
    <>
      <div>
        <Dialog
          open={openDialog?.edit}
          onClose={handleClose}
          maxWidth={false}
          fullWidth
          PaperProps={{
            style: {
              width: "70vw",
              height: "70vh",
            },
          }}
        >
          <form>
            <div
              style={{
                backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <DialogTitle style={{ color: "blue", flex: "1" }}>
                Add Holidays
              </DialogTitle>
              <CancelOutlinedIcon
                onClick={handleClose}
                sx={{
                  color: "red",
                  fontSize: "30px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              />
            </div>
            <DialogContent className="row popup d-flex justify-content-center">
              <div className="row">
                <div className="d-flex mx-2">
                  <select
                    className="form-select m-2 col-md-5"
                    style={{ width: "230px" }}
                    defaultValue={dateFilter.year}
                    onChange={(e: any) => {
                      setDateFilter({ ...dateFilter, year: e.target.value });
                    }}
                  >
                    <option selected disabled>
                      Select Year
                    </option>
                    <option value={2023}>2023</option>
                  </select>
                  <select
                    className="form-select m-2 col-md-5"
                    style={{ width: "230px" }}
                    defaultValue={dateFilter.month}
                    onChange={async (e: any) => {
                      setDateFilter({ ...dateFilter, month: e.target.value });
                      setRefetch(!refetch);
                    }}
                  >
                    <option selected disabled>
                      Select Month
                    </option>
                    {months.map((month) => (
                      <option
                        key={month.id}
                        value={month.id}
                        disabled={month.id > new Date().getMonth() + 1}
                      >
                        {month.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="container mt-4" style={{ marginLeft: "15px" }}>
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "slateblue",
                            width: "10rem",
                            color: "white",
                          }}
                        >
                          ACTION
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "slateblue",
                            width: "30rem",
                            color: "white",
                          }}
                        >
                          DATE
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "slateblue",
                            width: "30rem",
                            color: "white",
                          }}
                        >
                          HOLIDAY NAME
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "slateblue",
                            width: "30rem",
                            color: "white",
                          }}
                        >
                          HOLIDAY APPLICABLE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((data: any, index: any) => (
                        <tr key={index}>
                          <td>
                            <Tooltip
                              title="Edit"
                              className="mx-1"
                              onClick={() => {
                                setTeamView({ edit: true });
                                setviewTeamData(data);
                              }}
                            >
                              <EditIcon className="fs-4 text-warning" />
                            </Tooltip>
                          </td>
                          <td>{ConvertDate(data.date)}</td>
                          <td>{data.holidayName ?? "-"}</td>
                          <td>{data.holidayApplicable ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>
      <EditCalendar
        openDialog={TeamView}
        setOpenDialog={setTeamView}
        Data={viewTeamData}
        setRefetch={setRefetch}
      />
    </>
  );
};
