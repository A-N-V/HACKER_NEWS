import React from "react";
import styles from "./CommentNode.module.css";
import commentImg from "../../icons/comments.svg";
import deletedCommentImg from "../../icons/deleted.svg";
import { Comment } from "../../features/post/postSlice";

interface CommentNodeProp {
  comment: Comment;
  txt: string;
}

const CommentNode: React.FC<CommentNodeProp> = ({ comment, txt }) => {
    const { text, comments } = comment;
    const isDeletedComment = text === "[dead]" || text === "comment has been deleted" || text === "[flagged]";
    const hasHTMLTags = /<[^>]+>/g.test(text? text : '');
    
    if (txt) {
      return (
        <div>
            {comments && comments.length > 0 && (
            <div style={{ marginLeft: '30px' }}>
              {comments.map((childComment) => (
                <CommentNode key={childComment.id} comment={childComment} txt=""/>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className={styles.comment}>
        <div className={styles.comment__box}>
          <img
            src={isDeletedComment ? deletedCommentImg : commentImg}
            className={styles.comment__img}
            alt="comment Img"
          />
          {isDeletedComment ? (
            <p className={styles.comment__text}>{text}</p>
          ) : hasHTMLTags ? (
            <div
              className={styles.comment__text}
              dangerouslySetInnerHTML={{ __html: text || ''}}
            />
          ) : (
            <p className={styles.comment__text}>{text}</p>
          )}
        </div>
        <div>
            {comments && comments.length > 0 && (
            <div style={{ marginLeft: '30px' }}>
              {comments.map((childComment) => (
                <CommentNode key={childComment.id} comment={childComment} txt=""/>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default CommentNode;