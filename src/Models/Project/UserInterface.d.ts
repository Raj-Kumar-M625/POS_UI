import { IBase } from "../Common/BaseModel";

export interface UserInterface extends IBase {
    uiId?: number | null;
    id:number | null;
    userStoryId?: number | null;
    userInterfaceName?: string | null;
    projectId?: number | null;
    projectObjectiveId?: number | null;
    name?: string | null;
    description?: string | null;
    status?: string | null;
    percentage: number | null;
    complexity?:string | null;
    uiCategory?:string | null;
    startDate?: string | null;
    endDate?: string | null;
}
