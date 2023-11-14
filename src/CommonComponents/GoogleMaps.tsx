import { Dialog, DialogTitle } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const GoogleMaps = ({ open, setOpen, coordinates }: any) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <LocationOnIcon />
          {coordinates?.place}
        </DialogTitle>
        <div className="mapouter">
          <div className="gmap_canvas">
            <iframe
              width="600"
              height="500"
              src={`https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        </div>
      </Dialog>
    </>
  );
};
