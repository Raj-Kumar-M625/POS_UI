import { IBase } from "../Common/BaseModel";

export interface UserStory extends IBase {
  projectId?: number | null;
  projectObjectiveId?: number | null;
  name?: string | null;
  description?: string | null;
  status?: string | null;
  percentage?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  id?: number|null;
}


export interface Document extends IBase {
  TableName: string;
  AttributeId: number;
  ProjectId: number;
  DocType: string;
  FileName: string;
  FileType: string;
  File: File;
  IsActive: boolean;
}
