const century = Math.floor((new Date()).getFullYear() / 100) * 100;

class Call {
	constructor(id, timestamp, type, caller, callee, duration, device, port) {
		this.id = id;
		this.timestamp = timestamp;
		this.type = type;
		this.caller = caller;
		this.callee = callee;
		this.duration = duration;
		this.device = device;
		this.port = port;
	}

	toJSON() {
		return {
			id: this.id,
			timestamp: +this.timestamp,
			type: this.type,
			caller: this.caller,
			callee: this.callee,
			duration: this.duration,
			device: this.device,
			port: this.port,
		};
	}
};

Call.fromXml = function(xml) {
	let call = new Call();
	call.id = xml.Id && xml.Id.length > 0 && parseInt(xml.Id[0]) || 0;
	call.timestamp = xml.Date && xml.Date.length > 0 && parseDate(xml.Date[0]) || 0;
	call.type = xml.Type && xml.Type.length > 0 && parseInt(xml.Type[0]) || 0;
	call.caller = xml.CallerNumber && xml.CallerNumber.length > 0 && xml.CallerNumber[0] || xml.Caller && xml.Caller.length > 0 && xml.Caller[0] || "";
	call.callee = xml.CalledNumber && xml.CalledNumber.length > 0 && xml.CalledNumber[0] || xml.Called && xml.Called.length > 0 && xml.Called[0] || "";
	call.duration = xml.Duration && xml.Duration.length > 0 && parseDuration(xml.Duration[0]) || 0;
	call.device = xml.Device && xml.Device.length > 0 && xml.Device[0] || "";
	call.port = xml.Port && xml.Port.length > 0 && xml.Port[0] || "";
	return call;
};

function parseDate(str) {
	// Dates are in format "DD.MM.YYYY hh:mm"
	let [date, time] = str.split(' ');
	let [d, m, y] = date.split('.').map(n => parseInt(n));
	let [h, i] = time.split(':').map(n => parseInt(n));
	if (y < 100) y += century;
	return new Date(y, m - 1, d, h, i);
}

function parseDuration(str) {
	// Duration is in format "hh:mm" for durations < 1d.
	// For durations >= 1d the format is unknown, we therefore assume that the duration
	// consists of numbers separated by non-numbers, which is probably true.
	let tokens = str.split(/[^0-9]+/g).map(n => parseInt(n)).reverse(); // seconds first
	let units = [60, 3600, 86400]; // minutes, hours, days

	// Handle case where the format is unkown
	if (tokens.length == 0 || tokens.length > units.length)
		return -1; // don't know what to do

	// Compute number of seconds
	let value = 0;
	for (let i = 0; i < tokens.length; i++)
		value += tokens[i] * units[i];
	return value;
}

module.exports = Call;
