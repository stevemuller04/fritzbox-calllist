class LocalPhonebook {
	constructor() {
		this.contacts = [];
	}

	lookup(telephone, callback) {
		let matches = [];
		for (let i = 0; i < this.contacts.length; i++)
			if (phoneNumbersMatch(telephone, this.contacts[i].telephone))
				matches.push(this.contacts[i]);
		callback(null, matches);
	}

	add(contact) {
		this.contacts.push(contact);
	}
}

function phoneNumbersMatch(nr1, nr2) {
	// Remove non-digits and leading zeroes and leading pluses
	nr1 = nr1.replace(/[^0-9+]/g, '').replace(/^[0+]+/, '');
	nr2 = nr2.replace(/[^0-9+]/g, '').replace(/^[0+]+/, '');

	// Two numbers match if one is contained in the other
	return nr1.indexOf(nr2) >= 0 || nr2.indexOf(nr1) >= 0;
}

module.exports = LocalPhonebook;
