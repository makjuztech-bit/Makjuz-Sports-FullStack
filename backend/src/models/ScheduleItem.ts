import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleItem extends Document {
    startDate: Date;
    endDate: Date;
    projectId: string;
    projectName: string;
    work: string;
    workers: string[];
    materials: { name: string; quantity: number; unit: string }[];
    deliveryMaterials: { name: string; quantity: number; unit: string }[];
    status: string;
}

const ScheduleItemSchema: Schema = new Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    work: { type: String, required: true },
    workers: [{ type: String }], // Names of workers
    materials: [{
        name: String,
        quantity: Number,
        unit: String,
        _id: false
    }],
    deliveryMaterials: [{
        name: String,
        quantity: Number,
        unit: String,
        _id: false
    }],
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed', 'Delayed'], default: 'Scheduled' },
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

export default mongoose.model<IScheduleItem>('ScheduleItem', ScheduleItemSchema);
