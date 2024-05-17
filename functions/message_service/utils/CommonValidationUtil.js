const RegExp = require('../constants/RegExp');
const AppError = require('../errors/AppError');
const AppConstants = require('../constants/AppConstants');

class CommonValidationUtil {
	static validatePaginationParams = (page, perPage) => {
		if (!page) {
			throw new AppError(400, 'page cannot be empty.');
		}

		if (!perPage) {
			throw new AppError(400, 'perPage cannot be empty.');
		}

		if (!RegExp.NUMBER.test(page)) {
			throw new AppError(
				400,
				'Invalid value for page. page should be a positive number.'
			);
		}

		if (!RegExp.NUMBER.test(perPage)) {
			throw new AppError(
				400,
				'Invalid value for perPage. perPage should be a positive number.'
			);
		}

		page = parseInt(page);
		perPage = parseInt(perPage);

		if (page <= 0) {
			throw new AppError(
				400,
				'Invalid value for page. page should be a greater than 0.'
			);
		}

		if (perPage <= 0) {
			throw new AppError(
				400,
				'Invalid value for perPage. perPage should be a greater than 0.'
			);
		}

		if (perPage > AppConstants.MAX_RECORDS_PER_OPERATION) {
			throw new AppError(
				400,
				'Invalid value for perPage. perPage should be a less than or equal to ' +
					AppConstants.MAX_RECORDS_PER_OPERATION
			);
		}
	};
	
}

module.exports = CommonValidationUtil;
