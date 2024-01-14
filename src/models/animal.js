const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const AnimalSchema = new mongoose.Schema({
    animalID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    animalType: {
        type: String,
    },

    breed: {
        type: String,
        required: true
    }, 
    gender: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }, 
    batchNo: {
        type: String,
        required: true
    },
    purchaseType: {
        type: String,
        required: true
    }, 
    shed: {
        type: String,
        required: true
    },    

}, {timestamps: true});


AnimalSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Breeds', AnimalSchema);
