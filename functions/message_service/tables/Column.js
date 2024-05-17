class Column {
	raw;
	value;

	constructor(table, column) {
		this.raw = column;
		this.value = `${table}.${column}`;
	}
}

module.exports = Column;
