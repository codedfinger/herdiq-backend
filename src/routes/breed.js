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

router.get('/get-cow-breeds/:id', authenticateMiddleware, Breed.getCowBreeds);

router.get('/get-sheep-breeds/:id', authenticateMiddleware, Breed.getSheepBreeds);

router.get('/get-pig-breeds/:id', authenticateMiddleware, Breed.getPigBreeds);

router.get('/get-rabbit-breeds/:id', authenticateMiddleware, Breed.getRabbitBreeds);

router.patch('/edit-breed/:id', authenticateMiddleware, Breed.updateBreed);

router.delete('/delete-breed/:id', authenticateMiddleware, Breed.deleteBreed);

module.exports = router;
