import prisma from "lib/prisma";
import moment from "lib/moment";
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

  const start_date = moment(
    `${meeting_datepicker.selected_date} ${meeting_timepicker.selected_time}`
  ).format();

  const newMeeting = await prisma.meeting.create({
    data: {
      created_by: body.user.id,
      next_run: start_date,
      project_id: Number(meeting_project.selected_option.value),
      slack_channel_id: meeting_channel.selected_channel,
      start_date,
      title: meeting_title.value,
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
