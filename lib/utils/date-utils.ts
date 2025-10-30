import moment from "moment";

// Define common formats you expect
const DATE_FORMATS = [
  "DD-MM-YYYY",
  "MM-DD-YYYY",
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY/MM/DD",
  "DD.MM.YYYY",
  "YYYY.MM.DD",
  "DD MMM YYYY",
  "MMM DD, YYYY",
  "YYYYMMDD"
];

// Excel serial to JS Date
function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1899, 11, 30); // Excel epoch = Dec 30, 1899
  const days = Math.floor(serial);
  const msPerDay = 24 * 60 * 60 * 1000;
  const date = new Date(excelEpoch.getTime() + days * msPerDay);

  // Fractional part = time of day
  const fractionalDay = serial - days;
  const msInDay = Math.round(fractionalDay * msPerDay);
  return new Date(date.getTime() + msInDay);
}

function parseDate(v: string | Date | number) {
  // Case 1: Already Date
  if (v instanceof Date) return moment(v);

  // Case 2: Excel serial number
  if (typeof v === "number") {
    return moment(excelDateToJSDate(v));
  }

  // Case 3: Try Moment known formats
  let m = moment(v, DATE_FORMATS, true);
  if (m.isValid()) return m;

  return moment();
}

// Your formatters
export function formatDate(v: string | Date) {
  return v ? parseDate(v).format("YYYY-MM-DD") : "";
}
export function formatMonth(v: string | Date) {
  return v ? parseDate(v).format("YYYY-MM") : "";
}
export function formatYear(v: string | Date) {
  return v ? parseDate(v).format("YYYY") : "";
}
export function formatQuarter(v: string | Date) {
  const m = parseDate(v);
  return `Q${m?.quarter()}-${m?.year()}`;
}
export function formatDayOfWeek(v: string | Date) {
  return v ? parseDate(v).format("dddd") : "";
}
export function formatMonthName(v: string | Date) {
  return v ? parseDate(v).format("MMMM") : "";
}
export function formatWeek(v: string | Date) {
  return v ? parseDate(v).format("GGGG-[W]WW") : "";
}


/**
 * Format date to YYYY-MM format (e.g., "2025-08")
 * @param date Date string or Date object
 * @returns Formatted date string in YYYY-MM format
 */
export const formatToMonth = (date: string | Date): string => {
  return moment(date).format('YYYY-MM');
};

/**
 * Format date to YYYY-MM-DD format (e.g., "2025-08-30")
 * @param date Date string or Date object
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatToDate = (date: string | Date): string => {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Format date to a human-readable format (e.g., "Aug 30, 2025")
 * @param date Date string or Date object
 * @returns Formatted human-readable date string
 */
export const formatToReadable = (date: string | Date): string => {
  return moment(date).format('MMM D, YYYY');
};

/**
 * Get the start of a period (day, week, month, year)
 * @param period One of: 'day', 'week', 'month', 'year'
 * @param date Optional date to get start of period for (defaults to now)
 * @returns Start of the specified period
 */
export const startOfPeriod = (
  period: 'day' | 'week' | 'month' | 'year',
  date: string | Date = new Date()
): Date => {
  return moment(date).startOf(period).toDate();
};

/**
 * Get the end of a period (day, week, month, year)
 * @param period One of: 'day', 'week', 'month', 'year'
 * @param date Optional date to get end of period for (defaults to now)
 * @returns End of the specified period
 */
export const endOfPeriod = (
  period: 'day' | 'week' | 'month' | 'year',
  date: string | Date = new Date()
): Date => {
  return moment(date).endOf(period).toDate();
};

/**
 * Add a specified amount of time to a date
 * @param amount Number of periods to add (can be negative)
 * @param unit Unit of time ('days', 'weeks', 'months', 'years')
 * @param date Optional start date (defaults to now)
 * @returns New date with the specified time added
 */
export const addTime = (
  amount: number,
  unit: 'days' | 'weeks' | 'months' | 'years',
  date: string | Date = new Date()
): Date => {
  return moment(date).add(amount, unit).toDate();
};

/**
 * Get the difference between two dates in the specified unit
 * @param date1 First date
 * @param date2 Second date (defaults to now)
 * @param unit Unit of time ('days', 'weeks', 'months', 'years')
 * @returns Difference between dates in the specified unit
 */
export const dateDiff = (
  date1: string | Date,
  date2: string | Date = new Date(),
  unit: 'days' | 'weeks' | 'months' | 'years' = 'days'
): number => {
  return moment(date2).diff(moment(date1), unit);
};
