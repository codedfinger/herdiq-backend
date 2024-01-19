const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Shed = require('../controllers/shed');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();

const upload = multer().single('image');


//STORE
router.post('/add-shed', authenticateMiddleware, Shed.addShed);

router.get('/get-shed/:id', authenticateMiddleware, Shed.getShed);

router.get('/get-shed/', authenticateMiddleware, Shed.getAllSheds);

router.get('/get-goat-sheds/:id', authenticateMiddleware, Shed.getGoatSheds);


router.patch('/edit-shed/:id', authenticateMiddleware, Shed.updateShed);

router.delete('/delete-shed/:id', authenticateMiddleware, Shed.deleteShed);

router.put('/add-shed-animal/:id', authenticateMiddleware, Shed.addAnimalInShed);

router.put('/remove-shed-animal/:id', authenticateMiddleware, Shed.removeAnimalFromShed);

module.exports = router;
