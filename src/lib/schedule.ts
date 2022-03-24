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
    const last_run = next_run;
    await prisma.meeting.update({
      where: {
        id: meeting_id,
      },
      data: {
        last_run,
        next_run: moment(last_run).add(1, "minute").format(),
      },
    });
    scheduleMeetingCheckin(
      moment(last_run).add(1, "minute").format(),
      meeting_id,
      slack_channel_id
    );
  });
};
