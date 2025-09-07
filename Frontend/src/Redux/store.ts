// store.ts
import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import {
    initUser,
    logoutUser,
    initVacation,
    addVacation,
    updateVacation,
} from './reducers';
import { UserModel } from '../Models/UserModel';
import { VacationModel } from '../Models/VacationModel';

import storage from 'redux-persist/lib/storage'; // localStorage for web
import { persistStore, persistReducer } from 'redux-persist';

// Application state:
export type AppState = {
    user: UserModel;
    vacations: VacationModel[];
};

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: { initUser, logoutUser },
});

// Vacations slice
const vacationsSlice = createSlice({
    name: 'vacations',
    initialState: [],
    reducers: { initVacation, addVacation, updateVacation },
});

// Persist config - persist only the user slice
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // only persist user slice, vacations will reset on refresh
};

// Combine reducers
const rootReducer = combineReducers({
    user: userSlice.reducer,
    vacations: vacationsSlice.reducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
});

// Create persistor
export const persistor = persistStore(store);

// Export actions
export const userActions = userSlice.actions;
export const vacationsActions = vacationsSlice.actions;
