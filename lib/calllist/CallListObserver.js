const EventEmitter = require("events");

module.exports = class CallListObserver extends EventEmitter {
	constructor(callListGetter) {
		super();
		this.callListGetter = callListGetter;
		this._lastId = null;
		this._lastTimestamp = null;
	}

	check() {
		this.callListGetter.get(this._lastId, this._lastTimestamp, (err, callList) => {
			if (err) {
				this.emit("error", err);
			}
			else {
				// Store reference to the last call, so that it does not feature in any future requests
				if (callList.lastCallId)
					this._lastId = callList.lastCallId;
				this._lastTimestamp = callList.timestamp;

				// Emit an event for each new call
				for (let i = 0; i < callList.calls.length; i++)
					this.emit("call", callList.calls[i]);
			}
			this.emit("checked");
		});
	}
};
