// models/Book.js

import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    std: {
        type: String,
    },
    year: {
        type: String,
    },
    semester: {
        type: String,
    },
    isSet: {
        type: Boolean,
        required: true,
    },
    books: [{
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        halfPrice:
        {
          type: Number,
          required: true,  
        },
        image:
        {
          type: String,
          default: "",
          required: true,
        },
      }],
    totalPrice: {
        type: Number,
        required: true,
    },
    
});

const Book = mongoose.models.books || mongoose.model("books", bookSchema);

export default Book;
