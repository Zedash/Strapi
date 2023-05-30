'use strict';

/**
 * vercel.service.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
const axios = require('axios');

module.exports = {
  async getDeployments() {
    const res = await this._getClient().get(
      `/v6/deployments?projectId=${this._getApiProjectId()}&limit=10&teamId=${this._getApiTeamId()}`
    );
    return res.data;
  },
  async getDeployment(id) {
    const res = await this._getClient().get(
      `/v13/deployments/${id}?teamId=${this._getApiTeamId()}`
    );
    return res.data;
  },
  async deploy(target) {
    const triggers = this._getApiTriggers();
    if (!triggers[target])
      throw `[strapi-plugin-vercel] Undefined vercel.triggers.${target}`;
    const res = await this._getClient().get(
      `/v1/integrations/deploy/${this._getApiProjectId()}/${triggers[target]}`
    );
    return res.data;
  },
  _getClient() {
    if (!this._client) {
      this._client = axios.create({
        baseURL: 'https://api.vercel.com',
        headers: {
          Authorization: `Bearer ${this._getApiToken()}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return this._client;
  },
  _getApiToken() {
    const conf = strapi.plugin('vercel').config('token');
    if (!conf) throw '[strapi-plugin-vercel] Missing vercel.token';
    return conf;
  },
  _getApiProjectId() {
    const conf = strapi.plugin('vercel').config('projectId');
    if (!conf) throw '[strapi-plugin-vercel] Missing vercel.projectId';
    return conf;
  },
  _getApiTeamId() {
    const conf = strapi.plugin('vercel').config('teamId');
    if (!conf) throw '[strapi-plugin-vercel] Missing vercel.teamId';
    return conf;
  },
  _getApiTriggers() {
    const conf = strapi.plugin('vercel').config('triggers.production');
    if (!conf) throw '[strapi-plugin-vercel] Missing vercel.triggers';
    return conf;
  },
};
