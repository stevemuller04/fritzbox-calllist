class CachedPhonebook {
	constructor(phoneBook) {
		this.phoneBook = phoneBook;
		this.cache = {};
		this.callbacks = {};
	}

	lookup(telephone, callback) {
		// If phone number is already known, invoke callback immediately
		if (this.cache.hasOwnProperty(telephone) && this.cache[telephone]) {
			callback(null, this.cache[telephone]);
			return;
		}

		// Register callback
		if (!this.callbacks.hasOwnProperty(telephone))
			this.callbacks[telephone] = [];
		this.callbacks[telephone].push(callback);

		// Schedule phonebook lookup, unless one is already running
		if (!this.cache.hasOwnProperty(telephone)) {
			this.phoneBook.lookup(telephone, (err, result) => {
				// Save result
				if (err)
					this.cache[telephone] = result;

				// Call all callbacks
				for (let i = 0; this.callbacks.hasOwnProperty(telephone) && i < this.callbacks[telephone].length; i++)
					this.callbacks[telephone][i](err, result);
				delete this.callbacks[telephone];
			});
		}
	}
}

module.exports = CachedPhonebook;
