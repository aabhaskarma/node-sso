class SSOHandler {
	async login() {
		throw new Error('Auth handler must implement login method');
	}
}

module.exports = SSOHandler;