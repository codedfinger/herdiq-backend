const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');


const animalSchema = new mongoose.Schema({
    breedName: {
        type: String,
        required: true,
    },
    tagID: {
        type: String,
        required: true,
    },
});

const MilkSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },

    animalType: {
        type: String,
        required: true,
    },

    milkingDate: {
        type: Date,
        required: true,
    },

    shift: {
        type: String,
        required: true
    },

    animals: {
        type: [animalSchema],
        required: false
    },

    amountOfMilk: {
        type: Number,
        required: false
    },

    unit: {
        type: String,
        required: false
    },

    fat: {
        type: Number,
        required: false
    },

    solidsNotFat: {
        type: Number,
        required: false
    },
    
    totalSolid: {
        type: Number,
        required: false
    },

    remark: {
        type: String,
        required: false
    }

}, {timestamps: true});


MilkSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('milk', MilkSchema);
