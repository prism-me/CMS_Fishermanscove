import authReducer from "./reducers";

export const userId = state => {
  return state.auth?.user?.id;
};

export const userIdAndToken = state => {
  return {id: state.auth?.user?.id, token: state.auth?.token}
}

export const getToken = state => {
  return state.auth?.token
}
