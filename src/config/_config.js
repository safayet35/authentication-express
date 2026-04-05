import dotenv from "dotenv";
dotenv.config();

export const _config = {
	mongodbUri: process.env.MONGODB_URI,
	port: process.env.PORT
};
