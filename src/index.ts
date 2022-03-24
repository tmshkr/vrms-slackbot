if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { app } from "app";

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
