import { combineReducers, Reducer, UnknownAction } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

export interface RootState {
    auth: ReturnType<typeof authSlice>;
}

const reducers = combineReducers({
    auth: authSlice,
})

const rootReducer: Reducer<RootState, UnknownAction> = (state, action) => {
    if (action.type === 'auth/logout') {
        return reducers(undefined, action)
    }

    return reducers(state, action)
}

export default rootReducer