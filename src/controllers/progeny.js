
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Progeny = require('../models/progeny');
const Animal = require('../models/animal');

const {uploader} = require('../utils/index');

const limit_ = 5;

// @route GET api/event
// @desc Returns all animal with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public
exports.addProgeny = async (req, res) => {
    try {
        const userID = req.user._id;
        console.log("user", userID);

        const {
            tagID,
            parentTagID,
            animalType, 
            breedName,
            gender,
            color,
            batchNo,
            shed, 
        } = req.body;

         // Check if tagID already exists
         const existingProgeny = await Progeny.findOne({ tagID });
         if (existingProgeny) {
             throw new Error('Progeny with the provided tagID already exists');
         }

        // Check if tagID already exists
        const existingAnimal = await Animal.findOne({ tagID });
        if (existingAnimal) {
            throw new Error('Animal with the provided tagID already exists');
        }

        // Create a new progeny entry
        const newProgeny = new Progeny({ 
            tagID,
            parentTagID,
            animalType, 
            breedName,
            gender,
            color,
            batchNo,
            shed,  
            userID
        });

        // Save the new progeny
        const progeny = await newProgeny.save();

        // If there is no image, return success message
        if (!progeny) {
            throw new Error('Failed to add progeny');
        }

        // Create a new animal entry for the progeny
        const progenyAnimal = new Animal({
            tagID,
            animalType, 
            breedName,
            gender,
            color,
            batchNo,
            shed,
            userID,
            progenyOf: parentTagID // Adding reference to the parent
        });

        // Save the new progeny animal
        const savedProgenyAnimal = await progenyAnimal.save();

        // Update parent animal
        const parentAnimal = await Animal.findOne({ tagID: parentTagID });
        if (!parentAnimal) {
            throw new Error('Parent animal not found');
        }

         // Initialize progeny array if it doesn't exist
         if (!parentAnimal.progeny) {
            parentAnimal.progeny = [];
        }

        // Add progeny to parent animal's progeny field
        parentAnimal.progeny.push(savedProgenyAnimal.tagID);
        await parentAnimal.save();

        return res.status(200).json({
            success: true,
            status: 200,
            data: {
                progeny,
                message: 'Progeny added successfully'
            }
        });
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
exports.getProgeny = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const progeny = await Progeny.findById(id);

        if (!progeny) return res.status(401).json({message: 'Progeny does not exist'});

        res.status(200).json({progeny});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route GET api/breed/{id}
// @desc Returns all goat breeds
// @access Public
exports.getGoatProgeny = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const progeny = await Progeny.find({ userID: id, animalType: 'goat' });

        if (!progeny || progeny.length === 0) {
            // return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
            return res.status(404).json({
                success: false,
                status: 404,
                data: {
                    message: `No progeny found for user with ID ${id}`,
                    reference_code: 'ERR-500-INTERNAL'

                }
            });
        }

        res.status(200).json({ progeny });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all cow progeny
// @access Public
exports.getCowProgeny = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const progeny = await Progeny.find({ userID: id, animalType: 'cow' });

        if (!progeny || progeny.length === 0) {
            // return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
            return res.status(404).json({
                success: false,
                status: 404,
                data: {
                    message: `No progeny found for user with ID ${id}`,
                    reference_code: 'ERR-500-INTERNAL'

                }
            });
        }

        res.status(200).json({ progeny });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all sheep progeny
// @access Public
exports.getSheepProgeny = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const progeny = await Progeny.find({ userID: id, animalType: 'sheep' });

        if (!progeny || progeny.length === 0) {
            // return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
            return res.status(404).json({
                success: false,
                status: 404,
                data: {
                    message: `No progeny found for user with ID ${id}`,
                    reference_code: 'ERR-500-INTERNAL'

                }
            });
        }

        res.status(200).json({ progeny });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all pig progeny
// @access Public
exports.getPigProgeny = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const progeny = await Progeny.find({ userID: id, animalType: 'pig' });

        if (!progeny || progeny.length === 0) {
            // return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
            return res.status(404).json({
                success: false,
                status: 404,
                data: {
                    message: `No progeny found for user with ID ${id}`,
                    reference_code: 'ERR-500-INTERNAL'

                }
            });
        }

        res.status(200).json({ progeny });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all rabbit progeny
// @access Public
exports.getRabbitProgeny = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const progeny = await Progeny.find({ userID: id, animalType: 'rabbit' });

        if (!progeny || progeny.length === 0) {
            // return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
            return res.status(404).json({
                success: false,
                status: 404,
                data: {
                    message: `No progeny found for user with ID ${id}`,
                    reference_code: 'ERR-500-INTERNAL'

                }
            });
        }

        res.status(200).json({ progeny });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateProgeny = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const progeny = await Progeny.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!progeny) return res.status(401).json({message: 'Progeny does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({progeny, message: 'Progeny has been updated'});

        res.status(200).json({progeny: breed_, message: 'Progeny has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteProgeny = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const progeny = await Progeny.findOneAndDelete({_id: id, userID});

        if (!progeny) return res.status(401).json({message: "Progeny does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Progeny has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


