const htmlparser = require("htmlparser2");
const https = require("https");
const url = require("url");
const Contact = require("./Contact.js");

class EditusPhonebook {
	_lookup(telephone, callback) {
		let full_url = "https://www.editus.lu/de/suche?q=" + encodeURIComponent(telephone);
		https.get(Object.assign({ rejectUnauthorized: false }, url.parse(full_url)), res => {
			// Handle server errors
			if (res.statusCode != 200)
				return callback("Server replied with HTTP response code " + res.statusCode + " (URL: " + full_url + ")", null);

			// Handle transmission errors
			res.on("error", err => callback("Unable to download phonebook results: " + err, null));

			// Read response in HTML format
			let parser = new htmlparser.Parser(new htmlparser.DomHandler((err, dom) => {
				if (err) {
					callback(err, null);
				}
				else {
					// Find results (<div itemscope itemtype="http://schema.org/Person"> and <div itemscope itemtype="http://schema.org/Organization">)
					let results = htmlparser.DomUtils.find(e => e.attribs && (!e.attribs.id || e.attribs.id != "footer-address") && (e.attribs.itemtype == "http://schema.org/Person" || e.attribs.itemtype == "http://schema.org/Organization"), dom, true);

					// Parse results and return
					callback(null, filterPhoneNumberMatches(telephone, results.map(parseResult)));
				}
			}), { decodeEntities: true });
			res.on("data", chunk => parser.write(chunk));
			res.on("end", () => parser.end());
		});
	}

	lookup(telephone, callback) {
		telephone = telephone.replace(/[^0-9+]/g, '').replace(/^(\+|00)352/, '');
		this._lookup(telephone, (err, results) => {
			// Number might contain an extension; try again with only 6 digits (common LU phone number size)
			if (!err && results.length == 0 && telephone.length > 6)
				this._lookup(telephone.substring(0, 6), callback);
			else
				callback(err, results);
		});
	}
}

function filterPhoneNumberMatches(caller, results) {
	let matches = [];
	for (let i = 0; i < results.length; i++)
		if (phoneNumbersMatch(caller, results[i].telephone))
			matches.push(results[i]);
	return matches;
}

function phoneNumbersMatch(nr1, nr2) {
	// Remove non-digits and leading zeroes and leading pluses
	nr1 = nr1.replace(/[^0-9+]/g, '').replace(/^(\+|00)352/, '').replace(/^[0+]+/, '');
	nr2 = nr2.replace(/[^0-9+]/g, '').replace(/^(\+|00)352/, '').replace(/^[0+]+/, '');

	// Two numbers match if one is contained in the other
	return nr1.indexOf(nr2) >= 0 || nr2.indexOf(nr1) >= 0;
}

function parseResult(domElement) {
	let obj = {};
	parseResult_recursive(domElement, obj);

	// Convert plain object to 'Contact' instance
	return new Contact(
		obj.name || "",
		obj.telephone || "",
		obj.address && obj.address.streetAddress || "",
		obj.address && obj.address.postalCode || "",
		obj.address && obj.address.addressLocality || "");
}

function parseResult_recursive(domElement, obj) {
	for (var i = 0; i < domElement.children.length; i++) {
		let child = domElement.children[i];
		if (child.type == "tag") {
			// If tag contains an "itemprop" attribute, create a new nested object
			if (child.attribs && child.attribs.itemprop) {
				let childObj = {};
				parseResult_recursive(child, childObj);

				// If the tag did not contain any further "itemprop" in the child tags,
				// take the text content of this tag as the value for the "itemprop".
				if (Object.keys(childObj) == 0)
					childObj = htmlparser.DomUtils.getText(child).replace(/\s+/g, " ").trim();

				// Save it to the object
				obj[child.attribs.itemprop] = childObj;
			}
			// If tag does not contain an "itemprop" attribute, transparently ignore this tag and look at child tags
			else {
				parseResult_recursive(child, obj);
			}
		}
	}
}

module.exports = EditusPhonebook;
