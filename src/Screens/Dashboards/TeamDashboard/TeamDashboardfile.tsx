import { useState , useMemo , useEffect} from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Get } from "../../../Services/Axios";
import { useLocation } from "react-router-dom";


export type Person = {
  projectId: string;
  team: string;
  age: number;
  projectName: string;
  objectiveStatus:string;
  type:string;
  percentage:string;
  monthlyObjcectiveName: string;
  weeklyObjectives:string;
  salary: number;
};


const TeamDashBoardTable = () => {

  const location: any = useLocation();
  const [data, setData] = useState<Person[]>([]);

  useEffect(() => { 
    const Teamdashboard = Get(`app/Common/GetTeamDashboardData?teamId=${location.state?.data?.teamId}`);
    Teamdashboard.then((response: any) => {
      setData(response.data.teamDashboardListDtos);
    });
  }, []);


  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        header: 'Team',
        accessorKey: 'team',
        enableGrouping: false, //do not let this column be grouped
        size: 100,
        headerCellProps: {
          style: { backgroundColor: 'blue', color: 'white' },
        },
      },
      {
        header: 'Project Id',
        accessorKey: 'projectId',
        size: 100,
      },
      {
        header: 'Project Name',
        accessorKey: 'projectName',
        aggregationFn: 'max',
        size: 100,
      },
      {
        header: 'Type',
        accessorKey: 'type',
        size: 100,
      },
      {
        header: 'Completed Objective',
        accessorKey: 'objectiveStatus',
        size: 100,
      },
      {
        header: 'Percentage',
        accessorKey: 'percentage',
        size: 100,
      },
      {
        header: 'Monthly Objective Name',
        accessorKey: 'monthlyObjcectiveName',
        size: 100,
      },
      {
        header:'Weely Objective Name',
        accessorKey: 'weeklyObjectives',
        size: 100,

      }
    ],
    [],
  );

  return (
    <>
      <div className="container d-flex justify-content-evenly">
    <div className="shadow w-100 bg-light m-2">
     <MaterialReactTable
     columns={columns}
     data={data}
     enableColumnResizing
     enableGrouping
     enableStickyHeader
     enableStickyFooter
     enableColumnActions ={false}
     initialState={{
       density: 'compact',
       expanded: true, //expand all groups by default
       grouping: ['projectName','monthlyObjcectiveName'], //an array of columns to group by by default (can be multiple)
       pagination: { pageIndex: 0, pageSize: 20 },
       sorting: [{ id: 'projectName', desc: true }], //sort by state by default
     }}
     muiToolbarAlertBannerChipProps={{ color: 'primary' }}
     muiTableContainerProps={{ sx: { maxHeight: 400 } }}
   />
   </div>
   </div>
   </>
  );
};

export default TeamDashBoardTable;
