
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const User = require('../models/user');
const Team = require('../models/teams');
const {uploader} = require('../utils/index');

const limit_ = 5;

// @route GET api/event
// @desc Returns all events with pagination
// @access Public
exports.index = async function (req, res) {
    let aggregate_options = [];

    //PAGINATION
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || limit_;

    //set the options for pagination
    const options = {
        page, limit,
        collation: {locale: 'en'},
        customLabels: {
            totalDocs: 'totalResults',
            docs: 'teams'
        }
    };

    //FILTERING AND PARTIAL TEXT SEARCH -- FIRST STAGE
    let match = {};

    //filter by name - use $regex in mongodb - add the 'i' flag if you want the search to be case insensitive.
    if (req.query.q) match.name = {$regex: req.query.q, $options: 'i'};

    //filter by date
    if (req.query.date) {
        let d = moment(req.query.date);
        let next_day = moment(d).add(1, 'days'); // add 1 day

        match.start_date = {$gte: new Date(d), $lt: new Date(next_day)};
    }

    aggregate_options.push({$match: match});

    //GROUPING -- SECOND STAGE
    if (req.query.group !== 'false' && parseInt(req.query.group) !== 0) {
        let group = {
            _id: {$dateToString: {format: "%Y-%m-%d", date: "$start_date"}}, // Group By Expression
            data: {$push: "$$ROOT"}
        };

        aggregate_options.push({$group: group});
    }

    //SORTING -- THIRD STAGE
    let sortOrder = req.query.sort_order && req.query.sort_order === 'desc' ? -1 : 1;
    aggregate_options.push({$sort: {"data.start_date": sortOrder}});

    //LOOKUP/JOIN -- FOURTH STAGE
    // aggregate_options.push({$lookup: {from: 'interested', localField: "_id", foreignField: "eventId", as: "interested"}});

    // Set up the aggregation
    const myAggregate = Team.aggregate(aggregate_options);
    const result = await Team.aggregatePaginate(myAggregate, options);
    res.status(200).json(result);
};


// @route POST api/event
// @desc Add a new event
// @access Public
exports.store = async (req, res) => {
    try {
        const userId = req.user._id;
        const newTeam = new Team({...req.body, userId});

        const team = await newTeam.save();

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({team, message: 'Team added successfully'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const team_ = await Team.findByIdAndUpdate(team._id, {$set: {image: result.url}}, {new: true});

        res.status(200).json({team: team_, message: 'Team added successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route GET api/event/{id}
// @desc Returns a specific event
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const team = await Team.findById(id);

        if (!team) return res.status(401).json({message: 'Team does not exist'});

        res.status(200).json({team});
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

        const team = await Team.findOneAndUpdate({_id: id, userId}, {$set: update}, {new: true});

        if (!team) return res.status(401).json({message: 'Team does not exist'});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({team, message: 'Team has been updated'});

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        const team_ = await Team.findOneAndUpdate({_id: id, userId}, {$set: {image: result.url}}, {new: true});

        res.status(200).json({team: team_, message: 'Team has been updated'});
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

        const team = await Team.findOneAndDelete({_id: id, userId});

        if (!team) return res.status(401).json({message: "Team does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Team has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


/**
 * Seed the database -  //For testing purpose only
 */
exports.seed = async function (req, res) {

    try {
        let ids = [];
        let teams = [];

        for (let i = 0; i < 5; i++) {
            const password = '_' + Math.random().toString(36).substr(2, 9); //generate a random password
            let newUser = new User({
                email: faker.internet.email(),
                password,
                firstName: faker.name.firstName(),
                lastName: `${faker.name.lastName()}`,
                isVerified: true
            });

            const user = await newUser.save();
            ids.push(user._id)
        }


        for (let i = 0; i < ids.length; i++) {
            //Create 5 events for each user
            for (let j = 0; j < 5; j++) {
                const newTeam = new Team({
                    name: faker.lorem.word(),
                    location: faker.address.streetName(),
                    description: faker.lorem.text(),
                    image: faker.image.nightlife(),
                    userId: ids[i]
                });

                let team = await newTeam.save();
                teams.push(team);
            }
        }

        res.status(200).json({ids, teams, message: 'Database seeded!'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

};