import { app } from "app";
import prisma from "lib/prisma";

import { getHomeTab } from "./views/home";

export const registerActions = () => {
  app.action("meeting_check_in", async ({ body, ack, say }) => {
    await ack();
    console.log(body);
    await say(`<@${body.user.id}> checked in`);
  });

  app.action("create_new_project", async ({ body, client, ack, logger }) => {
    await ack();
    console.log(body);

    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "create_project_modal",
        title: {
          type: "plain_text",
          text: "Create New Project",
        },
        blocks: [
          {
            type: "input",
            block_id: "new_project_title_block",
            label: {
              type: "plain_text",
              text: "What should the project's name be?",
            },
            element: {
              type: "plain_text_input",
              action_id: "new_project_title",
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  });

  app.action("create_new_meeting", async ({ body, client, ack, logger }) => {
    await ack();
    const user_projects = await prisma.teamMember.findMany({
      where: { slack_id: body.user.id },
      include: { project: true },
    });
    console.log(user_projects);

    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "create_meeting_modal",
        title: {
          type: "plain_text",
          text: "Create New Meeting",
        },
        blocks: [
          {
            type: "input",
            block_id: "meeting_title_block",
            label: {
              type: "plain_text",
              text: "What should this meeting be called?",
            },
            element: {
              type: "plain_text_input",
              action_id: "meeting_title",
            },
          },
          {
            type: "input",
            block_id: "meeting_project_select_block",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select a project",
                emoji: true,
              },
              options: user_projects.map(({ project }) => ({
                text: {
                  type: "plain_text",
                  text: project.name,
                  emoji: true,
                },
                value: String(project.id),
              })),
              action_id: "meeting_project_select",
            },
            label: {
              type: "plain_text",
              text: "Which project is this meeting for?",
              emoji: true,
            },
          },
          {
            type: "input",
            block_id: "meeting_channel_select_block",
            element: {
              type: "channels_select",
              placeholder: {
                type: "plain_text",
                text: "Select channel",
                emoji: true,
              },
              action_id: "meeting_channel_select",
            },
            label: {
              type: "plain_text",
              text: "Which channel should this meeting be in?",
              emoji: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    // const home = await getHomeTab(body.user.id);
    // await client.views.publish(home);
    // console.log(body);
  });
  app.action(
    "meeting_channel_select",
    async ({ body, client, ack, logger }) => {
      await ack();
      // console.log(body);
    }
  );

  console.log("⚡️ Actions registered!");
};
