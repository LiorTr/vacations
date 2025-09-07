import { validators } from './validate';
import { Document, Schema, model } from "mongoose";
import { Role } from "./enums";



export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: Role;
}

export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "Missing  first name."],
        minlength: [2, "first name to short"],
        maxlength: [50, "Name too long."],
        validate: validators.nameValidator,
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Missing last name."],
        minlength: [2, "Last name to short"],
        maxlength: [50, "Name too long."],
        validate: validators.nameValidator,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Missing email."],
        maxlength: [80, "email too long."],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Missing password."],
        validate: validators.passwordValidator,
    },
    roleId: {
        type: Number,
        required: [true, "Missing role."],
        default: Role.User,
    },


}, {
    versionKey: false,
    timestamps: true,

});


export const UserModel = model<IUserModel>("UserModel", UserSchema, "users"); 
