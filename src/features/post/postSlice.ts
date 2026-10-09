import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchItems, fetchTopStoryIds } from "../../lib/api";

export interface Post {
  id?: number;
  deleted?: boolean;
  type?: string;
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export type SortMode = "top" | "new";

const STORIES_LIMIT = 100;

interface PostState {
  posts: Post[];
  isFetching: boolean;
  error: string | null;
  sortMode: SortMode;
  lastUpdated: number | null;
}

const initialState: PostState = {
  posts: [],
  isFetching: true,
  error: null,
  sortMode: "top",
  lastUpdated: null,
};

//==================================================================
export const fetchPosts = createAsyncThunk<Post[], undefined, { rejectValue: string }>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const ids = await fetchTopStoryIds();
      return await fetchItems(ids.slice(0, STORIES_LIMIT));
    } catch (error) {
      return rejectWithValue((error as { message: string }).message);
    }
  }
);
//==================================================================

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSortMode: (state, action: PayloadAction<SortMode>) => {
      state.sortMode = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isFetching = false;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload ?? "Failed to load stories";
      });
  },
});

export const { setSortMode } = postSlice.actions;
export default postSlice.reducer;
