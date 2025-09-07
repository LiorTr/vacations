import { Document, Schema, model } from 'mongoose';

export interface ILikeModel extends Document {
    userId: string;
    vacationId: Schema.Types.ObjectId; // Use ObjectId type here
}

export const LikeSchema = new Schema<ILikeModel>(
    {
        userId: {
            type: String,
            required: true,
        },
        vacationId: {
            type: Schema.Types.ObjectId,
            ref: 'VacationModel',
            required: true,
        },
    },
    { versionKey: false }
);

export const LikeModel = model<ILikeModel>('LikeModel', LikeSchema, 'likes');
