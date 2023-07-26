import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "../Main/Main";
import { NewsPage } from "../NewPage/NewsPage";
import { useSelector } from "react-redux";
import { fetchPosts } from "../../features/post/postSlice";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function App() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        {posts.map((post) => (
          <Route
            key={post.id}
            path={"/post/" + post.id}
            element={<NewsPage post={post} />}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
