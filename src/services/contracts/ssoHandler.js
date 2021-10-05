class SSOHandler {
	async login() {
		throw new Error('"login" method not implemented yet.');
	}

	async generateAuthorizationUrl() {
		throw new Error('"generateAuthorizationUrl" method not implemented yet.');
	}

	async acquireToken() {
		throw new Error('"acquireToken" method not implemented yet.');
	}

	async refreshToken() {
		throw new Error('"refreshToken" method not implemented yet.');
	}

	async getUserInfo() {
		throw new Error('"getUserInfo" method not implemented yet.');
	}
}

module.exports = SSOHandler;