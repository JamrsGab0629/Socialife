import User from "./user.model.js";
import Otp from "./otp.model.js";

// A User has one OTP verification record, and an OTP belongs to a User
User.hasOne(Otp, { foreignKey: "user_id", as: "otpRecord", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "user_id", as: "user" });


// User A initiates
User.belongsToMany(User, {
  as: 'SentRequests',
  through: Friendship,
  foreignKey: 'requester_id',
  otherKey: 'addressee_id',
});

// User A receives
User.belongsToMany(User, {
  as: 'ReceivedRequests',
  through: Friendship,
  foreignKey: 'addressee_id',
  otherKey: 'requester_id',
});

export { User, Otp };