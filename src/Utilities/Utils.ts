import {
  ABSENT,
  DANGER,
  LATE,
  ONTIME,
  SECONDARY,
  SUCCESS,
} from "../Constants/TimeSpanText";

export function ConvertDate(date: string | null): string {
  if (date == null || date === "01-01-1") return "-";
  const convertedDate = new Date(date)
    .toLocaleDateString("en-bz")
    .replaceAll("/", "-");
  return convertedDate;
}

export function ConvertTime(date: string | null, meridian: string): string {
  if (date == null) return "-";
  const convertTime = new Date(date)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replaceAll("AM", meridian);
  return convertTime;
}

export function TimeSpanText(inTime: string) {
  if (inTime == null) return ABSENT;
  const officeTime: Date = new Date(`${inTime.slice(0, 10)}T10:00:01`);
  const InTime = new Date(inTime);
  if (InTime.getTime() > officeTime.getTime()) return LATE;
  if (InTime.getTime() <= officeTime.getTime()) return ONTIME;
}

export function TimeSpanBg(inTime: string) {
  if (inTime == null) return SECONDARY;
  const officeTime: Date = new Date(`${inTime.slice(0, 10)}T10:00:01`);
  const InTime = new Date(inTime);
  if (InTime.getTime() > officeTime.getTime()) return DANGER;
  if (InTime.getTime() <= officeTime.getTime()) return SUCCESS;
}

export function WeekEndingDate(): Date {
  let currentDate: Date = new Date();
  if (currentDate.getDay() == 5) return currentDate;
  let weekEndingDate: Date;
  let daysUntilFriday: number = (5 - currentDate.getDay() + 7) % 7;
  if (daysUntilFriday <= 0) {
    daysUntilFriday += 7;
  }
  weekEndingDate = new Date(
    currentDate.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000
  );
  weekEndingDate.setHours(23, 59, 59, 999);
  return weekEndingDate;
}

export function GetFridaysOfMonth(): Date[] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const fridays: Date[] = [];
  const dateIterator = new Date(currentDate.getFullYear(), currentMonth, 1);

  while (dateIterator.getMonth() === currentMonth) {
    if (dateIterator.getDay() === 5) {
      fridays.push(new Date(dateIterator));
    }
    dateIterator.setDate(dateIterator.getDate() + 1);
  }
  return fridays;
}

export function getSaturdaysAndSundays(year: number, month: number): number {
  const result: Date[] = [];
  const currentDate = new Date(year, month - 1, 1);
  while (currentDate.getMonth() === month - 1) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      result.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result.length;
}

export function ConvertToISO(params: Date): string {
  const date = new Date(params);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function ReduceFiveDays(params: any): string {
  debugger;
  let newdate = new Date(params);
  newdate.setDate(newdate.getUTCDate() - 4);
  return ConvertToISO(newdate);
}

export function SetMinDate(): string {
  const today = new Date();
  return ConvertToISO(today);
}

export function WeekEndingDateUTC(): Date {
  let currentDate: Date = new Date();
  if (currentDate.getUTCDay() == 5) return currentDate;
  let weekEndingDate: Date;
  let daysUntilFriday: number = (5 - currentDate.getUTCDay() + 7) % 7;
  if (daysUntilFriday <= 0) {
    daysUntilFriday += 7;
  }
  weekEndingDate = new Date(
    currentDate.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000
  );
  weekEndingDate.setHours(23, 59, 59, 999);
  return weekEndingDate;
}

export function TimeSpan(employeeTime: any) {
  var onTime: number = 0;
  var late: number = 0;
  employeeTime.forEach((e: any) => {
    if (e.inTime !== null) {
      const officeTime: Date = new Date(`${e.inTime.slice(0, 10)}T10:00:01`);
      const InTime = new Date(e.inTime);
      if (InTime.getTime() > officeTime.getTime()) late++;
      if (InTime.getTime() <= officeTime.getTime()) onTime++;
    }
  });
  return { onTime, late };
}

export function getDatesBetween(fromDate: string, toDate: string) {
  const dates = [];
  const currentDate = new Date(fromDate);
  var ToDate = new Date(toDate);

  while (currentDate <= ToDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
