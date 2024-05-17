const Column = require('./Column');

class MessageTable {
	static TABLE = 'Message';
	static ID = new Column(this.TABLE, 'ID');
	static ROWID = new Column(this.TABLE, 'ROWID');
	static MESSAGE = new Column(this.TABLE, 'MESSAGE');
	static CREATED_TIME = new Column(this.TABLE, 'CREATEDTIME');
}

module.exports = MessageTable;
