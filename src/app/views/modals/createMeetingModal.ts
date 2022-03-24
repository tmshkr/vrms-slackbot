export const createMeetingModal = (userProjects) => ({
  type: "modal",
  // View identifier
  callback_id: "create_meeting_modal",
  title: {
    type: "plain_text",
    text: "Create New Meeting",
  },
  blocks: [
    {
      type: "input",
      block_id: "meeting_title_block",
      label: {
        type: "plain_text",
        text: "What should this meeting be called?",
      },
      element: {
        type: "plain_text_input",
        action_id: "meeting_title",
      },
    },
    {
      type: "input",
      block_id: "meeting_project_select_block",
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select a project",
          emoji: true,
        },
        options: userProjects.map(({ project }) => ({
          text: {
            type: "plain_text",
            text: project?.name,
            emoji: true,
          },
          value: String(project?.id),
        })),
        action_id: "meeting_project_select",
      },
      label: {
        type: "plain_text",
        text: "Which project is this meeting for?",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "meeting_channel_select_block",
      element: {
        type: "channels_select",
        placeholder: {
          type: "plain_text",
          text: "Select channel",
          emoji: true,
        },
        action_id: "meeting_channel_select",
      },
      label: {
        type: "plain_text",
        text: "Which channel should this meeting be in?",
        emoji: true,
      },
    },
    // TODO: make it so user can't select a date in the past
    {
      type: "input",
      block_id: "meeting_datepicker_select_block",
      element: {
        type: "datepicker",
        placeholder: {
          type: "plain_text",
          text: "Select a date",
          emoji: true,
        },
        action_id: "meeting_datepicker_select",
      },
      label: {
        type: "plain_text",
        text: "When should the first meeting be?",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "meeting_timepicker_select_block",
      element: {
        type: "timepicker",
        placeholder: {
          type: "plain_text",
          text: "Select time",
          emoji: true,
        },
        action_id: "meeting_timepicker_select",
      },
      label: {
        type: "plain_text",
        text: "At what time?",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "repeat_frequency_select_block",
      element: {
        type: "radio_buttons",
        options: [
          {
            text: {
              type: "plain_text",
              text: "once every week",
              emoji: true,
            },
            value: "1 week",
          },
          {
            text: {
              type: "plain_text",
              text: "once every 2 weeks",
              emoji: true,
            },
            value: "2 weeks",
          },
          {
            text: {
              type: "plain_text",
              text: "once a month",
              emoji: true,
            },
            value: "1 month",
          },
        ],
        action_id: "repeat_frequency_select",
      },
      label: {
        type: "plain_text",
        text: "This meeting should repeat",
        emoji: true,
      },
    },
  ],
  submit: {
    type: "plain_text",
    text: "Submit",
  },
});
