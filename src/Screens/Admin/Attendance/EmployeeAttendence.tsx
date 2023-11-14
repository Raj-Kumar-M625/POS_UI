import "../../../StyleSheets/EmployeeAttendance.css";
import { useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useQuery } from "react-query";
import { Get } from "../../../Services/Axios";
import BackDrop from "../../../CommonComponents/BackDrop";
import {
  ConvertTime,
  ConvertDate,
  TimeSpanText,
  TimeSpanBg,
} from "../../../Utilities/Utils";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { GoogleMaps } from "../../../CommonComponents/GoogleMaps";
import { useContextProvider } from "../../../CommonComponents/Context";

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

export const EmployeeAttendence = () => {
  const location = useLocation();
  const [showMap, setshowMap] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const { role } = useContextProvider();
  const [dateFilter, setDateFilter] = useState<any>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [coordinate, setCoordinate] = useState<any>({
    latitude: 0,
    longitude: 0,
    place: "",
  });

  const { data, isLoading, refetch }: any = useQuery(
    "EmployeeAttendence",
    async () => {
      const employeeAttendance: any = await Get(
        `app/Employee/GetAttendanceByUserId?userId=${location.state.userId}&month=${dateFilter.month}&year=${dateFilter.year}`
      );
      setRows(employeeAttendance?.data?.employeeAttendances || []);
      return employeeAttendance?.data;
    }
  );
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Link color="inherit" to={`/${role}/Attendance`}>
          <Typography sx={{ fontWeight: "bold" }}>Attendence</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Attendance</Typography>
      </Breadcrumbs>
      <div className="emp-det-box p-3">
        <div
          className="d-flex justify-content-between"
          style={{ width: "72vw" }}
        >
          <h1 className="mx-5 mb-3 fw-bold">{data?.name || "-"}</h1>
          <div className="d-flex mx-2">
            <select
              className="form-select m-1 col-md-4"
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
              className="form-select m-1 col-md-4"
              defaultValue={dateFilter.month}
              onChange={async (e: any) => {
                await setDateFilter({ ...dateFilter, month: e.target.value });
                await refetch();
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
        <div className="emp-info d-flex w-75 mx-5">
          <div className="col-sm-2">
            <div className="form-group">
              <label htmlFor="name" className="mb-1">
                Role
              </label>
              <h5 id="name1" className="input1">
                Employee
              </h5>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label htmlFor="name" className="mb-1">
                Phone Number
              </label>
              <h5 id="name2" className="input2">
                {data?.phoneNumber || "-"}
              </h5>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label htmlFor="name" className="mb-1">
                Email
              </label>
              <h5 id="name3" className="input3">
                {data?.email || "-"}
              </h5>
            </div>
          </div>
        </div>
        <div className="attce d-flex justify-content-evenly mt-3">
          <div className="flex-1 m-1 d-flex align-items-center">
            <LoginIcon
              className="icon m-3"
              style={{
                fontSize: 64,
                padding: 10,
              }}
            />
            <div className="mx-2">
              <h2>{data?.totalAttendance || "0"}</h2>
              <p>Total Attendance</p>
            </div>
          </div>
          <div className="flex-1 m-1 d-flex align-items-center">
            <SouthWestIcon
              className="icon m-3"
              style={{
                fontSize: 64,
                padding: 10,
              }}
            />
            <div className="mx-2">
              <h2>{data?.averageInTime || "-"} AM</h2>
              <p>Average In Time</p>
            </div>
          </div>{" "}
          <div className="flex-1 m-1 d-flex align-items-center">
            <ArrowOutwardIcon
              className="icon m-3"
              style={{
                fontSize: 64,
                padding: 10,
              }}
            />
            <div className="mx-2">
              <h2>{data?.averageOutTime || "-"} PM</h2>
              <p>Average Out Time</p>
            </div>
          </div>{" "}
          <div className="flex-1 m-1 d-flex align-items-center">
            <PersonOffIcon
              className="icon m-3"
              style={{
                fontSize: 64,
                padding: 10,
              }}
            />
            <div className="mx-2">
              <h2>{data?.totalAbsent || "0"}</h2>
              <p>Total Absent</p>
            </div>
          </div>{" "}
        </div>
      </div>
      <div className="emp-atte-his p-3 overflow-scroll mb-4">
        <h2 className="m-3">Attendance History</h2>

        <div className="m-3 d-flex flex-wrap justify-content-between">
          {rows.map((e: any) => (
            <div
              className="flex-2 mt-4 d-flex align-items-center flex-column"
              key={e?.date}
            >
              <div className="d-flex align-items-center justify-content-between width">
                <div className="d-flex align-items-center justify-content-start mx-3">
                  <CalendarMonthIcon
                    className="icon"
                    style={{
                      fontSize: 40,
                      padding: 8,
                    }}
                  />
                  <h5 className="mx-2">{ConvertDate(e?.date)}</h5>
                </div>
                <p className={`mx-2 float-end ${TimeSpanBg(e?.inTime)} mt-2`}>
                  {TimeSpanText(e?.inTime)}
                </p>
              </div>
              <div className="d-flex justify-content-between width-1">
                <div className="col-sm-3">
                  <div className="form-group">
                    <p className="mb-1 ">In Time</p>
                    <h5
                      id="name"
                      className="time d-flex"
                      style={{ width: "7em" }}
                    >
                      {ConvertTime(e?.inTime, "AM")}
                      {ConvertTime(e?.inTime, "AM") !== "-" && (
                        <LocationOnIcon
                          className="fs-4 mx-1"
                          onClick={() => {
                            setCoordinate({
                              latitude: e?.employeeGeo[0]?.latitude || 0,
                              longitude: e?.employeeGeo[0]?.longitude || 0,
                              place: "In Time Location",
                            });
                            setshowMap(true);
                          }}
                        />
                      )}
                    </h5>
                  </div>
                </div>
                <div className="col-sm-4 ">
                  <div className="form-group">
                    <label htmlFor="name" className="mb-1">
                      Out Time
                    </label>
                    <h5
                      id="name"
                      className="time d-flex "
                      style={{ width: "6.5em" }}
                    >
                      {ConvertTime(e?.outTime, "PM")}
                      {ConvertTime(e?.outTime, "PM") !== "-" && (
                        <LocationOnIcon
                          className="fs-4 mx-1"
                          onClick={() => {
                            setCoordinate({
                              latitude: e?.employeeGeo[1]?.latitude || 0,
                              longitude: e?.employeeGeo[1]?.longitude || 0,
                              place: "Out Time Location",
                            });
                            setshowMap(true);
                          }}
                        />
                      )}
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
      <GoogleMaps
        open={showMap}
        setOpen={setshowMap}
        coordinates={coordinate}
      />
      <BackDrop open={isLoading} />
    </>
  );
};
