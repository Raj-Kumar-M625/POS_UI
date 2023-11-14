import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Get, Post } from "../../../Services/Axios";
import { AlertOption } from "../../../Models/Common/AlertOptions";

const formField = [
  "UserName",
  "password",
  "confirmPassword",
  "email",
  "phoneNumber",
  "role",
  "secondaryPhoneNumber",
  "employeeCode",
  "secondaryEmail",
];

export const AddEmployee = ({
  openDialog,
  setOpenDialog,
  emailList,
  setReload,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [commonMaster, setCommonMaster] = useState<any>([]);
  const [Categories, setCategories] = useState<any>([]);
  var department: any = new Set();
  var role: any = new Set();
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  useEffect(() => {
    const response = Get("app/CommonMaster/GetCodeTableList");
    response.then((res: any) => {
      setCommonMaster(res.data);
    });
  }, []);

  commonMaster?.map((e: any) => {
    if (e.codeType === "EmployeeCategory") {
      department.add(e.codeName);
    }
  });

  commonMaster?.map((e: any) => {
    if (e.codeType === "Role") {
      role.add(e.codeValue);
    }
  });

  const handleDepartmentChange = (event: any) => {
    let temp: any = [];
    commonMaster.map((e: any) => {
      if (event.target.value === e.codeName) {
        temp.push(e.codeValue);
      }
    });
    setCategories(temp);
  };

  const onSubmitHandler = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setErrorMsg({ message: "Passwords do not match!", show: true });
      return;
    }

    if (data.phoneNumber.replaceAll(" ", "").length != 10) {
      setErrorMsg({
        message: "Please enter 10 digit phone number!",
        show: true,
      });
      return;
    }
    const email = emailList.find((e: any) => {
      return e.trim().toLowerCase() === data.email.trim().toLowerCase();
    });

    if (email) {
      setErrorMsg({
        message: "Email already exists!",
        show: true,
      });
      return;
    }
    const { error }: any = await Post("Auth/register", data);

    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Data Not Saved!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Employee Created Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setReload((prev: boolean) => !prev);
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setOpenDialog({ add: false });
  };

  return (
    <div>
      <Dialog open={openDialog?.add} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogContent className="row popup">
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}. <strong>check it out!</strong>
              </Alert>
            )}
            <div className="row">
              <TextField
                required
                className="col m-2"
                {...register("UserName")}
                label="Name"
                type="text"
                variant="outlined"
              />
              <TextField
                required
                className="col m-2"
                {...register("phoneNumber", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                margin="dense"
                id="phoneNumber"
                label="Phone Number"
                type="number"
                fullWidth
                variant="outlined"
              />
            </div>

            <div className="row">
              <FormControl fullWidth className="col m-2">
                <InputLabel required id="Team-Member">
                  Department
                </InputLabel>
                <Select
                  labelId="department"
                  required
                  id="department"
                  label="Department"
                  defaultValue=""
                  {...register("department", {
                    onChange: (e: any) => handleDepartmentChange(e),
                  })}
                >
                  {[...department].map((e: any) => {
                    return (
                      <MenuItem value={e} key={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth className="col m-2">
                <InputLabel required id="Team-Member">
                  Category
                </InputLabel>
                <Select
                  labelId="category"
                  required
                  id="category"
                  label="Category"
                  defaultValue=""
                  {...register("category")}
                >
                  {[...Categories].map((e: any) => {
                    return (
                      <MenuItem value={e} key={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="row">
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("email", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                id="email"
                label="Email"
                type="email"
                autoComplete="off"
                fullWidth
                variant="outlined"
              />
              <TextField
                className="col m-2"
                margin="dense"
                {...register("secondaryEmail", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                id="secondaryEmail"
                autoComplete="off"
                label="Secondary Email"
                type="email"
                fullWidth
                variant="outlined"
              />
            </div>
            <div className="row">
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("password", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                label="Password"
                autoComplete="off"
                type="password"
                variant="outlined"
              />
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("confirmPassword", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                id="confirmPassword"
                autoComplete="off"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="outlined"
              />
            </div>
            <div className="row col-md-6">
              <FormControl fullWidth className="col m-2">
                <InputLabel required id="Team-Member">
                  Role
                </InputLabel>
                <Select
                  required
                  className="col-md-2 "
                  margin="dense"
                  {...register("role")}
                  autoComplete="off"
                  label="Role"
                  fullWidth
                  variant="outlined"
                >
                  {[...role].map((e: any) => {
                    return (
                      <MenuItem value={e} key={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
