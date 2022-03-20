import { app } from "app";

export const registerEvents = () => {
  app.event("app_home_opened", async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: event.user,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          type: "home",
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: ":house: Welcome to VRMS",
                emoji: true,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Here you'll find an overview of your projects and upcoming meetings.`,
              },
            },
            {
              type: "divider",
            },
            {
              type: "header",
              text: {
                type: "plain_text",
                text: ":open_file_folder: My Projects",
                emoji: true,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: ":small_blue_diamond: VRMS",
              },
            },
            {
              type: "divider",
            },
            {
              type: "header",
              text: {
                type: "plain_text",
                text: ":calendar: Upcoming Meetings",
                emoji: true,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: ":small_blue_diamond: *VRMS Team Meeting* – Monday, March 21",
              },
            },
          ],
        },
      });

      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  });

  console.log("⚡️ Events registered!");
};
