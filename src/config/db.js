import mongoose from "mongoose";
import { _config } from "./_config.js";

export const connectDb = async () => {
	try {
		await mongoose.connect(_config.mongodbUri);
		console.log("Mongodb connected successfully")
	} catch (e) {
		console.log("Mongodb connection error!");
		process.exit(1);
	}
};
