const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tagID: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    }
});

const ShedSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },

    animalType: {
        type: String,
        required: true
    },

    shedName: {
        type: String,
        required: true,
    },

    shedDescription: {
        type: String,
    },

    shedAnimals: {
        type: [animalSchema],
    },   

}, {timestamps: true});


ShedSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Sheds', ShedSchema);
