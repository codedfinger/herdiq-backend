const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    firstName: {
        type: String,
    },

    lastName: {
        type: String,
        required: true
    }, 
    loginID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    employeeType: {
        type: String,
        required: true
    },  

}, {timestamps: true});


employeeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Breeds', employeeSchema);
