const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

app.get('/', (req, res) => {
    res.redirect('/books');
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.use((err, req, res, next) => {
    console.log('Error: ' + err.message);
    res.status(500).send('Something went wrong: ' + err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});
