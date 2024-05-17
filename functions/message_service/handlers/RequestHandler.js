class RequestHandler {
	static sendResponse(response, responseWrapper) {
		response
			.status(responseWrapper.statusCode)
			.send(responseWrapper.getResponse());
	}
}

module.exports = RequestHandler;
