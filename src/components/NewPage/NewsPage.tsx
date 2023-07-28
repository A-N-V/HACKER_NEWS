import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewsPage.module.css";
import vector from "../../icons/Vector.svg";
import Comment from "../Comment/Comment";
import axios from "axios";
import reload from "../../icons/Reload.svg";
import { Post } from "../../features/post/postSlice";
import { Preloader } from "../Preloader/Preloader";

interface NewPageProp {
  post: Post;
}

const NewsPage: React.FC<NewPageProp> = ({ post }) => {
  const [isRotating, setIsRotating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Post[]>([]);
  const navigate = useNavigate();
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    if (post.kids && post.kids.length > 0) {
      const promises = post.kids.map(async (id) => {
        try {
          const resp = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          );
          return resp.data;
        } catch (error) {
          console.error(error);
        }
      });

      try {
        const commentsData: Post[] = await Promise.all(promises);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [post.kids]);

  let date;
  if (post.time) {
      date = new Date(post.time * 1000).toLocaleString();
  }


  const handleRotateClick = () => {
    fetchData();
    setComments([]);
    setIsRotating(true);
  };
  const rotateClassName = isRotating ? styles.rotate : "";

  return (
    <div className={styles.container}>
      <button onClick={handleGoBack} className={styles.goBack__btn}>
        Go Back
      </button>
      <div className={styles.new__block}>
        <div>
          <div className={styles.new__block__info}>
            <h1 className={styles.new__block__title}>New by: {post.by}</h1>
          </div>
          <div className={styles.time}>
              <img src={vector} alt="timer img" className={styles.timer} />
              <p className={styles.new__block__date}>Time: {date}</p>
            </div>
          <div className={styles.new__block__linkBlock}>
            <p className={styles.new__block__text}>{post.title}</p>
            <a
              className={styles.new__block__link}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              visit page
            </a>
          </div>
        </div>
        <div className={styles.reload__box}>
          {post.kids ? (
            <p className={styles.new__block__comment__text}>
              Comments: {comments.length}
            </p>
          ) : (
            <p className={styles.new__block__comment__text}>Comments: 0</p>
          )}
          <img
            src={reload}
            alt="reload Img"
            className={`${styles.svgImage} ${rotateClassName}`}
            onClick={handleRotateClick}
            onAnimationEnd={() => setIsRotating(false)}
          />
        </div>
        <div className={styles.new__block__comments}>
          
        {isLoading ? (
                  <Preloader /> 
        ) : (
          post.kids &&
            post.kids.length > 0 &&
            comments.map((comment, index) => (
              <Comment
                key={index}
                comment={comment.text ? comment.text : 'Comment has been deleted'} 
                id={comment.id ? comment.id : 0}
                kids={comment.kids ? comment.kids.length : 0}
              />
            ))
        )}
        </div>
      </div>
    </div>
  );
}

export { NewsPage };
