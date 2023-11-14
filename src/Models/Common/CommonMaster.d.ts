export interface CommonMaster {
  id: number;
  codeType: string;
  codeName: string;
  codeValue: string;
  displaySequence: number;
  isActive: boolean;
}

export interface Category {
  id: number;
  categories: string;
  subCategory: string;
  uiApplicable: string;
  userStoryApplicable: string;
}
