const axios = require('axios');
const SSOHandler = require('../contracts/ssoHandler');

const AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

class GoogleSSO extends SSOHandler {
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
        redirect_uri: config.redirectUri || this._redirectUri,
        grant_type: config.grantType || 'authorization_code'
    };

    return axios.post(TOKEN_URL, new URLSearchParams(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then((res) => res.data);
  }

  async getUserInfo(accessToken) {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    };

    return axios.get(USER_INFO_URL, config)
        .then((res) => res.data);
  }

  // combination of acquireToken and getUserInfo
  async login(authCode, config) {
    const token = await this.acquireToken(authCode, config);
    const userInfo = await this.getUserInfo(token.access_token);

    return {
        firstname: userInfo.given_name,
        lastname: userInfo.family_name,
        email: userInfo.email,
        picture: userInfo.picture.replace('=s96-c', '=s500'), // https://developers.google.com/people/image-sizing
        token,
        userInfo
    };
  }

  generateAuthorizationUrl(config = {}) {
    const params = {
        redirect_uri: config.redirectUri || this._redirectUri,
        client_id: config.clientId || this._clientId,
        response_type: config.responseType || 'code',
        scope: config.scope || [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
        auth_type: config.authType || 'offline',
        prompt: config.prompt || 'consent',
    };

    return `${AUTHORIZATION_URL}?${new URLSearchParams(params)}`;
  }
}

module.exports = GoogleSSO;
