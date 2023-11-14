import { TopBar } from "./CommonComponents/TopBar";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginScreen } from "./Screens/Login/LoginScreen";
import { AdminRouter } from "./Router/AdminRouter";
import { EmployeeRouter } from "./Router/EmployeeRouter";
import { Typography } from "@mui/material";
import { UAT, VERSION } from "./Constants/Versions";

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/Login" />}></Route>
        <Route path="/Login" element={<LoginScreen />}></Route>
      </Routes>
      <AdminRouter />
      <EmployeeRouter />
      <div
        style={{
          backgroundColor: "",
        }}
        className="w-100 footer"
      >
        <Typography className="fw-bolder text-center">
          Version {VERSION} | {UAT}
        </Typography>
      </div>
    </>
  );
}
export default App;
