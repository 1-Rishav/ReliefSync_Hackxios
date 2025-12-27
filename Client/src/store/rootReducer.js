import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.jsx'
import userReducer from './slices/userSlice.jsx'
import disasterReducer from './slices/disasterSlice.jsx'

const rootReducer = combineReducers({
   auth:authReducer,
   user:userReducer,
   disasterReport:disasterReducer
});

export default rootReducer;