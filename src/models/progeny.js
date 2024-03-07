const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const ProgenySchema = new mongoose.Schema({
    tagID: {
        type: String,
        required: true,
    },
    parentTagID: {
        type: String,
        required: true
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
    shed: {
        type: String,
    },
    vaccine: {
        type: Array,
    }    

}, {timestamps: true});


ProgenySchema.plugin(aggregatePaginate);

module.exports = mongoose.model('progenies', ProgenySchema);
