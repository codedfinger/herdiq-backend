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
    },
    firstDay: {
        type: Date,
        required: true
    },
    cycle: {
        type: Number,
        required: true
    },
    lastDay:{
        type: Date,
        required: true
    },
    remark: {
        type: String,
        required: true
    }
});

const VaccineSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    vaccineName: {
        type: String,
        required: true,
    },

    cycle: {
        type: Number,
        required: true
    }, 

    remark: {
        type: String,
        required: true
    },
    vaccineAnimals: {
        type: [animalSchema],
        required: true
    }   

}, {timestamps: true});


VaccineSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Vaccines', VaccineSchema);
