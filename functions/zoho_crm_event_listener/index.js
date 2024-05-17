const CatalystSDK = require('zcatalyst-sdk-node');

const MAX_RECORDS_PER_OPERATION = 200;

module.exports = async (event, context) => {
	try {
		const catalystApp = CatalystSDK.initialize(context);
		const zcql = catalystApp.zcql();
		const table = catalystApp.datastore().table('Message');

		const messages = [];
		const eventData = event.data.event_data;

		let lastGeneratedId = await zcql
			.executeZCQLQuery(
				'SELECT Message.ID FROM Message ORDER BY Message.CREATEDTIME DESC LIMIT 1,1'
			)
			.then((response) =>
				response.length ? parseInt(response[0]['Message']['ID']) : 0
			);

		for (const data of eventData) {
			messages.push({
				ID: ++lastGeneratedId,
				MESSAGE: JSON.stringify(data)
			});
		}

		const totalPages = Math.ceil(messages.length / MAX_RECORDS_PER_OPERATION);

		for (let page = 1; page <= totalPages; page++) {
			const start = (page - 1) * MAX_RECORDS_PER_OPERATION;

			await table.insertRows(
				messages.slice(start, start + MAX_RECORDS_PER_OPERATION)
			);
		}

		context.closeWithSuccess();
	} catch (err) {
		console.log('Event function failed ', err);
		context.closeWithFailure();
	}
};
