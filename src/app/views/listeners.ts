import { app } from "app";
import prisma from "lib/prisma";
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

      await prisma.meeting.create({
        data: {
          title: meeting_title.value,
          created_by: body.user.id,
          project_id: Number(meeting_project_select.selected_option.value),
          slack_channel_id: meeting_channel_select.selected_channel,
          week_frequency: 1,
          start_date: new Date(),
          participants: {
            create: {
              slack_id: body.user.id,
            },
          },
        },
      });

      const home = await getHomeTab(body.user.id);
      await client.views.publish(home);
    }
  );

  console.log("⚡️ View listeners registered!");
};
