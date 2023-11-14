import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
export const ViewUserInterface = ({
  openDialog,
  setOpenDialog,
  Data,
  data1,
}: any) => {
  const handleClose = () => {
    setOpenDialog({ view: false });
  };

  var objetive: any = data1?.data?.find(
    (x: any) => x.id === Data?.projectObjectiveId
  );

  return (
    <div>
      <Dialog open={openDialog?.view}>
        <form>
        <div style={{ backgroundColor: "#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <DialogTitle style={{ color: 'blue', flex: '1' }}>User Interface</DialogTitle>
  <CancelOutlinedIcon
    onClick={handleClose}
    sx={{ color: "red", fontSize: "30px", marginRight: '10px', cursor: 'pointer' }}
  />
</div>
          <DialogContent className="row popup">
            <div className="row">
              <TextField
                value={Data?.name}
                className="col m-2"
                label="User Interface Name"
                type="text"
                variant="outlined"
              />
              <TextField
                className="col m-2"
                value={Data?.description}
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
              />
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <InputLabel id="Complexity">Complexity</InputLabel>
                <Select
                  labelId="Complexity"
                  required
                  id="Complexity"
                  label="Complexity"
                  value={Data?.complexity}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                value={Data?.status}
                className="col m-2"
                label="Status"
                type="text"
                variant="outlined"
              />
            </div>

            <div className="row">
              <div className="col">
                <InputLabel id="start-date">Start date</InputLabel>
                <TextField
                  required
                  id="start-date"
                  value={Data?.startDate?.slice(0, 10)}
                  margin="dense"
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="col">
                <InputLabel id="end-date">End date</InputLabel>
                <TextField
                  required
                  id="end-date"
                  value={Data?.endDate?.slice(0, 10)}
                  margin="dense"
                  label=""
                  type="date"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row">
              <FormControl className="col m-2">
                <TextField
                  label="UI-Category"
                  value={Data?.uiCategory}
                  margin="dense"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="col mt-3 mx-2">
                <InputLabel id="Status">Project Objective</InputLabel>
                <Select
                  labelId="Project-Objective"
                  defaultValue={objetive?.id}
                  id="Status"
                  label="Project Objective"
                >
                  {data1?.data?.length > 0 &&
                    data1?.data?.map((e: any) => {
                      return (
                        <MenuItem value={e.id} key={e.id}>
                          {e.description}
                        </MenuItem>
                      );
                    })}
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
