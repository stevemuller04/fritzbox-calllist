const EventEmitter = require("events");
const CallInfo = require("./CallInfo.js");
const CallType = require("./calllist/CallType.js");

class CallManager extends EventEmitter {
	constructor(phoneBook) {
		super();
		this.phoneBook = phoneBook;
		this.callInfos = [];
	}

	addCall(call) {
		// Add call to this class
		let callInfo = new CallInfo(call.id, call, null);
		callInfo.direction = CallType.directionIn(call.type) ? "in" : CallType.directionOut(call.type) ? "out" : null;
		this.callInfos.push(callInfo);
		this.emit("callInfo", callInfo);

		// Look up contact information of the caller
		if (CallType.directionIn(call.type) && call.caller)
			this._lookup(callInfo, call.caller);
		if (CallType.directionOut(call.type) && call.callee)
			this._lookup(callInfo, call.callee);
	}

	_lookup(callInfo, telephone) {
		this.phoneBook.lookup(telephone, (err, contacts) => {
			if (err) {
				this.emit("error", err);
			}
			else if (contacts.length > 0) {
				callInfo.contact = contacts[0];
				this.emit("callInfo", callInfo);
			}
		});
	}

	getCalls() {
		return this.callInfos;
	}
}

module.exports = CallManager;
