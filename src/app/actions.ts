import { app } from "app";
import { projects } from "data/projects";
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

    projects.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":small_blue_diamond: VRMS",
      },
    });
    await client.views.publish(getHomeTab(body.user.id));
    console.log(body);
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
    await client.views.publish(getHomeTab(body.user.id));
    console.log(body);
  });

  console.log("⚡️ Actions registered!");
};
