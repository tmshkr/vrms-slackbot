const { App } = require("@slack/bolt");
import { registerActions } from "./actions";
import { registerEvents } from "./events";
import { registerViewListeners } from "./views/listeners";
import { registerMessages } from "./message";

// Initialize app
export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

registerActions();
registerEvents();
registerViewListeners();
registerMessages();
