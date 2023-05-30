module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'vercelController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/deployments',
    handler: 'vercelController.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/deployments/:id',
    handler: 'vercelController.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/deploy/:target',
    handler: 'vercelController.deploy',
    config: {
      policies: [],
    },
  },
];
