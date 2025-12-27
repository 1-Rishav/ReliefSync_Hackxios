import { createSlice } from "@reduxjs/toolkit"
import { persistor } from "../index";
import axios from "../../utils/axios"
import { toast } from "react-toastify";

const initialState = {
    role: "citizen",
    verified: false,
    token: null,
    ngo_verified: false,
    agent_verified: false,
    email: null,
    NgoExist: false,
    AgentExist: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn(state, action) {
            state.role = action.payload.role,
                state.verified = action.payload.verified,
                state.token = action.payload.token,
                state.ngo_verified = action.payload.ngo_verified,
                state.agent_verified = action.payload.agent_verified,
                state.NgoExist = action.payload.NgoExist,
                state.AgentExist = action.payload.AgentExist,
                state.email = action.payload.email

        },

    }
})

const authAction = authSlice.actions;
export default authSlice.reducer;

export function register(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('auth/register', formValues, { headers: {
          "Content-Type": "application/json",
        }, });
            const { message } = response.data;
            toast.success(message);
            if (!getState().auth.error) {
               window.location.href = "/auth/verify"
            }
            dispatch(authAction.logIn({ email: formValues.email }));

        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function verify(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('auth/verifyEmail', formValues, { headers:{"Content-Type":"application/json"}, withCredentials: true });
            const { verified, role, token, message } = response.data;
            if (!getState().auth.error && role === "ngo") {
                window.location.href = "/auth/ngo-verification";
            } else if (!getState().auth.error && role === "gov_Agent") {
                window.location.href = "/auth/agency-verification";
            }

            toast.success(message);

            dispatch(authAction.logIn({ verified, role, token }));
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function login(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('auth/login', formValues, { withCredentials: true });
            const { verified, role, token, ngo_verified, agent_verified, message, NgoExist, AgentExist } = response.data;
            if (!getState().auth.error && role === "ngo" && !ngo_verified && !NgoExist) {
                window.location.href = "/auth/ngo-verification";
            } else if (!getState().auth.error && role === "ngo" && !ngo_verified && NgoExist) {
                window.location.href = "/auth/ngo_waitlist";
            } else if (!getState().auth.error && role === "gov_Agent" && !agent_verified && !AgentExist) {
                window.location.href = "/auth/agency-verification";
            } else if (!getState().auth.error && role === "gov_Agent" && !agent_verified && AgentExist) {
                window.location.href = "/auth/agent_waitlist";
            } else if (!getState().auth.error && !verified) {
                window.location.href = "/auth/verify";
            }
            toast.success(message);
            dispatch(authAction.logIn({ verified, role, token, ngo_verified, agent_verified, NgoExist, AgentExist, email: formValues.email }));
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function forgotPassword(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('auth/forgetPassword', formValues, { withCredentials: true });
            const { message } = response.data;
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function resetPassword(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('auth/resetPassword', formValues, { withCredentials: true });
            const { role, verified, ngo_verified, agent_verified, token, message, NgoExist, AgentExist } = response.data;
            if (!getState().auth.error && role === "ngo" && !ngo_verified && NgoExist) {
                window.location.href = "/auth/ngo_waitlist";
            } else if (!getState().auth.error && role === "ngo" && !ngo_verified) {
                window.location.href = "/auth/ngo-verification";
            } else if (!getState().auth.error && role === "gov_Agent" && !agent_verified && AgentExist) {
                window.location.href = "/auth/agent_waitlist";
            } else if (!getState().auth.error && role === "gov_Agent" && !agent_verified) {
                window.location.href = "/auth/agency-verification";
            } else if (!getState().auth.error && !verified) {
                window.location.href = "/auth/verify";
            }
            toast.success(message);
            dispatch(authAction.logIn({ role, verified, ngo_verified, agent_verified, token, NgoExist, AgentExist }));
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function logOut() {
    return async (dispatch, getState) => {
        try {
            const response = await axios.get('auth/logout', { withCredentials: true })
            const { role, verified, token, message } = response.data;

            toast.success(message);
            dispatch(authAction.logIn({ role, verified, token }));
            localStorage.clear();
            sessionStorage.clear();
            persistor.purge();
        } catch (error) {
            toast.error(error.message)
        }
    }
}

//Google Auth

export function googleAuth(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('auth/googleAuth', formValues, {headers:{"Content-Type":"application/json"}, withCredentials: true });
            const { role, verified, token, message } = response.data;

            toast.success(message)
            dispatch(authAction.logIn({ role, verified, token }))
        } catch (error) {
            toast.error(error.message)
        }
    }

}

export function ngoEntry(formValues) {
    return async (dispatch, getState) => {
        console.log(formValues)
        try {
            const response = await axios.post('ngo/ngoEntry', formValues, {
                withCredentials: true, headers: {
                    "Content-Type": "multipart/form-data", // Required for file uploads
                }
            });
            const { message, NgoExist, token, role, ngo_verified, verified } = response.data;
            toast.success(message);
            if (!getState().auth.error && NgoExist) {
                window.location.href = "/auth/ngo_waitlist"
            }
            dispatch(authAction.logIn({ NgoExist, token, role, ngo_verified, verified }))
        } catch (error) {
            toast.error(error.message)
        }
    }
}
export function fetchNGO() {
    return async () => {
        try {
            const response = await axios.get('ngo/getNgoDetails', { withCredentials: true });
            const { data } = response.data;
            return data;
        } catch (error) {
            toast.error(error.message);
        }
    }
}
export function getAllNGO() {
    return async () => {
        try {
            const response = await axios.get('ngo/getAllNGO', { withCredentials: true });

            return response.data;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

export function toggleNGO() {
    return async () => {
        try {
            await axios.post('ngo/ngoToggle', {}, { withCredentials: true });

        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function agentEntry(formValues) {
    return async (dispatch, getState) => {
        try {
            const response = await axios.post('agent/agentEntry', formValues, {
                withCredentials: true, headers: {
                    "Content-Type": "multipart/form-data", // Required for file uploads
                }
            });
            const { message, AgentExist, token, role, agent_verified, verified } = response.data;
            toast.success(message);
            if (!getState().auth.error && AgentExist) {
                window.location.href = "/auth/agent_waitlist"
            }
            dispatch(authAction.logIn({ AgentExist, token, role, agent_verified, verified }));
        } catch (error) {
            toast.error(error.message)
        }
    }
}

export function fetchAgent() {
    return async () => {
        try {
            const response = await axios.get('agent/getAgentDetails', { withCredentials: true });
            const { data } = response.data;
            return data;
        } catch (error) {
            toast.error(error.message);
        }
    }
}

export function getAllAgent() {
    return async () => {
        try {
            const response = await axios.get('agent/getAllAgent', { withCredentials: true });

            return response.data;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

export function toggleAgent() {
    return async () => {
        try {
            await axios.post('agent/agentToggle', {}, { withCredentials: true });
        } catch (error) {
            toast.error(error.message);
        }
    }
}
