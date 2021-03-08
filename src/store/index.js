import { createStore, combineReducers } from "redux";
import global from "../redux/global";
import { authReducer } from "../redux/users/reducers";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    globalReducer: global.globalReducer,
    userReducer: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)


// export default () => {
export const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store)
    // return { store, persistor };
// }

