import { put, takeLatest, select } from "redux-saga/effects";
import { toast } from "react-toastify";
import { types } from "./types";
import * as service from "./service";
import history from "./../../history";
import * as selectors from './selectors';


function* loginUser(action) {
  try {

    const result = yield service.login(action.payload);
    if (result.status === 200) {
      yield put({ type: types.LOGIN_SUCCESS, payload: result.data.message });
      history.push("/");

    } else {
      yield put({ type: types.LOGIN_FAILURE, payload: result.message.data.message });

      toast.error(result.message.message.toString());
    }
  } catch (error) {
    yield put({ type: globalTypes.STOP_LOADER });
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      yield put({ type: types.LOGIN_FAILURE, payload: errorMessage });
    } else if (error.request) {
      const errorMessage = "Error. Please check your internet connection.";
      toast.error(errorMessage);
      yield put({ type: types.LOGIN_FAILURE, payload: errorMessage });
    }
    else {
      const errorMessage = "There was some error.";
      toast.error(errorMessage);
      yield put({ type: types.LOGIN_FAILURE, payload: errorMessage });
    }
  }
}
function* registerUser(action) {
  try {

    const result = yield service.register(action.payload);
    if (result.status === 200 || result.status === 201) {
      yield put({ type: types.REGISTRATION_SUCCESS });
      toast.info(result.data.message.toString());
      if (action.payload?.role === "customer") {
        history.push("/");
      } else {
        history.push("/verify-phone");
      }
    } else {
      toast.error(result.data.message.toString());
      yield put({ type: types.REGISTRATION_FAILURE, payload: result.message.data.message });
    }
  } catch (error) {
    yield put({ type: globalTypes.STOP_LOADER });
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      yield put({ type: types.REGISTRATION_FAILURE, payload: errorMessage });
    } else if (error.request) {
      const errorMessage = "Error. Please check your internet connection.";
      toast.error(errorMessage);
      yield put({ type: types.REGISTRATION_FAILURE, payload: errorMessage });
    }
    else {
      const errorMessage = "There was some error.";
      toast.error(errorMessage);
      yield put({ type: types.REGISTRATION_FAILURE, payload: errorMessage });
    }
  }
}
function* resetPassword(action) {
  try {

    const result = yield service.reset(action.payload);
    if (result.status === 200 || result.status === 201) {
      yield put({ type: types.RESET_PASSWORD_SUCCESS, payload: result });
      toast.info(result.data.message.toString());
    } else {
      toast.error(result.data.message.toString());
      yield put({ type: types.RESET_PASSWORD_FAILURE, payload: result });
    }
  } catch (error) {
    yield put({ type: globalTypes.STOP_LOADER });
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      yield put({ type: types.RESET_PASSWORD_FAILURE, payload: errorMessage });
    } else if (error.request) {
      const errorMessage = "Error. Please check your internet connection.";
      toast.error(errorMessage);
      yield put({ type: types.RESET_PASSWORD_FAILURE, payload: errorMessage });
    }
    else {
      const errorMessage = "There was some error.";
      toast.error(errorMessage);
      yield put({ type: types.RESET_PASSWORD_FAILURE, payload: errorMessage });
    }
  }
}
function* forgotPassword(action) {
  try {

    const result = yield service.forgot(action.payload);
    if (result.status === 200 || result.status === 201) {
      yield put({ type: types.FORGOT_PASSWORD_SUCCESS });
      toast.info(result.data.message.toString());
    } else {
      toast.error(result.data.message.toString());
      yield put({ type: types.FORGOT_PASSWORD_FAILURE });
    }
  } catch (error) {
    yield put({ type: globalTypes.STOP_LOADER });
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      yield put({ type: types.FORGOT_PASSWORD_FAILURE, payload: errorMessage });
    } else if (error.request) {
      const errorMessage = "Error. Please check your internet connection.";
      toast.error(errorMessage);
      yield put({ type: types.FORGOT_PASSWORD_FAILURE, payload: errorMessage });
    }
    else {
      const errorMessage = "There was some error.";
      toast.error(errorMessage);
      yield put({ type: types.FORGOT_PASSWORD_FAILURE, payload: errorMessage });
    }
  }
}
function* verifyEmail(action) {
  try {

    const result = yield service.verifyEmail(action.payload);
    if (result.status === 200 || result.status === 201) {
      yield put({ type: types.VERIFY_EMAIL_SUCCESS });
      toast.info(result.data.message.toString());
      history.push("/");
    } else {
      toast.error(result.data.message.toString());
      yield put({ type: types.VERIFY_EMAIL_FAILURE });
    }
  } catch (error) {
    yield put({ type: globalTypes.STOP_LOADER });
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      yield put({ type: types.VERIFY_EMAIL_FAILURE, payload: errorMessage });
    } else if (error.request) {
      const errorMessage = "Error. Please check your internet connection.";
      toast.error(errorMessage);
      yield put({ type: types.VERIFY_EMAIL_FAILURE, payload: errorMessage });
    }
    else {
      const errorMessage = "There was some error.";
      toast.error(errorMessage);
      yield put({ type: types.VERIFY_EMAIL_FAILURE, payload: errorMessage });
    }
  }
}

export function* getUser() {
  try {
    const userId = yield select(selectors.userId)
    const result = yield service.getUser(userId);
    if (result.status === 200 || result.status === 201) {
      yield put({ type: types.GET_USER_SUCCESS,  payload: result.data.message});
    } else {
      toast.error(result.data.message.toString());
      yield put({ type: types.GET_USER_FAILURE });
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      yield put({ type: types.GET_USER_FAILURE, payload: errorMessage });
    } else if (error.request) {
      toast.error(JSON.stringify(error.request))
      const errorMessage = "Error. Please check your internet connection.";
      toast.error(errorMessage);
      yield put({ type: types.GET_USER_FAILURE, payload: errorMessage });
    }
    else {
      const errorMessage = "There was some error.";
      toast.error(errorMessage);
      yield put({ type: types.GET_USER_FAILURE, payload: errorMessage });
    }
  }
}


function* logout() {
  yield put({ type: types.LOGOUT_SUCCESS })
  history.push('/')
}

export default function* usersWatcher() {
  yield takeLatest(types.LOGIN_REQUEST, loginUser);
  yield takeLatest(types.REGISTRATION_REQUEST, registerUser);
  yield takeLatest(types.RESET_PASSWORD_REQUEST, resetPassword);
  yield takeLatest(types.FORGOT_PASSWORD_REQUEST, forgotPassword);
  yield takeLatest(types.VERIFY_EMAIL_REQUEST, verifyEmail);
  yield takeLatest(types.GET_USER_REQUEST, getUser);
  yield takeLatest(types.LOGOUT, logout);
}
