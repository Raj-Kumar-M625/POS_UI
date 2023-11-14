import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Get, Post } from "../../Services/Axios";
import {
  BAD_REQUEST,
  CONFLICT,
  NOTFOUND,
  SUCCESS,
} from "../../Constants/StatusCodes";
import { BASE_URL } from "../../Constants/Urls";
import Swal from "sweetalert2";
import { UserCreateDto } from "../../Models/Employee/User";
import { RegisterInputField } from "./RegisterInputField";
import { PASSWORD_PATTERN } from "../../Constants/Regex/Regex";

type ModelError = {
  PhoneNumber: boolean;
  SecondaryPhoneNumber: boolean;
  UserName: boolean;
  EmployeeCode: boolean;
  Email: boolean;
  Password: boolean;
  ConfirmPassword: boolean;
  Role: boolean;
  Department: boolean;
  Category: boolean;
};

export const Register = ({ setUserAction }: any) => {
  const [categories, setcategories] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const categoryRef = useRef<any>(null);
  const subCategoryRef = useRef<any>(null);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [userDto, setUserDto] = useState<UserCreateDto>({
    PhoneNumber: "",
    SecondaryPhoneNumber: "",
    UserName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Role: "",
    Department: "",
    Category: "",
  });

  const [modelError, setModelError] = useState<ModelError>({
    PhoneNumber: false,
    SecondaryPhoneNumber: false,
    UserName: false,
    EmployeeCode: false,
    Email: false,
    Password: false,
    ConfirmPassword: false,
    Role: false,
    Department: false,
    Category: false,
  });

  var Category: string[] = [];
  var categorySet = new Set<any>();

  useEffect(() => {
    let categoriesList = Get("app/CommonMaster/GetCodeTableList");
    categoriesList.then((response: any) => {
      var category = response?.data?.filter(
        (x: any) => x.codeType === "EmployeeCategory"
      );
      setcategories(category || []);
    });
  }, []);

  categories?.forEach((element: any) => {
    categorySet.add(element.codeName);
  });

  Category = [...categorySet];
  type userDtoType = keyof typeof userDto;

  async function onSubmitHandler() {
    var isModelError = false;
    var error: any = {};
    Object.keys(userDto).forEach((key: string) => {
      if (userDto[key as userDtoType]?.length === 0) {
        error[`${key}`] = true;
        isModelError = true;
      } else {
        error[`${key}`] = false;
      }
    });

    setModelError(error);
    if (isModelError) return;

    if (userDto.PhoneNumber.length < 10) {
      Swal.fire({
        title: "Error",
        text: "Please enter valid phone number.",
        icon: "error",
      });
      return;
    }

    if (userDto.SecondaryPhoneNumber.length < 10) {
      Swal.fire({
        title: "Error",
        text: "Please enter valid secondary phone number.",
        icon: "error",
      });
      return;
    }

    if (userDto?.Password?.length < 8) {
      Swal.fire({
        title: "Error",
        text: "Password must be atleast 8 characters.",
        icon: "error",
      });
      return;
    }

    if (userDto?.ConfirmPassword !== userDto?.Password) {
      Swal.fire({
        title: "Error",
        text: "Passwords does not match.",
        icon: "error",
      });
      return;
    }

    if (!PASSWORD_PATTERN.test(`${userDto?.Password}`)) {
      Swal.fire({
        title: "Error",
        text: "Password must contain atleast one special character,number and captial letter",
        icon: "error",
      });
      return;
    }
    setLoader(true);
    var response: any = await Post(`${BASE_URL}Auth/register`, userDto);

    if (response.response) response = response.response;

    switch (response.response?.status || response.status) {
      case SUCCESS:
        Swal.fire({
          title: "Success",
          text: "User Successfully Created",
          icon: "success",
        }).then(() => {
          setUserAction({ signUp: true, register: false });
        });
        break;
      case NOTFOUND:
        Swal.fire({
          title: "Error",
          text: `${response.response.data}`,
          icon: "error",
        });
        break;
      case CONFLICT:
        Swal.fire({
          title: "Error",
          text: `${response.response.data}`,
          icon: "error",
        });
        break;
      case BAD_REQUEST:
        Swal.fire({
          title: "Error",
          text: `${response.response.data.errors}`,
          icon: "error",
        });
        break;
      default:
        setLoader(false);
        Swal.fire({
          title: "Error",
          text: `${response.response}`,
          icon: "error",
        });
    }
    return;
  }

  const handleCategoryChange = (event: any) => {
    if (subCategoryRef.current) subCategoryRef.current.value = "";
    const subCategories = categories.filter(
      (element: any) => element.codeName === event.target.value
    );
    setSubCategories(subCategories);
  };

  return (
    <>
      <Box>
        <TextField
          margin="normal"
          required
          fullWidth
          id="UserName"
          label="Name"
          error={modelError?.UserName}
          onChange={(e: any) => {
            setModelError({ ...modelError, UserName: false });
            setUserDto({ ...userDto, UserName: e.target.value });
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="Email"
          label="Email Address"
          autoComplete="Email"
          error={modelError?.Email}
          onChange={(e: any) => {
            setModelError({ ...modelError, Email: false });
            setUserDto({ ...userDto, Email: e.target.value });
          }}
          autoFocus
        />
        <div className="row">
          <FormControl fullWidth className="col m-3">
            <InputLabel required id="Team-Member">
              Role
            </InputLabel>
            <Select
              labelId="role"
              required
              label="Role"
              error={modelError?.Role}
              onChange={(e: any) => {
                setModelError({ ...modelError, Role: false });
                setUserDto({ ...userDto, Role: e.target.value });
              }}
            >
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Customer">Customer</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="row">
          <TextField
            margin="normal"
            className="col m-3"
            required
            fullWidth
            inputProps={{ minLength: 10, maxLength: 10 }}
            error={modelError?.PhoneNumber}
            onChange={(e: any) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              setModelError({ ...modelError, PhoneNumber: false });
              setUserDto({ ...userDto, PhoneNumber: e.target.value });
            }}
            label="Phone Number"
            type="text"
            id="number"
          />
        </div>
        <div className="row">
          <TextField
            margin="normal"
            className="col m-3"
            fullWidth
            error={modelError?.SecondaryPhoneNumber}
            onChange={(e: any) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              setModelError({ ...modelError, SecondaryPhoneNumber: false });
              setUserDto({ ...userDto, SecondaryPhoneNumber: e.target.value });
            }}
            inputProps={{ minLength: 10, maxLength: 10 }}
            label="Secondary Number"
            type="text"
            id="number"
          />
        </div>
        <div className="row">
          <FormControl required fullWidth className="col m-3">
            <InputLabel id="Team-Member">Category</InputLabel>
            <Select
              labelId="category-simple-select"
              required
              inputRef={categoryRef}
              error={modelError?.Category}
              onChange={(e: any) => {
                handleCategoryChange(e);
                setModelError({ ...modelError, Category: false });
                setUserDto({ ...userDto, Category: e.target.value });
              }}
              label="Category"
            >
              {Category.map((option: any) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="col m-3">
            <InputLabel required id="department-simple-select">
              Department
            </InputLabel>
            <Select
              labelId="department"
              required
              inputRef={subCategoryRef}
              label="Department"
              error={modelError?.Department}
              onChange={(e: any) => {
                setModelError({ ...modelError, Department: false });
                setUserDto({ ...userDto, Department: e.target.value });
              }}
            >
              {subCategories.map((option: any) => (
                <MenuItem key={option.codeValue} value={option.codeValue}>
                  {option.codeValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="row">
          <RegisterInputField
            setModelError={setModelError}
            setUserDto={setUserDto}
            userDto={userDto}
            modelError={modelError}
          />
        </div>
        <div className="row">
          <TextField
            margin="normal"
            className="col m-3"
            required
            fullWidth
            error={modelError?.ConfirmPassword}
            onChange={(e: any) => {
              setModelError({ ...modelError, ConfirmPassword: false });
              setUserDto({ ...userDto, ConfirmPassword: e.target.value });
            }}
            autoComplete="new-password"
            label="Confirm Password"
            type="password"
          />
        </div>
        <Button
          variant="contained"
          fullWidth
          disabled={loader}
          color="primary"
          onClick={() => onSubmitHandler()}
          sx={{ mt: 3, mb: 2 }}
        >
          {loader ? "Registering..." : "Register"}
        </Button>
      </Box>
    </>
  );
};
