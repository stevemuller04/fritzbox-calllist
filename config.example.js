module.exports = {
	// All these settings configure the web server launched by this tool
	webserver: {
		// The port at which the HTTP web interface is listening.
		// For example, if this is set to 8080, the web interface will be available at http://localhost:8080.
		port: 8080,
	},
	// All these settings configure the connection to the Fritz!Box web interface and API.
	fritzbox: {
		// The host name or IP address of your Fritz!Box web interface. Typically this is "fritz.box" or "192.168.1.1".
		host: "fritz.box",
		// The user name that you use to log into your Fritz!Box.
		// This is the same one that you would enter at http://fritz.box.
		// Typically this is "admin".
		username: "admin",
		// The password that you use to log into your Fritz!Box.
		// This is the same one that you would enter at http://fritz.box.
		password: "---Fritz!Box password here---",
	},
	// The local phone book lists all contacts for whom the phone number shall be resolved to a name and an address.
	// Each entry is of the form { name: "", telephone: "", streetAddress: "", postalCode: "", addressLocality: "" },
	// specifying the contact's display name, the phone number that shall be matched, and the street address + postalCode + locality that shall be additionally displayed.
	phoneBook: [
		{ name: "Claude Lochard", telephone: "+352999999", streetAddress: "1, sous le pont", postalCode: "1000", addressLocality: "Luxembourg" },
		// { name: ..., ... },
		// { name: ..., ... },
		// ...
	],
};
