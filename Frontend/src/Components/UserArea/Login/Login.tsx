import { useForm } from "react-hook-form";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { errorHandler } from "../../../Utils/ErrorHandler";
import { notify } from "../../../Utils/notify";
import "./Login.css";

export function Login(): JSX.Element {
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {
        try {
            await userService.login(credentials);
            notify.success("Welcome back!");
            navigate("/home");
        } catch (err: any) {
            const errorMessage = errorHandler.getError(err);
            notify.error(errorMessage);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send)}>
                <label>Email: </label>
                <input type="email" placeholder="please enter your email" {...register("email")} />

                <label>Password: </label>
                <input type="password" placeholder="please enter your password"{...register("password")} />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}
