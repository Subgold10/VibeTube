import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userState from "./userSlice";
import videoState from "./videoSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistSettings = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({ user: userState, video: videoState });
const persisted = persistReducer(persistSettings, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
