const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const BreedingSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },

    animalType: {
        type: String,
        required: true,
    },

    tagID: {
        type: String,
        required: true
    },

    matingDate: {
        type: Date,
        required: true,
    },

    matingType: {
        type: String,
        required: true
    },
    maleTagID: {
        type: String,
        required: false
    },

    maleBreed: {
        type: String,
        required: false
    },

    semen: {
        type: String,
        required: false
    },

    dose: {
        type: String,
        required: false
    },

    administrator: {
        type: String,
        required: false
    },

    time: {
        type: String,
        required: false
    },

    embryo: {
        type: String,
        required: false
    },

    matingStatus: {
        type: String,
        required: false
    },

    miscarraigeDate: {
        type: String,
        required: false
    },

    miscarraigeReason: {
        type: String,
        required: false
    },

    deliveryDate: {
        type: String,
        required: false
    },

    remark: {
        type: String,
        required: false
    }

}, {timestamps: true});


BreedingSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Breedings', BreedingSchema);
