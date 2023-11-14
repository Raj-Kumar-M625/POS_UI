import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { ChangeEvent, useState } from "react";
import { PayAttention } from "../../../Models/PMOScrum/PMOScrum";

export const AttentionDetails = ({
  openDialog,
  setOpenDialog,
  PMOScrum,
  PMOScrumDto,
  setPMOScrumDto,
}: any) => {
  const handleClose = () => {
    setOpenDialog({ attentiondetails: false });
    setPMOScrumDto({ ...PMOScrumDto, payAttentions: payAttention });
    setPayAttention([]);
  };

  const [payAttention, setPayAttention] = useState<PayAttention[] | undefined>(
    []
  );

  function checkDetails(
    event: ChangeEvent<HTMLInputElement>,
    reason: string,
    _id: number
  ) {
    var attentation: PayAttention[] | undefined;
    if (event.target.checked) {
      attentation = payAttention?.concat([
        {
          id: _id,
          pMOScrumId: PMOScrum.id,
          reason: reason,
          dayId: PMOScrum.dayId,
          employeeId: PMOScrum.employeeId,
          CreatedBy: "user",
          UpdatedBy: "user",
        } as PayAttention,
      ]);
    } else {
      attentation = payAttention?.filter((x) => x.id !== _id);
    }
    setPayAttention(() => attentation);
  }

  function disableCheckBox(option: string): boolean | undefined {
    return PMOScrum?.payAttention &&
      PMOScrum?.payAttentions?.filter((x: any) => x?.reason?.trim() === option)
        .length > 0
      ? true
      : undefined;
  }
  return (
    <div className="w-50">
      <Dialog open={openDialog?.attentiondetails} onClose={handleClose}>
        <form>
          <DialogTitle sx={{ color: "blue", fontWeight: "bold" }}>
            {PMOScrum?.payAttention
              ? "Attention Details"
              : "Select Attention Details"}
          </DialogTitle>
          <CancelOutlinedIcon
            onClick={handleClose}
            sx={{
              color: "red",
              fontSize: "30px",
              cursor: "pointer",
              ml: 65,
              mt: -12,
            }}
          />
          <DialogContent
            className="row popup d-flex justify-content-center"
            sx={{
              width: 590,
              border: "1px solid #000",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableCheckBox("No Tasks")}
                    disabled={PMOScrum?.payAttention}
                    onChange={(event) => checkDetails(event, "No Tasks", 1)}
                  />
                }
                label="No Tasks"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableCheckBox("Partial Tasks")}
                    disabled={PMOScrum?.payAttention}
                    onChange={(event) =>
                      checkDetails(event, "Partial Tasks", 2)
                    }
                  />
                }
                label="Partial Tasks"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableCheckBox("Tasks Not Cleared")}
                    disabled={PMOScrum?.payAttention}
                    onChange={(event) =>
                      checkDetails(event, "Tasks Not Cleared", 3)
                    }
                  />
                }
                label="Tasks Not Cleared"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableCheckBox("Tasks Not Entered in POS")}
                    disabled={PMOScrum?.payAttention}
                    onChange={(event) =>
                      checkDetails(event, "Tasks Not Entered in POS", 4)
                    }
                  />
                }
                label="Tasks Not Entered in POS"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableCheckBox("POS Attendance Problem")}
                    disabled={PMOScrum?.payAttention}
                    onChange={(event) =>
                      checkDetails(event, "POS Attendance Problem", 5)
                    }
                  />
                }
                label="POS Attendance Problem"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={disableCheckBox("Communication Issue")}
                    disabled={PMOScrum?.payAttention}
                    onChange={(event) =>
                      checkDetails(event, "Communication Issue", 6)
                    }
                  />
                }
                label="Communication Issue"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              color={`${PMOScrum?.payAttention ? "success" : "error"}`}
              className="m-2"
            >
              {PMOScrum?.payAttention ? "Ok" : "Cancel"}
            </Button>
            {!PMOScrum?.payAttention && (
              <Button
                onClick={handleClose}
                color="success"
                className="m-2"
                variant="contained"
              >
                Save
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
