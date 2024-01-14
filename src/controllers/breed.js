
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const User = require('../models/user');
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
        const userId = req.user._id;
        console.log("user", userId);

        const newBreed = new Breed({ ...req.body, userId });

        const breed = await newBreed.save();

        // If there is no image, return success message
        if (!req.file) {
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

// @route GET api/event/{id}
// @desc Returns a specific event
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const breed = await Breed.findById(id);

        if (!shop) return res.status(401).json({message: 'Shop does not exist'});

        res.status(200).json({shop});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        const breed = await Breed.findOneAndUpdate({_id: id, userId}, {$set: update}, {new: true});

        if (!breed) return res.status(401).json({message: 'Shop does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({breed, message: 'Shop has been updated'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const breed_ = await Shop.findOneAndUpdate({_id: id, userId}, {$set: {image: result.url}}, {new: true});

        res.status(200).json({breed: breed_, message: 'Shop has been updated'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        const breed = await Shop.findOneAndDelete({_id: id, userId});

        if (!breed) return res.status(401).json({message: "Shop does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Shop has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


