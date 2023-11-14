import GroupsIcon from "@mui/icons-material/Groups";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TodayIcon from "@mui/icons-material/Today";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';

export const EmployeePages = [
  { name: "Task", icon: TaskAltIcon, disabled: false },
  { name: "Task Progress", icon: HourglassTopIcon, disabled: true },
  { name: "Project", icon: ViewKanbanIcon, disabled: true },
  { name: "Whatsapp Task List", icon: WhatsAppIcon, disabled: true },
  { name: "Daily Task", icon: TodayIcon, disabled: true },
  { name: "Employee Time", icon: AccessTimeIcon },
];

export const EmployeeDrawer = [
  { name: "Task", icon: TaskAltIcon, disabled: false },
  { name: "Task Progress", icon: HourglassTopIcon, disabled: true },
  { name: "Project", icon: ViewKanbanIcon, disabled: true },
  { name: "Team", icon: GroupsIcon, disabled: true },
  { name: "Whatsapp Task List", icon: WhatsAppIcon, disabled: true },
  { name: "Daily Task", icon: TodayIcon, disabled: true },
  { name: "Employee Time", icon: AccessTimeIcon },
  { name: "Leave", icon: CalendarMonthIcon },
];
