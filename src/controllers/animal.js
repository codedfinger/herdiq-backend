
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Animal = require('../models/animal');
const {uploader} = require('../utils/index');

const limit_ = 5;

// @route GET api/event
// @desc Returns all animal with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public
exports.addAnimal = async (req, res) => {
    try {
        const userID = await req.user._id;
        console.log("user", userID);

        const {
            tagID,
            animalType, 
            breedName,
            gender,
            color,
            batchNo,
            purchaseType,
            shed, 
        } = req.body;

        // Check if tagID already exists
        const existingAnimal = await Animal.findOne({ tagID });
        if (existingAnimal) {
            throw new Error('Animal with the provided tagID already exists');
        }

        const newAnimal = new Animal({ 
            tagID,
            animalType, 
            breedName,
            gender,
            color,
            batchNo,
            purchaseType,
            shed,  
            userID
        });

        const animal = await newAnimal.save();

        // If there is no image, return success message
        if (animal) {
            return res.status(200).json({
                success: true,
                status: 200,
                data: {
                    animal,
                    message: 'Animal added successfully'
                }
            });
        }

        // Attempt to upload to cloudinary
        // const result = await uploader(req);
        // const shop_ = await Shop.findByIdAndUpdate(shop._id, {$set: {image: result.url}}, {new: true});

        // res.status(200).json({shop: shop_, message: 'Shop added successfully'});
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                message: error.message,
                reference_code: 'ERR-500-INTERNAL'
            }
        });
    }
};

// @route GET api/event/{id}
// @desc Returns a specific event
// @access Public
exports.getAnimal = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const animal = await Animal.findById(id);

        if (!animal) return res.status(401).json({message: 'Animal does not exist'});

        res.status(200).json({animal});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route GET api/breed/{id}
// @desc Returns all goat breeds
// @access Public
exports.getGoatAnimals = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const animals = await Animal.find({ userID: id, animalType: 'goat' });

        if (!animals || animals.length === 0) {
            // return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
            return res.status(404).json({
                success: false,
                status: 404,
                data: {
                    message: `No breeds found for user with ID ${id}`,
                    reference_code: 'ERR-500-INTERNAL'

                }
            });
        }

        res.status(200).json({ animals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateAnimal = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const animal = await Animal.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!animal) return res.status(401).json({message: 'Animal does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({animal, message: 'Animal has been updated'});

        res.status(200).json({animal: breed_, message: 'Animal has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteAnimal = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const animal = await Animal.findOneAndDelete({_id: id, userID});

        if (!animal) return res.status(401).json({message: "Animal does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Animal has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


