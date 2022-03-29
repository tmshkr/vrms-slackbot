import { app } from "app";
import prisma from "lib/prisma";
import { getMongoClient } from "lib/mongo";

import { createMeetingModal } from "app/views/modals/createMeetingModal";

export const registerActions = () => {
  app.action("meeting_check_in", async ({ body, ack, say }) => {
    await ack();
    console.log(body);
    await say(`<@${body.user.id}> checked in`);
  });

  app.action("create_new_project", async ({ body, client, ack, logger }) => {
    await ack();
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
    const userProjects = await prisma.teamMember.findMany({
      where: { slack_id: body.user.id },
      include: { project: true },
    });

    if (!userProjects.length) {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          close: {
            type: "plain_text",
            text: "Close",
            emoji: true,
          },
          title: {
            type: "plain_text",
            text: "No Projects Found",
            emoji: true,
          },
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "You must be working on a project to create a meeting.",
              },
            },
          ],
        },
      });
    } else {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: createMeetingModal(userProjects),
      });
    }
  });

  app.action(
    "meeting_channel_select",
    async ({ body, client, ack, logger }) => {
      await ack();
    }
  );

  app.action("role_select", async ({ body, client, ack, logger }) => {
    await ack();
    const selectedRole = body.actions[0].selected_option.value;
    const mongoClient = await getMongoClient();
    mongoClient
      .db()
      .collection("onboarding")
      .updateOne(
        { _id: body.user.id },
        { $set: { selectedRole } },
        { upsert: true }
      );

    switch (selectedRole) {
      case "role_data":
        console.log("user selected role_data");
        break;
      case "role_engineering":
        console.log("user selected role_engineering");
        break;
      case "role_product":
        console.log("user selected role_product");
        break;
      case "role_ux":
        console.log("user selected role_ux");
        break;
      default:
        break;
    }
  });

  console.log("⚡️ Actions registered!");
};
