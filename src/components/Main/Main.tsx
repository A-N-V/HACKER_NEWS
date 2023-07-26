import React, { useEffect } from "react";
import { fetchPosts, sortPosts } from "../../features/post/postSlice";
import New from "../New/New";
import styles from "./Main.module.css";
import reset from "../../icons/Reload.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function Main() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.posts);

  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchPosts()), 60000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, fetchPosts]);

  return (
    <div className={styles.container}>
      <div className={styles.btn__container}>
        <button onClick={() => dispatch(sortPosts(posts))}>sort</button>
        <button
          className={styles.reset__btn}
          onClick={() => dispatch(fetchPosts())}
        >
          <img src={reset} alt="reset img" />
        </button>
      </div>
      {posts.map((post) => (
        <New key={post.id} post={post} href={post.id || null} />
      ))}
    </div>
  );
}

export default React.memo(Main);
