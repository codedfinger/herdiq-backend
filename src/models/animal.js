const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const AnimalSchema = new mongoose.Schema({
    tagID: {
        type: String,
        required: true,
    },

    userID: {
        type: String,
        required: true,
    },

    animalType: {
        type: String,
    },

    breedName: {
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
        required: false
    }, 
    shed: {
        type: String,
    },
    vaccine: {
        type: Array,
    },
    progenyOf: {
        type: String
    },
    progeny: {
        type: Array
    }    

}, {timestamps: true});


AnimalSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Animals', AnimalSchema);
