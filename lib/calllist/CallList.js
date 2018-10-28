const Call = require("./Call.js");

class CallList {
	constructor() {
		this.calls = [];
		this.lastCallId = null;
		this.timestamp = null;
	}
};

CallList.fromXml = function(xml) {
	let result = new CallList();
	result.timestamp = xml.timestamp;

	// Parse calls
	for (let i = 0; xml.Call && i < xml.Call.length; i++)
		result.calls.push(Call.fromXml(xml.Call[i]));

	// Determine last call (which is at index 0, because list is in reverse order)
	if (result.calls.length > 0) {
		result.lastCallId = result.calls[0].id;
	}

	// Calls are in reverse order
	result.calls.reverse();

	return result;
};

module.exports = CallList;
