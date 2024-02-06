const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const Vaccine = require('../controllers/vaccine');
const validate = require('../middlewares/validate');
const authenticateMiddleware = require('../middlewares/authenticate');


const router = express.Router();

const upload = multer().single('image');


//STORE
router.post('/add-vaccine', authenticateMiddleware, Vaccine.addVaccine);

router.get('/get-vaccine/:id', authenticateMiddleware, Vaccine.getVaccine);

router.get('/get-vaccine/', authenticateMiddleware, Vaccine.getAllVaccines);

router.get('/get-user-vaccines/:id', authenticateMiddleware, Vaccine.getUserVaccines);

router.patch('/edit-vaccine/:id', authenticateMiddleware, Vaccine.updateVaccine);

router.delete('/delete-vaccine/:id', authenticateMiddleware, Vaccine.deleteVaccine);

router.put('/add-animal-vaccine/:id', authenticateMiddleware, Vaccine.addVaccineToAnimal);

router.put('/remove-vaccine-animal/:id', authenticateMiddleware, Vaccine.removeVaccineFromAnimal);

router.put('/add-animals-from-shed/:id', authenticateMiddleware, Vaccine.addAnimalsFromShedToVaccine);

router.put('/remove-animals-from-shed/:id', authenticateMiddleware, Vaccine.removeAnimalsFromShedFromVaccine);

module.exports = router;
