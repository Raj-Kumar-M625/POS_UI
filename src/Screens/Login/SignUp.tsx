import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../Services/Axios";
import { VERSION } from "../../Constants/Versions";
import { BASE_URL } from "../../Constants/Urls";
import { CONFLICT, NOTFOUND, SUCCESS } from "../../Constants/StatusCodes";
import { ADMIN, CUSTOMER, EMPLOYEE } from "../../Constants/Roles";
import { ForgotPassword } from "./ForgotPassword";
import { UserLoginDto } from "../../Models/Employee/User";
import { SessionUser } from "../../Models/Employee/Employee";
import { useContextProvider } from "../../CommonComponents/Context";

export const SignUp = ({
  setLoader,
  setemailError,
  setpasswordError,
  seterrorMsg,
  emailError,
  passwordError,
  setError,
  loader,
}: any) => {
  const [open, setopen] = useState(false);
  sessionStorage.setItem("isLoggedIn", "Login");
  const [user, setuser] = useState<UserLoginDto>({
    email: "",
    password: "",
    versionCode: VERSION,
  });
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser: SessionUser = JSON.parse(json);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const { setContext } = useContextProvider();
  const handleSignInClick = async () => {
    if (user.email == "" || user.password == "") {
      user.email == ""
        ? emailRef.current?.focus()
        : user.password == ""
        ? passwordRef.current?.focus()
        : undefined;
      return;
    }
    setLoader(true);
    setError(false);
    let response: any = await Post(`${BASE_URL}Auth/Login`, user);
    if (response.response) response = response.response;

    switch (response.response?.status || response.status) {
      case SUCCESS:
        sessionStorage.setItem("user", JSON.stringify(response.data));
        setContext(response.data);
        Redirect(response.data.userRoles);
        break;
      case NOTFOUND:
        setemailError(true);
        setLoader(false);
        seterrorMsg(response.response.data);
        break;
      case CONFLICT:
        setpasswordError(true);
        setLoader(false);
        seterrorMsg(response.response.data);
        break;
      default:
        setLoader(false);
        setError(true);
        seterrorMsg(response?.message);
    }
  };

  async function Redirect(role: string) {
    switch (role) {
      case EMPLOYEE:
        navigate("/Employee");
        break;
      case ADMIN:
        navigate("/Admin");
        break;
      case CUSTOMER:
        navigate("/Customer");
        break;
      default:
        navigate("/Login");
    }
    sessionStorage.setItem("isLoggedIn", "Logout");
  }

  useEffect(() => {
    if (sessionUser == null) {
      sessionStorage.setItem("isLoggedIn", "Login");
    } else {
      sessionStorage.setItem("isLoggedIn", "Logout");
      Redirect(sessionUser.userRoles);
    }
  }, []);

  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        inputRef={emailRef}
        id="email"
        label="Email Address"
        name="email"
        error={emailError}
        autoComplete="email"
        onChange={(e) => {
          setemailError(false);
          setuser({ ...user, email: e.target.value });
        }}
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        onChange={(e) => {
          setuser({ ...user, password: e.target.value });
          setpasswordError(false);
        }}
        name="password"
        label="Password"
        type="password"
        inputRef={passwordRef}
        error={passwordError}
        id="password"
        autoComplete="current-password"
      />
      <Button
        variant="contained"
        fullWidth
        color="primary"
        disabled={loader}
        sx={{ mt: 3, mb: 2 }}
        onClick={() => handleSignInClick()}
      >
        {loader ? "Signing In..." : "Sign In"}
      </Button>
      <Button
        variant="text"
        fullWidth
        disabled={loader}
        color="primary"
        sx={{ mt: 1 }}
        onClick={() => setopen(true)}
      >
        Forgot Password?
      </Button>
      <ForgotPassword open={open} setOpen={setopen} />
    </>
  );
};
