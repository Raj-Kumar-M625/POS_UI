import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextareaAutosize,
  Button,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Get, Post } from "../../../../Services/Axios";
import { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AlertOption } from "../../../../Models/Common/AlertOptions";

const formField = ["Description", "ProjectId", "Status", "Percentage", "id"];

export const EditProjectObjective = ({
  openDialog,
  setOpenDialog,
  Data,
  setfilterRows,
  setRows,
  ProjectId,
}: any) => {
  const { register, handleSubmit, resetField } = useForm();
  const [save, setSave] = useState<boolean>(false);
  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  const onSubmitHandler = async (data: any) => {
    setSave(true);
    const { error }: any = await Post(
      "app/Project/UpdateProjectObjective",
      data
    );
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
        text: "Objective Updated successfully!!",
        icon: "success",
      };
    }

    Swal.fire({
      ...option,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      let skillList = Get(
        `app/Project/GetProjectObjective?ProjectId=${ProjectId}`
      );
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
    setSave(false);
  };
  return (
    <div className="w-50">
      <Dialog open={openDialog?.edit} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogTitle sx={{ color: "orange", fontWeight: "bold" }}>
              Project Objective
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
          <DialogContent
            className="row popup d-flex justify-content-center"
            sx={{
              width: 590,
            }}
          >
            <div className="row col-md-8">
              <TextareaAutosize
                className="col m-2 form-control"
                placeholder="Description"
                required
                {...register("Description")}
                style={{ height: 100 }}
                defaultValue={Data?.description}
              />
            </div>
            <div className="row col-md-8">
              <FormControl className="col m-2">
                <InputLabel id="project-type">Status</InputLabel>
                <Select
                  labelId="Status"
                  id="Status"
                  required
                  {...register("Status")}
                  label="Status"
                  defaultValue={Data?.status}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="In Progress">In Progres</MenuItem>
                </Select>
              </FormControl>
            </div>
            <input type="text" {...register("id")} value={Data?.id} hidden />
            <input {...register("CreatedBy")} value="user" hidden />
            <input {...register("UpdatedBy")} value="user" hidden />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">
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
