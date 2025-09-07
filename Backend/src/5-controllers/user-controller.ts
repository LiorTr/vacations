import express, { Request, Response, NextFunction } from "express";
import { UserModel, IUserModel } from "../3-models/user-model";
import { userService } from "../4-services/user-service";
import { StatusCode } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-model";
import { ValidationError, UnauthorizedError } from "../3-models/client-error";

class UserController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
    }

    private async register(request: Request, response: Response, next: NextFunction) {
        try {
            // Validate the request body
            const userData: IUserModel = request.body;
            const user = new UserModel(userData);
            await user.validate(); // Validate before proceeding

            const token = await userService.register(user);
            response.status(StatusCode.Created).json({ token });
        } catch (err) {
            if (err instanceof ValidationError) {
                response.status(StatusCode.BadRequest).json({ message: err.message });
            } else {
                next(err);
            }
        }
    }

    private async login(request: Request, response: Response, next: NextFunction) {
        try {
            // Validate the request body
            const credentials = new CredentialsModel(request.body);

            const token = await userService.login(credentials);
            response.json({ token });
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                response.status(StatusCode.Unauthorized).json({ message: err.message });
            } else {
                next(err);
            }
        }
    }
}

export const userController = new UserController();
