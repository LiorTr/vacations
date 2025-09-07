import { useForm } from "react-hook-form";
import "./Register.css";
import { UserModel } from "../../../Models/UserModel";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/notify";
import { errorHandler } from "../../../Utils/ErrorHandler";

export function Register() {

    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    async function send(user: UserModel) {
        try {
            await userService.register(user);
            notify.success("Welcome " + user.firstName);
            navigate("/home");
        }
        catch (err: any) {
            notify.error(errorHandler.getError(err));
        }
    }

    return (
        <div className="Register">

            <form onSubmit={handleSubmit(send)}>

                <label>First name: </label>
                <input type="text" placeholder="please enter your first name"{...register("firstName")} />

                <label>Last name: </label>
                <input type="text" placeholder="please enter your last name"{...register("lastName")} />

                <label>Email: </label>
                <input type="email" placeholder="please enter your email"{...register("email")} />

                <label>Password: </label>
                <input type="password" placeholder="please enter your password" {...register("password")} />

                <button>Register</button>

            </form>
        </div>
    );
}
