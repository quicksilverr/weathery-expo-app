import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Api } from './api';
import { rootSlice } from './reducer';
import { TypedUseSelectorHook, useSelector } from 'react-redux';


const appReducer = combineReducers({
    [Api.reducerPath]: Api.reducer,
    [rootSlice.name]: rootSlice.reducer,
})
export const reduxStore = configureStore({
    reducer: appReducer,
    middleware: (gDM) =>
      gDM({
        immutableCheck: false,
        serializableCheck: false,
      }).concat([Api.middleware]),
  });

export type RootState = ReturnType<typeof reduxStore.getState>;
export const dispatch = reduxStore?.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;