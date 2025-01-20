import mongoose, { Schema, type Document } from "mongoose"
import Player from '@/models/User';

export interface IPlayer {
    playerName: string;
    price: number;
  }
  
  export interface ITeam extends Document {
    name: string;
    budget: number;
    players: IPlayer[];
  }
  
  const PlayerSchema: Schema = new Schema({
    playerName: { type: String, required: true },
    price: { type: Number, required: true },
  });
  
  const TeamSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    budget: { type: Number, required: true, default: 1000000 }, // Default budget of 10 lakhs
    players: { type: [PlayerSchema], default: [{ name: "Default Player", price: 100000 }] },
  });

export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema)

