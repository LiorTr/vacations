import axios from 'axios';
import { appConfig } from '../Utils/AppConfig';
import { VacationModel } from '../Models/VacationModel';
import { store, vacationsActions } from '../Redux/store';

class VacationService {
    async getVacations(): Promise<VacationModel[]> {
        // If vacations are already in store, return them
        if (store.getState().vacations.length > 0) {
            return store.getState().vacations;
        }

        // Get vacations from backend and assert the response type
        const response = await axios.get(appConfig.vacationsUrl);

        // Assert the response.data as an array of VacationModel
        const data = response.data as VacationModel[];

        // Dispatch action to store
        const action = vacationsActions.initVacation(data);
        store.dispatch(action);

        // Return the data
        return data;
    }

    async getVacationById(_id: string) {
        return await axios.get(appConfig.vacationsUrl + _id);
    }

    async addVacation(vacation: VacationModel): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, vacation, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        vacation.image = response.data.image;
        if (store.getState().vacations) {
            const action = vacationsActions.addVacation(vacation);
            store.dispatch(action);
        }
        return response.data;
    }

    // async deleteVacation(_id: string) {
    //     const action = vacationsActions.deleteVacation(_id);
    //     store.dispatch(action);
    //     return await axios.delete(appConfig.vacationsUrl + _id);
    // }

    // async getVacationImage(imageName: string) {
    //     return await axios.get(appConfig.baseImageUrl + imageName);
    // }
}

export const vacationService = new VacationService();
