const express = require('express');
const catalyst = require('zcatalyst-sdk-node');

const AuthUtil = require('./utils/AuthUtil');
const QueryUtil = require('./utils/QueryUtil');
const MessageUtil = require('./utils/MessageUtil');
const MessageTable = require('./tables/MessageTable');
const ErrorHandler = require('./handlers/ErrorHandler');
const ResponseWrapper = require('./web/ResponseWrapper');
const RequestHandler = require('./handlers/RequestHandler');
const RequestConstants = require('./constants/RequestConstants');
const CommonValidationUtil = require('./utils/CommonValidationUtil');

const app = express();
app.use(express.json());

app.use((request, response, next) => {
	try {
		if (
			!AuthUtil.isValidSecretKey(
				request.get(RequestConstants.Headers.CATALYST_CODELIB_SECRET_KEY.key)
			)
		) {
			throw new AppError(
				401,
				"You don't have permission to perform this operation. Kindly contact your administrator for more details."
			);
		}

		next();
	} catch (err) {
		const { message, statusCode } = ErrorHandler.processError(err);

		const responseWrapper = new ResponseWrapper();
		responseWrapper.message = message;
		responseWrapper.statusCode = statusCode;

		RequestHandler.sendResponse(response, responseWrapper);
	}
});

app.get('/messages', async (request, response) => {
	const responseWrapper = new ResponseWrapper();
	try {
		CommonValidationUtil.validatePaginationParams(
			request.query.page,
			request.query.perPage
		);

		const page = parseInt(request.query.page);
		const perPage = parseInt(request.query.perPage);

		const catalystApp = catalyst.initialize(request);

		const zcql = catalystApp.zcql();

		const totalRecords = await zcql
			.executeZCQLQuery(
				`SELECT COUNT(${MessageTable.ROWID.value}) FROM ${MessageTable.TABLE}`
			)
			.then((result) =>
				parseInt(
					QueryUtil.getCountResult(
						result,
						MessageTable.TABLE,
						MessageTable.ROWID.raw
					)
				)
			);

		const hasMore = totalRecords > page * perPage;
		const totalPages = Math.ceil(totalRecords / perPage);

		const data = await zcql
			.executeZCQLQuery(
				`SELECT ${MessageTable.ID.value},${MessageTable.MESSAGE.value},${
					MessageTable.CREATED_TIME.value
				} FROM ${MessageTable.TABLE} ORDER BY ${
					MessageTable.CREATED_TIME.value
				} LIMIT ${perPage} OFFSET ${QueryUtil.calculateOffsetForPageBasedOperations(
					page,
					perPage
				)} `
			)
			.then(MessageUtil.generateDtoFromQueryResult);

		responseWrapper.data = data;
		responseWrapper.page = {
			page,
			perPage,
			hasMore,
			totalPages,
			totalRecords
		};
		responseWrapper.statusCode = 200;
	} catch (err) {
		const { message, statusCode } = ErrorHandler.processError(err);
		responseWrapper.message = message;
		responseWrapper.statusCode = statusCode;
	}

	RequestHandler.sendResponse(response, responseWrapper);
});

module.exports = app;
