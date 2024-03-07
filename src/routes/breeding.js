const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Breeding = require('../controllers/breeding');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();

const upload = multer().single('image');

//STORE
router.post('/add-breeding', authenticateMiddleware, Breeding.addBreeding);

router.get('/get-breeding/:id', authenticateMiddleware, Breeding.getBreeding);

// router.get('/get-breeds/', authenticateMiddleware, Breed.getAllBreeds);

router.get('/get-goat-breedings/:id', authenticateMiddleware, Breeding.getGoatBreedings);

router.get('/get-cow-breedings/:id', authenticateMiddleware, Breeding.getCowBreedings);

router.get('/get-sheep-breedings/:id', authenticateMiddleware, Breeding.getSheepBreedings);

router.get('/get-pig-breedings/:id', authenticateMiddleware, Breeding.getPigBreedings);

router.get('/get-rabbit-breedings/:id', authenticateMiddleware, Breeding.getRabbitBreedings);

router.patch('/edit-breeding/:id', authenticateMiddleware, Breeding.updateBreeding);

router.delete('/delete-breeding/:id', authenticateMiddleware, Breeding.deleteBreeding);

module.exports = router;
