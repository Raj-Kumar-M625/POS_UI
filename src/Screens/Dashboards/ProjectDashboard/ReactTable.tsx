import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ConvertDate } from "../../../Utilities/Utils";

const ReactTable = ({ data }: any) => {
  const columns: any = useMemo(
    () => [
      {
        id: "employee",
        header: "",
        columns: [
          {
            accessorFn: (row: any) => `${row.name}`,
            id: "name",
            header: "Project Name",
            size: 250,
            Cell: ({ renderedCellValue }: any) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "description",
            enableClickToCopy: true,
            header: "Description",
            size: 300,
            Cell: ({ renderedCellValue }: any) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
        ],
      },
      {
        id: "type",
        header: "",
        columns: [
          {
            accessorKey: "type",
            header: "Type",
            size: 200,
            Cell: ({ cell }: any) => (
              <Box component="span">{cell.getValue()}</Box>
            ),
          },
          {
            accessorFn: (row: any) => new Date(row.startDate),
            id: "startDate",
            header: "Start Date",
            filterFn: "lessThanOrEqualTo",
            sortingFn: "datetime",
            Cell: ({ cell }: any) => ConvertDate(cell.getValue()),
            Header: ({ column }: any) => <em>{column.columnDef.header}</em>,
            Filter: ({ column }: any) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(newValue: any) => {
                    column.setFilterValue(newValue);
                  }}
                  slotProps={{
                    textField: {
                      helperText: "Filter Mode: Less Than",
                      sx: { minWidth: "120px" },
                      variant: "standard",
                    },
                  }}
                  value={column.getFilterValue()}
                />
              </LocalizationProvider>
            ),
          },
          {
            accessorFn: (row: any) => new Date(row.startDate),
            id: "endDate",
            header: "End Date",
            filterFn: "lessThanOrEqualTo",
            sortingFn: "datetime",
            Cell: ({ cell }: any) => ConvertDate(cell.getValue()),
            Header: ({ column }: any) => <em>{column.columnDef.header}</em>,
            Filter: ({ column }: any) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(newValue: any) => {
                    column.setFilterValue(newValue);
                  }}
                  slotProps={{
                    textField: {
                      helperText: "Filter Mode: Less Than",
                      sx: { minWidth: "120px" },
                      variant: "standard",
                    },
                  }}
                  value={column.getFilterValue()}
                />
              </LocalizationProvider>
            ),
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data.projects || []}
        enableColumnFilterModes
        enableColumnOrdering
        enableGrouping
        enablePinning
        initialState={{ showColumnFilters: true }}
        positionToolbarAlertBanner="top"
        renderDetailPanel={({ row }: any) => {
          var userStoryidx = 0;
          var userInterfaceidx = 0;

          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Box sx={{ width: 400, height: 200 }} className="border border-1">
                <Typography
                  variant="h5"
                  sx={{ background: "yellow" }}
                  className="text-center fw-bolder"
                >
                  Tech Stack
                </Typography>
                {row.original.projectTechStacks.map((e: any, index: number) => (
                  <Typography
                    variant="h5"
                    className="text-right m-2"
                    key={e.commonMaster.id}
                  >
                    {index + 1}.{e.commonMaster.codeValue}
                  </Typography>
                ))}
              </Box>
              <Box
                sx={{ width: 400, height: 200 }}
                className="border border-1 overflow-scroll position-relative"
              >
                <Typography
                  variant="h5"
                  sx={{ background: "yellow", position: "sticky" }}
                  className="text-center fw-bolder position-sticky"
                >
                  User Story
                </Typography>
                {data.userStories.map((userstory: any) => {
                  if (userstory.projectId === row.original.id) {
                    userStoryidx++;
                    return (
                      <>
                        <Typography
                          variant="h6"
                          className="text-right m-2"
                          key={userstory.id}
                        >
                          {userStoryidx}. {userstory.name}
                        </Typography>
                      </>
                    );
                  }
                })}
              </Box>
              <Box
                sx={{ width: 400, height: 200 }}
                className="border border-1 overflow-scroll"
              >
                <Typography
                  variant="h6"
                  sx={{ background: "yellow" }}
                  className="text-center fw-bolder "
                >
                  User Interface
                </Typography>
                {data.userInterface.map((Interface: any) => {
                  if (Interface.projectId === row.original.id) {
                    userInterfaceidx++;
                    return (
                      <>
                        <Typography
                          variant="h6"
                          className="text-right m-2"
                          key={Interface.id}
                        >
                          {userInterfaceidx}. {Interface.name}
                        </Typography>
                      </>
                    );
                  }
                  userStoryidx++;
                })}
              </Box>
            </Box>
          );
        }}
      />
    </>
  );
};

export default ReactTable;
