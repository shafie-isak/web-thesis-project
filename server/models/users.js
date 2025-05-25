import mongoose from 'mongoose';


const Userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    joinedAt: { type: Date, default: Date.now },  
    role: { type: String, default: "user"},  
    // 🔥 NEW FIELDS
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: String, default: "Beginner" },
    badges: [{ type: String }]
  }, { timestamps: true });
  
const User = mongoose.model('User', Userschema);

export default User;