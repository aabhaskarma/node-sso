const axios = require('axios');
const { ValidationException } = require('../../exceptions/http.exception');
const SSOHandler = require('../contracts/ssoHandler');

const AUTHORIZATION_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const NAME_URL = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,localizedLastName,localizedFirstName,profilePicture(displayImage~:playableStreams))';
const EMAIL_URL = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';

class LinkedinSSO extends SSOHandler {
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

		const { profile, email: emailObj } = userInfo;

		return {
			email: emailObj.elements[0]['handle~'].emailAddress,
			firstname: profile.localizedFirstName,
			lastname: profile.localizedLastName,
			picture: profile.profilePicture['displayImage~'].elements[3].identifiers[0].identifier,
			token,
			userInfo
		};
	}

	generateAuthorizationUrl(config = {}) {
		const params = {
			redirect_uri: config.redirectUri || this._redirectUri,
			client_id: config.clientId || this._clientId,
			response_type: config.responseType || 'code',
			scope: config.scope || 'r_liteprofile r_emailaddress'
		};

		return `${AUTHORIZATION_URL}?${new URLSearchParams(params)}`;
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

	refreshToken() {
		throw ValidationException('Linkedin refresh method not available yet');
	}

	async getUserInfo(accessToken) {
		const config = {
			headers: { Authorization: `Bearer ${accessToken}` }
		};

		const [profile, email] = await Promise.all([
			axios.get(NAME_URL, config).then((res) => res.data),
			axios.get(EMAIL_URL, config).then((res) => res.data)
		]);

		return {
			profile, email
		};
	}
}

module.exports = LinkedinSSO;