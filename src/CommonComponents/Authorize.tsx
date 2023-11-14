import { Navigate } from "react-router-dom";
import { SessionUser } from "../Models/Employee/Employee";

type AuthorizeProps = {
  children: JSX.Element;
  role: string | undefined;
};

export function Authorize({ children, role }: AuthorizeProps) {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser: SessionUser = JSON.parse(json);

  if (sessionUser == null || role != sessionUser.userRoles)
    return <Navigate to="/" />;

  return children;
}
