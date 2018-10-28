const http = require("http");
const fs = require("fs");

const MAX_NUM_RESULTS = 30; // maximum number of results to return

class Server {
	constructor(port, callManager) {
		this.port = port;
		this.callManager = callManager;
		this.server = http.createServer(this._handle.bind(this));
	}

	start() {
		this.server.listen(this.port);
	}

	_handle(request, response) {
		switch (request.method.toUpperCase()) {
			case "GET": return this._handleGet(request, response);
			default:
				response.writeHead(405, { "Content-Type": "text/plain;charset=utf-8" });
				response.write("405 Method Not Allowed\r\n");
				response.end();
				break;
		}
	}

	_handleGet(request, response) {
		switch (request.url) {
			case "":
			case "/":
				return this._serveStatic(__dirname + "/../../static/index.html", "text/html;charset=utf-8", response);
			case "/calls":
				return this._serveCallList(response);
			default:
				response.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
				response.end("404 Not Found\r\n");
				break;
		}
	}

	_serveStatic(filename, contentType, response) {
		fs.readFile(filename, (err, data) => {
			if (err) {
				response.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
				response.end("404 Not Found\r\n");
			}
			else {
				response.writeHead(200, { "Content-Type": contentType });
				response.end(data);
			}
		});
	}

	_serveCallList(response) {
		response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
		response.end(JSON.stringify(this.callManager.getCalls().slice(0, MAX_NUM_RESULTS)));
	}
}

module.exports = Server;
