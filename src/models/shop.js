const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const ShopSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    name: {
        type: String,
        required: 'Shop name is required',
    },

    type: {
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


ShopSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Shops', ShopSchema);
