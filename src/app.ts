if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import { app } from "./slack";
import { sendCheckin } from "./checkins";

app.action("meeting_check_in", async ({ body, ack, say }) => {
  await ack();
  console.log(body);
  await say(`<@${body.user.id}> checked in`);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  sendCheckin("C024CB1S4DU");

  console.log("⚡️ Bolt app is running!");
})();
