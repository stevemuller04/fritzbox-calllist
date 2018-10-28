const WebSocketServer = require("websocket").server;

class CallBroadcaster {
	constructor(httpServer) {
		this.ws = new WebSocketServer({ httpServer: httpServer, autoAcceptConnections: true });
	}

	broadcast(callInfo) {
		let data = JSON.stringify(callInfo);
		this.ws.broadcast(data);
	}
}

module.exports = CallBroadcaster;
