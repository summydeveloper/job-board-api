import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from '../models/user.model'; // Assuming you have a user model with IUser interface

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  jobType: 'Full-Time' | 'Part-Time' | 'Contract';
  createdBy: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema: Schema<IJob> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    company: {
      type: String,
      required: [true, 'Please specify the company'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    salary: {
      type: Number,
      default: 0,
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract'],
      default: 'Full-Time',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);
export default Job;
