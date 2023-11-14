import { useEffect, useRef, useState } from "react";
import {
  Typography,
  Breadcrumbs,
  TextareaAutosize,
  Button,
  InputLabel,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LoadingMap from "../../assets/LocoMovingImage.gif";
import { Get, Post } from "../../Services/Axios";
import Swal from "sweetalert2";
import { ConvertDate, ConvertTime } from "../../Utilities/Utils";
import { AlertOption } from "../../Models/Common/AlertOptions";

type coordinate = {
  latitude: number;
  longitude: number;
};

type LoginDetails = {
  Id?: number;
  InTime: Date | null;
  OutTime: Date | null;
  Comments?: string;
  Latitude?: number;
  Longitude?: number;
};

export const EmployeeTime = () => {
  const [comment, setComment] = useState<string>("");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const commentRef = useRef<any>();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState<any>([]);
  const [coordinate, setCoordinate] = useState<coordinate>({
    latitude: 0,
    longitude: 0,
  });

  async function fetchLoginDetails() {
    const response: any = await Get("app/EmployeeTime/GetEmployeeTimeDetails");
    setLoginDetails(response?.data || []);
  }

  useEffect(() => {
    fetchLoginDetails();
  }, [refetch]);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {}
    );
  } else {
    alert("Geolocation is not available in this browser.");
  }

  async function handleSave() {
    if (coordinate.latitude === 0 || coordinate.longitude === 0) {
      Swal.fire({
        title: "Error",
        text: "Turn on location?",
        icon: "error",
      });
      return;
    }

    setLoading(true);
    if (comment.length === 0) {
      Swal.fire({
        title: "Add Comment",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      setLoading(false);
      return;
    }
    setRefetch(!refetch);
    setLoading(false);
    if (commentRef.current) commentRef.current.value = "";

    var id = 0;
    var inTime: Date | null = null;
    var outTime: Date | null = null;
    var lastIdx: number = loginDetails.length - 1;

    if (loginDetails.length === 0) {
      id = 0;
      inTime = new Date();
    } else if (
      loginDetails[lastIdx].inTime !== null &&
      loginDetails[lastIdx].outTime !== null
    ) {
      id = 0;
      inTime = new Date();
    } else if (
      loginDetails[lastIdx].inTime !== null &&
      loginDetails[lastIdx].outTime === null
    ) {
      id = loginDetails[lastIdx].id;
      inTime = loginDetails[lastIdx].inTime;
      outTime = new Date();
    }

    const loginDetail: LoginDetails = {
      Id: id,
      InTime: inTime,
      OutTime: outTime,
      Comments: comment,
      Latitude: coordinate.latitude,
      Longitude: coordinate.longitude,
    };

    const { error }: any = await Post(
      "app/EmployeeTime/AddEmployeeTimeDetails",
      loginDetail
    );
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error Occured While Saving!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Details Added successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/Employee/Task");
      }
    });

    setRefetch(!refetch);
    setLoading(false);
    if (commentRef.current) commentRef.current.value = "";
  }
  console.log(loginDetails);
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link to="/Employee">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Employee Time</Typography>
      </Breadcrumbs>
      <Grid container>
        <div className="w-100 d-flex">
          <div className="m-3 w-100 border">
            <Grid>
              <Typography
                className="mt-3"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "25px",
                }}
              >
                Your Login Time
              </Typography>
              <div
                className="overflow-scroll scroll mb-5 mt-1"
                style={{ height: "28vh" }}
              >
                <table className="table table-bordered mx-auto w-50 mt-5">
                  <thead
                    style={{
                      position: "static",
                      top: " 50px",
                      background: "white",
                      color: "black",
                    }}
                  >
                    <tr className="bg-info text">
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginDetails?.map((e: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>
                            {ConvertDate(e?.inTime)} <br />
                            {ConvertTime(e?.inTime, "AM")}
                          </td>
                          <td>
                            {ConvertDate(e?.outTime)} <br />
                            {ConvertTime(e?.outTime, "PM")}
                          </td>
                          <td>{e?.comments}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <InputLabel className="mb-3 fw-bold" style={{ width: "26vw" }}>
                  Comment
                </InputLabel>
                <TextareaAutosize
                  style={{ width: 400, height: 100 }}
                  ref={commentRef}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(
                      /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]+$/,
                      ""
                    );
                    setComment(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  className="m-3 bg-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </Grid>
          </div>
          <Grid xs={7}>
            <div className="gmap_canvas m-3 w-50 border">
              <iframe
                width="750"
                height="500"
                style={{
                  background: `url(${LoadingMap})`,
                  objectFit: "contain",
                }}
                src={`https://maps.google.com/maps?q=${coordinate.latitude},${coordinate.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </Grid>
        </div>
      </Grid>
    </>
  );
};
