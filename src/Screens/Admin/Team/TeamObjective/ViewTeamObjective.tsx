import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextareaAutosize,
  Button,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

export const ViewTeamObjective = ({ openDialog, setOpenDialog, Data }: any) => {
  const handleClose = () => {
    setOpenDialog({ view: false });
  };
  return (
    <div className="w-50">
      <Dialog open={openDialog?.view} onClose={handleClose}>
        <form>
          <DialogTitle sx={{color:"blue", fontWeight:"bold"}}>Team Objective</DialogTitle>
          <DialogContent
            className="row popup d-flex justify-content-center"
            sx={{
              width: 590,
            }}
          >
            <div className="row col-md-8">
              <TextareaAutosize
                readOnly
                className="col m-2 form-control"
                placeholder="Description"
                style={{ height: 100 }}
                value={Data?.description}
              />
            </div>
            <div className="row col-md-8">
              <FormControl className="col m-2">
                <InputLabel id="project-type">Status</InputLabel>
                <Select
                  labelId="Status"
                  readOnly
                  id="Status"
                  label="Status"
                  value={Data?.status}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="In Progress">In Progres</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">ok</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
