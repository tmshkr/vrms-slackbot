import prisma from "lib/prisma";
import { RRule } from "rrule";
import dayjs from "lib/dayjs";
import { scheduleMeetingCheckin } from "lib/schedule";
import { getHomeTab } from "app/views/home";

function getValuesFromObject(obj) {
  const values = {} as any;
  for (const key in obj) {
    const [innerKey] = Object.keys(obj[key]);
    values[innerKey] = obj[key][innerKey];
  }
  return values;
}

export const createMeeting = async ({ ack, body, view, client, logger }) => {
  await ack();
  const values = getValuesFromObject(view.state.values);
  console.log(values);
  const {
    meeting_title,
    meeting_project,
    meeting_channel,
    meeting_datepicker,
    meeting_timepicker,
    meeting_duration,
    meeting_frequency,
  } = values;

  const start_date = dayjs(
    `${meeting_datepicker.selected_date} ${meeting_timepicker.selected_time}`
  );

  let rule;
  switch (meeting_frequency.selected_option.value) {
    case "1 week":
      rule = new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        dtstart: new Date(start_date.format()),
        tzid: "America/Los_Angeles",
      });
      break;
    case "2 weeks":
      rule = new RRule({
        freq: RRule.WEEKLY,
        interval: 2,
        dtstart: new Date(start_date.format()),
        tzid: "America/Los_Angeles",
      });
      break;

    default:
      break;
  }


  const newMeeting = await prisma.meeting.create({
    data: {
      created_by: body.user.id,
      duration: Number(meeting_duration.selected_option.value.split(" ")[0]),
      next_run: start_date.utc().format(),
      project_id: Number(meeting_project.selected_option.value),
      slack_channel_id: meeting_channel.selected_channel,
      start_date: start_date.utc().format(),
      title: meeting_title.value,
      rrule: rule?.toString(),
      participants: {
        create: {
          slack_id: body.user.id,
        },
      },
    },
  });

  scheduleMeetingCheckin(
    start_date,
    newMeeting.id,
    meeting_channel.selected_channel
  );

  const home = await getHomeTab(body.user.id);
  await client.views.publish(home);
};
