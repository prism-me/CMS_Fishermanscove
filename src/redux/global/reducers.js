import { types } from "./types";

let initialState = {
    showSpinner: false,
};
const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHOW_SPINNER:
            return {
                ...state,
                showSpinner: true
            };
        case types.HIDE_SPINNER:
            return {
                ...state,
                showSpinner: false
            };
        default: {
            return state;
        }
    }
};
export default globalReducer;
