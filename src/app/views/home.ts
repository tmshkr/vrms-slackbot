import prisma from "lib/prisma";
import moment from "lib/moment";

const renderProject = (project) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:small_blue_diamond: ${project.name}`,
    },
  };
};

const renderMeeting = (meeting) => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:small_blue_diamond: *${meeting.title}* – ${moment(
        meeting.next_run
      ).format(
        "dddd, MMMM Do, h:mm a"
      )} – <https://www.google.com|Add to Calendar>`,
      // TODO: use Google Calendar API to create event with link to meeting
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

  const userOverview = await prisma.user
    .findUnique({
      where: { slack_id },
      include: {
        team_assignments: {
          orderBy: { id: "asc" },
          include: { project: true },
        },
        meeting_assignments: {
          include: {
            meeting: true,
          },
        },
      },
    })
    .then((user) => {
      const userOverview = {} as any;
      userOverview.projects = user.team_assignments?.map(({ project }) =>
        renderProject(project)
      );
      userOverview.meetings = user.meeting_assignments?.map(({ meeting }) =>
        renderMeeting(meeting)
      );
      return userOverview;
    });

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
        ...userOverview.projects,
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
        ...userOverview.meetings,
      ],
    },
  };
};
