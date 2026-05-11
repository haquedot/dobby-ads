import app from "./app.js";
import connectDB from "./config/db.js";

let isConnected = false;

const initDb = async () => {
	if (isConnected) {
		return;
	}

	await connectDB(process.env.MONGO_URI);
	isConnected = true;
};

export default async function handler(req, res) {
	await initDb();
	return app(req, res);
}
