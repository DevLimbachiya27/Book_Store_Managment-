const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/bookController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        if (ext) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

router.get('/', bookController.getAllBooks);
router.get('/add', bookController.getAddBook);
router.post('/add', upload.single('image'), bookController.postAddBook);
router.get('/edit/:id', bookController.getEditBook);
router.put('/edit/:id', upload.single('image'), bookController.putUpdateBook);
router.delete('/delete/:id', bookController.deleteBook);
router.get('/detail/:id', bookController.getBookDetail);

module.exports = router;
