import PsychologyIcon from "@mui/icons-material/Psychology";
import MessageIcon from "@mui/icons-material/Message";
import NotesIcon from "@mui/icons-material/Notes";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AttributionIcon from '@mui/icons-material/Attribution';
import { ScrumIconBlack, ScrumIconWhite } from "../CommonComponents/BackDrop";

export const AdminPages = [
    { name: "Task", icon: TaskAltIcon },
    { name: "Task Progress", icon: HourglassTopIcon },
    { name: "Employee", icon: BadgeIcon },
    { name: "Project", icon: ViewKanbanIcon },
    { name: "Team", icon: GroupsIcon },
    { name: "Attendance", icon: PersonIcon },
    { name: "PMO Scrum", icon: ScrumIconWhite },
  //{ name: "Check List",icon: PersonIcon}
];

export const Admindrawer = [
  { name: "Task", icon: TaskAltIcon },
  { name: "Task Progress", icon: HourglassTopIcon },
  { name: "Employee", icon: BadgeIcon },
  { name: "Skill", icon: PsychologyIcon },
  { name: "Project", icon: ViewKanbanIcon },
  { name: "Team", icon: GroupsIcon },
  { name: "Comment", icon: MessageIcon },
  { name: "Attendance", icon: PersonIcon },
  { name: "PMO Scrum", icon: ScrumIconBlack },
  { name: "Release Notes", icon: NotesIcon },
  { name: "Leave", icon: CalendarMonthIcon },
  { name: "Common Master", icon:AttributionIcon},
];