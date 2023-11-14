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

  export const ScrumDetails = ({ openDialog, setOpenDialog }: any) => {
    const handleClose = () => {
      setOpenDialog({ scrumdetails: false });
    };
  
    return (
      <div className="w-50">
        <Dialog open={openDialog?.scrumdetails} onClose={handleClose}>
          <form>
            <DialogTitle sx={{ color: "blue", fontWeight: "bold" }}>
              Select Attention Details
            </DialogTitle>
            <CancelOutlinedIcon
            onClick={handleClose}
            sx={{
              color: "red",
              fontSize: "30px",
              cursor: "pointer",   
              ml: 65,   
              mt: -12
            }}
          />
            <DialogContent
              className="row popup d-flex justify-content-center"
              sx={{
                width: 590,
                border: '1px solid #000'
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Scrum Not Taken"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Pending"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Completed"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Self Scrum"
                />
              </FormGroup>
            </DialogContent>
            <DialogActions>
            <Button 
             onClick={handleClose}
             variant="contained"
             color="error"
             className="m-2"
            >
              Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleClose}
                color="success"
                className="m-2"
                variant="contained"
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  };