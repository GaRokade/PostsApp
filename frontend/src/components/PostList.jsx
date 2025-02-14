import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import PostForm from "./PostForm";
import Navbar from "./Navbar";
import "../App.css"; // Ensure styles are applied

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false); // Controls modal visibility

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="back">
    <Navbar />
    <div className="post-list">
      <button className="add-post-btn" onClick={() => setShowForm(true)}>
        + Add Post
      </button>

      {/* Modal for Post Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowForm(false)}>✖</button>
            <PostForm refreshPosts={fetchPosts} />
          </div>
        </div>
      )}

      {/* Display Posts */}
      {posts.map((post) => (
       <Post key={post._id} post={post} refreshPosts={fetchPosts} />

      ))}
    </div>
    </div>
  );
};

export default PostList;
