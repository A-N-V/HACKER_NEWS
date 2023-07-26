import React, { useState } from "react";
import styles from "./comment.module.css";
import commentImg from "../../icons/comments.svg";
import deletedCommentImg from "../../icons/deleted.svg";
import axios from "axios";
import CommentNode from "../CommentNode/CommentNode";

interface CommentProp {
  comment: string;
  id: number;
  kids: number[] | number;
}
/* ============================================================================ */
const Comment: React.FC<CommentProp> = ({ comment, id , kids}) => {
  const isDeletedComment = comment === "[dead]" || comment === "comment has been deleted" || comment === "[flagged]";
  const hasHTMLTags = /<[^>]+>/g.test(comment);
  const [articleWithComments, setArticleWithComments] = useState(null);
/* ============================================================================ */
async function getCommentsTree(articleId: number) {
  try {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${articleId}.json`);
    const articleData = response.data;

    if (articleData && articleData.kids) {
      // Получаем все комментарии и дочерние комментарии для статьи
      const commentsPromises = articleData.kids.map((commentId: number) => getCommentsTree(commentId));
      const comments = await Promise.all(commentsPromises);
      // Добавляем свойство с комментариями в объект статьи
      articleData.comments = comments;
    }

    return articleData;
  } catch (error) {
    console.error('Ошибка при получении комментариев:', (error as {message: string}).message);
    throw error;
  }
}
/* ============================================================================ */
async function fetchComments(id: number) {
  try {
    const articleComments = await getCommentsTree(id);
    setArticleWithComments(articleComments);
  } catch (error) {
    console.error('Ошибка при получении комментариев:', (error as {message: string}).message);
  }
}
/* ============================================================================ */
  return (
    <div>
      <div className={styles.comment__box} >
        <img
          onClick={() => fetchComments(id)}
          src={isDeletedComment ? deletedCommentImg : commentImg}
          className={styles.comment__img}
          alt="comment Img"
        />
        {isDeletedComment ? (
          <p className={styles.comment__text}>{comment}</p>
        ) : hasHTMLTags ? (
          <div
            className={styles.comment__text}
            dangerouslySetInnerHTML={{ __html: comment }}
          />
        ) : (
          <p className={styles.comment__text}>{comment}</p>
        )}
      </div>
      <div className={styles.response__box}>
        <p className={styles.response}>{kids} {kids === 1 ? "response" : "responses"}</p>
      </div>
      <div style={{ marginLeft: '30px' }}>
        {articleWithComments ? (
          <CommentNode comment={articleWithComments} txt={comment}/>
        ) : null}
      </div>
    </div>
  );
}

export default Comment;