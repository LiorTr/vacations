import { useForm } from "react-hook-form";
import "./AddVacation.css";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/notify";
import { errorHandler } from "../../../Utils/ErrorHandler";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationsService";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/store";
import { UserModel } from "../../../Models/UserModel";

export function AddVacation() {
  const user = useSelector<AppState, UserModel | null>((state) => state.user);

  const { register, handleSubmit } = useForm<VacationModel>();
  const navigate = useNavigate();

  if (!user || user.roleId !== 1) {
    return null; // Or an unauthorized message if you want
  }

  const send = async (vacation: VacationModel) => {
    try {
      vacation.image = (vacation.image as unknown as FileList)[0];
      await vacationService.addVacation(vacation);
      notify.success("Vacation added successfully");
      navigate("/home");
    } catch (err) {
      errorHandler.getError(err);
    }
  };

  return (
    <div className="AddVacation">
      <form onSubmit={handleSubmit(send)}>
        <label>Destination: </label>
        <input
          type="text"
          {...register("destination")}
          required
          minLength={2}
          maxLength={100}
        />

        <label>Description: </label>
        <input
          type="textarea"
          {...register("description")}
          required
          min={0}
          max={1000}
        />

        <label>Start on: </label>
        <input type="datetime-local" {...register("startDate")} required />
        <label>End on: </label>
        <input type="datetime-local" {...register("endDate")} required />
        <label>Price: </label>
        <input type="number" {...register("price")} required />

        <label>Image: </label>
        <input type="file" accept="image/*" {...register("image")} required />

        <button>Add</button>
        <button onClick={() => {}}>Cancel</button>
      </form>
    </div>
  );
}
