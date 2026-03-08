import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
    name: string;
    contact: string;
    email: string;
    materials: string[];
    rating: number;
    amountPaid: number;
    notes: string;
    yearsInTouch: number;
    experience: string;
    location: string;
}

const SupplierSchema: Schema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    materials: [{ type: String }],
    rating: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    notes: { type: String },
    yearsInTouch: { type: Number, default: 0 },
    experience: { type: String },
    location: { type: String },
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

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
