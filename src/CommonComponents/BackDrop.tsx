import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import WhiteScrum from "../assets/whiteScrum.svg";
import BlackScrum from "../assets/blackScrum.svg";

export default function BackDrop({ open }: any) {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export function ScrumIconWhite() {
  return <img src={WhiteScrum} className="mx-1" />;
}

export function ScrumIconBlack() {
  return <img src={BlackScrum} className="mx-1" />;
}
