import prisma from "lib/prisma";
import { getHomeTab } from "app/views/home";
import { getInnerValues } from "utils/getInnerValues";

export const createProject = async ({ ack, body, view, client, logger }) => {
  await ack();

  const values = getInnerValues(view.state.values);
  const { new_project_title, team_members } = values;
  console.log(values);

  await prisma.project.create({
    data: {
      name: new_project_title.value,
      created_by: body.user.id,
      team_members: {
        create: team_members.selected_conversations.map((slack_id) => {
          if (slack_id === body.user.id) {
            return {
              slack_id,
              role: "OWNER",
            };
          } else {
            return {
              slack_id,
              role: "MEMBER",
            };
          }
        }),
      },
    },
  });

  const home = await getHomeTab(body.user.id);
  await client.views.publish(home);
};
