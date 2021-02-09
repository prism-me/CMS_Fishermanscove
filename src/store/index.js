import { createStore, combineReducers } from "redux";
import global from "../redux/global";
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// const persistConfig = {
//     key: 'root',
//     storage,
// }

const rootReducer = combineReducers({
    globalReducer: global.globalReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer)


// export default () => {
export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    // return { store, persistor };
// }

