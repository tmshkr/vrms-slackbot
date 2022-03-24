import { app } from "app";
import prisma from "lib/prisma";
import moment from "lib/moment";
import { scheduleMeetingCheckin } from "lib/schedule";
import { getHomeTab } from "app/views/home";

export const registerViewListeners = () => {
  app.view(
    "create_project_modal",
    async ({ ack, body, view, client, logger }) => {
      await ack();
      const { new_project_title } = view.state.values.new_project_title_block;
      console.log(new_project_title);

      await prisma.project.create({
        data: {
          name: new_project_title.value,
          created_by: body.user.id,
          team_members: {
            create: {
              slack_id: body.user.id,
              role: "OWNER",
            },
          },
        },
      });

      const home = await getHomeTab(body.user.id);
      await client.views.publish(home);
    }
  );

  app.view(
    "create_meeting_modal",
    async ({ ack, body, view, client, logger }) => {
      await ack();
      console.log(view.state.values);
      const { values } = view.state;
      const { meeting_title } = values.meeting_title_block;
      const { meeting_channel_select } = values.meeting_channel_select_block;
      const { meeting_project_select } = values.meeting_project_select_block;
      const { selected_date } =
        values.meeting_datepicker_select_block.meeting_datepicker_select;
      const { selected_time } =
        values.meeting_timepicker_select_block.meeting_timepicker_select;
      const { repeat_frequency_select } = values.repeat_frequency_select_block;

      const start_date = moment(`${selected_date} ${selected_time}`).format();
      console.log({ selected_date, selected_time, start_date });

      const newMeeting = await prisma.meeting.create({
        data: {
          created_by: body.user.id,
          next_run: start_date,
          project_id: Number(meeting_project_select.selected_option.value),
          slack_channel_id: meeting_channel_select.selected_channel,
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
        meeting_channel_select.selected_channel
      );

      const home = await getHomeTab(body.user.id);
      await client.views.publish(home);
    }
  );

  console.log("⚡️ View listeners registered!");
};
