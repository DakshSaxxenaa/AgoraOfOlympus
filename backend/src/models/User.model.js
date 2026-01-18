import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    avatar: {
      type: String,
      default: ""
    },
    inventory: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        rated: { type: Boolean, default: false },
        rating: { type: Number, default: 0 }
      }
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],
    ratingsReceived: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 }
      }
    ],
    wishlist: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Item" 
      }
    ],
    reputation: {
      totalRatings: { type: Number, default: 0 },
      ratingSum: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      badges: [{ type: String }]
    },
    tradeCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
