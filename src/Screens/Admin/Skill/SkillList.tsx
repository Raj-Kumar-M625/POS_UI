import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import DataTable from "react-data-table-component";
import { useEffect, useState, useRef } from "react";
import { Get } from "../../../Services/Axios";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { Skill } from "../../../Models/Skill/Skill";
import { AddSkill } from "./AddSkill";
import { ViewSkill } from "./ViewSkill";
import { EditSkill } from "./EditSkill";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const SkillList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<any>([]);
  const [filterRows, setfilterRows] = useState<any>([]);
  const [filter, setfilter] = useState<Skill>({});
  const categoryRef = useRef<HTMLInputElement>(null);
  const category1Ref = useRef<HTMLInputElement>(null);
  const category2Ref = useRef<HTMLInputElement>(null);
  const category3Ref = useRef<HTMLInputElement>(null);
  const [viewSkillData, setSkillData] = useState<any>({});

  const [skillView, setSkilliew] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });

  const columns: any = [
    {
      field: "Action",
      name: "Action",
      type: "Date",
      width: 242,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              title="View"
              className="mx-2"
              onClick={() => {
                setSkilliew({ view: true });
                setSkillData(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            <Tooltip
              title="Edit"
              className="mx-2"
              onClick={() => {
                setSkilliew({ edit: true });
                setSkillData(row);
              }}
            >
              <EditIcon className="fs-4 text-warning" />
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "category",
      name: "Category",
      width: 300,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.category}</p>,
    },
    {
      field: "subCategory1",
      name: "Sub Category 1",
      width: 300,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.subCategory1}</p>,
    },
    {
      field: "subCategory2",
      name: "Sub Category 2",
      width: 300,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.subCategory2}</p>,
    },
    {
      field: "subCategory3",
      name: "Sub Category 3",
      width: 300,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row?.subCategory3}</p>,
    },
  ];

  useEffect(() => {
    let employeeList = Get("app/Skillset/GetSkillsetList");
    employeeList.then((response: any) => {
      setRows(response?.data);
      setfilterRows(response?.data || []);
      setLoading(false);
    });
  }, []);

  const handleClickOpen = () => {
    setSkilliew({ add: true });
  };

  function ApplyFilter() {
    let temp: any = [];

    if (filter.Category != null) {
      temp = rows.filter((row: any) => {
        return (
          row.category?.toLowerCase().search(filter?.Category?.toLowerCase()) >=
          0
        );
      });
      setfilterRows(temp);
    }

    if (filter.Category1 != null) {
      temp = rows.filter((row: any) => {
        return (
          row.subCategory1
            ?.toLowerCase()
            .search(filter?.Category1?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.Category2 != null) {
      temp = rows.filter((row: any) => {
        return (
          row.subCategory2
            ?.toLowerCase()
            .search(filter?.Category2?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.Category3 != null) {
      temp = rows.filter((row: any) => {
        return (
          row.subCategory3
            ?.toLowerCase()
            .search(filter?.Category3?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.Id != null) {
      temp = rows.filter((row: any) => {
        return row.id === Number(filter.Id);
      });
      setfilterRows(temp);
    }
  }

  function Reset() {
    setfilter({});
    if (categoryRef.current) categoryRef.current.value = "";
    if (category1Ref.current) category1Ref.current.value = "";
    if (category2Ref.current) category2Ref.current.value = "";
    if (category3Ref.current) category3Ref.current.value = "";
    setfilterRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to="/Admin">
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Skills</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Category</label>
                <input
                  id="Category"
                  ref={categoryRef}
                  placeholder="Category"
                  className="m-1 form-control col"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const alphabeticValue = inputValue.replace(
                      /[^A-Za-z]/g,
                      ""
                    );
                    setfilter((prevState) => ({
                      ...prevState,
                      Category:
                        alphabeticValue === "" ? undefined : alphabeticValue,
                    }));
                  }}
                  value={filter.Category || ""}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Sub Category 1</label>
                <input
                  id="subCategory1"
                  ref={category1Ref}
                  placeholder="Sub Category 1"
                  className="m-1 form-control col"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const alphabeticValue = inputValue.replace(
                      /[^A-Za-z]/g,
                      ""
                    );
                    setfilter((prevState) => ({
                      ...prevState,
                      Category1:
                        alphabeticValue === "" ? undefined : alphabeticValue,
                    }));
                  }}
                  value={filter.Category1 || ""}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Sub Category 2</label>
                <input
                  id="project-name"
                  ref={category2Ref}
                  placeholder="Sub Category 2"
                  className="m-1 form-control col"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const alphabeticValue = inputValue.replace(
                      /[^A-Za-z]/g,
                      ""
                    );
                    setfilter((prevState) => ({
                      ...prevState,
                      Category2:
                        alphabeticValue === "" ? undefined : alphabeticValue,
                    }));
                  }}
                  value={filter.Category2 || ""}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>Sub Category 3</label>
                <input
                  id="Sub Category 1"
                  ref={category3Ref}
                  placeholder="Sub Category 3"
                  className="m-1 form-control col"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const alphabeticValue = inputValue.replace(
                      /[^A-Za-z]/g,
                      ""
                    );
                    setfilter((prevState) => ({
                      ...prevState,
                      Category3:
                        alphabeticValue === "" ? undefined : alphabeticValue,
                    }));
                  }}
                  value={filter.Category3 || ""}
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
        <Grid>
          <Button
            variant="contained"
            className="mb-2 float-md-start"
            onClick={handleClickOpen}
          >
            Add Skill Set
            <AddIcon className="mx-1" />
          </Button>

          <Grid item xs={12} sm={11}>
            <Box style={{ width: "94vw" }}>
              <DataTable
                columns={columns}
                fixedHeader
                responsive
                persistTableHead
                progressPending={loading}
                data={filterRows || []}
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
      <AddSkill
        openDialog={skillView}
        setOpenDialog={setSkilliew}
        setfilterRows={setfilterRows}
        setRows={setRows}
      />
      <ViewSkill
        openDialog={skillView}
        setOpenDialog={setSkilliew}
        data={viewSkillData}
      />

      <EditSkill
        openDialog={skillView}
        setOpenDialog={setSkilliew}
        setfilterRows={setfilterRows}
        setRows={setRows}
        data={viewSkillData}
      />
    </>
  );
};
