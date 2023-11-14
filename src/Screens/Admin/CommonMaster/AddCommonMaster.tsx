import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
  } from "@mui/material";
  import { useForm } from "react-hook-form";
  import { useState } from "react";
  import Swal from "sweetalert2";
  import { Post } from "../../../Services/Axios";
  import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
  import { AlertOption } from "../../../Models/Common/AlertOptions";
  const formField = [
    "CodeType",
    "CodeName",
    "CodeValue",
    "DisplaySequence",
    "IsActive",
    "id"
  ]; 
  export const AddCommonMaster = ({ openDialog, setOpenDialog, setLoading }: any) => {
    const { register, handleSubmit, resetField } = useForm();
    const [save, setSave] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<any>({
      message: "",
      show: false,
    });
  
    function reset() {
      formField.map((e: string) => {
        resetField(e);
      });     
    }
  
    debugger
    const onSubmitHandler = async (data: any) => {
      setSave(true);
      data.IsActive = data.IsActive === "Active" ? true :false
      const { error }: any = await Post("app/CommonMaster/AddCommonmaster", data);
      var option: AlertOption;
      if (error) {
        option = {
          title: "Error",
          text: "Error Occured While Saving!",
          icon: "error",
        };
      } else {
        option = {
          title: "Success",
          text: "Project Added Successfully!",
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

  
    const handleClose = () => {
      reset();
      setErrorMsg({
        message: "",
        show: false,
      });
      setSave(false);
      setOpenDialog({ add: false });
    };
  
    return (
      <div>
        <Dialog open={openDialog?.add}>
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
                Add CommonMaster
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
                  {errorMsg.message}. <strong>check it out!</strong>
                </Alert>
              )}
              <div className="row">
                <TextField
                  required
                  className="col m-2"
                  {...register("CodeType")}
                  label="Code Type"
                  type="text"
                  variant="outlined"
                />
                <TextField
                  required
                  className="col m-2"
                  {...register("CodeName")}
                  label="Code Name"
                  type="text"
                  variant="outlined"
                />               
              </div>
              <div className="row">
              <TextField
                  required
                  className="col m-2"
                  {...register("CodeValue")}
                  label="Code Value"
                  type="text"
                  variant="outlined"
                />               
              </div>
              <div className="row">
                <TextField
                  required
                  className="col m-2"
                  {...register("DisplaySequence")}
                  label="Display Sequence"
                  type="text"
                  variant="outlined"
                />
                <TextField
                  required
                  className="col m-2"
                  {...register("IsActive")}
                  label="Is Active"
                  type="text"
                  variant="outlined"
                />               
              </div>      
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                size="medium"
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
              <Button
                size="medium"
                variant="contained"
                color="success"
                disabled={save}
                type="submit"
              >
                {save ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  };
  