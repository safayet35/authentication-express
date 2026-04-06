import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true
		},
		password: {
			type: String,
			trim: true,
			required: true
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user"
		},
		isEmailVerified: {
			type: Boolean,
			default: false
		},
		isTwoFactorEnabled: {
			type: Boolean,
			default: false
		},
		twoFactorSecret: {
			type: String,
			default: undefined
		},
		tokenVersion: {
			type: Number,
			default: 0
		},
		resetPasswordToken: {
			type: String,
			default: undefined
		},
		resetPasswordExpiry: {
			type: Date,
			default: undefined
		}
	},
	{ timestamps: true }
);


const User = model("User",userSchema)

export default User