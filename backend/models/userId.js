const mongoose = require('mongoose');

const UserIdSchema = mongoose.Schema({
    publisherId : {
        type : String
    },
    distributorId : {
        type : String
    },
    email : {
        type : String
    }
})

module.exports = mongoose.model('credential', UserIdSchema)