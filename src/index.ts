if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { app } from "app";
import { agenda } from "lib/agenda";

(async () => {
  await app.start(process.env.PORT || 3000);
  await agenda.start();

  console.log("⚡️ Bolt app is running!");
})();
