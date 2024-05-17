class ResponseWrapper {
	statusCode = -1;
	page = undefined;
	data = undefined;
	message = undefined;

	getResponse() {
		const result = {};

		if (this.data) {
			result['data'] = this.data;
		}

		if (this.page) {
			result['page'] = this.page;
		}

		if (this.message) {
			result['message'] = this.message;
		}

		if (this.statusCode >= 200 && this.statusCode < 300) {
			result['status'] = 'success';
		} else {
			result['status'] = 'failure';
		}

		return result;
	}
}

module.exports = ResponseWrapper;
