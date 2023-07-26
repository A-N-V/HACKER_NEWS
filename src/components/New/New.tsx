import React from "react";
import styles from "./New.module.css";
import { Link } from "react-router-dom";
import { Post } from "../../features/post/postSlice";

interface NewProps {
    post: Post;
    href: number | null;
}

const New: React.FC<NewProps> = ({ post, href }) => {
    let date;
    if (post.time) {
        date = new Date(post.time * 1000).toLocaleString();
    }
    return(
        <div className={styles.new__box}>
            <Link to={"/post/" + href} className={styles.new__box__title} rel="noopener noreferrer">{post.title}</Link>
            <div className={styles.new__box__wrap}>
                <p>rating: {post.score} | {post.by} | {date}</p>
            </div>
        </div>
    )
}

export default New;