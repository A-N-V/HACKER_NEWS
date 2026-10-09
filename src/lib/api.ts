import axios from "axios";
import type { Post } from "../features/post/postSlice";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export const fetchTopStoryIds = async () => {
  const { data } = await axios.get<number[]>(`${BASE_URL}/topstories.json`);
  return data;
};

export const fetchItem = async (id: number) => {
  const { data } = await axios.get<Post | null>(`${BASE_URL}/item/${id}.json`);
  return data;
};

// Failed or missing items are dropped instead of failing the whole batch.
export const fetchItems = async (ids: number[]) => {
  const results = await Promise.allSettled(ids.map(fetchItem));
  return results.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : []
  );
};
