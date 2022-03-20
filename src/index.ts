if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { app } from "app";
import { sendCheckin } from "./checkins";

(async () => {
  await app.start(process.env.PORT || 3000);
  sendCheckin("C024CB1S4DU");

  console.log("⚡️ Bolt app is running!");
})();
