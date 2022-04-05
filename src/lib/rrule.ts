import { rrulestr } from "rrule";
import dayjs from "./dayjs";

/*
Returns the given date as if it were UTC, replacing any timezone offset.
Workaround for https://github.com/jakubroztocil/rrule/issues/501
*/
export function getFakeUTC(date: dayjs.Dayjs) {
  return date.format().slice(0, -6) + "Z";
}

export function getNextOccurrence(rrule: string) {
  const rule = rrulestr(rrule);
  const maxDate = new Date(8640000000000000);

  const [nextOccurrence] = rule.between(
    new Date(getFakeUTC(dayjs())),
    maxDate,
    true,
    (date, i) => i === 0
  );

  // adds the correct timezone offset to the fake UTC date
  return dayjs
    .tz(nextOccurrence.toISOString().slice(0, -1), rule.options.tzid)
    .utc()
    .format();
}
