
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Breed = require('../models/breed');
const {uploader} = require('../utils/index');

const limit_ = 5;

// @route GET api/event
// @desc Returns all breed with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public
exports.addBreed = async (req, res) => {
    try {
        const userID = await req.user._id;
        console.log("user", userID);

        const { animalType, breedName } = req.body;

        const newBreed = new Breed({ 
            animalType, 
            breedName, 
            userID
        });

        const breed = await newBreed.save();

        // If there is no image, return success message
        if (breed) {
            return res.status(200).json({
                success: true,
                status: 200,
                data: {
                    breed,
                    message: 'Breed added successfully'
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

// @route GET api/breed/{id}
// @desc Returns all breeds
// @access Public
exports.getAllBreeds = async function (req, res) {
    try {
        const breeds = await Breed.find();

        if (!breeds || breeds.length === 0) {
            return res.status(404).json({ message: 'No breeds found' });
        }

        res.status(200).json({ breeds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all goat breeds
// @access Public
exports.getGoatBreeds = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breeds = await Breed.find({ userID: id, animalType: 'goat' });

        if (!breeds || breeds.length === 0) {
            return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
        }

        res.status(200).json({ breeds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all cow breeds
// @access Public
exports.getCowBreeds = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breeds = await Breed.find({ userID: id, animalType: 'cow' });

        if (!breeds || breeds.length === 0) {
            return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
        }

        res.status(200).json({ breeds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all sheep breeds
// @access Public
exports.getSheepBreeds = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breeds = await Breed.find({ userID: id, animalType: 'sheep' });

        if (!breeds || breeds.length === 0) {
            return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
        }

        res.status(200).json({ breeds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all pig breeds
// @access Public
exports.getPigBreeds = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breeds = await Breed.find({ userID: id, animalType: 'pig' });

        if (!breeds || breeds.length === 0) {
            return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
        }

        res.status(200).json({ breeds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all rabbit breeds
// @access Public
exports.getRabbitBreeds = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breeds = await Breed.find({ userID: id, animalType: 'rabbit' });

        if (!breeds || breeds.length === 0) {
            return res.status(404).json({ message: `No breeds found for user with ID ${id}` });
        }

        res.status(200).json({ breeds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route GET api/breed/{id}
// @desc Returns a specific breed
// @access Public
exports.getBreed = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const breed = await Breed.findById(id);

        if (!breed) return res.status(401).json({message: 'Breed does not exist'});

        res.status(200).json({breed});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateBreed = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const breed = await Breed.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!breed) return res.status(401).json({message: 'Breed does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({breed, message: 'Breed has been updated'});

        res.status(200).json({breed: breed_, message: 'Breed has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteBreed = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const breed = await Breed.findOneAndDelete({_id: id, userID});

        if (!breed) return res.status(401).json({message: "Breed does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Breed has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


