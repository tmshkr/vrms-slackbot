import { app } from "app";
import { getHomeTab } from "./views/home";

export const registerEvents = () => {
  app.event("app_home_opened", async ({ event, client, logger }) => {
    try {
      const result = await client.views.publish(getHomeTab(event.user));

      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  });

  console.log("⚡️ Events registered!");
};
