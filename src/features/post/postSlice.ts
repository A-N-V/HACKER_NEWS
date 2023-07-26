import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { postRequest } from "../../postRequest";

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

export interface Comment extends Post {
  comments?: Post[];
}

interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};

//==================================================================
export const fetchPosts = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string }
>("posts/fetchPosts", async (_, { rejectWithValue, dispatch }) => {
  try {
    const ids = await postRequest({
      url: "https://hacker-news.firebaseio.com/v0/topstories.json",
      params: { print: "pretty" },
      method: "GET",
    });

    if (ids) {
      ids.data.length = 100;
      const postPromises = ids.data.map((id) =>
        axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        )
      );

      const container = await Promise.all(postPromises);
      const posts = container.map((post) => post.data);
      dispatch(setPosts(posts));
    }
  } catch (error) {
    return rejectWithValue((error as { message: string}).message);
  }
});
//==================================================================

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {

    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...action.payload];
    },

    sortPosts: (state, action: PayloadAction<Post[]>) => {

      const buf = [...action.payload];

      buf.sort((a, b) => {
        if (a.time && b.time) {
          return a.time > b.time ? -1 : 1;
        }
        return 0;
      });
      
      state.posts = [...buf];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, () => console.log("fulfilled"))
      .addCase(fetchPosts.pending, () => console.log("pending"))
      .addCase(fetchPosts.rejected, () => console.log("rejected"));
  },
});

export const { setPosts, sortPosts } = postSlice.actions;
export default postSlice.reducer;
