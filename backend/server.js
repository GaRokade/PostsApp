const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // No need for body-parser in latest Express

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
});

const User = mongoose.model("User", userSchema);

// **Sign Up Route**
app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
});

// **Login Route**
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // ✅ Return token and user details (firstName, lastName, email)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ Available Route: ${r.route.path}`);
  }
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// Forgot Password Route

// Schema
const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: String,
    image: String, // Image URL
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

// Get All Posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Create Post with Image
app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    console.log("File Uploaded:", req.file); // Log uploaded file details
    console.log("Request Body:", req.body); // Log request body

    const newPost = new Post({
      author: req.body.author,
      content: req.body.content,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
});

// Like a Post
app.put("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.body.userId;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error liking post" });
  }
});

// Add Comment
app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { username, text } = req.body;
    if (!username || !text)
      return res.status(400).json({ message: "Missing fields" });

    post.comments.push({ username, text });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
});

// Serve static images
app.use("/uploads", express.static("uploads"));

app.put("/api/posts/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// 5️⃣ Delete Post by ID
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.use((req, res, next) => {
  console.log(`📩 Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ Forgot Password Route
var nodemailer = require("nodemailer");
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🔍 Checking user for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ Status: "User not found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
      },
      tls: {
        rejectUnauthorized: false, // <-- Add this line
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password",
      text: `Click here to reset your password: posts-app-iwjw.vercel.app/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email sending error:", error);
        return res.status(500).json({ Status: "Error sending email" });
      } else {
        console.log("✅ Email sent:", info.response);
        return res
          .status(200)
          .json({ Status: "Success", message: "Email sent" });
      }
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ Status: "Error", message: "Internal Server Error" });
  }
});
// 🛠 Debugging: Check registered routes

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
    if (!decoded) {
      return res.status(400).json({ Status: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ Status: "User not found" });
    }

    res.json({ Status: "Success" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ Status: "Internal server error" });
  }
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
