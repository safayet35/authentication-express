import nodemailer from "nodemailer";
import { _config } from "../config/_config.js";

export const sendEmail = async (to, subject, html) => {
	if ((!_config.smtpHost || !_config.smtpPort || !_config.smtpUser, !_config.smtpPassword)) {
		console.log("Email envs are not available");
		return;
	}

	const { smtpHost, smtpPort, smtpPassword, smtpUser, emailFrom } = _config;

	const transporter = nodemailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: false,
		auth: {
			user: smtpUser,
			pass: smtpPassword
		}
	});

	await transporter.sendMail({
		from: emailFrom,
		to,
		subject,
		html
	});
};
