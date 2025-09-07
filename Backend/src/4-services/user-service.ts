import { UserModel, IUserModel } from "../3-models/user-model"; // Adjust the import path as necessary
import { Role } from "../3-models/enums";
import { cyber } from "../2-utils/cyber";
import { CredentialsModel } from "../3-models/credentials-model";
import { UnauthorizedError, ValidationError } from "../3-models/client-error";
import { validators } from "../3-models/validate";

class UserService {

    // Register new user: 
    public async register(user: IUserModel) {
        // Validate plain-text password
        const passwordValid = validators.passwordValidator.validator(user.password);
        if (!passwordValid) {
            console.error(`Password validation failed: ${user.password}`);
            throw new ValidationError('Password must contain at least one lowercase letter, one uppercase letter, one special character, and be at least four characters long.');
        }

        console.log(`Password is valid: ${user.password}`);

        // Set role as regular user and not something else: 
        user.roleId = Role.User;

        // Hash password: 
        const hashedPassword = cyber.hash(user.password);
        console.log(`Hashed password: ${hashedPassword}`);
        user.password = hashedPassword;

        // Create new user document:
        const newUser = new UserModel(user);

        // Save user to the database:
        const savedUser = await newUser.save();

        // Create JWT (Json Web Token): 
        const token = cyber.generateNewToken(savedUser);

        // Return:
        return token;
    }

    // User login:
    public async login(credentials: CredentialsModel) {
        // Hash password:
        const hashedPassword = cyber.hash(credentials.password);
        console.log(`Hashed password for login: ${hashedPassword}`);

        // Find user by email and password:
        const user = await UserModel.findOne({ email: credentials.email, password: hashedPassword }).exec();

        // If no user: 
        if (!user) {
            console.error(`User not found for email: ${credentials.email}`);
            throw new UnauthorizedError("Incorrect email or password.");
        }

        // Create JWT (Json Web Token): 
        const token = cyber.generateNewToken(user);

        // Return:
        return token;
    }
}

export const userService = new UserService();
