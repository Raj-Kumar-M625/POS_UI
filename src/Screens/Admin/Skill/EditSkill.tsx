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
const formField = [
  "Id",
  "Category",
  "SubCategory1",
  "SubCategory2",
  "SubCategory3",
];
export const EditSkill = ({
  openDialog,
  setOpenDialog,
  setfilterRows,
  setRows,
  data,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [errorMsg] = useState<any>({
    message: "",
    show: false,
  });
  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    await Post("app/Skillset/UpdateSkillset", data);
    Swal.fire({
      title: "Success",
      text: "Skill  Updated Successfully!",
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
  };

  return (
    <div>
      <Dialog open={openDialog?.edit} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ backgroundColor: "#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <DialogTitle style={{ color: 'blue', flex: '1' }}>Edit Skill Set</DialogTitle>
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
            <input {...register("Id")} value={data.id} hidden />
            <div className="row">
              <TextField
                required
                className="col m-2"
                {...register("Category")}
                label="Category"
                defaultValue={data.category}
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
                defaultValue={data.subCategory1}
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
                defaultValue={data.subCategory2}
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
                defaultValue={data.subCategory3}
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
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="success">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
