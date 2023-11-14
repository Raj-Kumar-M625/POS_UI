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
  MenuItem,
  Select,
  Typography,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import "../../../StyleSheets/EditTask.css";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Get, Post } from "../../../Services/Axios";
import { ConvertToISO } from "../../../Utilities/Utils";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/system";
import { AlertOption } from "../../../Models/Common/AlertOptions";

export const EditTask = ({
  openDialog,
  setOpenDialog,
  Data,
  setLoading,
}: // setfilterRows,
// setRows,
any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [categoryLists, setCategoryList] = useState([]);
  const [category, setcategory] = useState<any>([]);
  const [selSubCat, setselSubCatt] = useState<any>([]);
  const [save, setSave] = useState<boolean>(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#0653cf",
  };

  const grey = {
    50: "#f6f8fa",
    100: "#eaeef2",
    200: "#d0d7de",
    300: "#afb8c1",
    400: "#8c959f",
    500: "#6e7781",
    600: "#57606a",
    700: "#424a53",
    800: "#32383f",
    900: "#24292f",
  };

  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 200px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 4.5;
    padding: 12px;
    border-radius: 5px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1.5px solid ${
      theme.palette.mode === "dark" ? grey[700] : grey[200]
    };

    &:hover {
      border-color: ${grey[900]}; 
    }

    &:focus {
      border-color: ${blue[400]};
      border:2px solid ${blue[900]}
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  const handleClose = () => {
    reset();
    setErrorMsg({
      message: "",
      show: false,
    });
    setOpenDialog({ edit: false });
    setSave(false);
  };

  const handleCategoryChange = (event: any) => {
    let temp: any = [];
    categoryLists.map((e: any) => {
      if (event.target.value === e.categories) {
        temp.push(e);
      }
    });
    setselSubCatt(temp);
    setSelectedSubCategory("");
  };

  const formField = [
    "Name",
    "Description",
    "EstimateStartDate",
    "StartDate",
    "EndDate",
    "EstimateEndDate",
    "Status",
    "Percentage",
    "CreatedBy",
    "UpdatedBy",
    "ProjectId",
    "Id",
    "category",
    "subCategory",
    "weekEndDate",
  ];

  var categoryList: any = new Set();

  useEffect(() => {
    setSelectedSubCategory(Data?.subCategory);
    const response = Get("app/Common/GetCategoriesList");
    response.then((res: any) => {
      res.data?.forEach((e: any) => {
        categoryList.add(e.categories);
      });
      setCategoryList(res.data || []);
      let temp = res.data?.filter((x: any) => x.categories === Data?.category);
      setcategory([...categoryList]);
      setselSubCatt(temp || []);
    });
  }, [Data?.description, Data?.subCategory]);

  const onSubmitHandler = async (data: any) => {
    setSave(true);
    let CategoryId: any = categoryLists.find(
      (x: any) => x.subCategory === data.CategoryId
    );
    data.CategoryId = CategoryId?.id;
    if (selectedSubCategory === "") {
      setErrorMsg({
        message: "Please select sub category!",
        show: true,
      });
      return;
    }
    if (data.EstimateStartDate > data.EstimateEndDate) {
      setErrorMsg({
        message: "Estimate Start Date must be before Estimate End Date",
        show: true,
      });
      return;
    }

    const { error }: any = await Post("app/Task/UpdateTask", data);
    var option: AlertOption;

    if (error) {
      option = {
        title: "Error",
        text: "Error updating the record!",
        icon: "error",
      };
    } else {
      option = {
        title: "Success",
        text: "Task Updated Successfully!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      setLoading((prev: boolean) => !prev);
    });
    handleClose();
  };

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  return (
    <div>
      <Dialog open={openDialog?.edit}>
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Typography
              className="fs-4"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                position: "sticky",
                top: 0,
                zIndex: 30,
              }}
            >
              <CancelOutlinedIcon
                onClick={handleClose}
                sx={{ ml: 65, color: "red", fontSize: "30px" }}
              />
              <span className="info-label">Project Name:</span>{" "}
              <span className="info-value">{Data?.projectName}</span>
              <br />
              <span className="info-label">Task Name:</span>{" "}
              <span className="info-value">{Data?.name}</span>
              <br />
              <span className="info-label">User Story:</span>{" "}
              <span className="info-value">{Data?.usName || "-"}</span>
              <br />
              <span className="info-label">User Interface:</span>{" "}
              <span className="info-value">{Data?.uiName || "-"}</span>
            </Typography>
            <Grid container sx={{ display: "inline-flex" }}>
              <Grid item xs={8}>
                <DialogTitle
                  className="fs-3"
                  style={{
                    textAlign: "center",
                    marginLeft: "45%",
                    color: "orange",
                    fontWeight: "bold",
                  }}
                >
                  Edit Task
                </DialogTitle>
              </Grid>
              <Grid item xs={4} sx={{ mt: 1 }}>
                <DialogActions>
                  <Button
                    size="large"
                    variant="contained"
                    color="success"
                    disabled={save}
                    type="submit"
                    sx={{ mr: 2, width: "150px" }}
                  >
                    {save ? "Saving..." : "Save"}
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
            <DialogContent className="row popup">
              {errorMsg.show && (
                <Alert severity="error" className="mb-3">
                  {errorMsg.message}.
                </Alert>
              )}
              <div className="row">
                <TextField
                  required
                  defaultValue={Data?.name}
                  className="col m-2"
                  {...register("Name")}
                  label="TasK Name"
                  type="text"
                  variant="outlined"
                  inputProps={{ maxLength: 250 }}
                />
                <FormControl fullWidth className="col m-2">
                  <InputLabel id="project-type">Status</InputLabel>
                  <Select
                    labelId="Priority"
                    defaultValue={Data?.status}
                    required
                    id="Priority"
                    label="Priority"
                    {...register("Status")}
                  >
                    <MenuItem value="Unassigned">Unassigned</MenuItem>
                    <MenuItem value="Assigned">Assigned</MenuItem>
                    <MenuItem value="In-Progress">In-Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On-Hold">On-Hold</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="row">
                <InputLabel id="description" sx={{ ml: 2 }}>
                  Description
                </InputLabel>
                <StyledTextarea
                  required
                  id="description"
                  {...register("Description")}
                  className="col m-2 mb-3"
                  aria-label="empty textarea"
                  defaultValue={Data?.description}
                />
              </div>
              <div className="row">
                <TextField
                  required
                  defaultValue={Data?.teamName}
                  className={`col m-2 ${
                    Data?.teamName ? "read-only-input" : ""
                  }`}
                  label="Team Name"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  className={`col m-2 ${
                    Data?.employeeName ? "read-only-input" : ""
                  }`}
                  defaultValue={Data?.employeeName || "-"}
                  label="Employee Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="row">
                <FormControl fullWidth className="col m-2">
                  <InputLabel required id="category">
                    category
                  </InputLabel>
                  <Select
                    labelId="category"
                    required
                    id="category"
                    label="Category"
                    defaultValue={Data?.category}
                    {...register("SubCategory", {
                      onChange: (e: any) => {
                        handleCategoryChange(e);
                      },
                    })}
                  >
                    {[...category].map((e: any, index: number) => {
                      return (
                        <MenuItem value={e} key={index}>
                          {e}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl fullWidth className="col m-2">
                  <InputLabel required id="subCategory">
                    Sub Category
                  </InputLabel>
                  <Select
                    labelId="Sub category"
                    required
                    id="Sub-category"
                    label="Sub Category"
                    defaultValue={Data?.subCategory}
                    {...register("CategoryId", {
                      onChange: (e: any) => {
                        setSelectedSubCategory(e.target.value);
                        setErrorMsg({
                          message: "",
                          show: false,
                        });
                      },
                    })}
                  >
                    {[...selSubCat].map((e: any) => {
                      return (
                        <MenuItem value={e.subCategory} key={e.id}>
                          {e.subCategory}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="row">
                <div className="col">
                  <InputLabel id="start-date">Est Start date</InputLabel>
                  <TextField
                    required
                    id="start-date"
                    defaultValue={ConvertToISO(Data?.estimateStartDate)}
                    margin="dense"
                    {...register("EstimateStartDate")}
                    type="date"
                    fullWidth
                    variant="outlined"
                  />
                </div>
                <div className="col">
                  <InputLabel id="end-date">Est End date</InputLabel>
                  <TextField
                    required
                    id="end-date"
                    defaultValue={ConvertToISO(Data?.estimateEndDate)}
                    margin="dense"
                    {...register("EstimateEndDate")}
                    type="date"
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <InputLabel id="start-date">Start date</InputLabel>
                  <TextField
                    required
                    id="start-date"
                    defaultValue={ConvertToISO(Data?.actualStartDate)}
                    className={`${
                      Data?.actualStartDate ? "read-only-input" : ""
                    }`}
                    margin="dense"
                    {...register("StartDate")}
                    label=""
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div className="col">
                  <InputLabel id="end-date">End date</InputLabel>
                  <TextField
                    required
                    id="end-date"
                    defaultValue={ConvertToISO(Data?.actualEndDate)}
                    className={`${
                      Data?.actualEndDate ? "read-only-input" : ""
                    }`}
                    margin="dense"
                    {...register("EndDate")}
                    label=""
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </div>
              <Grid container>
                <Grid item xs={5} sx={{ ml: 0 }}>
                  <div>
                    <InputLabel id="end-date">Week Ending date</InputLabel>
                    <TextField
                      required
                      id="end-date"
                      defaultValue={ConvertToISO(Data?.weekEndDate)}
                      margin="dense"
                      {...register("weekEndDate")}
                      label=""
                      type="date"
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                </Grid>
              </Grid>
              <input
                {...register("ProjectId")}
                value={Data?.projectId}
                hidden
              />
              <input {...register("CreatedBy")} value="user" hidden />
              <input {...register("UpdatedBy")} value="user" hidden />
              <input {...register("Id")} value={Data?.id} hidden />
            </DialogContent>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
