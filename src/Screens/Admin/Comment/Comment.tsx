import DataTable from "react-data-table-component";
import "../../../StyleSheets/TabPage.css";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_COMMENT_URL } from "../../../Constants/Urls";
import { ConvertDate } from "../../../Utilities/Utils";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { EditComment } from "./EditComment";

const json: any = sessionStorage.getItem("user") || null;
const sessionUser = JSON.parse(json);
const token = sessionUser?.token;
const HEADER = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

type Filter = {
  TableName?: string;
  LiteralName?: string;
  CreatedBy?: string;
  CreatedDate?: string;
};

export const Comment = () => {
  const [comments, setComments] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const tableNameRef = useRef<any>();
  const literalNameRef = useRef<any>();
  const createdByRef = useRef<any>();
  const createdDateRef = useRef<any>();
  const [data, setData] = useState<any>({});
  const [filter, setfilter] = useState<Filter>({});
  const [filterRows, setfilterRows] = useState<any>([]);
  const [open, setOpen] = useState(false);

  async function fetchComments() {
    debugger;
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_COMMENT_URL}app/Comments/GetComments`,
        HEADER
      );
      setComments(response.data || []);
      setfilterRows(response.data || []);
      setLoading(false);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  const columns: any = [
    {
      name: "Action",
      width: "15rem",
      selector: (row: any) => (
        <Tooltip
          className="mx-1"
          title="Edit"
          onClick={() => {
            setData(row);
            setOpen(!open);
          }}
        >
          <EditIcon className="fs-4 text-warning" key={row.id} />
        </Tooltip>
      ),
    },
    {
      name: "Table Name",
      width: "15rem",
      selector: (row: any) => <p className="tableStyle">{row.tableName}</p>,
    },
    {
      name: "Description",
      width: "15rem",
      selector: (row: any) => <p className="tableStyle">{row.description}</p>,
    },
    {
      name: "Literal Name",
      width: "15rem",
      selector: (row: any) => <p className="tableStyle">{row.literalName}</p>,
    },
    {
      name: "Created By",
      width: "15rem",
      selector: (row: any) => <p className="tableStyle">{row.createdBy}</p>,
    },
    {
      name: "Created Date",
      width: "15rem",
      selector: (row: any) => {
        const result = ConvertDate(row.createdDate);
        return <p className="tableStyle">{result}</p>;
      },
    },
  ];

  function ApplyFilter() {
    if (filter.CreatedDate != null) {
      var filteredData = comments.filter(
        (x: any) =>
          x.CreatedDate.slice(0, 10) === filter.CreatedDate?.slice(0, 10)
      );
      setfilterRows(filteredData);
    }

    if (filter.CreatedBy != null) {
      var filteredData = comments.filter(
        (x: any) => x.createdBy.toLowerCase().search(filter.CreatedBy) >= 0
      );
      setfilterRows(filteredData);
    }

    if (filter.TableName != null) {
      var filteredData = comments.filter(
        (x: any) => x.tableName.toLowerCase().search(filter.TableName) >= 0
      );
      setfilterRows(filteredData);
    }

    if (filter.LiteralName != null) {
      var filteredData = comments.filter(
        (x: any) => x.literalName.toLowerCase().search(filter.LiteralName) >= 0
      );
      setfilterRows(filteredData);
    }
  }

  function Reset() {
    if (tableNameRef.current) tableNameRef.current.value = "";
    if (literalNameRef.current) literalNameRef.current.value = "";
    if (createdByRef.current) createdByRef.current.value = "";
    if (createdDateRef.current) createdDateRef.current.value = "";
    setfilterRows(comments);
  }

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Comments</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Table Name</label>
                <input
                  id="Category"
                  ref={tableNameRef}
                  placeholder="Table Name"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        TableName: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Literal Name</label>
                <input
                  id="subCategory1"
                  ref={literalNameRef}
                  placeholder="Literal Name"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        Category1: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Created By</label>
                <input
                  id="project-name"
                  ref={createdByRef}
                  placeholder="Created By"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        CreatedBy: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Created date</label>
                <input
                  id="Sub Category 1"
                  type="date"
                  ref={createdDateRef}
                  placeholder="Created date"
                  className="m-1 form-control col"
                  onChange={(e: any) => {
                    setfilter((prevState) => {
                      return {
                        ...prevState,
                        Category3: e.target.value == "" ? null : e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="row justify-content-end">
                <div className="col-auto">
                  <Button
                    variant="contained"
                    endIcon={<SearchIcon />}
                    className="mx-2 mt-4"
                    onClick={() => ApplyFilter()}
                  >
                    Search
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<RefreshIcon />}
                    className="mx-2 mt-4"
                    onClick={() => Reset()}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mb-5">
        <Grid item xs={12} sm={11}>
          <Box style={{ width: "94vw" }}>
            <DataTable
              columns={columns}
              fixedHeader
              responsive
              persistTableHead
              progressPending={loading}
              data={filterRows}
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
      </div>
      <EditComment
        open={open}
        setOpen={setOpen}
        data={data}
        fetchComments={fetchComments}
      />
    </>
  );
};
