import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ConvertDate } from "../../../Utilities/Utils";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { AddComment } from "./AddComment";

export const ViewTaskComment = ({
  openDialog,
  setOpenDialog,
  data,
  refetch,
}: any) => {
  const [open, setopen] = useState(false);
  const handleClose = () => {
    setOpenDialog({ view: false });
  };

  return (
    <div>
      <Dialog
        open={openDialog?.view || false}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "90%",
              maxWidth: "110vw",
            },
          },
        }}
      >
        <form>
          <DialogTitle sx={{ fontWeight: "bold", color: "blue" }}>
            Comment Details
          </DialogTitle>
          <DialogContent className="row popup ">
            <TableContainer component={Paper} className="w-100">
              <Button
                variant="contained"
                className="mb-2"
                onClick={() => setopen(true)}
              >
                <AddIcon /> Add Comment
              </Button>
              <Table
                sx={{ minWidth: 800 }}
                aria-label="simple table"
                className="border"
              >
                <TableHead>
                  <TableRow sx={{ background: "#03fcc6" }}>
                    <TableCell>Comments</TableCell>
                    <TableCell align="right">Created By</TableCell>
                    <TableCell align="right">Created date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row: any) => (
                    <TableRow
                      key={row.taskId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell sx={{ width: 900 }}>{row.comment}</TableCell>
                      <TableCell align="right">{row.employee}</TableCell>
                      <TableCell align="right">
                        {ConvertDate(row.createdOn)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <AddComment
        open={open}
        setOpen={setopen}
        commentData={data}
        refetch={refetch}
      />
    </div>
  );
};
