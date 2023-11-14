import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Post } from "../../../Services/Axios";
import { BASE_COMMENT_URL } from "../../../Constants/Urls";
import Swal from "sweetalert2";

const formField = [
  "TableName",
  "Description",
  "LiteralName",
  "CreatedBy",
  "UpdatedBy",
  "Id",
];

export const EditComment = ({ open, setOpen, data, fetchComments }: any) => {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const { handleSubmit, register, resetField } = useForm();

  function handleClose() {
    setOpen(false);
    reset();
  }

  function reset() {
    formField.map((e: string) => {
      resetField(e);
    });
  }

  async function onSubmitHandler(data: any) {
    await Post(`${BASE_COMMENT_URL}app/Comments/UpdateComment`, data);
    setOpen(!open);
    Swal.fire({
      title: "Success",
      text: "Comment Updated successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    reset();
    fetchComments();
  }

  return (
    <>
      <Dialog open={open}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle>Edit Comment</DialogTitle>
          <DialogContent className="row popup ">
            <div className="row">
              <TextField
                id="Table-Name"
                label="Table Name"
                className="m-3"
                {...register("TableName")}
                defaultValue={data?.tableName}
              />
              <TextField
                id="desc"
                label="Description"
                className="m-3"
                {...register("Description")}
                defaultValue={data?.description}
              />
              <TextField
                id="literal-name"
                label="Literal Name"
                {...register("LiteralName")}
                defaultValue={data?.literalName}
                className="m-3"
              />
            </div>
            <input
              type="text"
              {...register("Id")}
              defaultValue={data?.id}
              hidden
            />
            <input
              type="text"
              {...register("CreatedBy")}
              defaultValue={sessionUser.employeeId}
              hidden
            />
            <input
              type="text"
              {...register("UpdatedBy")}
              defaultValue={sessionUser.employeeId}
              hidden
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
