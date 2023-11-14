import { Breadcrumbs, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Scrum = () => {
  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">>">
        <Link color="inherit" to="/Admin">
          Home
        </Link>
        <Link color="inherit" to="/Admin/Employee">
          <Typography color="slateblue">Employee</Typography>
        </Link>
        <Typography color="slateblue">Scrum</Typography>
      </Breadcrumbs>
      <Grid sx={{ textAlign: "center" }}>
        <Typography className="fs-3">
          Employee Name: <span className="fw-bolder">Rahul</span>
        </Typography>
      </Grid>
      <div className="accordion container" id="accordionExample">
        <div className="accordion-item m-3">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              What tasks you will be doing today ?
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-5 d-flex align-items-center justify-content-between">
              <span>Today i will be implementing Login Pos</span>
              <audio autoPlay controls className="float-end" />
            </div>
          </div>
        </div>
        <div className="accordion-item m-3">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              What projects you will be working on doing today?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-5 d-flex align-items-center justify-content-between">
              <span>Today i will be working on POS</span>
              <audio autoPlay controls className="float-end" />
            </div>
          </div>
        </div>
        <div className="accordion-item m-3">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              What tasks you will be doing tomorrow ?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-5 d-flex align-items-center justify-content-between">
              <span>Tomorrow i will be implementing employee attendence</span>
              <audio autoPlay controls className="float-end" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
