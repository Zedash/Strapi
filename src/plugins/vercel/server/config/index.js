'use strict';

module.exports = {
  default: ({ env }) => ({
    token: env('VERCEL_TOKEN'),
    projectId: env('VERCEL_PROJECT_ID'),
    teamId: env('VERCEL_TEAM_ID'),
    triggers: {
      production: env('VERCEL_TRIGGER_PRODUCTION'),
    },
  }),
  validator: (config) => {
    if (typeof config.token !== 'string') {
      throw new Error('token has to be a string');
    }
  },
};
