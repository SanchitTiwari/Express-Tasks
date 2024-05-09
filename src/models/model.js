const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: 
    {   type: String, 
        required: true, 
        unique: true 
    },

    password:
    { 
          type: String,
          required: true 
    },

    email: 
    {
          type: String, 
          required: true, 
          unique: true 
    },

    firstName: 
    { 
        type: String, 
        required: true 
    },
    lastName: 
    {   type: String, 
        required: true 
    },
    jwtBlacklist: [{
            blToken: {type: String, required: false}
    }] ,
    // added addresses in user model schema in the form of array, multiple addresses can be stored as subdocuments 
    addresses: [{
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pin_code: { type: String, required: true },
        phone_no: { type: String, required: true }
    }]
});

module.exports = mongoose.model('User', userSchema); 