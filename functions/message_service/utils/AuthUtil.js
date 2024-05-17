const AppConstants = require('../constants/AppConstants');
const EnvConstants = require('../constants/EnvConstants');

class AuthUtil {
	static isValidSecretKey(key) {
		return (
			key &&
			key !== AppConstants.DEFAULT_SECRET_KEY &&
			key === EnvConstants.CODELIB_SECRET_KEY
		);
	}
}
module.exports = AuthUtil;
