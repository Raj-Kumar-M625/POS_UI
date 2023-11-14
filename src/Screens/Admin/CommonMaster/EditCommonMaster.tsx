import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
  } from "@mui/material";
  import { useState } from "react";
  import { useForm } from "react-hook-form";
  import Swal from "sweetalert2";
  import { Post } from "../../../Services/Axios";
//   import { useQuery } from "react-query";
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
  
  export const EditCommonMaster = ({
    openDialog,
    setOpenDialog,
    Data,
    setLoading,
  }: any) => {
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
     
    const onSubmitHandler = async (data:any) => {
      setSave(true); 
      debugger
      data.IsActive = data.IsActive === "Active" ? true :false
      const { error }: any = await Post(`app/CommonMaster/UpdateCommonMaster`, data);
      var option: AlertOption;
  
      if (error) {
        option = {
          title: "Error",
          text: "Error Occured While Updating!",
          icon: "error",
        };
      } else {
        option = {
          title: "Success",
          text: "Common Master Updated Successfully!",
          icon: "success",
        };
      }
  
      Swal.fire({
        ...option,
        confirmButtonColor: "#3085d6",
      }).then(() => {       
      });
      setLoading((prev:boolean)=>!prev)
      handleClose();
    };
  
    const handleClose = () => {
      reset();
      setErrorMsg({
        message: "",
        show: false,
      });
      setOpenDialog({ edit: false });
      setSave(false);
    };
  
    return (
      <div>
        <Dialog open={openDialog?.edit || false}>
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
                Edit CommonMaster{" "}
                <span style={{ color: "blue" }}>{" - " + Data?.codeType}</span>
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
                  defaultValue={Data?.codeType}
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
                  margin="dense"
                  defaultValue={Data?.codeName}
                  label="Code Name"
                  type="text"
                  fullWidth
                  variant="outlined"              
                />                
              </div>
              <div className="row">
                <TextField
                  required
                  className="col m-2"
                  {...register("CodeValue")}
                  margin="dense"
                  defaultValue={Data?.codeValue}
                  label="Code Value"
                  type="text"
                  fullWidth
                  variant="outlined"            
                />
              </div>
              <div className="row">
              <TextField
                  required
                  className="col m-2"
                  {...register("DisplaySequence")}
                  margin="dense"
                  defaultValue={Data?.displaySequence}
                  label="Display Sequence"
                  type="text"
                  fullWidth
                  variant="outlined"          
                /> 
                <TextField
                  required
                  className="col m-2"
                  {...register("IsActive")}
                  margin="dense"
                  defaultValue={Data?.isActive ? "Active":"In Active"}
                  label="Is Active"
                  type="text"
                  fullWidth
                  variant="outlined"          
                />                             
              </div>
              <input {...register("id")} value={Data?.id} hidden />
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
  