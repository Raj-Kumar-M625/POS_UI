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
import { Get, Post } from "../../../Services/Axios";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
const formField = ["Category", "SubCategory1", "SubCategory2", "SubCategory3"];
export const AddSkill = ({
  openDialog,
  setOpenDialog,
  setfilterRows,
  setRows,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });
  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    await Post("app/Skillset/AddSkillset", data);
    Swal.fire({
      title: "Success",
      text: "Skill Added successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let skillList = Get("app/Skillset/GetSkillsetList");
      skillList.then((response: any) => {
        setRows(response?.data);
        setfilterRows(response?.data || []);
      });
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setOpenDialog({ add: false });
    setErrorMsg;
    ({
      message: "",
      show: false,
    });
  };

  return (
    <div>
      <Dialog open={openDialog?.add} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ backgroundColor: "#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <DialogTitle style={{ color: 'blue', flex: '1' }}>Add Skill Set</DialogTitle>
  <CancelOutlinedIcon
    onClick={handleClose}
    sx={{ color: "red", fontSize: "30px", marginRight: '10px', cursor: 'pointer' }}
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
                {...register("Category")}
                label="Category"
                type="text"
                variant="outlined"
                inputProps={{
                  maxLength: 250,
                  onInput: (event) => {
                    const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                    const newValue = input.value.replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
                    if (newValue !== input.value) {
                      input.value = newValue;
                    }
                  },
                }}
              />
              <TextField
                required
                className="col m-2"
                {...register("SubCategory1")}
                aria-required
                label="Sub Category1"
                type="text"
                variant="outlined"
                inputProps={{
                  maxLength: 250,
                  onInput: (event) => {
                    const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                    const newValue = input.value.replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
                    if (newValue !== input.value) {
                      input.value = newValue;
                    }
                  },
                }}
              />
            </div>
            <div className="row">
              <TextField
                className="col m-2"
                {...register("SubCategory2")}
                label="Sub Category2"
                type="text"
                variant="outlined"
                inputProps={{
                  maxLength: 250,
                  onInput: (event) => {
                    const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                    const newValue = input.value.replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
                    if (newValue !== input.value) {
                      input.value = newValue;
                    }
                  },
                }}
              />
              <TextField
                className="col m-2"
                {...register("SubCategory3")}
                label="Sub Category3"
                type="text"
                variant="outlined"
                inputProps={{
                  maxLength: 250,
                  onInput: (event) => {
                    const input = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
                    const newValue = input.value.replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
                    if (newValue !== input.value) {
                      input.value = newValue;
                    }
                  },
                }}
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
                    type="submit"
                  >
                    Save
                  </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
