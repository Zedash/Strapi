module.exports = ({ env }) => ({
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  auth: {
    secret: env('JWT_SECRET'),
  },
  url: env('PUBLIC_ADMIN_URL', '/dashboard'),
});
