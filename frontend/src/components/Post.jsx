import { useContext, useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaEdit } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../App.css";
import EmojiPicker from "emoji-picker-react";

const Post = ({ post, refreshPosts }) => {
  const { user } = useContext(AuthContext);

  if (!post) {
    return <p>Loading post...</p>;
  }

  const [likes, setLikes] = useState(post.likes.length || 0);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(post.title);
  const [newContent, setNewContent] = useState(post.content);
  const [updatedContent, setUpdatedContent] = useState(post.content); // ✅ Initialize state
  const [showPicker, setShowPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [showFullContent, setShowFullContent] = useState(false);

  
  useEffect(() => {
    setLikes(post.likes.length || 0);
    setIsLiked(post.likes.includes(user?._id));
    setComments(post.comments || []);
  }, [post]);

  const contentPreview =
    post.content.length > 30 ? post.content.slice(0, 30) + "..." : post.content;
  
  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  const handleLike = async () => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${post._id}/like`, {
        userId: user._id,
      });
      setIsLiked(!isLiked);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
        username: user?.username || "Anonymous",
        text: newComment,
      });
      setComments([...comments, res.data.comments[res.data.comments.length - 1]]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { content: updatedContent }; // Use updatedContent
  
      const response = await axios.put(`http://localhost:5000/api/posts/${post?._id}`, updatedData);
      console.log("Update response:", response);
  
      if (typeof refreshPosts === "function") {
        refreshPosts();
      } else {
        console.error("refreshPosts is not a function");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
  
  

  const handleDelete = async () => {
    console.log("Deleting post with ID:", post?._id);
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${post?._id}`);
      console.log("Delete response:", response);
      refreshPosts();
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
    }
  };
  
  return (
    <>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={`http://localhost:5000${post.image}`} alt="Post" className="modal-image" />
            <div className="modal-actions">
              <button onClick={handleLike} className="modal-like-button">
                {isLiked ? <FaHeart color="red" /> : <FaRegHeart />} {likes}
              </button>
              <button className="modal-comment-button" onClick={() => setShowComments(!showComments)}>
                <FaComment /> {comments.length}
              </button>
            </div>
            {showComments && (
              <div className="modal-comments">
                {comments.map((comment, index) => (
                  <p key={index} className="comment">
                    <strong>{comment.username}: </strong> {comment.text}
                  </p>
                ))}
                <form onSubmit={handleComment} className="comment-form">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">Post</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="post">
        <div className="post-header">
          <h3>{post.author || "Unknown Author"}</h3>
          
        </div>

       
        {post.image && (
          <div className="post-image-container" onClick={() => setShowModal(true)}>
            <img
              src={`https://posts-app-iwjw.vercel.app${post.image}`}
              alt="Post"
              className="post-image"
              onError={(e) => console.error("Image failed to load", e)}
            />
          </div>
        )}
        
         {isEditing ? (
  <div className="edit-section">
    <textarea 
      value={updatedContent} 
      onChange={(e) => setUpdatedContent(e.target.value)}  onClick={() => setShowEmojiPicker(false)} 
    />
    <button type="button" className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
    {showEmojiPicker && (
    <div className="emoji-picker-container">
      <EmojiPicker onEmojiClick={(emoji) => setUpdatedContent(prev => prev + emoji.emoji)} />
    </div>
  )}
     <div className="edit-buttons">
    <button className="save-btn" onClick={handleUpdate}>Save</button>
    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
  </div>
  </div>
) : (
  <p className="content" onClick={() => setIsEditing(true)}>
          {showFullContent ? post.content : contentPreview}
          {post.content.length > 30 && !showFullContent && (
            <span
              className="read-more"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering edit mode
                setShowFullContent(true);
              }}
              style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
            >
              Read more
            </span>
          )}
        </p>
)}
<div className="post-section">
      {user?._id === post.author?._id && (
            <div className="post-actions">
              <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                <FaEdit /> Edit
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                <FaTrash /> Delete
              </button>
            </div>
          )}
        <div className="post-actions">
          <button onClick={handleLike} className="like-button">
            {isLiked ? <FaHeart color="red" /> : <FaRegHeart />} {likes}
          </button>
          <button className="comment-button" onClick={() => setShowComments(!showComments)}>
            <FaComment /> {comments.length}
          </button>
        </div>
        </div>
        {showComments && (
  <div className="post-comments">
    {comments.map((comment, index) => (
      <p key={index} className="comment">
        <strong>{comment.username}: </strong>
        {comment.text}
      </p>
    ))}
    <form onSubmit={handleComment} className="comment-form">
      <input
        type="text"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
      {showEmojiPicker && <EmojiPicker onEmojiClick={(emoji) => setNewComment(prev => prev + emoji.emoji)} />}
      <button type="submit">Post</button>
    </form>
  </div>
)}

      </div>
    </>
  );
};

export default Post;
