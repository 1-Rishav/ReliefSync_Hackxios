import { createSlice } from '@reduxjs/toolkit'
import axios from '../../utils/axios'
import { toast } from 'react-toastify'
import { logOut } from './authSlice'

const initialState = {
    _id: null,
    role: 'citizen',
    firstName: '',
    lastName: '',
    password: '',
    verified: false,
    token: null,
    ngo_verified: false,
    agent_verified: false,
    ngoExist: false,
    agentExist: false,
    email: null,
    profile: null,
    createdAt: null,
    updatedAt: null,
    phone: null,
    help: false,
    helpRequestLimit: null,
    allocationConfirm: false,
    feedback: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user(state, action) {
            state._id = action.payload._id;
            state.role = action.payload.role;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.password = action.payload.password;
            state.verified = action.payload.verified;
            state.token = action.payload.token;
            state.ngo_verified = action.payload.ngo_verified;
            state.agent_verified = action.payload.agent_verified;
            state.ngoExist = action.payload.ngoExist;
            state.agentExist = action.payload.agentExist;
            state.email = action.payload.email;
            state.profile = action.payload.profile;
            state.createdAt = action.payload.createdAt;
            state.help = action.payload.help;
            state.helpRequestLimit = action.payload.helpRequestLimit;
            state.allocationConfirm = action.payload.allocationConfirm;
            state.phone = action.payload.phone;
            state.feedback = action.payload.feedback;
            state.updatedAt = action.payload.updatedAt;
        }
    }
})

const userAction = userSlice.actions;
export default userSlice.reducer;

export function getUser() {
    return async (dispatch, getState) => {
        try {
            const response = await axios.get('user/getUser', { withCredentials: true });
            const { user } = response.data;
            dispatch(userAction.user(user));
        } catch (error) {
            await dispatch(logOut())
        }
    }
}

export function editUser(formValues, { req }) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post(`user/${req}`, formValues, { withCredentials: true });
            const { updatedFields } = response.data;
            dispatch(userAction.user(updatedFields))
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function editProfile(formValues) {
    return async (dispatch, getState) => {
        console.log(formValues)
        try {
            const response = await axios.post('user/changeProfile', formValues, { withCredentials: true, headers: { 'content-Type': "multipart/form-data" } })
            const { updatedFields } = response.data;
            dispatch(userAction.user(updatedFields))
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.message)
        }
    }
}

export function toggleHelp(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('user/changeHelp', formValues, { withCredentials: true });
            const { updatedFields } = response.data;
            dispatch(userAction.user(updatedFields))

        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function deleteAccount() {
    return async (dispatch, getState) => {
        try {
            const response = await axios.delete('user/removeAccount', { withCredentials: true });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.message)
        }
    }
}

export function changeFeedBack(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('user/feedStatus', formValues, { withCredentials: true });
            const { updatedFields } = response.data;
            dispatch(userAction.user(updatedFields))
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function submitFeedback(formValues) {
    return async () => {
        try {
            const response = await axios.post('user/submitFeedback', formValues, { withCredentials: true });
            toast.success(response.data.message);
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function fetchFeedbacks() {
    return async () => {
        try {
            const response = await axios.get('user/getFeedbacks', { withCredentials: true });
            return response.data;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function fetchUnverifiedNGOsCount() {
    return async () => {
        try {
            const response = await axios.get('user/getUnverifiedNGO', { withCredentials: true });
            return response.data;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function fetchUnverifiedAgentsCount() {
    return async () => {
        try {
            const response = await axios.get('user/getUnverifiedAgent', { withCredentials: true });
            return response.data;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function agencyStatus(formValues) {
    return async () => {
        try {
            const response = await axios.post('user/toggleAgency', formValues, { withCredentials: true });
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function agencyEmergencyStatus() {
    return async (dispatch,_) => {
        try {
            const response = await axios.post('user/toggleEmergency', {}, { withCredentials: true });
            const { updatedFields } = response.data;
            await dispatch(userAction.user(updatedFields));
            toast.success(response.data.message);
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function changeAllocationAndStatus() {
    return async (dispatch,_) => {
        try {
            const response = await axios.post('user/defaultAllocationAndStatus', {}, { withCredentials: true });
            toast.success(response.data.message);
            dispatch(userAction.user(response.data.updatedFields));
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}
export function changeAllocationOnly(){
    return async (dispatch,_) => {
        try {
            const response = await axios.post('user/resetAllocation', {}, { withCredentials: true });
            toast.success(response.data.message);
            dispatch(userAction.user(response.data.updatedFields));
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function notifySubscriber() {
    return async () => {
        try {
            const response = await axios.get('notify/segment', { withCredentials: true });
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function notifyRequester(formValues) {
    return async () => {
        try {
            const response = await axios.post('notify/user', formValues, { withCredentials: true });
            return response;
        } catch (error) {
            toast.error(error.message);
        }
    }
}