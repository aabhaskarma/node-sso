const { AUTH_TYPES, SSO_TYPES } = require('./constants');
const { BadRequestException } = require('./exceptions/http.exception');

const SSO_TYPE_TO_HANDLER_MAP = {
	[AUTH_TYPES.GOOGLE]: './service/google/handler',
	[AUTH_TYPES.FACEBOOK]: './service/facebook/handler',
	[AUTH_TYPES.LINKEDIN]: './service/linkedin/handler',
//  	[AUTH_TYPES.APPLE]: './service/apple/handler'
};

class NodeSSO {
	constructor(ssoType, config) {
		this._ssoType = ssoType;

		if (!Object.values(SSO_TYPES).includes(this._ssoType)) {
			throw new BadRequestException('Invalid SSO Type');
		}

		const Handler = require(SSO_TYPE_TO_HANDLER_MAP[this._ssoType]);

		Object.setPrototypeOf(this, new Handler(config));
	}
}

module.exports = NodeSSO;
