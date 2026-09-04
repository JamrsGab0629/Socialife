import User from "./user.model.js";
import Otp from "./otp.model.js";
import Friendship from "./friend.model.js"; // Make sure this is imported if used below
import Post from "./post.model.js";
import PhotoData from "./photo_data.model.js";

// --- OTP Associations ---
User.hasOne(Otp, { foreignKey: "user_id", as: "otpRecord", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "user_id", as: "user" });

// --- Friendship Associations ---
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


User.hasMany(Post, { foreignKey: "user_id", as: "posts", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", as: "author" });

// A User can have many uploaded photos
User.hasMany(PhotoData, { foreignKey: "user_id", as: "photos", onDelete: "CASCADE" });
PhotoData.belongsTo(User, { foreignKey: "user_id", as: "uploader" });

// A Post has one Photo (since you limited it to 1 image per post)
Post.hasOne(PhotoData, { foreignKey: "post_id", as: "photo", onDelete: "CASCADE" });
PhotoData.belongsTo(Post, { foreignKey: "post_id", as: "post" });

export { User, Otp, Friendship, Post, PhotoData };