// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["farmer", "consumer", "admin"], default: "consumer" },
  location: String,
  status: { type: String, enum: ["active", "banned"], default: "active" },      // 🆕
  restrictedUntil: { type: Date, default: null },                               // 🆕
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
