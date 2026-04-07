import jwt from "jsonwebtoken";
import { _config } from "../config/_config.js";
export const createAccessToken = async (userId, role, tokenVersion) => {
	const payload = { id: userId, role, tokenVersion };

	return jwt.sign(payload, _config.jwtAccessSecret, { expiresIn: "30m" });
};

export const createRefreshToken = async (userId, tokenVersion) => {
	const payload = { id: userId, tokenVersion };

	return jwt.sign(payload, _config.jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = async token => {
	
	return jwt.verify(token, _config.jwtRefreshSecret);
};
