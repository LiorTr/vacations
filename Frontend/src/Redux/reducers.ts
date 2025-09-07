import { Action, PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '../Models/UserModel';
import { VacationModel } from '../Models/VacationModel';

// npm i react-redux @types/react-redux @reduxjs/toolkit

export function initUser(
    currentState: UserModel,
    action: PayloadAction<UserModel>
) {
    const newState: UserModel = action.payload;
    return newState;
}

export function logoutUser(currentState: UserModel, action: Action) {
    const newState: UserModel = null;
    return newState;
}

export function updateVacation(
    currentState: VacationModel[],
    action: PayloadAction<VacationModel>
) {
    const newState: VacationModel[] = currentState.map((v) =>
        v._id === action.payload._id ? action.payload : v
    );
    return newState;
}


export function initVacation(
    currentState: VacationModel[] = [],
    action: PayloadAction<VacationModel[]>
) {
    return action.payload;
}

export function addVacation(
    currentState: VacationModel[] = [],
    action: PayloadAction<VacationModel>
) {
    return [...currentState, action.payload];
}
