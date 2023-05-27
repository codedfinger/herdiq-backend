const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Shop = require('../controllers/shop');
const validate = require('../middlewares/validate');

const router = express.Router();

const upload = multer().single('image');

//SEED
router.get('/seed', Shop.seed);

//INDEX
router.get('/', Shop.index);

//STORE
router.post('/create', upload, [
    check('name').not().isEmpty().withMessage('Shop name is required'),
    check('type').not().isEmpty().withMessage('Shop type is required'),
    check('description').not().isEmpty().withMessage('Shop description is required')
], validate, Shop.store);

//SHOW
router.get('/:id',  Shop.show);

//UPDATE
router.put('/:id', upload, Shop.update);

//DELETE
router.delete('/:id', Shop.destroy);

module.exports = router;
