const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        const totalBooks = books.length;
        const totalQuantity = books.reduce((sum, b) => sum + b.quantity, 0);
        const totalValue = books.reduce((sum, b) => sum + (b.price * b.quantity), 0);
        res.render('books/index', { books, totalBooks, totalQuantity, totalValue, error: null });
    } catch (err) {
        res.render('books/index', { books: [], totalBooks: 0, totalQuantity: 0, totalValue: 0, error: err.message });
    }
};

exports.getAddBook = (req, res) => {
    res.render('books/add', { error: null });
};

exports.postAddBook = async (req, res) => {
    try {
        const { title, author, category, price, quantity, description } = req.body;

        if (!title || !author || !category || !price || !quantity) {
            return res.render('books/add', { error: 'Please fill all required fields.' });
        }

        const newBook = new Book({
            title,
            author,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            description,
            image: req.file ? req.file.filename : ''
        });

        await newBook.save();
        res.redirect('/books');
    } catch (err) {
        res.render('books/add', { error: err.message });
    }
};

exports.getEditBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.redirect('/books');
        }
        res.render('books/edit', { book, error: null });
    } catch (err) {
        res.redirect('/books');
    }
};

exports.putUpdateBook = async (req, res) => {
    try {
        const { title, author, category, price, quantity, description } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.redirect('/books');
        }

        book.title = title;
        book.author = author;
        book.category = category;
        book.price = parseFloat(price);
        book.quantity = parseInt(quantity);
        book.description = description;

        if (req.file) {
            book.image = req.file.filename;
        }

        await book.save();
        res.redirect('/books');
    } catch (err) {
        const book = await Book.findById(req.params.id);
        res.render('books/edit', { book, error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    } catch (err) {
        res.redirect('/books');
    }
};

// GET - View single book
exports.getBookDetail = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.redirect('/books');
        res.render('books/detail', { book });
    } catch (err) {
        res.redirect('/books');
    }
};
