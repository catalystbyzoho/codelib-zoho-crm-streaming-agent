const AppError = require('../errors/AppError');

class ErrorHandler {
	static processError(err) {
		if (err instanceof AppError) {
			return {
				statusCode: err.statusCode,
				message: err.message
			};
		} else {
			console.log('Error :::', err);
			return {
				statusCode: 500,
				message:
					"We're unable to process your request. Kindly check logs to know more details."
			};
		}
	}
}
module.exports = ErrorHandler;
