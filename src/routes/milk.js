const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Milk = require('../controllers/milk');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();

const upload = multer().single('image');

//STORE
router.post('/add-milk-record', authenticateMiddleware, Milk.addMilking);

router.get('/get-milk-record/:id', authenticateMiddleware, Milk.getMilking);

// router.get('/get-milkings/', authenticateMiddleware, Milk.getAllMilkings);

router.get('/get-goat-milkings/:id', authenticateMiddleware, Milk.getGoatMilkings);

router.get('/get-cow-milkings/:id', authenticateMiddleware, Milk.getCowMilkings);

router.patch('/edit-milk-record/:id', authenticateMiddleware, Milk.updateMilking);

router.delete('/delete-milk-record/:id', authenticateMiddleware, Milk.deleteMilking);

module.exports = router;
