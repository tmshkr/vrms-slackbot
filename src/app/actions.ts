import { app } from "app";
import { meetings } from "data/meetings";
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
    meetings.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":small_blue_diamond: *VRMS Team Meeting* – Monday, March 21",
      },
    });
    const home = await getHomeTab(body.user.id);
    await client.views.publish(home);
    console.log(body);
  });

  console.log("⚡️ Actions registered!");
};
