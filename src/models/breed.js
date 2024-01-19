const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const BreedSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },

    animalType: {
        type: String,
        required: 'Pls Choose animal type',
    },

    breedName: {
        type: String,
        required: true
    },    

}, {timestamps: true});


BreedSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Breeds', BreedSchema);
