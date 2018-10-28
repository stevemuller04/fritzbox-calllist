class MergedPhonebook {
	constructor(...phoneBooks) {
		this.phoneBooks = phoneBooks;
	}

	lookup(telephone, callback) {
		this._lookup(telephone, callback, Array.prototype.slice.call(this.phoneBooks));
	}

	_lookup(telephone, callback, phoneBooks) {
		if (phoneBooks.length == 0)
			return callback(null, []);
		phoneBooks.shift().lookup(telephone, (err, results) => {
			if (!err && results.length > 0)
				callback(null, results);
			else
				this._lookup(telephone, callback, phoneBooks);
		});
	}
}

module.exports = MergedPhonebook;
