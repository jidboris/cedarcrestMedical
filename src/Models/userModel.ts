import mongoose, { Schema } from "mongoose";
import UserType from "../Interface/userType";

const userSchema = new Schema<UserType>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    passwordDigest: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false},
    verificationCode: { type: Number, select: false },
    role: {type: String, enum:{ values: ['userNormal','userAdmin', 'superAdmin', 'owner'], 
    default: 'userNormal', message: `{VALUE} is not suported`}},
    location: { type: String, trim: true, maxlength: 20, default: "my city" },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
