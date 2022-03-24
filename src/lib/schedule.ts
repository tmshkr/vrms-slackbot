import prisma from "lib/prisma";
import moment from "lib/moment";
import { sendMeetingCheckin } from "app/notifications";
const schedule = require("node-schedule");

export const scheduleMeetingCheckin = (
  next_run,
  meeting_id,
  slack_channel_id
) => {
  schedule.scheduleJob(next_run, async function () {
    await sendMeetingCheckin(slack_channel_id);

    // TODO: determine next_run based on rrule
    // https://www.npmjs.com/package/rrule
    const last_run = next_run;
    next_run = moment(last_run).add(1, "minute").format();

    await prisma.meeting.update({
      where: {
        id: meeting_id,
      },
      data: {
        last_run,
        next_run,
      },
    });
    // schedule next run
    // scheduleMeetingCheckin(next_run, meeting_id, slack_channel_id);
  });
};
