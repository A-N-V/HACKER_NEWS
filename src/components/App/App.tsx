import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "../Main/Main";
import { NewsPage } from "../NewPage/NewsPage";
import { fetchPosts } from "../../features/post/postSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Preloader } from "../Preloader/Preloader";
import  NewSkeleton  from "../Skeletons/NewSkeleton";
import styles from "./App.module.css";
import SortBtnSkeleton from "../Skeletons/SortBtnSkeleton";
import ResetBtnSkeleton from "../Skeletons/ResetBtnSkeleton";

function App() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.posts);
  const isFetching = useAppSelector((state) => state.post.isFetching);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <div >
      {isFetching ? (<div className={styles.container}>
        <div className={styles.btn__container}>
          <SortBtnSkeleton/>
          <ResetBtnSkeleton />
        </div>
        {Array.from({ length: 100 }).map((_, index) => (
            <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}> 
              <NewSkeleton key={index} />
              <br/>
              <br/>
            </div>
          ))}
      </div>) : (
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
      )}
    </div>
  );
}

export default App;
