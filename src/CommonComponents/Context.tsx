import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionUser } from "../Models/Employee/Employee";
import { EMPLOYEE } from "../Constants/Roles";
import { Get } from "../Services/Axios";
import { Category, CommonMaster } from "../Models/Common/CommonMaster";

type ContextProviderProps = {
  children: ReactNode;
};

type ContextType = {
  role: string | undefined;
  user: SessionUser | undefined;
  commonMaster: Array<CommonMaster>;
  category: Array<Category>;
  setContext: React.Dispatch<React.SetStateAction<SessionUser | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext<ContextType | null>(null);

export function useContextProvider() {
  const value = useContext(Context);
  if (value == null) throw Error("Cannot use outside of Context Provider");
  return value;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [user, setUser] = useState<SessionUser | undefined>();
  const [commonMaster, setCommonMaster] = useState<CommonMaster[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setReload] = useState<boolean>(true);

  async function GetCommonData() {
    const categories: any = await Get("app/Project/GetCategoriesList");
    const response: any = await Get("app/CommonMaster/GetCodeTableList");
    setCommonMaster(response.data ?? []);
    setCategory(categories.data ?? []);
  }

  useEffect(() => {
    const json: any = sessionStorage.getItem("user") || null;
    const sessionUser: SessionUser = JSON.parse(json);
    GetCommonData();
    setUser(sessionUser);
  }, [loading]);

  return (
    <Context.Provider
      value={{
        role: user?.userRoles === EMPLOYEE ? undefined : user?.userRoles,
        user: user,
        commonMaster: commonMaster,
        category: category,
        setContext: setUser,
        setLoading: setReload,
      }}
    >
      {children}
    </Context.Provider>
  );
}
