import dotenv from "dotenv";
dotenv.config();

export const _config = {
	mongodbUri: process.env.MONGODB_URI,
	port: process.env.PORT,
	smtpHost: process.env.SMTP_HOST,
	smtpPort: process.env.SMTP_PORT,
	smtpUser: process.env.SMTP_USER,
	smtpHost: process.env.SMTP_HOST,
	smtpPassword: process.env.SMTP_PASS,
	emailFrom: process.env.EMAIL_FROM,
	jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	isProduction: process.env.NODE_ENV
};
