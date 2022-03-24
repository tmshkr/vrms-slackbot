import prisma from "lib/prisma";
import { getHomeTab } from "app/views/home";

export const createProject = async ({ ack, body, view, client, logger }) => {
  await ack();
  const { new_project_title } = view.state.values.new_project_title_block;
  console.log(new_project_title);

  await prisma.project.create({
    data: {
      name: new_project_title.value,
      created_by: body.user.id,
      team_members: {
        create: {
          slack_id: body.user.id,
          role: "OWNER",
        },
      },
    },
  });

  const home = await getHomeTab(body.user.id);
  await client.views.publish(home);
};
