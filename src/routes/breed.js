const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Breed = require('../controllers/breed');
const validate = require('../middlewares/validate');

const router = express.Router();

const upload = multer().single('image');


//STORE
router.post('/create', Breed.addBreed);

module.exports = router;
