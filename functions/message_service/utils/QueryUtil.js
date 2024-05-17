class QueryUtil {
	static getCountResult(queryResult, table, column) {
		return queryResult[0][table][`COUNT(${column})`];
	}

	static calculateOffsetForPageBasedOperations(page, perPage) {
		return (page - 1) * perPage + 1;
	}
}

module.exports = QueryUtil;
