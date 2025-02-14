import React, { useState } from "react";
import axios from "axios";

const CommentBox = ({ postId }) => {
    const [comment, setComment] = useState("");

    const handleCommentSubmit = async () => {
        try {
            await axios.post(`/api/posts/${postId}/comment`, { text: comment });
            setComment("");
        } catch (err) {
            console.error("Error posting comment", err);
        }
    };

    return (
        <div>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button onClick={handleCommentSubmit}>Comment</button>
        </div>
    );
};

export default CommentBox;