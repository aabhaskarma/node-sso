const axios = require('axios');
const { ValidationException } = require('../../exceptions/http.exception');
const SSOHandler = require('../contracts/ssoHandler');

const AUTHORIZATION_URL = 'https://www.facebook.com/v4.0/dialog/oauth';
const TOKEN_URL = 'https://graph.facebook.com/v4.0/oauth/access_token';
const USER_INFO_URL = 'https://graph.facebook.com/me';

class FacebookSSO extends SSOHandler {
    constructor(config) {
        super();
        this._clientId = config.clientId;
        this._clientSecret = config.clientSecret;
        this._redirectUri = config.redirectURI;
    }

    // combination of acquireToken and getUserInfo
    async login(authCode, config) {
        const token = await this.acquireToken(authCode, config);
        const userInfo = await this.getUserInfo(token.access_token);

        return {
            firstname: userInfo.name.split(' ')[0],
            lastname: userInfo.name.split(' ')[1],
            email: userInfo.email,
            picture: userInfo.picture.data.url,
            token,
            userInfo
        };
    }

    generateAuthorizationUrl(config = {}) {
        const params = {
            redirect_uri: config.redirectUri || this._redirectUri,
            client_id: config.clientId || this._clientId,
            response_type: config.responseType || 'code',
            scope: config.scope || 'public_profile,email',
            display: config.display || 'popup',
            auth_type: config.authType || 'rerequest',
        };

        return `${AUTHORIZATION_URL}?${new URLSearchParams(params)}`;
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

    refreshToken() {
        throw ValidationException('Facebook refresh method not available yet');
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