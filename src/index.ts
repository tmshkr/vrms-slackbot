if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { app } from "app";
import { agenda } from "lib/agenda";
import { sendCheckin } from "./checkins";

(async () => {
  await app.start(process.env.PORT || 3000);
  await agenda.start();
  sendCheckin("C024CB1S4DU");

  console.log("⚡️ Bolt app is running!");
})();
