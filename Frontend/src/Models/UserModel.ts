import { Role } from "./enums";

export class UserModel {
    public _id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId: Role;
    constructor(user: UserModel) {
        this._id = user._id
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.password = user.password
        this.roleId = user.roleId
    }
}

