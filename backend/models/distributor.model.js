const mongoose = require('mongoose');

const distributorSchema = mongoose.Schema({
    distributorId : {
        type : String
    },
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },   
    email : {
        type : String
    },
    phoneNumber : {
        type : String
    },
    address : {
        type : String
    },
    publisherId : {
        type : String
    }
    
})

module.exports = mongoose.model('distributor', distributorSchema);