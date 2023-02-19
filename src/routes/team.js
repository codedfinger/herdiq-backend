const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Team = require('../controllers/team');
const validate = require('../middlewares/validate');

const router = express.Router();

const upload = multer().single('image');

//SEED
router.get('/seed', Team.seed);

//INDEX
router.get('/', Team.index);

//STORE
router.post('/', upload, [
    check('name').not().isEmpty().withMessage('Team name is required'),
    check('location').not().isEmpty().withMessage('Team location is required'),
    check('description').not().isEmpty().withMessage('Team description is required')
], validate, Team.store);

//SHOW
router.get('/:id',  Team.show);

//UPDATE
router.put('/:id', upload, Team.update);

//DELETE
router.delete('/:id', Team.destroy);

module.exports = router;
