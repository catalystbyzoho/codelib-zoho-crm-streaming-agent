const MessageTable = require('../tables/MessageTable');

class MessageUtil {
	static generateDtoFromQueryResult(result) {
		return result.map((item) => ({
			id: item[MessageTable.TABLE][MessageTable.ID.raw],
			message: item[MessageTable.TABLE][MessageTable.MESSAGE.raw],
			created_time: item[MessageTable.TABLE][MessageTable.CREATED_TIME.raw]
		}));
	}
}

module.exports = MessageUtil;
