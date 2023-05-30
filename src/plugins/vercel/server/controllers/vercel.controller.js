'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi.plugin('vercel').service('vercelService').getWelcomeMessage();
  },
  find: async (ctx) => {
    try {
      const data = await strapi
        .plugin('vercel')
        .service('vercelService')
        .getDeployments();
      ctx.send(data);
    } catch (e) {
      ctx.send({ error: e }, 400);
    }
  },
  findOne: async (ctx) => {
    const { id } = ctx.params;
    try {
      const data = await strapi
        .plugin('vercel')
        .service('vercelService')
        .getDeployment(id);
      ctx.send(data);
    } catch (e) {
      ctx.send({ error: e }, 400);
    }
  },
  deploy: async (ctx) => {
    const { target } = ctx.params;
    try {
      const data = await strapi.plugin('vercel').service('vercelService').deploy(target);
      ctx.send(data);
    } catch (e) {
      ctx.send({ error: e }, 400);
    }
  },
};
