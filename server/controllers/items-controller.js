import HttpError from "../models/http-error.js";
import bookModel from "../models/bookModel.js";
import generateSlug from "../utils/slug.js";

const getItemBySlug = async (request, response, next) => {
  const slug = request.params.slug;

  try {
    const book = await bookModel.findOne({ slug });
    if (!book) {
      return next(new HttpError("The book is not found.", 404));
    }
    response.status(200).json(book);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Fetching book failed, please try again later.", 500)
    );
  }
};

const createItem = async (request, response, next) => {
  const { cover, title, author, price, description, details, genre, qty } =
    request.body;

  try {
    // throw an error when any of the fields is missing
    if (!cover || !title || !author || !price || !genre || !qty) {
      return next(
        new HttpError(
          "Cover, title, author, price, genre, and quantity are compulsory fields.",
          400
        )
      );
    }

    // Ensure price, genre, and qty are numbers
    if (isNaN(price) || isNaN(genre) || isNaN(qty)) {
      return next(
        new HttpError("Price, genre, and quantity must be valid numbers.", 400)
      );
    }

    // create a unique slug for SEO
    const slug = await generateSlug(title);

    // create a new book document
    const newBook = new bookModel({
      cover,
      title,
      author,
      price,
      description,
      details,
      genre,
      slug,
      qty,
    });

    // save the new document to the Db
    await newBook.save();
    response.status(201).json(newBook);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Creating book failed, please try again later.", 500)
    );
  }
};

const updateItemById = async (request, response, next) => {
  const bookId = request.params.id;
  const {
    cover,
    title,
    author,
    price,
    description,
    details,
    genre,
    slug,
    qty,
  } = request.body;

  try {
    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { cover, title, author, price, description, details, genre, slug, qty },
      { new: true }
    );
    if (!updatedBook) {
      return next(new HttpError("The book is not found.", 404));
    }
    response.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Updating book failed, please try again later.", 500)
    );
  }
};

const deleteItemById = async (request, response, next) => {
  const bookId = request.params.id;

  try {
    const book = await bookModel.findOneAndDelete({ _id: bookId });
    if (!book) {
      return next(new HttpError("The book is not found.", 404));
    }
    response.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Deleting book failed, please try again later.", 500)
    );
  }
};

const getItems = async (request, response, next) => {
  const query = request.query.query?.trim();
  const id = request.query.id?.trim();
  const sortPrice = request.query.sortPrice;

  if (id) {
    // Fetch by ID to return a single book item if found
    try {
      const book = await bookModel.findById(id);
      if (!book) {
        return next(new HttpError("The book is not found.", 404));
      }
      response.status(200).json(book);
    } catch (error) {
      console.log(error);
      return next(
        new HttpError("Fetching book failed, please try again later.", 500)
      );
    }
  } else {
    // if no id is given, search by the query and perform sorting if needed
    let searchCriteria = {};
    let sortCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query.trim(), $options: "i" } },
        { author: { $regex: query.trim(), $options: "i" } },
      ];
    }

    if (sortPrice) {
      sortCriteria.price = sortPrice === "asc" ? 1 : -1; // 1 for ascending, -1 for descending
    }

    try {
      const books = await bookModel.find(searchCriteria).sort(sortCriteria);
      if (books.length === 0) {
        return response.status(404).json({ message: "No books found" });
      }
      response.status(200).json(books);
    } catch (error) {
      console.log(error);
      return next(
        new HttpError("Fetching books failed, please try again later.", 500)
      );
    }
  }
};

export default {
  getItemBySlug,
  createItem,
  updateItemById,
  deleteItemById,
  getItems,
};
