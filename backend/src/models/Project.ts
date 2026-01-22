import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    name: string;
    turfType: string;
    location: string;
    startDate: Date;
    expectedCompletion: Date;
    status: string;
    progress: number;
    budget: number;
    spent: number;
    managerId: string;
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    turfType: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    expectedCompletion: { type: Date, required: true },
    status: { type: String, required: true, default: 'Planning' },
    progress: { type: Number, default: 0 },
    budget: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    managerId: { type: String, required: true, default: 'USR001' },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true
    }
});

export default mongoose.model<IProject>('Project', ProjectSchema);
