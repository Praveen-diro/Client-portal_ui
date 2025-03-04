import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Helper to get the current Redux state without hooks (for non-React code)
export const getReduxState = (): RootState => {
  const { store } = require("./store");
  return store.getState();
};

// Helper to dispatch actions outside of React components
export const dispatchAction = (action: any) => {
  const { store } = require("./store");
  return store.dispatch(action);
};
