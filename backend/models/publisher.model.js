const mongoose = require('mongoose');

const publisherSchema = mongoose.Schema({
    publisherId : {
        type : String,
        require : true
    },
    name : {
        type : String,
        require : true
    },
    
    email : {
        type : String,
        require : true
    },
    phoneNumber : {
        type : String
    },
    address : {
        type : String
    },
    password : {
        type : String,
        require : true
    }   
})

module.exports = mongoose.model('publisher', publisherSchema);