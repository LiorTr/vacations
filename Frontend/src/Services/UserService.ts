import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { store, userActions } from "../Redux/store";
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from "../Models/CredentialsModel";

class UserService {
    public constructor() {
        const token = localStorage.getItem("token");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // ✅ חשוב מאוד

            try {
                const container = jwtDecode<any>(token);
                const dbUser: UserModel = {
                    _id: container.id,
                    firstName: container.firstName,
                    lastName: container.lastName,
                    email: container.email,
                    password: "",
                    roleId: container.roleId
                };

                store.dispatch(userActions.initUser(dbUser));
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
            }
        }
    }

    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<{ token: string }>(appConfig.registerUrl, user);
        const token = response.data.token;

        if (token) {
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // ✅ הוספת הטוקן לבקשות עתידיות

            const container = jwtDecode<any>(token);
            const dbUser: UserModel = {
                _id: container.id,
                firstName: container.firstName,
                lastName: container.lastName,
                email: container.email,
                password: '',
                roleId: container.roleId
            };

            store.dispatch(userActions.initUser(dbUser));
        }
    }

    public async login(credentials: CredentialsModel): Promise<UserModel> {
        const response = await axios.post<{ token: string }>(appConfig.loginUrl, credentials);
        const token = response.data.token;

        if (token) {
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const container = jwtDecode<any>(token);
            const dbUser: UserModel = {
                _id: container.id,
                firstName: container.firstName,
                lastName: container.lastName,
                email: container.email,
                password: '',
                roleId: container.roleId
            };

            store.dispatch(userActions.initUser(dbUser));
            return dbUser;
        }

        throw new Error("Login failed");
    }

    public logout(): void {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        store.dispatch(userActions.logoutUser());
    }
}

export const userService = new UserService();
