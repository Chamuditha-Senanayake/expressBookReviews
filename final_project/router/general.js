const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Create a new user object
    const newUser = {
      username,
      password,
    };
  
    // Add the new user to the users array
    users.push(newUser);
  
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const allBooks = JSON.stringify(books, null, 2);
    return res.status(200).send(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
  
    // Check if the provided ISBN exists as a key in the 'books' object
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const bookDetails = JSON.stringify(books[isbn], null, 2);
    return res.status(200).send(bookDetails);
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;

  // Initialize an array to store matching books
  const matchingBooks = [];

  // Iterate through the 'books' object's properties
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];

      // Check if the author of the current book matches the requested author
      if (book.author === author) {
        matchingBooks.push(book);
      }
    }
  }

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "Author not found" });
  }

  const booksByAuthor = JSON.stringify(matchingBooks, null, 2);
  return res.status(200).send(booksByAuthor);
});


  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;

    // Initialize an array to store matching books
    const matchingBooks = [];
  
    // Iterate through the 'books' object's properties
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
  
        // Check if the author of the current book matches the requested author
        if (book.title === title) {
          matchingBooks.push(book);
        }
      }
    }
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }
  
    const booksByTitle= JSON.stringify(matchingBooks, null, 2);
    return res.status(200).send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
  
    // Check if the provided ISBN exists as a key in the 'books' object
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const bookDetails = JSON.stringify(books[isbn].reviews, null, 2);
    return res.status(200).send(bookDetails);
});

module.exports.general = public_users;