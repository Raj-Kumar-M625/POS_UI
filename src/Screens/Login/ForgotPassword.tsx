import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  InputLabel,
  TextField,
} from "@mui/material";
import { BASE_URL } from "../../Constants/Urls";
import { Post } from "../../Services/Axios";
import { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { PasswordUpdateDto } from "../../Models/Employee/User";
import Swal from "sweetalert2";
import { SUCCESS } from "../../Constants/StatusCodes";
import { PasswordSet } from "./PasswordSet";
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!])([A-Za-z0-9@#$%^&+=!]{8,})$/;

export const ForgotPassword = ({ open, setOpen }: any) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [passwordDto, setpasswordDto] = useState<PasswordUpdateDto>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmitHandler = async () => {
    if (passwordDto.email.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please enter email address.",
        icon: "error",
      });
      return;
    }

    if (passwordDto.password.length < 8) {
      Swal.fire({
        title: "Error",
        text: "Password should be at least 8 characters.",
        icon: "error",
      });
      return;
    }

    if (!passwordPattern.test(`${passwordDto.password}`)) {
      Swal.fire({
        title: "Error",
        text: "Password must contain atleast one special character,number and captial letter",
        icon: "error",
      });
      return;
    }

    if (passwordDto.password !== passwordDto.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords does not match.",
        icon: "error",
      });
      return;
    }
    setLoader(true);
    debugger;
    var response: any = await Post(`${BASE_URL}Auth/ChangePW`, passwordDto);
    if (response?.response) response = response?.response;
    Swal.fire({
      title: `${response?.status != SUCCESS ? "Error" : "Success"}`,
      text: "Error occured while updating!",
      icon: `${response?.status != SUCCESS ? "error" : "success"}`,
    });
    handleClose();
  };

  const handleClose = () => {
    setpasswordDto({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setOpen(false);
    setLoader(false);
  };
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              height: "60vh",
              width: "80%",
              maxWidth: "32vw",
            },
          },
        }}
      >
        <div
          style={{
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle>Create New Password</DialogTitle>
          <CancelOutlinedIcon
            onClick={handleClose}
            className="mx-2"
            sx={{
              color: "red",
              fontSize: "30px",
              cursor: "pointer",
            }}
          />
        </div>
        <DialogContent className="row popup">
          <InputLabel id="project-type" className="mb-2"></InputLabel>
          <div className="row">
            <TextField
              margin="normal"
              required
              className="col m-3"
              fullWidth
              autoComplete="new-email"
              label="Email Address"
              type="email"
              onChange={(e) =>
                setpasswordDto({ ...passwordDto, email: e.target.value })
              }
            />
          </div>
          <div className="row">
            <PasswordSet
              setpasswordDto={setpasswordDto}
              passwordDto={passwordDto}
            />
          </div>
          <div className="row">
            <TextField
              margin="normal"
              className="col m-3"
              required
              fullWidth
              onChange={(e) =>
                setpasswordDto({
                  ...passwordDto,
                  confirmPassword: e.target.value,
                })
              }
              autoComplete="off"
              label="Confirm Password"
              type="password"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            disabled={loader}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmitHandler}
            variant="contained"
            color="success"
            type="submit"
            disabled={loader}
          >
            {loader ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
