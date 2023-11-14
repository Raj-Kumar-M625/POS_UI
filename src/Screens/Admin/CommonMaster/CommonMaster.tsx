import { Box, Breadcrumbs, Button, Grid, Tooltip, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DataTable from "react-data-table-component";
import {  useState } from "react";
import { EditCommonMaster } from "./EditCommonMaster";
import { useContextProvider } from "../../../CommonComponents/Context";
import { CommonMaster } from "../../../Models/Common/CommonMaster";
import { AddCommonMaster } from "./AddCommonMaster";


export const Commonmaster =() => {
   
    const [projectView, setProjectView] = useState<any>({
        edit: false,
        add: false,
        viewObj: false,
      });
    
    const [projectdata, setProjectdata] = useState<any>();
    const [reload, setReload] = useState<boolean>(true);
    const {commonMaster,setLoading} = useContextProvider() 

const columns: any = [
    {
      name: "Action",
      width: "10rem",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              className="mx-1"
              title="Edit"
              onClick={() => {
                setProjectView({ edit: true });
                setProjectdata(row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "codeType",
      name: "Code Type",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: CommonMaster) => <p className="tableStyle">{row.codeType}</p>,
    },
    {
      field: "codeName",
      name: "Code Name",
      width: "15rem",
      right: true,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: CommonMaster) => <p className="tableStyle">{row.codeName}</p>,
    },
    {
      field: "codeValue",
      name: "Code Value",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: CommonMaster) => <p className="tableStyle">{row.codeValue}</p>,
    },
    {
      field: "displaySequence",
      name: "Display Sequence",
      width: "12rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      align: "right",
      selector: (row: CommonMaster) => <p className="tableStyle">{row.displaySequence}</p>,
    },
    {
        field: "isActive",
        name: "Is Active",
        width: "12rem",
        headerClassName: "bg-primary text-light",
        headerAlign: "right",
        align: "right",
        editable: false,
        right: true,
        selector: (row: CommonMaster) => (
          <p className="tableStyle">{row.isActive ? "Active":"In Active"}</p>
        ),
      },
  ];

  const handleClickOpen = () => {
    setProjectView({ add: true });
  };


  return (
    <>
    <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>CommonMaster</Typography>
      </Breadcrumbs>

      <div className="mt-5">
      <div className="d-flex flex-column justify-content-center align-items-center">
      <Grid>
        <Button
          variant="contained"
          className="mb-2 float-md-start"
          onClick={handleClickOpen}
        >
          Add CommonMaster
          <AddIcon className="mx-1" />
        </Button>
        <Grid item xs={12} sm={11}>
          <Box style={{ width: "94vw" }}>
            <DataTable
              columns={columns}
              fixedHeader
              responsive
              persistTableHead
              // progressPending={loading}
              data={commonMaster || []}
              customStyles={{
                table: {
                  style: {
                    height: "80vh",
                    border: "1px solid rgba(0,0,0,0.1)",
                  },
                },

                headRow: {
                  style: {
                    background: "#1e97e8",
                    fontSize: "16px",
                    color: "white",
                    fontFamily: "inherit",
                  },
                },
              }}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[50, 100, 200]}
              pointerOnHover={true}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
    </div>
    <AddCommonMaster
        openDialog={projectView}
        setOpenDialog={setProjectView}
        setReload={setReload}
        setLoading={setLoading}
      />
    <EditCommonMaster
        openDialog={projectView}
        setOpenDialog={setProjectView}
        Data={projectdata}
        setLoading={setLoading}
      />
    </>
  )
}

