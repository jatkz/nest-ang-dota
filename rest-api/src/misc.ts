export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const payloadify = async <T>(promise: Promise<T>) => {
  return promise.then(data => {
    return { payload: data };
  });
};

export const unixTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const daysToMs = (days: number) => {
  return 1000 * 60 * 60 * 24 * days;
};

export const difference = <T>(setA: Set<T>, setB: Set<T>) => {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
};

export const range = (n: any) => [...Array(n).keys()];

/* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
export const getWeekNumber = (d: Date) => {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday, Unary + will coerce to number.
  const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return `Week ${weekNo} ${d.getUTCFullYear()}`;
};
