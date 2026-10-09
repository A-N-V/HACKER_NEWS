import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectSortedPosts = createSelector(
  [(state: RootState) => state.post.posts, (state: RootState) => state.post.sortMode],
  (posts, sortMode) =>
    sortMode === "new" ? [...posts].sort((a, b) => (b.time ?? 0) - (a.time ?? 0)) : posts
);
