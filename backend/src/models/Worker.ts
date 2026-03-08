import mongoose, { Schema, Document } from 'mongoose';

export interface IWorker extends Document {
    name: string;
    role: string;
    contact: string;
    status: string;
    projectId: string;
    dailyRate: number;
    joinDate: Date;
    aadhar: string;
    daysWorked: number;
    paymentPending: number;
    experience: string;
}

const WorkerSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
    projectId: { type: String }, // Can be ObjectId if we link rigidly, but keeping string for loose coupling with mock data style
    dailyRate: { type: Number, required: true },
    joinDate: { type: Date, required: true },
    aadhar: { type: String },
    daysWorked: { type: Number, default: 0 },
    paymentPending: { type: Number, default: 0 },
    experience: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model<IWorker>('Worker', WorkerSchema);
