const moment = require('moment');
const catalyst = require('zcatalyst-sdk-node');

const DEFAULT_MESSAGES_MAX_RETENTION_DAYS = 7;
const MAX_MESSAGES_DELETED_PER_EXECUTION = 10000;
const CATALYST_COMPONENT_USAGE_SELEP_TIME = 2 * 1000;
const CATALYST_MAX_RECORDS_DELETED_PER_EXECUTION = 300;

function isNumber(value) {
	return /^[0-9]*$/.test(value);
}

module.exports = async (_, context) => {
	try {
		const catalystApp = catalyst.initialize(context);
		const zcql = catalystApp.zcql();

		let messagesMaxRetentionDays = process.env.MESSAGES_MAX_RETENTION_DAYS;

		if (!messagesMaxRetentionDays || !isNumber(messagesMaxRetentionDays)) {
			messagesMaxRetentionDays = DEFAULT_MESSAGES_MAX_RETENTION_DAYS;
		}

		const deletionDate = moment()
			.subtract(messagesMaxRetentionDays, 'day')
			.format('YYYY-MM-DD');

		const totalMessages = await zcql
			.executeZCQLQuery(
				`SELECT COUNT(Message.ROWID) FROM Message WHERE Message.CREATEDTIME < '${deletionDate}'`
			)
			.then((result) =>
				Math.min(
					parseInt(result[0]['Message']['COUNT(ROWID)']),
					MAX_MESSAGES_DELETED_PER_EXECUTION
				)
			);

		const totalPagesToBeDeleted = Math.ceil(
			totalMessages / CATALYST_MAX_RECORDS_DELETED_PER_EXECUTION
		);

		for (let page = 1; page <= totalPagesToBeDeleted; page++) {
			await zcql.executeZCQLQuery(
				`DELETE FROM Message WHERE Message.CREATEDTIME < '${deletionDate}'`
			);

			await new Promise((resolve) =>
				setTimeout(resolve, CATALYST_COMPONENT_USAGE_SELEP_TIME)
			);
		}

		console.log('Total messages deleted ::: ', totalMessages);

		context.closeWithSuccess();
	} catch (err) {
		console.log('Error :::', err);
		context.closeWithFailure();
	}
};
