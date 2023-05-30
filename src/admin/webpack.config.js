'use strict';

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  config.plugins.push(
    new webpack.DefinePlugin({
      // All your custom ENVs that you want to use in frontend
      CUSTOM_VARIABLES: {
        VERCEL_TOKEN: JSON.stringify(process.env.VERCEL_TOKEN),
        CLIENT_URL: JSON.stringify(process.env.CLIENT_URL),
        CLIENT_PREVIEW_SECRET: JSON.stringify(process.env.CLIENT_PREVIEW_SECRET),
      },
    })
  );
  // Important: return the modified config
  return config;
};
