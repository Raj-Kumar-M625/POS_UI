import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./../../../App.css";
import { Get, Post } from "../../../Services/Axios";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../Models/Common/AlertOptions";
const formField = [
  "UserName",
  "email",
  "phoneNumber",
  "secondaryPhoneNumber",
  "secondaryEmail",
  "department",
  "category",
  "Id",
  "Role",
];

export const EditEmployee = ({
  editEmployee,
  setEditEmployee,
  data,
  emailList,
  setReload,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [commonMaster, setCommonMaster] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);
  const [save, setSave] = useState<boolean>(false);
  const [selCat, setSelCat] = useState<any>("");
  var department: any = new Set();
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
    if (data.category) {
      setCategory([data.category]);
      setSelCat(data.category);
    }
  }, [data]);

  commonMaster?.map((e: any) => {
    if (e.codeType === "EmployeeCategory") {
      department.add(e.codeName);
    }
  });

  const handleDepartmentChange = (event: any) => {
    let temp: any = [];
    setSelCat("");
    commonMaster.map((e: any) => {
      if (event.target.value === e.codeName) {
        temp.push(e.codeValue);
      }
    });
    setCategory(temp);
  };

  const onSubmitHandler = async (data: any) => {
    if (selCat === "") {
      setErrorMsg({
        message: "Please select category!",
        show: true,
      });
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
    setSave(true);
    data.isActive = data.isActive === "Yes" ? true : false;
    const { error }: any = await Post("app/Employee/UpdateEmployee", data);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Data Not Updated!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Employee Updated Successfully!",
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
    setErrorMsg({
      message: "",
      show: false,
    });
    setSave(false);
    setEditEmployee({ edit: false });
    reset();
  };

  return (
    <div>
      <Dialog open={editEmployee?.edit}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle style={{ color: "blue", flex: "1" }}>
              Edit Employee Details -{" "}
              <span style={{ color: "blue" }}>{data.user?.name}</span>
            </DialogTitle>
            <CancelOutlinedIcon
              onClick={handleClose}
              sx={{
                color: "red",
                fontSize: "30px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
          </div>
          <DialogContent className="row popup">
            {errorMsg.show && (
              <Alert severity="error" className="mb-3">
                {errorMsg.message}.
              </Alert>
            )}
            <input {...register("Id")} value={data.userId} hidden />
            <input {...register("Role")} value="role" hidden />
            <div className="row">
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("UserName")}
                label="Name"
                defaultValue={data.user?.name}
                variant="outlined"
                // inputProps={{
                //   maxLength: 250,
                //   onInput: (event) => {
                //     const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                //     const newValue = input.value.replace(/[^A-Za-z0-1_ ]/g, ""); // Remove non-alphabetic characters
                //     if (newValue !== input.value) {
                //       input.value = newValue;
                //     }
                //   },
                // }}
              />
              <TextField
                required
                className="col m-2"
                margin="dense"
                {...register("phoneNumber", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                defaultValue={data.phoneNumber}
                label="Phone Number"
                variant="outlined"
                // inputProps={{
                //   maxLength: 250,
                //   onInput: (event) => {
                //     const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                //     const newValue = input.value.replace(/\D/g, "");
                //     // Remove non-alphabetic characters
                //     if (newValue !== input.value) {
                //       input.value = newValue;
                //     }
                //   },
                // }}
              />
            </div>
            <div className="row">
              <TextField
                required
                className="col m-2"
                margin="dense"
                defaultValue={data.user?.email}
                {...register("email", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                label="Email"
                variant="outlined"
              />
              <FormControl fullWidth className="col m-2">
                <InputLabel required id="Team-Member">
                  Department
                </InputLabel>
                <Select
                  labelId="department"
                  required
                  label="Department"
                  defaultValue={data.department}
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
            </div>
            <div className="row">
              <TextField
                className="col m-2"
                margin="dense"
                {...register("secondaryEmail", {
                  onChange: () => {
                    setErrorMsg({ show: false });
                  },
                })}
                defaultValue={data.user?.secondaryEmail}
                label="Secondary Email"
                variant="outlined"
              />
              <FormControl required fullWidth className="col m-2">
                <InputLabel id="Team-Member">Category</InputLabel>
                <Select
                  labelId="category"
                  required
                  label="Category"
                  defaultValue={data.category}
                  {...register("category", {
                    onChange: (e: any) => {
                      setSelCat(e.target.value);
                      setErrorMsg({
                        message: "",
                        show: false,
                      });
                    },
                  })}
                >
                  {category.map((e: any) => {
                    return (
                      <MenuItem value={e} key={e}>
                        {e}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="row col-6">
              <FormControl className="m-2">
                <InputLabel id="Is-Active">Is Active</InputLabel>
                <Select
                  labelId="category"
                  required
                  label="Category"
                  defaultValue={data.isActive ? "Yes" : "No"}
                  {...register("isActive", {
                    onChange: (e: any) => {
                      setSelCat(e.target.value);
                      setErrorMsg({
                        message: "",
                        show: false,
                      });
                    },
                  })}
                >
                  <MenuItem value={"Yes"}>Yes</MenuItem>
                  <MenuItem value={"No"}>No</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={save}
            >
              {save ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
