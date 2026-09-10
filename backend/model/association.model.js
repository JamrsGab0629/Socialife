import User from "./user.model.js";
import Otp from "./otp.model.js";
import Friendship from "./friend.model.js";
import Post from "./post.model.js";
import PhotoData from "./photo_data.model.js";
import SavedPost from "./savedPost.model.js";
import SharedPost from "./shared_post.model.js"; 
import LikeData from "./like_data.model.js";        
import CommentData from "./comment_data.model.js"; 

// --- OTP Associations ---
User.hasOne(Otp, { foreignKey: "user_id", as: "otpRecord", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "user_id", as: "user" });

// --- Friendship Associations ---
User.belongsToMany(User, {
  as: 'SentRequests',
  through: Friendship,
  foreignKey: 'requester_id',
  otherKey: 'addressee_id',
});

User.belongsToMany(User, {
  as: 'ReceivedRequests',
  through: Friendship,
  foreignKey: 'addressee_id',
  otherKey: 'requester_id',
});

// --- Post & User Associations ---
User.hasMany(Post, { foreignKey: "user_id", as: "posts", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", as: "author" });

// --- Photo Associations ---
User.hasMany(PhotoData, { foreignKey: "user_id", as: "photos", onDelete: "CASCADE" });
PhotoData.belongsTo(User, { foreignKey: "user_id", as: "uploader" });

Post.hasOne(PhotoData, { foreignKey: "post_id", as: "photo", onDelete: "CASCADE" });
PhotoData.belongsTo(Post, { foreignKey: "post_id", as: "post" });

// --- Saved Posts Associations ---
User.hasMany(SavedPost, { foreignKey: "user_id", as: "savedPosts", onDelete: "CASCADE" });
SavedPost.belongsTo(User, { foreignKey: "user_id", as: "user" });

Post.hasMany(SavedPost, { foreignKey: "post_id", as: "saves", onDelete: "CASCADE" });
SavedPost.belongsTo(Post, { foreignKey: "post_id", as: "post" });

// --- Shared Posts Associations ---
User.hasMany(SharedPost, { foreignKey: "user_id", as: "sharedPosts", onDelete: "CASCADE" });
SharedPost.belongsTo(User, { foreignKey: "user_id", as: "user" });

Post.hasMany(SharedPost, { foreignKey: "post_id", as: "shares", onDelete: "CASCADE" });
SharedPost.belongsTo(Post, { foreignKey: "post_id", as: "post" });

// --- Like Associations ---
Post.hasMany(LikeData, { foreignKey: "post_id", as: "likes", onDelete: "CASCADE" });
LikeData.belongsTo(Post, { foreignKey: "post_id", as: "post" });

User.hasMany(LikeData, { foreignKey: "user_id", as: "likes", onDelete: "CASCADE" });
LikeData.belongsTo(User, { foreignKey: "user_id", as: "user" });

// --- Comment Associations ---
Post.hasMany(CommentData, { foreignKey: "post_id", as: "comments", onDelete: "CASCADE" });
CommentData.belongsTo(Post, { foreignKey: "post_id", as: "post" });

User.hasMany(CommentData, { foreignKey: "author_id", as: "comments", onDelete: "CASCADE" });
CommentData.belongsTo(User, { foreignKey: "author_id", as: "author" });

Friendship.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });
Friendship.belongsTo(User, { foreignKey: 'addressee_id', as: 'addressee' });

export { 
    User, 
    Otp, 
    Friendship, 
    Post, 
    PhotoData, 
    SavedPost,
    SharedPost, 
    LikeData, 
    CommentData 
};