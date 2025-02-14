import React, { useState } from "react";
import axios from "axios";

const LikeButton = ({ postId }) => {
    const [likes, setLikes] = useState(0);

    const handleLike = async () => {
        try {
            await axios.post(`/api/posts/${postId}/like`);
            setLikes((prev) => prev + 1);
        } catch (err) {
            console.error("Error liking post", err);
        }
    };

    return <button onClick={handleLike}>Like ({likes})</button>;
};

export default LikeButton;