import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { hashPassword, checkPassword } from "../../lib/hash.js";
import { _config } from "../../config/_config.js";
import { sendEmail } from "../../lib/email.js";
import { createAccessToken, createRefreshToken } from "../../lib/token.js";
function getAppUrl() {
	return _config.appUrl || `http://localhost:${_config.port}`;
}

export const registerHandler = async (req, res) => {
	try {
		const result = registerSchema.safeParse(req.body);

		// check validation
		if (!result.success) {
			return res.status(400).json({
				message: "Invalid data",
				error: result.error.flatten()
			});
		}

		const { name, email, password } = result.data;
		const normalizedEmail = email.toLowerCase().trim();
		const existingUser = await User.findOne({ email: normalizedEmail });

		// check existing user

		if (existingUser) {
			return res.status(409).json({
				message: "Email is already in use! Please try with a different email"
			});
		}
		// hashing the password
		const passwordHash = await hashPassword(password);

		// create a new user
		const newUser = await User.create({
			name,
			email: normalizedEmail,
			password: passwordHash
		});

		// email verification

		const verifyToken = jwt.sign(
			{
				id: newUser._id
			},
			_config.jwtAccessSecret,
			{ expiresIn: "1d" }
		);

		// create a verification url

		const verifyUrl = `${getAppUrl()}/auth/verify-email?token=${verifyToken}`;

		// sending verification email

		await sendEmail(
			newUser.email,
			"Verify your email",

			`<div>
			<p>Please verify your email by clicking this url: </p>
<a href="${verifyUrl}">${verifyUrl}</a>
			
			</div>
			`
		);

		return res.status(201).json({
			message: "User registered",
			user: {
				id: newUser._id,
				email: newUser.email,
				role: newUser.role,
				isEmailVerified: newUser.isEmailVerified
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal server error"
		});
	}
};

export const verifyEmailHandler = async (req, res) => {
	try {
		const token = req.query.token;

		if (!token) {
			return res.status(400).json({
				message: "token in missing"
			});
		}

		const payload = jwt.verify(token, _config.jwtAccessSecret);

		const user = await User.findById(payload.id);

		if (!user) {
			return res.status(400).json({
				message: "User not found"
			});
		}
		if (user.isEmailVerified) {
			res.status(400).json({
				message: "Email is already verified"
			});
		}

		user.isEmailVerified = true;

		await user.save();

		return res.status(200).json({
			message: "Email verification successfully"
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal server error"
		});
	}
};

export const loginHandler = async (req, res) => {
	try {
		const result = loginSchema.safeParse(req.body);

		// check validation

		if (!result.success) {
			return res.status(400).json({
				message: "Invalid data",
				error: result.error.flatten()
			});
		}

		const { email, password } = result.data;

		const normalizedEmail = email.toLowerCase().trim();
		const existingUser = await User.findOne({ email: normalizedEmail });

		// check existing user

		if (!existingUser) {
			return res.status(400).json({
				message: "Invalid email or password"
			});
		}
		// check password

		const isCorrectPassword = checkPassword(password, existingUser.password);

		if (!isCorrectPassword) {
			return res.status(400).json({
				message: "Invalid email or password"
			});
		}

		// check user email verification

		if (!existingUser.isEmailVerified) {
			return res.status(403).json({
				message: "Please verify your email address"
			});
		}

		// create access and refresh token

		const accessToken = await createAccessToken(existingUser._id, existingUser.role, existingUser.tokenVersion);

		const refreshToken = await createRefreshToken(existingUser._id, existingUser.tokenVersion);

		// check production or not
		const isProd = _config.isProduction === "production";

		res.cookie("refreshToken", {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		return res.status(200).json({
			message: "Login successfully",
			accessToken,
			user: {
				id: existingUser._id,
				email: existingUser.email,
				role: existingUser.role,
				isEmailVerified: existingUser.isEmailVerified,
				twoFactorEnabled: existingUser.twoFactorEnabled
			}
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal server error"
		});
	}
};
