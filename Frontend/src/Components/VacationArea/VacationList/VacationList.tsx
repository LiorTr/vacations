import { useEffect, useState } from "react";
import "./VacationList.css";
import { VacationCard } from "../VacationCard/VacationCard";
import { notify } from "../../../Utils/notify";
import { errorHandler } from "../../../Utils/ErrorHandler";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationsService";

export function VacationList(): JSX.Element {



    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        // Fetch vacations and likes concurrently
        vacationService.getVacations()
            .then(vacations => {
                setVacations(vacations);
                setLoading(false)
            })
            .catch(err => {
                notify.error(errorHandler.getError(err));
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="vacationList">
            {vacations.length > 0 ? (
                vacations.map((vacation: VacationModel) => (
                    <VacationCard
                        key={vacation._id}
                        _id={vacation._id}
                        destination={vacation.destination}
                        description={vacation.description}
                        startDate={vacation.startDate}
                        endDate={vacation.endDate}
                        price={vacation.price}
                        image={vacation.image as string}
                        likesCount={vacation.likesCount}
                        likes={vacation.likes}
                    />
                ))
            ) : (
                <div>No vacations available</div>
            )}
        </div>
    );
}
