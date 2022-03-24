import prisma from "lib/prisma";
import moment from "lib/moment";
import { sendMeetingCheckin } from "app/notifications";
const schedule = require("node-schedule");

export const scheduleMeetingCheckin = (start_date, meeting_id) => {
  schedule.scheduleJob(
    start_date,
    async function (meeting_id) {
      const meeting = await prisma.meeting.findUnique({
        where: {
          id: meeting_id,
        },
      });

      await sendMeetingCheckin(meeting.slack_channel_id);

      const last_run = meeting.next_run;
      const next_run = moment(last_run).add(1, "minute").format();

      await prisma.meeting.update({
        where: {
          id: meeting_id,
        },
        data: {
          last_run,
          next_run,
        },
      });
      scheduleMeetingCheckin(next_run, meeting_id);
    }.bind(null, meeting_id)
  );
};
