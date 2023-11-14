import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import DownloadIcon from "@mui/icons-material/Download";
import DataTable from "react-data-table-component";
import { DownloadEmployeeList } from "../../../Services/EmployeeService";
import { Employee } from "../../../Models/Employee/Employee";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ViewEmployee } from "./ViewEmployee";
import { AddEmployee } from "./AddEmployee";
import { EditEmployee } from "./EditEmployee";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useContextProvider } from "../../../CommonComponents/Context";
import { ADMIN } from "../../../Constants/Roles";

const EmployeeList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);
  const [viewEmployeeData, setviewEmployeeData] = useState<any>({});
  const [filterRows, setfilterRows] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [categories, setcategories] = useState<any>([]);
  const [departments, setdepartments] = useState<any>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const userIdRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<any>(null);
  const departmentRef = useRef<any>(null);
  const [filter, setfilter] = useState<Employee>({});
  const { role } = useContextProvider();
  const navigate = useNavigate();
  const [empView, setEmpView] = useState<any>({
    view: false,
    edit: false,
    add: false,
  });
  var Category: string[] = [];
  var categorySet = new Set<any>();
  const columns: any = [
    {
      name: "Action",
      width: "15rem",
      selector: (row: any) => {
        return (
          <>
            <Tooltip
              className="mx-2"
              title="View"
              onClick={() => {
                setEmpView({ view: true });
                setviewEmployeeData(row);
              }}
            >
              <VisibilityIcon className="fs-4 text-info" />
            </Tooltip>
            {role === ADMIN && (
              <Tooltip
                className="mx-2"
                title="Edit"
                onClick={() => {
                  setEmpView({ edit: true });
                  setviewEmployeeData(row);
                }}
              >
                <EditIcon className="fs-4 text-warning" />
              </Tooltip>
            )}
            {role === ADMIN && (
              <Tooltip
                className="mx-2"
                title="Assign Skill"
                onClick={() => {
                  navigate("/Admin/AssignSkill", {
                    state: { data: row.user },
                  });
                }}
              >
                <PsychologyIcon className="fs-4 text-success" />
              </Tooltip>
            )}
            <Tooltip
              className="mx-2"
              title="Employee Dashboard"
              onClick={() => {
                navigate(`/${role}/EmployeeDashboard`, {
                  state: {
                    data: row.userId,
                    Employeename: row.user.name,
                    employeeId: row.id,
                  },
                });
              }}
            >
              <DashboardIcon className="fs-4 text-info" />
            </Tooltip>
            {/* <Link to="/Admin/Scrum">
              <Tooltip title="scrum" className="mx-2">
                <img src={Scrum} width={25} height={25} />
              </Tooltip>
            </Link> */}
          </>
        );
      },
    },
    {
      field: "userId",
      name: "User ID",
      width: "7rem",
      right: true,
      selector: (row: any) => <p className="tableStyle">{row.userId}</p>,
    },
    {
      field: "name",
      name: "Name",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => (
        <Link
          to={`/${role}/EmployeeOverView`}
          className="tableStyle"
          state={{
            employeeId: row.id,
            employeeName: row.user.name,
            route: "employee",
          }}
        >
          {row.user.name}
        </Link>
      ),
    },
    {
      field: "email",
      name: "Email",
      width: "15rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.user.email}</p>,
    },
    {
      field: "phoneNumber",
      name: "Phone Number",
      width: "15rem",
      right: true,
      headerClassName: "bg-primary text-light",
      headerAlign: "right",
      align: "right",
      selector: (row: any) => <p className="tableStyle">{row.phoneNumber}</p>,
    },
    {
      field: "category",
      name: "Category",
      width: "10rem",
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.category}</p>,
    },
    {
      field: "department",
      name: "Department",
      width: 200,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "left",
      align: "left",
      selector: (row: any) => <p className="tableStyle">{row.department}</p>,
    },
    {
      field: "Action",
      headerName: "Action",
      type: "Date",
      width: 430,
      editable: false,
      headerClassName: "bg-primary text-light",
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        return (
          <>
            <Button
              color="primary"
              variant="contained"
              className="mx-1"
              onClick={() => {
                setEmpView({ view: true });
                setviewEmployeeData(params.row);
              }}
            >
              View
            </Button>
            <Button
              color="warning"
              variant="contained"
              className="mx-1"
              onClick={() => {
                setEmpView({ edit: true });
                setviewEmployeeData(params.row);
              }}
            >
              Edit
            </Button>
            <Button
              color="secondary"
              variant="contained"
              className="mx-1 px-3"
              onClick={() => {
                navigate("/Admin/AssignSkill", {
                  state: { data: params.row.user },
                });
              }}
            >
              Assign Skill
            </Button>
            <Button
              color="info"
              variant="contained"
              className="mx-1 px-4"
              onClick={() => {
                navigate("/Admin/EmployeeDashboard", {
                  state: {
                    data: params.row.userId,
                    Employeename: params.row.user.name,
                    employeeId: params.row.id,
                  },
                });
              }}
            >
              DashBoard
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    let employeeList = Get("app/Employee/GetEmployeeList");
    let categoriesList = Get("app/Project/GetCategoriesList");

    employeeList.then((response: any) => {
      setRows(response?.data || []);
      setfilterRows(response?.data || []);
      setLoading(false);
    });

    categoriesList.then((response: any) => {
      setcategories(response?.data || []);
    });
  }, [reload]);

  categories?.forEach((element: any) => {
    categorySet.add(element.categories);
  });

  Category = [...categorySet];
  Category.sort((a, b) => {
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
  });

  const handleCategoryChange = (event: any) => {
    if (departmentRef.current) departmentRef.current.clearValue();
    let temp: any = [];
    setfilter((prevState) => {
      return { ...prevState, category: event?.label };
    });
    categories?.forEach((element: any) => {
      if (element.categories === event?.value) {
        temp.push(element.subCategory);
      }
    });
    temp.sort((a: any, b: any) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });
    setdepartments(temp);
  };

  let email: string[] = [];
  rows?.forEach((row: any) => {
    if (row.user?.email) {
      email.push(row.user?.email);
    }
  });

  const handleClickOpen = () => {
    setEmpView({ add: true });
  };

  function ApplyFilter() {
    let temp: any = [];

    if (filter.category != null) {
      temp = rows.filter((row: any) => {
        return (
          row.category?.toLowerCase().search(filter?.category?.toLowerCase()) >=
          0
        );
      });
      setfilterRows(temp);
    }

    if (filter.department != null) {
      temp = rows.filter((row: any) => {
        return (
          row.department
            ?.toLowerCase()
            .search(filter?.department?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.name != null) {
      temp = rows.filter((row: any) => {
        return (
          row.user.name?.toLowerCase().search(filter?.name?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.email != null) {
      temp = rows.filter((row: any) => {
        return (
          row.user.email?.toLowerCase().search(filter?.email?.toLowerCase()) >=
          0
        );
      });
      setfilterRows(temp);
    }

    if (filter.phoneNumber != null) {
      temp = rows.filter((row: any) => {
        return (
          row.phoneNumber
            ?.toLowerCase()
            .search(filter?.phoneNumber?.toLowerCase()) >= 0
        );
      });
      setfilterRows(temp);
    }

    if (filter.userId != null) {
      temp = rows.filter((row: any) => {
        return row.userId === Number(filter.userId);
      });
      setfilterRows(temp);
    }
  }

  function Reset() {
    setfilter({});
    if (userIdRef.current) userIdRef.current.value = "";
    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (phoneRef.current) phoneRef.current.value = "";
    if (categoryRef.current) categoryRef.current.value = "";
    if (departmentRef.current) departmentRef.current.value = "";
    if (categoryRef.current) categoryRef.current.clearValue();
    if (departmentRef.current) departmentRef.current.clearValue();
    setfilterRows(rows);
  }

  return (
    <>
      <Breadcrumbs className="mt-3 mx-3" separator=">">
        <Link color="inherit" to={`/${role}`}>
          <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
        </Link>
        <Typography sx={{ fontWeight: "bold" }}>Employee</Typography>
      </Breadcrumbs>
      <div className="well mx-auto mt-4">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label>User Id</label>
              <input
                id="name"
                placeholder="User Id"
                ref={userIdRef}
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue) || inputValue === "") {
                    setfilter((prevState) => ({
                      ...prevState,
                      userId: isNaN(numericValue) ? undefined : numericValue,
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    !/[\d.eE-]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Name</label>
              <input
                id="name"
                ref={nameRef}
                placeholder="Name"
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const alphabeticValue = inputValue.replace(/[^A-Za-z]/g, ""); // Remove non-alphabetic characters
                  setfilter((prevState) => ({
                    ...prevState,
                    name: alphabeticValue === "" ? undefined : alphabeticValue,
                  }));
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Email</label>
              <input
                id="email"
                ref={emailRef}
                placeholder="Email"
                className="m-1 form-control col"
                onChange={(e: any) => {
                  setfilter((prevState) => {
                    return {
                      ...prevState,
                      email: e.target.value == "" ? null : e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                id="tel"
                ref={phoneRef}
                placeholder="Phone Number"
                className="m-1 form-control col"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericValue = parseFloat(inputValue);

                  if (!isNaN(numericValue) || inputValue === "") {
                    setfilter((prevState) => ({
                      ...prevState,
                      phoneNumber: isNaN(numericValue)
                        ? undefined
                        : String(numericValue),
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    // Allow numeric keys, backspace, delete, and arrow keys
                    !/[\d.eE-]|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Category</label>
              <Select
                id="category-simple-select"
                isClearable={true}
                ref={categoryRef}
                className="col mt-1"
                onChange={(code: any) => {
                  if (code) {
                    handleCategoryChange(code);
                  }
                }}
                options={Category.map((opt: any) => ({
                  label: opt,
                  value: opt,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000,
                  }),
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Department</label>
              <Select
                id="department-simple-select"
                isClearable={true}
                ref={departmentRef}
                options={departments.map((opt: any) => ({
                  label: opt,
                  value: opt,
                }))}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000, // Adjust z-index if needed
                  }),
                }}
                placeholder="Department"
                className="m-1 col"
                onChange={(code: any) => {
                  if (code) {
                    setfilter((prevState) => ({
                      ...prevState,
                      department: code.value,
                    }));
                  }
                }}
              />
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-auto">
                <Button
                  variant="contained"
                  endIcon={<SearchIcon />}
                  className="mx-3 mt-3 "
                  onClick={() => ApplyFilter()}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  endIcon={<RefreshIcon />}
                  className="mx-3 mt-3"
                  onClick={() => Reset()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mb-5">
        <Grid>
          {role === ADMIN && (
            <Button
              variant="contained"
              className="mb-2 float-md-start"
              onClick={handleClickOpen}
            >
              Add Employee
              <AddIcon className="mx-1" />
            </Button>
          )}
          <Button
            variant="contained"
            className="mb-2 float-md-end"
            onClick={() => {
              if (filterRows.length == 0) {
                Swal.fire({
                  title: "Error",
                  text: "No data to download!",
                  icon: "error",
                  confirmButtonColor: "#3085d6",
                });
                return;
              }
              DownloadEmployeeList(filterRows);
            }}
          >
            Download
            <DownloadIcon className="mx-1" />
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
      <AddEmployee
        openDialog={empView}
        setOpenDialog={setEmpView}
        emailList={email}
        setReload={setReload}
      />
      <ViewEmployee
        viewEmployee={empView}
        setviewEmployee={setEmpView}
        data={viewEmployeeData}
      />
      <EditEmployee
        editEmployee={empView}
        setEditEmployee={setEmpView}
        setReload={setReload}
        emailList={email.filter((e) => e !== viewEmployeeData.user?.email)}
        data={viewEmployeeData}
      />
    </>
  );
};

export default EmployeeList;
