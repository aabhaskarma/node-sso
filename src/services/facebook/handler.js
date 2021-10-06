const axios = require('axios');
const { ValidationException } = require('../../exceptions/http.exception');
const SSOHandler = require('../contracts/ssoHandler');

const TOKEN_URL = 'https://graph.facebook.com/v4.0/oauth/access_token';
const USER_INFO_URL = 'https://graph.facebook.com/me';

class FacebookSSO extends SSOHandler {
    constructor(config) {
        super();
        this._clientId = config.clientId;
        this._clientSecret = config.clientSecret;
        this._redirectUri = config.redirectURI;
    }

    acquireToken(authCode, config) {
        const params = {
            code: authCode,
            client_id: config.cliendId || this._clientId,
            client_secret: config.clientSecret || this._clientSecret,
            redirect_uri: config.redirectUri || this._redirectUri
        };

        return axios.post(TOKEN_URL, new URLSearchParams(params), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then((res) => res.data);
    }

    async getUserInfo(accessToken) {
      const config = {
          params: {
              access_token: accessToken,
              fields: ['email', 'name', 'picture.width(500).height(500)'].join(','), // https://stackoverflow.com/a/21162489
              type: 'normal'
          }
      };

      return axios.get(USER_INFO_URL, config)
          .then((res) => res.data);
  }

}

module.exports = FacebookSSO;