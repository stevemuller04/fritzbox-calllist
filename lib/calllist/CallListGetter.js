const { TR064 } = require("tr-064");
const https = require("https");
const url = require("url");
const concat = require("concat-stream");
const xml2js = require("xml2js");
const CallList = require("./CallList.js");

const CallListServiceId = "urn:dslforum-org:service:X_AVM-DE_OnTel:1";

class CallListGetter {
	constructor(hostname, username, password) {
		this.hostname = hostname;
		this.username = username;
		this.password = password;
		this.tr = new TR064();
		this._cached_device = null;
		this._cached_calllisturl = null;
	}

	_connect(callback) {
		this.tr.initTR064Device(this.hostname, 49000, (err, device) => {
			if (err) {
				callback(err, null);
			}
			else {
				device.startEncryptedCommunication((err, device) => {
					if (err) {
						callback(err, null);
					}
					else {
						device.login(this.username, this.password);
						callback(null, device);
					}
				});
			}
		});
	}

	_fetchCallListUrl(callback) {
		// Make sure that _connect() was called before and that there is a device
		if (!this._cached_device)
			return this._connect((err, device) => (this._cached_device = device) && this._fetchCallListUrl(callback));

		// Make sure that the call list service is supported
		if (!this._cached_device.services.hasOwnProperty(CallListServiceId))
			return callback("TR064 device does not support call lists ('" + CallListServiceId + "')", null);

		// Retrieve call list URL
		this._cached_device.services[CallListServiceId].actions.GetCallList((err, result) => {
			if (err)
				callback(err, null);
			else
				callback(null, result.NewCallListURL);
		});
	}

	_fetchCallList(last_id, last_timestamp, callback) {
		// Make sure that _fetchCallListUrl() was called before and we know the call list URL
		if (!this._cached_calllisturl)
			return this._fetchCallListUrl((err, url) => (this._cached_calllisturl = url) && this._fetchCallList(last_id, last_timestamp, callback));

		// Build full call list URL
		let full_url = this._cached_calllisturl + "&max=10&days=7";
		if (last_id)
			full_url += "&id=" + last_id;
		if (last_timestamp)
			full_url += "&timestamp=" + last_timestamp;

		// Retrieve resource at that URL
		https.get(Object.assign({ rejectUnauthorized: false }, url.parse(full_url)), res => {
			// Handle server errors
			if (res.statusCode != 200)
				return callback("Server replied with HTTP response code " + res.statusCode + " (URL: " + full_url + ")", null);

			// Handle transmission errors
			res.on("error", err => callback("Unable to download call list: " + err, null));

			// Read response in XML format
			res.pipe(concat(buffer => xml2js.parseString(buffer.toString(), (err, xml) => {
				if (err)
					callback("XML error: " + err, null);
				else
					callback(null, CallList.fromXml(xml.root));
			})));
		});
	}

	get(last_id, last_timestamp, callback) {
		this._fetchCallList(last_id, last_timestamp, (err, calllist) => {
			// If an error occurred, try again (but only once)
			if (err) {
				// Clear cache and thus force refreshing call list URL
				this._cached_device = null;
				this._cached_calllisturl = null;
				this._fetchCallList(last_id, last_timestamp, callback);
			}
			else {
				callback(null, calllist);
			}
		});
	}
};

module.exports = CallListGetter;
