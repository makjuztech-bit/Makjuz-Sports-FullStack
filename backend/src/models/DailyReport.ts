import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyReport extends Document {
    date: Date;
    projectId: string;
    projectName: string;
    workPerformed: string;
    workersPresent: string[];
    materialsUsed: { name: string; quantity: number; unit: string }[];
    photos: string[];
    issues: string;
    remarks: string;
    createdBy: string;
}

const DailyReportSchema: Schema = new Schema({
    date: { type: Date, required: true },
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    workPerformed: { type: String, required: true },
    workersPresent: [{ type: String }],
    materialsUsed: [{
        name: String,
        quantity: Number,
        unit: String,
        _id: false
    }],
    photos: [{ type: String }],
    issues: { type: String },
    remarks: { type: String },
    createdBy: { type: String, required: true },
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

export default mongoose.model<IDailyReport>('DailyReport', DailyReportSchema);
