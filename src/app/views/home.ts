import prisma from "lib/prisma";
import { meetings } from "data/meetings";

const renderProject = (project) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:small_blue_diamond: ${project.name}`,
    },
  };
};

export const getHomeTab = async (slack_id) => {
  // create user if does not exist in db
  await prisma.user.upsert({
    where: { slack_id },
    update: {},
    create: { slack_id },
  });
  const projectsData = await prisma.project.findMany({
    include: { meetings: true },
    orderBy: {
      id: "asc",
    },
  });

  console.log(projectsData);
  const projects = projectsData.map(renderProject);

  return {
    user_id: slack_id,
    view: {
      type: "home",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: ":house: Welcome to VRMS",
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Here you'll find an overview of your projects and upcoming meetings.`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: ":open_file_folder: My Projects",
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Projects you're working on",
            emoji: true,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Create New Project",
              emoji: true,
            },
            action_id: "create_new_project",
          },
        },
        ...projects,
        {
          type: "divider",
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: ":calendar: Upcoming Meetings",
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Meetings for projects",
            emoji: true,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Create New Meeting",
              emoji: true,
            },
            action_id: "create_new_meeting",
          },
        },
        ...meetings,
      ],
    },
  };
};
