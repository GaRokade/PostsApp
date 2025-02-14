import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Post from "../components/Post";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const formData = new FormData();
    formData.append("author", user?.username || "Anonymous");
    formData.append("content", newPostContent);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts([res.data, ...posts]); // Add new post to the feed
      setNewPostContent(""); // Clear input field
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="feed-container">
      <Navbar />
      <div className="feed">
        <h2>Social Media Feed</h2>

        
        {/* Display Posts */}
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          posts.map((post) => <Post key={post._id} post={post} />)
        )}
        {/* Add Post Form */}
        <form onSubmit={handleCreatePost} className="add-post-form">
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <button type="submit">Post</button>
        </form>

      </div>
    </div>
  );
};

export default Feed;
