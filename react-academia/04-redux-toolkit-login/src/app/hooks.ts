import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// useDispatch y useSelector de siempre, pero ya saben los tipos
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
