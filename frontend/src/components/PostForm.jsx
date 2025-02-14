import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostForm.css"; // Import CSS file

const PostForm = ({ refreshPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (image) formData.append("image", image);
  
    try {
      await axios.post("posts-app-iwjw.vercel.app/api/posts", formData);
  
      // Reload the page after successful post submission
      window.location.reload();
  
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  
  return (
    <div className="post-form-container">
      <h2 className="form-title">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required className="input-field" />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required className="textarea-field" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="file-input" />
        <button type="submit" className="submit-btn">Post</button>
      </form>
    </div>
  );
};

export default PostForm;
