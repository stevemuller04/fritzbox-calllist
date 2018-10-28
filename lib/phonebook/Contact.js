class Contact {
	constructor(name, telephone, streetAddress, postalCode, addressLocality) {
		this.name = name || "";
		this.telephone = telephone || "";
		this.streetAddress = streetAddress || "";
		this.postalCode = postalCode || "";
		this.addressLocality = addressLocality || "";
	}
}

module.exports = Contact;
