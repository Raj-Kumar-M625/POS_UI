import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  InputLabel,
  Typography,
  Tooltip,
  Grid,
} from "@mui/material";
import "../../../StyleSheets/EditTask.css";
import { ConvertToISO } from "../../../Utilities/Utils";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
export const ViewTask = ({ openDialog, setOpenDialog, Data }: any) => {
  const handleClose = () => {
    setOpenDialog({ view: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.view}>
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          <form>
            <Typography
              className="fs-4"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                position: "sticky",
                top: 0,
                zIndex: 30,
              }}
            >
              <CancelOutlinedIcon
                onClick={handleClose}
                sx={{ ml: 65, color: "red", fontSize: "30px" }}
              />
              <span className="info-label">Project Name:</span>{" "}
              <span className="info-value">{Data?.projectName}</span>
              <br />
              <span className="info-label">Task Name:</span>{" "}
              <span className="info-value">{Data?.name}</span>
              <br />
              <span className="info-label">User Story:</span>{" "}
              <span className="info-value">{Data?.usName || "-"}</span>
              <br />
              <span className="info-label">User Interface:</span>{" "}
              <span className="info-value">{Data?.uiName || "-"}</span>
            </Typography>
            <Grid container sx={{ display: "inline-flex" }}>
              <Grid item xs={8}>
                <DialogTitle
                  className="fs-3"
                  style={{
                    textAlign: "center",
                    marginLeft: "45%",
                    color: "orange",
                    fontWeight: "bold",
                  }}
                >
                  Task
                </DialogTitle>
              </Grid>
            </Grid>
            <DialogContent className="row popup">
              <div className="row">
                <TextField
                  required
                  defaultValue={Data?.name}
                  className="col m-2 read-only-input"
                  label="TasK Name"
                  type="text"
                  variant="outlined"
                  inputProps={{ maxLength: 250, readOnly: true }}
                />
                <Tooltip title={Data?.description} arrow>
                  <TextField
                    className="col m-2 read-only-input"
                    defaultValue={Data?.description}
                    margin="dense"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    inputProps={{ maxLength: 350, readOnly: true }}
                  />
                </Tooltip>
              </div>
              <div className="row">
                <TextField
                  required
                  defaultValue={Data?.teamName}
                  className="col m-2 read-only-input"
                  label="Team Name"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  className="col m-2 read-only-input"
                  defaultValue={Data?.employeeName || "-"}
                  label="Employee Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="row">
                <TextField
                  className="col m-2 read-only-input"
                  defaultValue={Data?.category || "-"}
                  label="Category"
                  type="text"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  className="col m-2 read-only-input"
                  defaultValue={Data?.subCategory || "-"}
                  label="Sub Cateory"
                  type="text"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="row">
                <div className="col">
                  <InputLabel id="start-date">Est Start date</InputLabel>
                  <TextField
                    required
                    id="start-date"
                    defaultValue={ConvertToISO(Data?.estimateStartDate)}
                    margin="dense"
                    className="read-only-input"
                    type="date"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </div>
                <div className="col">
                  <InputLabel id="end-date">Est End date</InputLabel>
                  <TextField
                    required
                    id="end-date"
                    defaultValue={ConvertToISO(Data?.estimateEndDate)}
                    margin="dense"
                    label=""
                    type="date"
                    className="read-only-input"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <InputLabel id="start-date">Start date</InputLabel>
                  <TextField
                    required
                    id="start-date"
                    defaultValue={ConvertToISO(Data?.actualStartDate)}
                    className="read-only-input"
                    margin="dense"
                    label=""
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div className="col">
                  <InputLabel id="end-date">End date</InputLabel>
                  <TextField
                    required
                    id="end-date"
                    defaultValue={ConvertToISO(Data?.actualEndDate)}
                    className="read-only-input"
                    margin="dense"
                    label=""
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <TextField
                  required
                  id="end-date"
                  defaultValue={ConvertToISO(Data?.weekEndDate)}
                  label="Week Ending date"
                  fullWidth
                  className="col m-3 read-only-input"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  required
                  defaultValue={Data?.status}
                  className="col m-3 read-only-input"
                  label="Status"
                  type="text"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            </DialogContent>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
