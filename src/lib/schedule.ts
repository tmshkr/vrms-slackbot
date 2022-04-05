import { getNextOccurrence } from "./rrule";
import { getAgenda } from "./agenda";

export const scheduleMeetingCheckin = async (
  start_date: string,
  meeting_id,
  slack_channel_id,
  rrule?: string
) => {
  const next_run = rrule ? getNextOccurrence(rrule) : start_date;
  const agenda = await getAgenda();
  agenda.schedule(next_run, "sendMeetingCheckin", {
    start_date,
    meeting_id,
    slack_channel_id,
    rrule,
  });
};
