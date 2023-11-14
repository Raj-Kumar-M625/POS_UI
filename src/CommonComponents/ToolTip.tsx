import { Tooltip } from "@mui/material";

export const ToolTip = ({ children, title }: any) => {
  return <Tooltip title={title}>{children}</Tooltip>;
};
