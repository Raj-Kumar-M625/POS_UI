import { useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../Constants/Urls";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";

export function EditFileUpload({
  uploadedFiles,
  setUploadedFiles,
  selectedFiles,
  setSelectedFiles,
  deleteFileIds,
  setDeleteFileIds,
}: any) {
  const fileRef = useRef<any>();

  const handleUploadFiles = (files: any) => {
    const uploaded: any = [...uploadedFiles];
    const newFiles: any = [...selectedFiles];
    files.some((file: any) => {
      if (uploaded.findIndex((f: any) => f.fileName === file.name) === -1) {
        uploaded.push({
          fileName: file.name,
        });
        newFiles.push(file);
        return true;
      }
    });
    setUploadedFiles(uploaded);
    setSelectedFiles(newFiles);
  };

  const handleFileEvent = (e: any) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  function handleFileRemove(fileName: string) {
    var removeFile = uploadedFiles.find(
      (file: any) => file.fileName === fileName
    );
    debugger;
    var files = uploadedFiles.filter((file: any) => file.fileName !== fileName);
    setUploadedFiles(files);
    var _files = selectedFiles.filter((file: any) => file.name !== fileName);
    setSelectedFiles(_files);
    if (_files.length === 0) {
      if (fileRef.current) fileRef.current.value = "";
    }
    if (removeFile.id) {
      var ids = [...deleteFileIds, removeFile.id];
      setDeleteFileIds(ids);
    }
    return;
  }

  function downloadFile(id: number, fileName: string): string {
    if (!id) return "";
    const json: any = sessionStorage.getItem("user") || null;
    const sessionUser = JSON.parse(json);
    axios({
      url: `${BASE_URL}app/Project/DownloadFile?id=${id}`,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${sessionUser.token}`,
        Accept: "*/*",
      },
    })
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error: any) => {
        console.error("Error downloading file:", error);
      });
    return "";
  }

  return (
    <div className="App1">
      <input
        id="fileUpload"
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFileEvent}
        className="form-control p-3"
      />
      <div className="uploaded-files-list mt-2" style={{ width: "22rem" }}>
        {uploadedFiles.length > 0 &&
          uploadedFiles.map((file: any, index: number) => (
            <div key={index}>
              <table>
                <td>
                  <div className="text-start" style={{ width: "10.2rem" }}>
                    {file.fileName.length > 18 ? (
                      <Tooltip title={file.fileName}>
                        <span>{file.fileName.slice(0, 18)}...</span>
                      </Tooltip>
                    ) : (
                      file.fileName
                    )}
                  </div>
                </td>
                <td>-</td>
                <td>
                  <p
                    onClick={() => downloadFile(file.id, file.fileName)}
                    className={`text-primary mx-1 ${!file.id && "text-muted"}`}
                    style={{
                      cursor: `${file.id ? "pointer" : "not-allowed"}`,
                    }}
                  >
                    {file.id ? <DownloadIcon /> : <FileDownloadOffIcon />}
                  </p>
                </td>
                <td>
                  <DeleteIcon
                    color="error"
                    className="mx-2"
                    onClick={() => {
                      handleFileRemove(file.fileName);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
}
