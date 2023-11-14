import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import "../../StyleSheets/LoginPage.css";
import LinearProgress from "@mui/material/LinearProgress";
import { SignUp } from "./SignUp";
import { Register } from "./Register";
import { useState } from "react";

type UserAction = {
  signUp: boolean;
  register: boolean;
};

export const LoginScreen = () => {
  sessionStorage.setItem("isLoggedIn", "Login");
  const [userAction, setUserAction] = useState<UserAction>({
    signUp: true,
    register: false,
  });
  const [emailError, setemailError] = useState<boolean>(false);
  const [passwordError, setpasswordError] = useState<boolean>(false);
  const [errorMsg, seterrorMsg] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <div className="login-container d-flex flex-column align-items-center mt-5">
      {(emailError || passwordError || error) && (
        <Alert severity="error">{errorMsg}</Alert>
      )}
      <Container component="main" maxWidth="xs" className="m-3">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {userAction.signUp ? "Sign in" : "Register"}
          </Typography>
          {loader && (
            <Box sx={{ width: "100%" }} className="mt-2">
              <LinearProgress />
            </Box>
          )}
          <div className="d-flex m-2">
            <Button
              fullWidth
              className="mx-1"
              variant={userAction.signUp ? "contained" : `outlined`}
              onClick={() => {
                setUserAction({ signUp: true, register: false });
              }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              className="mx-1"
              type="submit"
              disabled={loader}
              variant={userAction.register ? "contained" : `outlined`}
              onClick={() => {
                setUserAction({ signUp: false, register: true });
                setemailError(false);
                setpasswordError(false);
              }}
            >
              Register
            </Button>
          </div>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {userAction.signUp && (
              <SignUp
                setLoader={setLoader}
                setemailError={setemailError}
                setpasswordError={setpasswordError}
                seterrorMsg={seterrorMsg}
                emailError={emailError}
                passwordError={passwordError}
                setError={setError}
                loader={loader}
              />
            )}
            {userAction.register && <Register setUserAction={setUserAction} />}
          </Box>
        </Box>
      </Container>
    </div>
  );
};
