const express = require('express');
const {check} = require('express-validator');

const Animal = require('../controllers/animal');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();


//STORE
router.post('/add-animal', authenticateMiddleware, Animal.addAnimal);

router.get('/get-animal/:id', authenticateMiddleware, Animal.getAnimal);

router.get('/get-goat-animals/:id', authenticateMiddleware, Animal.getGoatAnimals);

router.patch('/edit-animal/:id', authenticateMiddleware, Animal.updateAnimal);

router.delete('/delete-animal/:id', authenticateMiddleware, Animal.deleteAnimal);

module.exports = router;
