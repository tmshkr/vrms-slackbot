import { app } from "app";
import { getBlocks } from "utils/getBlocks";

export const registerMessages = () => {
  app.message("hi", async ({ message, client, logger }) => {
    if (message.channel_type !== "im") {
      return;
    }

    try {
      const reply: any = await getBlocks("onboarding/0-welcome.md");
      await client.chat.postMessage({
        channel: message.channel,
        text: reply.text,
        blocks: reply.blocks,
      });
    } catch (error) {
      logger.error(error);
    }
  });
};
