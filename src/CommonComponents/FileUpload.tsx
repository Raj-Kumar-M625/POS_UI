import { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";

export function FileUpload({ uploadedFiles, setUploadedFiles }: any) {
  const [fileLimit, setFileLimit] = useState(false);
  const fileRef = useRef<any>();
  const MAX_COUNT = 20;
  const handleUploadFiles = (files: any) => {
    const uploaded: any = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file: any) => {
      if (uploaded.findIndex((f: any) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e: any) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  function handleFileRemove(fileName: string) {
    var files = uploadedFiles.filter((file: File) => file.name !== fileName);
    setUploadedFiles(files);
    if (files.length === 0) {
      if (fileRef.current) fileRef.current.value = "";
    }
    return;
  }

  return (
    <div className="App">
      <input
        id="fileUpload"
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFileEvent}
        disabled={fileLimit}
        className="form-control p-3"
      />
      <div className="uploaded-files-list">
        {uploadedFiles.map((file: any, index: number) => (
          <div key={index} className="d-flex justify-content-evenly">
            <span className="text-start" style={{ width: "20rem" }}>
              {file.name.length > 25 ? (
                <Tooltip title={file.name}>
                  <span>{file.name.slice(0, 25)}...</span>
                </Tooltip>
              ) : (
                file.name
              )}
            </span>
            <span className="text-center">-</span>
            <span
              className="fw-bold mx-2 text-danger"
              style={{ cursor: "pointer" }}
            >
              <DeleteIcon onClick={() => handleFileRemove(file.name)} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
