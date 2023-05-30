module.exports = ({ env }) => ({
  host: env('NODE_HOST', '0.0.0.0'),
  port: env.int('NODE_PORT', 1337),
});
