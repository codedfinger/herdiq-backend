const express = require('express');
const {check} = require('express-validator');

const Progeny = require('../controllers/progeny');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();


//STORE
router.post('/add-progeny', authenticateMiddleware, Progeny.addProgeny);

// router.get('/get-animal/:id', authenticateMiddleware, Progeny.getAnimal);

// router.get('/get-goat-animals/:id', authenticateMiddleware, Progeny.getGoatAnimals);

// router.patch('/edit-animal/:id', authenticateMiddleware, Progeny.updateAnimal);

// router.delete('/delete-animal/:id', authenticateMiddleware, Progeny.deleteAnimal);

module.exports = router;
