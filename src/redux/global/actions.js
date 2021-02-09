import { types } from "./types";

export function getDomainValues(domains) {
    return {
        type: types.GET_DOMAIN_VALUES,
        payload: {
            domains
        }
    };
}

export function loginRequest(user) {
    return {
        type: types.LOGIN_REQUEST,
        payload: {
            user
        }
    };
}

export function logoutUser() {
    return {
        type: types.LOGOUT
    };
}


export function resultSubmit() {
    return {
        type: types.TEST_TAKEN
    };
}
