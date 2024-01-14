const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const BreedSchema = new mongoose.Schema({
    vaccineID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    vaccineName: {
        type: String,
        required: 'Pls Choose animal type',
    },

    cycle: {
        type: String,
        required: true
    }, 
    remark: {
        type: String,
        required: true
    },   

}, {timestamps: true});


BreedSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Breeds', BreedSchema);
