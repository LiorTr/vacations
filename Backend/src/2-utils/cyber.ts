import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { IUserModel } from "../3-models/user-model";
import { Role } from "../3-models/enums";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class Cyber {

    private secretKey: string;
    private hashingSalt: string;

    constructor() {
        if (!process.env.JWT_SECRET_KEY || !process.env.PASSWORD_SALT) {
            throw new Error("Missing JWT_SECRET_KEY or PASSWORD_SALT in environment variables.");
        }

        this.secretKey = process.env.JWT_SECRET_KEY;
        this.hashingSalt = process.env.PASSWORD_SALT;
    }

    // Hash with salt:
    public hash(plainText: string): string {
        return crypto.createHmac("sha512", this.hashingSalt).update(plainText).digest("hex");
    }

    // Generate new JWT token:
    public generateNewToken(user: IUserModel): string {
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleId: user.roleId
        };

        const options: SignOptions = { expiresIn: "3h" };
        const token = jwt.sign(payload, this.secretKey, options);

        console.log(`Generated Token: ${token}`);  // Log for debugging
        return token;
    }

    // Is token valid:
    public isTokenValid(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, this.secretKey);
            return true;
        } catch (err: any) {
            return false;
        }
    }

    // Is user admin:
    public isAdmin(token: string): boolean {
        try {
            const payload = jwt.decode(token) as { roleId: Role };
            return payload.roleId === Role.Admin;
        } catch (err: any) {
            return false;
        }
    }

}

export const cyber = new Cyber();
