import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import settingsreducer from "./reducers/settings";
import WalletData from "./reducers/WalletData";
import WalletPayment from "./reducers/WalletPayment";
import api from "../store/Api/api";
import CartDetails from "./reducers/CartDetails";
import Cities from "./reducers/Cities";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  settings: settingsreducer,
  wallet: WalletData,
  iswalletused: WalletPayment,
  cartDetails: CartDetails,
  Cities: Cities,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: [api],
});

export const persistor = persistStore(store);
