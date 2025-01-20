import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  rollNumber: string;
  name: string;
  mobileNumber: string;
  isCricketSelected: boolean;
  password: string;
  rating: number;
  votesReceived: number;
  hasVoted: boolean;
  isSold: boolean;
  team: mongoose.Types.ObjectId | null;
  soldPrice: number;
}

const UserSchema: Schema = new Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  isCricketSelected: { type: Boolean, required: true },
  password: { type: String, required: true },
  rating: { type: Number, default: 0 },
  votesReceived: { type: Number, default: 0 },
  hasVoted: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  soldPrice: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);


// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUser extends Document {
//   rollNumber: string;
//   name: string;
//   mobileNumber: string;
//   isCricketSelected: boolean;
//   password: string;
//   rating: number;
//   votesReceived: number;
//   hasVoted: boolean;
//   isSold: boolean;
// }

// const UserSchema: Schema = new Schema({
//   rollNumber: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   isCricketChoosen: { type: Boolean, required: true },
//   password: { type: String, required: true },
//   rating: { type: Number, default: 0 },
//   votesReceived: { type: Number, default: 0 },
//   hasVoted: { type: Boolean, default: false },
//   isSold: { type: Boolean, default: false },
// });

// export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

