import { types } from "./types";

let initialState = {
  isAuthenticated: false
};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        // user: action.payload.user,
        isAuthenticated: true,
        // loading: false,
        // token: action.payload.token,
      };
    case types.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        loginError: action.payload,
      };
    case types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case types.REGISTRATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.REGISTRATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.REGISTRATION_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_USER_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    default: {
      return state;
    }
  }
};
