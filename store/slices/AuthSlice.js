import {createSlice} from '@reduxjs/toolkit'

const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        //
    },
    reducers: {
        SET_AUTH_DATA: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const {SET_AUTH_DATA} = AuthSlice.actions

export default AuthSlice.reducer;
