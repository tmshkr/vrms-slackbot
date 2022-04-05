import { sendMeetingCheckin } from "app/notifications";
import { getNextOccurrence } from "lib/rrule";

export function registerJobs(agenda) {
  agenda.define("sendMeetingCheckin", async (job) => {
    const { rrule, slack_channel_id } = job.attrs.data;
    await sendMeetingCheckin(slack_channel_id);
    if (rrule) {
      const next_run = getNextOccurrence(rrule);
      job.schedule(next_run);
      await job.save();
    }
  });
  console.log("Agenda jobs registered");
}
