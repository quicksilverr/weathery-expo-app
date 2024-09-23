import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationData } from "./type";
import { RootState } from "./root_store";

export const ROOT_FEATURE_KEY = 'rootSlice';
export interface RootSliceState {
  locationData: LocationData
}
export const intialRootState:RootSliceState = {
    locationData: {
        name: 'Pune',
        lat: 18.51957,
        lng: 73.85535
    }
}


export const rootSlice = createSlice({
    name:ROOT_FEATURE_KEY,
    initialState: intialRootState,
    reducers: {
      selectLocation(state, action: PayloadAction<{locationData: LocationData}>){
        state.locationData = action.payload.locationData
      }
    }
})


export const {
    selectLocation,
} = rootSlice.actions

export const getRootState = (rootState: RootState): RootSliceState =>
    rootState[ROOT_FEATURE_KEY];
  

  export const getLocationData = createSelector(
    getRootState,
    (state) => state?.locationData
  );
  