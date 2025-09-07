import { Document, Schema, model } from 'mongoose';

export interface IVacationModel extends Document {
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    image: string;
}

export const VacationSchema = new Schema<IVacationModel>(
    {
        destination: {
            type: String,
            required: [true, 'Destination is required'],
            minlength: [2, 'Destination must be at least 2 characters long'],
            maxlength: [100, 'Destination cannot be longer than 100 characters'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [10, 'Description must be at least 10 characters long'],
            maxlength: [1000, 'Description cannot be longer than 1000 characters'],
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
            validate: {
                validator: function (endDate: Date) {
                    return endDate > this.startDate;
                },
                message: 'End date must be after start date',
            },
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number'],
        },
        image: {
            type: String,
            required: [true, 'Image name is required'],
            trim: true,
        },
    },
    { versionKey: false }
);

export const VacationModel = model<IVacationModel>(
    'VacationModel',
    VacationSchema,
    'vacations'
);
