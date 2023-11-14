export interface TaskFilter {
  name?: string | null;
  projectName?: string | null;
  status?: string | null;
  percentage?: number | null;
  category?: string | null;
  subCategory?: string | null;
  actualTime?: number | null;
  estimatedTime?: number | null;
  estStartDate?: Date | null;
  estEndDate?: Date | null;
  actStartDate?: Date | null;
  actEndDate?: Date | null;
  taskName?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  priority?: string | null;
  weekEndingDate?: Date | null;
  projectType?: string | null;
  teamName?: string | null;
  employeeName?: string | null;
}

