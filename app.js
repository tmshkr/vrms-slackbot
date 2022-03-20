require("dotenv").config();
const { App } = require("@slack/bolt");

// Initialize app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.action("meeting_check_in", async ({ body, ack, say }) => {
  await ack();
  console.log(body);
  await say(`<@${body.user.id}> checked in`);
});

(async () => {
  const channel = "C024CB1S4DU";
  await app.start(process.env.PORT || 3000);

  await app.client.chat.postMessage({
    channel,
    text: `@here it's time to meet!`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `@here it's time to meet!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Check In",
          },
          action_id: "meeting_check_in",
        },
      },
    ],
  });

  console.log("⚡️ Bolt app is running!");
})();
