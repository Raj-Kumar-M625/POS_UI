import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Grid, ListItemButton, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { TbReportSearch } from "react-icons/tb";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardText,
    CCol,
    CRow,
} from '@coreui/react';
import Paper from '@mui/material/Paper';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Link } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Get } from "../../../../Services/Axios";
import { useQuery } from "react-query";
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from "react";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: '5px',
    width: '215px',
    height: '34px',
    marginLeft:10
}));

export const AdminProjectReport = () => {
    // const location = useLocation();
    const [ProjectId, setProjectId] = useState<any>("1");
    const [TaskLists, setTaskLists] = useState<any>();
    const [ProjectName, setProjectName] = useState<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const onClickProjectName = (name: any) => {
        const value = name.id.toString();
        const ProjectName = name.name;
        setProjectId(value);
        setProjectName(ProjectName);
        setSelectedProjectId(value);
    }

    useEffect(() => {
        if (ProjectId) {
            const TaskList = Get(
                `app/Task/getProjectTaskList?projectId=${ProjectId}`
            );
            TaskList.then((response: any) => {
                setTaskLists(response.data || []);
            });
        }
    }, [ProjectId]);



    async function ProjectReportLists() {
        const projectList = await Get(
            `app/Project/GetAllProjectlist`
        );
        return { projectList };
    }
    const { data }: any = useQuery("ProjectReportDetails", ProjectReportLists);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredProjects = data?.projectList?.data?.filter((project: any) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const completedMonthlyTasks = TaskLists?.monthlyTaskLists?.filter(
        (e: any) => e.status === "Completed"
    );

    const InProgressMonthlyTasks = TaskLists?.monthlyTaskLists?.filter(
        (e: any) => e.status === "In-Progress"
    );

    const CompletedMonthlyTasks = TaskLists?.monthlyTaskLists?.filter(
        (e: any) => e.status === "Ready-For-UAT"
    );

    const completedOverallTasks = TaskLists?.projectTaskLists?.filter(
        (e: any) => e.status === "Completed"
    );

    const InProgressOverAllTasks = TaskLists?.projectTaskLists?.filter(
        (e: any) => e.status === "In-Progress"
    );

    const ReadyforUATOverAllTasks = TaskLists?.projectTaskLists?.filter(
        (e: any) => e.status === "Ready-For-UAT"
    );

    const completedWeekTasks = TaskLists?.weekTask?.filter(
        (e: any) => e.status === "Completed"
    );

    const InProgressWeekTasks = TaskLists?.weekTask?.filter(
        (e: any) => e.status === "In-Progress"
        
    );

    const ReadyforUATWeekTasks = TaskLists?.weekTask?.filter(
        (e: any) => e.status === "Ready-For-UAT"
    );
    debugger

    return (
        <>
            <div style={{ background: "#dff0ed", height: "110vh" }}>
                <Breadcrumbs className="mt-3 mx-3" separator=">>">
                    <Link color="inherit" to="/Admin">
                        <Typography color="slateblue" >
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Home
                        </Typography>
                    </Link>
                    <Link color="inherit" to="/Admin/ProjectDashboard">
                        <Typography color="slateblue">
                            <TaskAltIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Project Dashboard
                        </Typography>
                    </Link>
                    <Typography color="slateblue" >
                        <TbReportSearch sx={{ mr: 1 }} fontSize="inherit" />
                        Project Report
                    </Typography>
                </Breadcrumbs>
                <Grid container sx={{ display: 'inline-flex' }}>
                    <Grid xs={3}>
                        <CCard
                            className={`mb-3 border-top-primary border-top-3`}
                            style={{ maxWidth: '35rem', height: '37rem', borderRadius: '5px', border: '1px solid orange', marginTop: '35px', marginLeft: '35px' }}
                        >
                            <CCardHeader style={{ fontSize: '40px', textAlign: 'center', color: 'darkblue', backgroundColor: "#f0e8e6" }}>PROJECT LIST</CCardHeader>
                            <TextField
                                label="Search Project Here"
                                variant="outlined"
                                fullWidth
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{marginTop:5}}
                            />
                            <CCardBody style={{ overflowY: 'scroll' }}>
                                <CCardText style={{ maxHeight: '25rem' }}>
                                    <List component="nav" aria-label="project folders">
                                        {filteredProjects?.map((e: any) => (
                                            <div key={e.id}>
                                                <ListItemButton
                                                    onClick={() => {
                                                        onClickProjectName(e);
                                                    }}
                                                    sx={{
                                                        backgroundColor: selectedProjectId === e.id.toString() ? 'lightblue' : 'transparent',
                                                    }}
                                                >
                                                    <ListItemText primary={e.name} />
                                                </ListItemButton>
                                                <Divider />
                                            </div>
                                        ))}
                                    </List>
                                </CCardText>
                            </CCardBody>
                        </CCard>
                    </Grid>
                    <Grid xs={8} sx={{ ml: 4 }}>
                        <Typography sx={{ textAlign: 'center', color: "blue", fontWeight: "bold", fontSize: "23px" }}>{ProjectName? ProjectName?.toUpperCase() : data?.projectList?.data[0].name.toUpperCase() } TASK REPORT</Typography>
                        <Grid container>
                            <Grid xs={10}>
                                <CCard className="mb-3" style={{ maxWidth: '840px', maxHeight: '600px', height: '230px' }}>
                                    <CRow className="g-0">
                                        <CCol md={4} >
                                            <CCardHeader style={{ fontSize: '30px', textAlign: 'center', height: '230px', border: '1px solid red' }}>
                                                <Typography
                                                    sx={{ fontSize: "30px", width: "58%", ml: 6, mt: 4, color: "blue" }}
                                                >
                                                    OVERALL TASK LIST
                                                </Typography>
                                            </CCardHeader>
                                        </CCol>
                                        <CCol md={8} style={{border: '1px solid red',borderLeft:'none'}}>
                                            <Typography sx={{ textAlign: 'center', position: 'static', color: 'blue', fontSize: '20px' }}>TASK LIST <span style={{ float: "right", color: 'red', fontWeight: 'bold' }}>[{TaskLists?.projectTaskLists?.length}]</span></Typography>
                                            <CCardBody style={{ maxHeight: 199, flexGrow: 1, maxWidth: 600, overflowY: 'auto' }}>
                                                {TaskLists?.projectTaskLists?.length > 0 ? (
                                                    <TreeView
                                                        aria-label="file system navigator"
                                                        defaultCollapseIcon={<ExpandMoreIcon />}
                                                        defaultExpandIcon={<ChevronRightIcon />}
                                                    >
                                                        {TaskLists?.projectTaskLists?.map((e: any) => {
                                                            return (
                                                                <>
                                                                    <TreeItem
                                                                        key={e.id}
                                                                        nodeId={e.id}
                                                                        label={e.names}
                                                                    >
                                                                        <TreeItem nodeId={`${e.id}-completed`} label={e.percentage === 100 ? `Completed (${e.percentage}%)` : 'In-progress'}>
                                                                            {e.percentage === 100 ? '' : `${e.percentage}%`}
                                                                        </TreeItem>
                                                                        <Divider />
                                                                    </TreeItem>
                                                                    <Divider />
                                                                </>
                                                            )
                                                        }
                                                        )}
                                                    </TreeView>
                                                ) : (   
                                                    <h4 className="text-center m-3">
                                                        <PriorityHighIcon className="fs-2" /> No Task
                                                    </h4>
                                                )}
                                                <CCardText>
                                                </CCardText>
                                            </CCardBody>
                                        </CCol>
                                    </CRow>
                                </CCard>
                            </Grid>
                            <Grid xs={2}>
                                <Stack>
                                    <Item sx={{ backgroundColor: "lightgreen" }}>
                                        <Typography sx={{ height: "50%", fontWeight: 'bold', mt: 0.5 }}>COMPLETED</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{completedOverallTasks?.length}</Typography>
                                    </Item>
                                    <Item sx={{ backgroundColor: "#f7a540" }}>
                                        <Typography sx={{ height: "40%", fontWeight: 'bold', mt: 0.5 }}>IN - PROGRESS</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{InProgressOverAllTasks?.length}</Typography>
                                    </Item>
                                    <Item sx={{ backgroundColor: "#f07d80" }}>
                                        <Typography sx={{ height: "40%", fontWeight: 'bold', mt: 0.5 }}>READY-FOR-UAT</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{ReadyforUATOverAllTasks?.length}</Typography>
                                    </Item>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid xs={10}>
                                <CCard className="mb-3" style={{ maxWidth: '840px', maxHeight: '600px', height: '230px' }}>
                                    <CRow className="g-0">
                                        <CCol md={4} >
                                            <CCardHeader style={{ fontSize: '30px', textAlign: 'center', height: '230px', border: '1px solid grey' }}>
                                                <Typography
                                                    sx={{ fontSize: "30px", width: "60%", ml: 6, mt: 4, color: "gray" }}
                                                >
                                                    MONTHLY TASK LIST
                                                </Typography>
                                            </CCardHeader>
                                        </CCol>
                                        <CCol md={8} style={{ border: '1px solid grey',borderLeft:'none'}}>
                                            <Typography sx={{ textAlign: 'center', color: "blue", fontSize: '20px' }}>TASK LIST<span style={{ float: "right", color: 'red', fontWeight: 'bold' }}>[{TaskLists?.monthlyTaskLists?.length}]</span></Typography>
                                            <CCardBody style={{ maxHeight: 199, flexGrow: 1, maxWidth: 600, overflowY: 'auto' }}>

                                                {TaskLists?.monthlyTaskLists?.length > 0 ? (
                                                    <TreeView
                                                        aria-label="file system navigator"
                                                        defaultCollapseIcon={<ExpandMoreIcon />}
                                                        defaultExpandIcon={<ChevronRightIcon />}

                                                    >
                                                        {TaskLists?.monthlyTaskLists?.map((e: any) => {
                                                            return (
                                                                <>
                                                                    <TreeItem
                                                                        key={e.id}
                                                                        nodeId={e.id}
                                                                        label={e.names}
                                                                    >
                                                                        <TreeItem nodeId={`${e.id}-completed`} label={e.percentage === 100 ? `Completed (${e.percentage}%)` : 'In-progress'}>
                                                                            {e.percentage === 100 ? '' : `${e.percentage}%`}
                                                                        </TreeItem>
                                                                        <Divider />
                                                                    </TreeItem>
                                                                    <Divider />
                                                                </>
                                                            )
                                                        }
                                                        )}
                                                    </TreeView>
                                                ) : (
                                                    <h4 className="text-center m-3">
                                                        <PriorityHighIcon className="fs-2" /> No Task
                                                    </h4>
                                                )}                                               <CCardText>
                                                </CCardText>
                                            </CCardBody>
                                        </CCol>
                                    </CRow>
                                </CCard>
                            </Grid>
                            <Grid xs={2}>
                                <Stack>
                                    <Item sx={{ backgroundColor: "lightgreen" }}>
                                        <Typography sx={{ height: "50%", fontWeight: 'bold' }}>COMPLETED</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>
                                            {completedMonthlyTasks?.length}
                                        </Typography>
                                    </Item>
                                    <Item sx={{ backgroundColor: "#f7a540" }}>
                                        <Typography sx={{ height: "40%", fontWeight: 'bold' }}>IN - PROGRESS</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{InProgressMonthlyTasks?.length}</Typography>
                                    </Item>
                                    <Item sx={{ backgroundColor: "#f07d80" }}>
                                        <Typography sx={{ height: "40%", fontWeight: 'bold', mt: 0.5 }}>READY-FOR-UAT</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{CompletedMonthlyTasks?.length}</Typography>
                                    </Item>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid xs={10}>
                                <CCard className="mb-3" style={{ maxWidth: '840px', maxHeight: '600px', height: '230px' }}>
                                    <CRow className="g-0">
                                        <CCol md={4} >
                                            <CCardHeader style={{ fontSize: '30px', textAlign: 'center', height: '230px', border: '1px solid green' }}>
                                                <Typography
                                                    sx={{ fontSize: "30px", width: "60%", ml: 6, mt: 4, color: 'green' }}
                                                >
                                                    WEEKLY TASK LIST
                                                </Typography>
                                            </CCardHeader>
                                        </CCol>
                                        <CCol md={8} style={{ border: '1px solid green',borderLeft:'none'}}>
                                            <Typography sx={{ textAlign: 'center', fontSize: '20px', color: "blue" }}>TASK LIST<span style={{ float: "right", color: 'red', fontWeight: 'bold' }}>[{TaskLists?.weekTask?.length}]</span></Typography>
                                            <CCardBody style={{ maxHeight: 199, flexGrow: 1, maxWidth: 600, overflowY: 'auto' }}>
                                                {TaskLists?.weekTask?.length > 0 ? (
                                                    <TreeView
                                                        aria-label="file system navigator"
                                                        defaultCollapseIcon={<ExpandMoreIcon />}
                                                        defaultExpandIcon={<ChevronRightIcon />}

                                                    >
                                                        {TaskLists?.weekTask?.map((e: any) => {
                                                            return (
                                                                <>
                                                                    <TreeItem
                                                                        key={e.id}
                                                                        nodeId={e.id}
                                                                        label={e.names}
                                                                    // onClick={(event) => handleNodeClick(event, e.names)}
                                                                    >
                                                                        <TreeItem nodeId={`${e.names}-completed`} label={e.percentage === 100 ? `Completed (${e.percentage}%)` : 'In-progress'}>
                                                                            {e.percentage === 100 ? '' : `${e.percentage}%`}
                                                                        </TreeItem>
                                                                        <Divider />
                                                                    </TreeItem>
                                                                    <Divider />
                                                                </>
                                                            )
                                                        }
                                                        )}
                                                    </TreeView>
                                                ) : (
                                                    <h4 className="text-center m-3">
                                                        <PriorityHighIcon className="fs-2" /> No Task

                                                    </h4>
                                                )}

                                                <CCardText>
                                                </CCardText>
                                                <CCardText>

                                                </CCardText>
                                            </CCardBody>
                                        </CCol>
                                    </CRow>
                                </CCard>
                            </Grid>
                            <Grid xs={2}>
                                <Stack>
                                    <Item sx={{ backgroundColor: "lightgreen" }}>
                                        <Typography sx={{ height: "50%", fontWeight: 'bold' }}>COMPLETED</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>
                                            {completedWeekTasks?.length}
                                        </Typography>
                                    </Item>
                                    <Item sx={{ backgroundColor: "#f7a540" }}>
                                        <Typography sx={{ height: "40%", fontWeight: 'bold' }}>IN - PROGRESS</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{InProgressWeekTasks?.length}</Typography>
                                    </Item>
                                    <Item sx={{ backgroundColor: "#f07d80" }}>
                                        <Typography sx={{ height: "40%", fontWeight: 'bold', mt: 0.5 }}>READY-FOR-UAT</Typography>
                                    </Item>
                                    <Item>
                                        <Typography sx={{ color: "blue", fontSize: "25px" }}>{ReadyforUATWeekTasks?.length}</Typography>
                                    </Item>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}