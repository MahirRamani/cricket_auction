import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  voterId: string;
  playerId: string;
  rating: number;
}

const RatingSchema: Schema = new Schema({
  voterId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);