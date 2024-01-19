const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Breed = require('../controllers/breed');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();

const upload = multer().single('image');


//STORE
router.post('/add-breed', authenticateMiddleware, Breed.addBreed);

router.get('/get-breed/:id', authenticateMiddleware, Breed.getBreed);

router.get('/get-breeds/', authenticateMiddleware, Breed.getAllBreeds);

router.get('/get-goat-breeds/:id', authenticateMiddleware, Breed.getGoatBreeds);


router.patch('/edit-breed/:id', authenticateMiddleware, Breed.updateBreed);

router.delete('/delete-breed/:id', authenticateMiddleware, Breed.deleteBreed);

module.exports = router;
