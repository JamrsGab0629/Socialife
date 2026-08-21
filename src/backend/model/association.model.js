import User from "./user.model.js";
import Otp from "./otp.model.js";

// A User has one OTP verification record, and an OTP belongs to a User
User.hasOne(Otp, { foreignKey: "user_id", as: "otpRecord", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { User, Otp };