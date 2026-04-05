import { connectDb } from "./config/db.js";
import { _config } from "./config/_config.js";
import app from "./app.js";
import http from "http";

const startServer = async () => {
	await connectDb();

	const server = http.createServer(app);

	server.listen(_config.port, () => {
		console.log(`Server is now listening to port ${_config.port}`);
	});
};

startServer().catch(error => {
	console.log("Error while starting the server", error);
	process.exit(1);
});
