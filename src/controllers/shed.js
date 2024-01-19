
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Shed = require('../models/shed');
const Animal = require('../models/animal'); 

const limit_ = 5;

// @route GET api/event
// @desc Returns all breed with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public

exports.addShed = async (req, res) => {
    try {
        const userID = await req.user._id;
        console.log("user", userID);

        const { animalType, shedName, shedDescription } = req.body;

        const newShed = new Shed({
            userID,
            animalType,
            shedName,
            shedDescription,
        });

        const shed = await newShed.save();

        if (shed) {
            return res.status(200).json({
                success: true,
                status: 200,
                data: {
                    shed,
                    message: 'Shed added successfully',
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                message: error.message,
                reference_code: 'ERR-500-INTERNAL',
            },
        });
    }
};


// @route GET api/breed/{id}
// @desc Returns all shed
// @access Public
exports.getAllSheds = async function (req, res) {
    try {
        const sheds = await Shed.find();

        if (!sheds || sheds.length === 0) {
            return res.status(404).json({ message: 'No shed found' });
        }

        res.status(200).json({ sheds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all goat breeds
// @access Public
exports.getGoatSheds = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const sheds = await Shed.find({ userID: id, animalType: 'goat' });

        if (!sheds || sheds.length === 0) {
            return res.status(404).json({ message: `No shed found for user with ID ${id}` });
        }

        res.status(200).json({ sheds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @route GET api/breed/{id}
// @desc Returns a specific breed
// @access Public
exports.getShed = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const shed = await Shed.findById(id);

        if (!shed) return res.status(401).json({message: 'Shed does not exist'});

        res.status(200).json({shed});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateShed = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const shed = await Shed.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!shed) return res.status(401).json({message: 'Shed does not exist'});

        res.status(200).json({shed, message: 'Shed has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.addAnimalInShed = async function (req, res) {
    try {
        const { tagID } = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        // check if shed exist
        const shed = await Shed.findOne({_id: id, userID});
        if (!shed) return res.status(401).json({message: 'Shed does not exist'});

        // Fetch the animal details based on tagID
        const animal = await Animal.findOne({tagID});
        if (!animal) return res.status(404).json({message: 'Animal not found for the provided tag ID'});

         // Check if the animal with tagID is already in the shed
         const existingAnimal = shed.shedAnimals.find(animal => animal.tagID === tagID);
         if (existingAnimal) {
             return res.status(400).json({message: 'Animal already in shed'});
         }

        // Check if the animal exists in other sheds
        const otherSheds = await Shed.find({ 'shedAnimals.tagID': tagID, userID });
        if (otherSheds.length > 0) {
            const shedNames = otherSheds.map(otherShed => otherShed.shedName);
            return res.status(400).json({ message: `Animal exists in ${shedNames} shed. Please remove them before adding here.` });
        }

        // Update shedAnimals array
        shed.shedAnimals.push({
            name: animal.breedName,
            tagID: animal.tagID,
            gender: animal.gender
        });

         // Save the updated Shed
         const updatedShed = await shed.save();

         // Update shed value in Animal model
        animal.shed = shed.shedName; 
        await animal.save();


        res.status(200).json({shed: updatedShed, message: 'Shed has been updated with the new animal'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @route PUT api/shed/remove-shed-animal/{id}
// @desc Remove an animal from the shed
// @access Public
exports.removeAnimalFromShed = async function (req, res) {
    try {
        const { tagID } = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        // check if shed exists
        const shed = await Shed.findOne({ _id: id, userID });
        if (!shed) return res.status(401).json({ message: 'Shed does not exist' });

        // Check if the animal with tagID is in the shed
        const existingAnimalIndex = shed.shedAnimals.findIndex(animal => animal.tagID === tagID);
        if (existingAnimalIndex === -1) {
            return res.status(400).json({ message: 'Animal not found in shed' });
        }

        // Remove the animal from shedAnimals array
        const removedAnimal = shed.shedAnimals.splice(existingAnimalIndex, 1);

        // Save the updated Shed
        const updatedShed = await shed.save();

        // Clear shed value in Animal model
        const animal = await Animal.findOne({ tagID });
        if (animal) {
            animal.shed = "";
            await animal.save();
        }

        res.status(200).json({ shed: updatedShed, removedAnimal, message: 'Animal removed from the shed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteShed = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const shed = await Shed.findOneAndDelete({_id: id, userID});

        if (!shed) return res.status(401).json({message: "Shed does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Breed has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


