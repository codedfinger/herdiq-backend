const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const TeamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    name: {
        type: String,
        required: 'Team name is required',
    },

    location: {
        type: String,
        required: true
    },    
    description: {
        type: String,
        required: true,
        max: 255
    },

    image: {
        type: String,
        required: false,
        max: 255
    }

}, {timestamps: true});


TeamSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Teams', TeamSchema);
