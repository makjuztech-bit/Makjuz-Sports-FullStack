import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    minStock: number;
    supplier: string;
    lastUpdated: Date;
}

const MaterialSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    minStock: { type: Number, required: true, default: 0 },
    supplier: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
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

export default mongoose.model<IMaterial>('Material', MaterialSchema);
