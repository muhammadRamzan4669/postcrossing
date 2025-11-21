import mongoose, { Schema, Model } from "mongoose";

// export interface IUser {
//   _id: mongoose.Types.ObjectId;
//   fullName: string;
//   email: string;
//   password: string;
//   city: string;
//   postalCode: string;
//   avatar?: string;
//   bio?: string;
//   country: string;
//   username: string;
//   postcardsSent: number;
//   postcardsReceived: number;
//   postcardsTraveling: number;
//   joinedAt: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   address: string;
// }
//
// const userSchema = new Schema<IUser>(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       unique: true,
//     },
//     fullName: { type: String, required: true },
//     country: { type: String, required: true },
//     city: { type: String, required: true },
//     address: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     bio: { type: String, default: '' },
//     avatar: { type: String, default: '' },
//     postcardsSent: { type: Number, default: 0 },
//     postcardsReceived: { type: Number, default: 0 },
//     postcardsTraveling: { type: Number, default: 0 },
//     joinedAt: { type: Date, default: Date.now },
//   }
//   , { timestamps: true },
// )
//
// userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });
// userSchema.index({ country: 1 });
//
// const User: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);
//
// export default User;

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  country: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    countryCode: string;
  };
  profileImage?: string;
  bio?: string;

  stats: {
    postcardsSent: number;
    postcardsReceived: number;
    totalTravelDistance: number;
    joinDate: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
      match: [/^[a-z0-9_-]+$/i, 'Username can only contain letters, numbers, underscores, and dashes'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 60,
      select: false,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
        trim: true,
      },
      countryCode: {
        type: String,
        required: [true, 'Country code is required'],
        uppercase: true,
        length: 2,
      },
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio must not exceed 500 characters'],
      default: '',
    },
    stats: {
      postcardsSent: {
        type: Number,
        default: 0,
        min: 0,
      },
      postcardsReceived: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalTravelDistance: {
        type: Number,
        default: 0,
        min: 0,
      },
      joinDate: {
        type: Date,
        default: () => new Date(),
      },
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'address.countryCode': 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User; 
