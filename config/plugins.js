module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-mcmandrill',
      providerOptions: {
        mandrill_api_key: env('MANDRILL_API_KEY'),
        mandrill_default_from_name: 'Strapi CMS',
        mandrill_default_from_email: env('MANDRILL_FROM_EMAIL'),
      },
    },
  },
  upload: {
    config: {
      provider: 'strapi-provider-upload-aws-s3-advanced',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET_NAME'),
        },
        baseUrl: env('AWS_BASE_URL'),
        imgPrefix: env('AWS_BUCKET_IMG_PREFIX'),
        vidPrefix: env('AWS_BUCKET_VID_PREFIX'),
        docPrefix: env('AWS_BUCKET_DOC_PREFIX'),
      },
    },
  },
  vercel: {
    enabled: true,
    resolve: './src/plugins/vercel',
    config: {
      token: env('VERCEL_TOKEN'),
      projectId: env('VERCEL_PROJECT_ID'),
      teamId: env('VERCEL_TEAM_ID'),
      triggers: {
        production: env('VERCEL_TRIGGER_PRODUCTION'),
      },
    },
  },
})
