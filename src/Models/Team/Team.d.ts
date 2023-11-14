import { IBase } from "../Common/BaseModel";

export interface Team extends IBase {
  name: string;
  startDate: Date;
  endDate: Date;
}
