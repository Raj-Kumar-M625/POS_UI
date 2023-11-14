import { Button } from "@mui/material";
import "../StyleSheets/Quadrant.css";
export const Quadrant = () => {
  return (
    <>
      <div className="container">
        <div className="grid">
          <div className="item m-2 ">
            <Button color="primary" variant="contained" className="px-1 m-2">
              Assign Lead
            </Button>
          </div>
          <div className="item m-2"></div>
          <div className="item m-2"></div>
          <div className="item m-2"></div>
        </div>
      </div>
    </>
  );
};
