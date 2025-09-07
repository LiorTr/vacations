import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { store, userActions } from "../Redux/store";
import { jwtDecode } from "jwt-decode";

import { CredentialsModel } from "../Models/CredentialsModel";
import { notify } from "../Utils/notify";

class UserService {
    public constructor() {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const container = jwtDecode<{ user: UserModel }>(token);
                const dbUser = container.user;

                // Check if the user object is valid
                if (dbUser && dbUser._id) {
                    // Dispatch the complete user object
                    store.dispatch(userActions.initUser(dbUser));
                } else {
                    console.warn("Invalid user data:", dbUser);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
            }
        }
    }

    public async register(user: UserModel) {
        const response = await axios.post<{ token: string }>(appConfig.registerUrl, user);
        const token = response.data.token;
        if (token) localStorage.setItem("token", token);
        const container = jwtDecode<{ user: UserModel }>(token);
        const dbUser = container.user;

        if (dbUser) {
            store.dispatch(userActions.initUser(dbUser)); // Dispatch the complete user object
        }
    }

    public async login(credentials: CredentialsModel): Promise<UserModel> {
        try {
            const response = await axios.post<{ token: string }>(appConfig.loginUrl, credentials);
            const token = response.data.token;
            if (token) localStorage.setItem("token", token);
            const container = jwtDecode<any>(token);
            const dbUser: UserModel = {
                _id: container.id,
                firstName: container.firstName,
                lastName: container.lastName,
                email: container.email,
                password: '',
                roleId: container.roleId // Ensure all properties are included
            };

            store.dispatch(userActions.initUser(dbUser)); // Dispatch the complete user object
            return dbUser;
        } catch (error) {
            console.error('Error in login method:', error);
            throw error;
        }
    }

    public logout() {
        localStorage.removeItem("token");
        store.dispatch(userActions.logoutUser());
    }
}

export const userService = new UserService();
