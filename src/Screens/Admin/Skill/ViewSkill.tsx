import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
export const ViewSkill = ({ openDialog, setOpenDialog, data }: any) => {
  const handleClose = () => {
    setOpenDialog({ add: false });
  };
  return (
    <>
      <Dialog open={openDialog?.view}>
        <form>
        <div style={{ backgroundColor: "#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <DialogTitle style={{ color: 'blue', flex: '1' }}>Skill Set Details</DialogTitle>
  <CancelOutlinedIcon
    onClick={handleClose}
    sx={{ color: "red", fontSize: "30px", marginRight: '10px', cursor: 'pointer' }}
  />
</div>
          <DialogContent className="row popup">
            <div className="row">
              <TextField
                className="col m-2"
                margin="dense"
                aria-readonly
                value={data.category}
                label="Category"
                fullWidth
                variant="outlined"
              />
              <TextField
                className="col m-2"
                margin="dense"
                id="SubCategory1"
                aria-readonly
                label="Sub Category1"
                value={data.subCategory1}
                variant="outlined"
              />
            </div>
            <div className="row">
              <TextField
                className="col m-2"
                margin="dense"
                aria-readonly
                id="SubCategory2"
                value={data.subCategory2}
                label="Sub Category2"
                variant="outlined"
              />{" "}
              <TextField
                className="col m-2"
                margin="dense"
                id="SubCategory3"
                aria-readonly
                value={data.subCategory3}
                label="Sub Category3"
                variant="outlined"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
            variant="contained"
              onClick={() => {
                setOpenDialog({ view: false });
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
