import { app } from "app";
import prisma from "lib/prisma";
import { getHomeTab } from "app/views/home";

export const registerViewListeners = () => {
  app.view(
    "create_project_modal",
    async ({ ack, body, view, client, logger }) => {
      await ack();
      const { new_project_title } = view.state.values.new_project_title_block;
      console.log(new_project_title);

      await prisma.project.create({
        data: {
          name: new_project_title.value,
          created_by: body.user.id,
        },
      });

      const home = await getHomeTab(body.user.id);
      await client.views.publish(home);
    }
  );

  console.log("⚡️ View listeners registered!");
};
