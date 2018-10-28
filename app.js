const CallListGetter = require("./lib/calllist/CallListGetter.js");
const CallListObserver = require("./lib/calllist/CallListObserver.js");
const CallType = require("./lib/calllist/CallType.js");
const Contact = require("./lib/phonebook/Contact.js");
const EditusPhonebook = require("./lib/phonebook/EditusPhonebook.js");
const CachedPhonebook = require("./lib/phonebook/CachedPhonebook.js");
const LocalPhonebook = require("./lib/phonebook/LocalPhonebook.js");
const MergedPhonebook = require("./lib/phonebook/MergedPhonebook.js");
const CallManager = require("./lib/CallManager.js");
const CallBroadcaster = require("./lib/server/CallBroadcaster.js");
const Server = require("./lib/server/Server.js");
const Config = require("./config.js");

// Initialise components
const localPhoneBook = new LocalPhonebook();
const phoneBook = new CachedPhonebook(new MergedPhonebook(localPhoneBook, new EditusPhonebook()));
const callManager = new CallManager(phoneBook);
const server = new Server(Config.webserver.port, callManager);
const callBroadcaster = new CallBroadcaster(server.server);
const callListObserver = new CallListObserver(new CallListGetter(Config.fritzbox.host, Config.fritzbox.username, Config.fritzbox.password));
callListObserver.on("call", call => callManager.addCall(call));
callManager.on("callInfo", callInfo => callBroadcaster.broadcast(callInfo));

// Register error handlers
callManager.on("error", console.error);
callListObserver.on("error", console.error);

// Populat local phone book
for (let contact of Config.phoneBook) {
	localPhoneBook.add(new Contact(contact.name, contact.telephone, contact.streetAddress, contact.postalCode, contact.addressLocality));
}

// Run
callListObserver.on("checked", () => setTimeout(callListObserver.check.bind(callListObserver), 1e3));
callListObserver.check();
server.start();
