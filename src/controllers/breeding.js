
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Breeding = require('../models/breeding');
const {uploader} = require('../utils/index');

const limit_ = 5;

// @route GET api/event
// @desc Returns all breed with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public
exports.addBreeding = async (req, res) => {
    try {
        const userID = await req.user._id;
        console.log("user", userID);

        const { 
            tagID,
            animalType,
            matingDate, 
            matingType,
            maleTagID,
            maleBreed,
            semen,
            dose,
            administrator,
            time,
            matingStatus,
            embryo,
            miscarraigeDate,
            miscarraigeReason,
            deliveryDate,
            remark, 
        } = req.body;

        const newBreeding = new Breeding({ 
            tagID,
            animalType,
            matingDate, 
            matingType,
            maleTagID,
            maleBreed,
            semen,
            dose,
            administrator,
            time,
            matingStatus,
            embryo,
            miscarraigeDate,
            miscarraigeReason,
            deliveryDate,
            remark, 
            userID
        });

        const breeding = await newBreeding.save();

        // If there is no image, return success message
        if (breeding) {
            return res.status(200).json({
                success: true,
                status: 200,
                data: {
                    breeding,
                    message: 'Breeding added successfully'
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
// @desc Returns all goat breeds
// @access Public
exports.getGoatBreedings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breedings = await Breeding.find({ userID: id, animalType: 'goat' });

        if (!breedings || breedings.length === 0) {
            return res.status(404).json({ message: `No breedings found for user with ID ${id}` });
        }

        res.status(200).json({ breedings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all cow breeds
// @access Public
exports.getCowBreedings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breedings = await Breeding.find({ userID: id, animalType: 'cow' });

        if (!breedings || breedings.length === 0) {
            return res.status(404).json({ message: `No breedings found for user with ID ${id}` });
        }

        res.status(200).json({ breedings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all sheep breeds
// @access Public
exports.getSheepBreedings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breedings = await Breeding.find({ userID: id, animalType: 'sheep' });

        if (!breedings || breedings.length === 0) {
            return res.status(404).json({ message: `No breedings found for user with ID ${id}` });
        }

        res.status(200).json({ breedings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all pig breeds
// @access Public
exports.getPigBreedings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breedings = await Breeding.find({ userID: id, animalType: 'pig' });

        if (!breedings || breedings.length === 0) {
            return res.status(404).json({ message: `No breedings found for user with ID ${id}` });
        }

        res.status(200).json({ breedings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all rabbit breeds
// @access Public
exports.getRabbitBreedings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const breedings = await Breeding.find({ userID: id, animalType: 'rabbit' });

        if (!breedings || breedings.length === 0) {
            return res.status(404).json({ message: `No breedings found for user with ID ${id}` });
        }

        res.status(200).json({ breedings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route GET api/breed/{id}
// @desc Returns a specific breed
// @access Public
exports.getBreeding = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const breeding = await Breeding.findById(id);

        if (!breeding) return res.status(401).json({message: 'Breeding does not exist'});

        res.status(200).json({breeding});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateBreeding = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const breeding = await Breeding.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!breeding) return res.status(401).json({message: 'Breed does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({breeding, message: 'Breed has been updated'});

        res.status(200).json({breeding: breeding, message: 'Breed has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteBreeding = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const breeding = await Breeding.findOneAndDelete({_id: id, userID});

        if (!breeding) return res.status(401).json({message: "Breeding does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Breeding has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


