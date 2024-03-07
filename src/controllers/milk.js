
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Milking = require('../models/milk');
const {uploader} = require('../utils/index');

const limit_ = 5;

// @route GET api/event
// @desc Returns all breed with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public
exports.addMilking = async (req, res) => {
    try {
        const userID = await req.user._id;
        console.log("user", userID);

        const { 
            animalType,
            milkingDate,
            shift,
            animals,
            amountOfMilk,
            unit,
            fats,
            solidsNotFat,
            totalSolid,
            remark, 
        } = req.body;

        const newMilking = new Milking({ 
            animalType,
            milkingDate,
            shift,
            animals,
            amountOfMilk,
            unit,
            fats,
            solidsNotFat,
            totalSolid,
            remark, 
            userID
        });

        const milking = await newMilking.save();

        // If there is no image, return success message
        if (milking) {
            return res.status(200).json({
                success: true,
                status: 200,
                data: {
                    milking,
                    message: 'milking record added successfully'
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
exports.getGoatMilkings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const milkings = await Milking.find({ userID: id, animalType: 'goat' });

        if (!milkings || milkings.length === 0) {
            return res.status(404).json({ message: `No Milk record found for user with ID ${id}` });
        }

        res.status(200).json({ milkings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all cow milking
// @access Public
exports.getCowMilkings = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const milkings = await Milking.find({ userID: id, animalType: 'cow' });

        if (!milkings || milkings.length === 0) {
            return res.status(404).json({ message: `No Milk record found for user with ID ${id}` });
        }

        res.status(200).json({ milkings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route GET api/breed/{id}
// @desc Returns a specific breed
// @access Public
exports.getMilking = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const milking = await Milking.findById(id);

        if (!milking) return res.status(401).json({message: 'Milk record does not exist'});

        res.status(200).json({milking});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateMilking = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const milking = await Milking.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!milking) return res.status(401).json({message: 'Milk record does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({milking, message: 'Breed has been updated'});

        res.status(200).json({milking: milking, message: 'milk record has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteMilking = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const milking = await Milking.findOneAndDelete({_id: id, userID});

        if (!milking) return res.status(401).json({message: "Milk Record does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Milk record has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


