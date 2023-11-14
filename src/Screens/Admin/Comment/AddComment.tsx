import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  Button,
  InputLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Post } from "../../../Services/Axios";
export const AddComment = ({ open, setOpen, commentData, refetch }: any) => {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);
  const onSubmitHandler = async (data: any) => {
    var comment: any = {
      Comment: data.Comment,
      TaskId: commentData[0].taskId,
      ProjectId: commentData[0].projectId,
      EmployeeId: sessionUser.employeeId,
      CreatedBy: "user",
      UpdatedBy: "user",
    };
    debugger;
    await Post("app/Common/AddComment", comment);
    refetch();
    handleClose();
  };
  const { register, handleSubmit, resetField } = useForm();
  const handleClose = () => {
    resetField("Comment");
    setOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              height: "50vh",
              width: "90%",
              maxWidth: "50vw",
            },
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent className="row popup">
            <InputLabel id="project-type" className="mb-2">
              Comment
            </InputLabel>
            <TextareaAutosize
              required
              className="col form-control"
              placeholder="Description"
              {...register("Comment")}
              style={{ height: 180 }}
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
