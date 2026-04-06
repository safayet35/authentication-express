import bcrypt from "bcryptjs";

export const hashPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

export const checkPassword = async (password, hashPassword) => {
	return await bcrypt.compare(password, hashPassword);
};
