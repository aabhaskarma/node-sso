const axios = require('axios');

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
}

module.exports = GoogleSSO;
