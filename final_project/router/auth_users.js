const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Find the user with the provided username
  const user = users.find((user) => user.username === username);

  // If the user is not found, return an error
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the provided password matches the user's password
  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  // Generate a JWT token with user information
  const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });

  // Return the JWT and a success message
  return res.status(200).json({ message: "Login successful" });
});


// Add a book review
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      req.username = decoded.username;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.username;
  
    // Check if review is provided
    if (!review) {
      return res.status(400).json({ message: 'Review is required' });
    }
  
    // Find the book with the provided isbn
    const book = books[isbn];
  
    // Check if the book exists
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Check if the book has existing reviews
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // Check if the user has already posted a review for the same book
    if (book.reviews[username]) {
      // Modify the existing review
      book.reviews[username] = review;
      return res.status(200).json({ message: 'Review modified successfully' });
    } else {
      // Return an error if the user has not posted a review for the book
      return res.status(404).json({ message: 'Review not found' });
    }
  });

  // Delete a book review  
  regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.username;
  
    // Check if review is provided
    if (!review) {
      return res.status(400).json({ message: 'Review is required' });
    }
  
    // Find the book with the provided isbn
    const book = books[isbn];
  
    // Check if the book exists
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Check if the book has existing reviews
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // Check if the user has already posted a review for the same book
    if (book.reviews[username]) {
      // Modify the existing review
      book.reviews[username] = "";
      return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      // Return an error if the user has not posted a review for the book
      return res.status(404).json({ message: 'Review not found' });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;